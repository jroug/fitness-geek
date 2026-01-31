import type { NextApiRequest, NextApiResponse } from "next";
import { fetch as undiciFetch } from "undici";

// We want to proxy multipart uploads, so disable Next's body parser.
export const config = {
  api: {
    bodyParser: false,
  },
};

function getWpApiBase() {
  const wpApi =
    process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "";
  if (!wpApi) throw new Error("Missing WORDPRESS_API_URL (or NEXT_PUBLIC_WORDPRESS_API_URL)");
  return wpApi.replace(/\/$/, "");
}

function getAuthHeaders(req: NextApiRequest) {
  const token = req.cookies?.jr_token || req.cookies?.token || "";
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (req.headers.cookie) {
    headers.Cookie = req.headers.cookie;
  }

  return headers;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const wpApi = getWpApiBase();
    const authHeaders = getAuthHeaders(req);

    // 1) Upload image to WP Media Library
    // We expect the browser to send multipart/form-data (FormData).
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Expected multipart/form-data upload" });
    }

    const mediaEndpoint = `${wpApi}/wp/v2/media`;
    const uploadRes = await undiciFetch(mediaEndpoint, {
      method: "POST",
      headers: {
        ...authHeaders,
        // Forward the multipart boundary content-type as-is
        "Content-Type": contentType,
      },
      // Required by Node/undici when streaming a request body
      duplex: "half",
      // NextApiRequest is a Node stream / async iterable; undici accepts async iterables
      body: req as unknown as AsyncIterable<Uint8Array>,
    });

    const uploadText = await uploadRes.text();
    let uploadJson = null;
    try {
      uploadJson = uploadText ? JSON.parse(uploadText) : null;
    } catch {
      uploadJson = null;
    }

    if (!uploadRes.ok) {
      return res.status(uploadRes.status).json({
        error: uploadJson?.message || "Failed to upload image to WordPress",
        details: uploadJson ?? uploadText,
      });
    }

    const mediaId = uploadJson?.id;
    if (!mediaId) {
      return res.status(500).json({ error: "Upload succeeded but no media id returned" });
    }

    // 2) Update user ACF field profile_picture with the media ID
    const updateUserEndpoint = `${wpApi}/wp/v2/users/me?context=edit&acf_format=standard`;

    const updateRes = await fetch(updateUserEndpoint, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        acf: {
          profile_picture: mediaId,
        },
      }),
    });

    const updateText = await updateRes.text();
    let updateJson = null;
    try {
      updateJson = updateText ? JSON.parse(updateText) : null;
    } catch {
      updateJson = null;
    }

    if (!updateRes.ok) {
      return res.status(updateRes.status).json({
        error: updateJson?.message || "Image uploaded but failed to update user profile_picture",
        details: updateJson ?? updateText,
      });
    }

    // Return only what the frontend needs
    return res.status(200).json({
      message: "Profile image updated successfully",
      mediaId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: message });
  }
}