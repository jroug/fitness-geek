import type { NextApiRequest, NextApiResponse } from "next";

type UpdateProfileBody = {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string; // expected YYYYMMDD (or empty)
  password?: string; // optional
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const wpApi = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!wpApi) {
      return res.status(500).json({
        error: "Missing WORDPRESS_API_URL (or NEXT_PUBLIC_WORDPRESS_API_URL) env var",
      });
    }

    const body = (req.body ?? {}) as UpdateProfileBody;

    // Build WP payload
    const payload: Record<string, unknown> = {
      first_name: body.first_name ?? "",
      last_name: body.last_name ?? "",
      acf: {
        date_of_birth: body.date_of_birth ?? "",
      },
    };

    // Only send password when provided
    if (typeof body.password === "string" && body.password.trim().length > 0) {
      payload.password = body.password;
    }

    // Auth: try bearer token from cookie; otherwise forward cookies
    const token = req.cookies?.jr_token || req.cookies?.token || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (req.headers.cookie) {
      headers.Cookie = req.headers.cookie;
    }

    // Update current user. We also request standard ACF formatting.
    const url = `${wpApi.replace(/\/$/, "")}/wp/v2/users/me?context=edit&acf_format=standard`;

    const wpRes = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const text = await wpRes.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!wpRes.ok) {
      return res.status(wpRes.status).json({
        error:
          json?.message || json?.error || "Failed to update profile on WordPress",
        details: json ?? text,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch  {
    return res.status(500).json({ message: "Unknown error" });
  }
}