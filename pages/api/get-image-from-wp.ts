

import type { NextApiRequest, NextApiResponse } from "next";

// GET /api/get-image-from-wp?src=<encoded-url>
// or  /api/get-image-from-wp?id=<mediaId>
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const wpApi = process.env.WORDPRESS_API_URL;

    if (!wpApi) {
      return res.status(500).json({
        error:
          "Missing WORDPRESS API URL. Set NEXT_PUBLIC_WORDPRESS_API_URL or WORDPRESS_API_URL.",
      });
    }

    // Derive the allowed hostname from WP API URL, e.g. https://example.com/wp-json
    const allowedHost = new URL(wpApi).hostname;

    const srcParam = req.query.src;
    const idParam = req.query.id;

    const src = typeof srcParam === "string" ? srcParam : "";
    const id = typeof idParam === "string" ? idParam : "";

    let imageUrl = "";

    if (id) {
      // Resolve media ID -> source_url via WP REST
      const mediaUrl = `${wpApi.replace(/\/$/, "")}/wp/v2/media/${encodeURIComponent(id)}`;
      const mediaRes = await fetch(mediaUrl, { cache: "no-store" });

      if (!mediaRes.ok) {
        return res
          .status(mediaRes.status)
          .json({ error: "Failed to resolve media id" });
      }

      const mediaJson = (await mediaRes.json()) as { source_url?: string };
      if (!mediaJson?.source_url) {
        return res.status(404).json({ error: "Media has no source_url" });
      }

      imageUrl = mediaJson.source_url;
    } else if (src) {
      imageUrl = src;
    } else {
      return res.status(400).json({ error: "Provide either src or id" });
    }

    // Security: only allow fetching from the configured WP host
    let parsed: URL;
    try {
      parsed = new URL(imageUrl);
    } catch {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    if (parsed.hostname !== allowedHost) {
      return res.status(403).json({ error: "Forbidden host" });
    }

    // Fetch the image bytes
    const upstream = await fetch(imageUrl, {
      // Let the browser cache via our response headers
      cache: "no-store",
    });

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: "Failed to fetch image" });
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const cacheControl = upstream.headers.get("cache-control");

    // Caching: default 1 day, allow CDN to cache.
    // If WP already provides cache-control, you may choose to forward it.
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Cache-Control",
      cacheControl || "public, s-maxage=86400, max-age=86400, stale-while-revalidate=604800"
    );

    // Stream response
    const arrayBuffer = await upstream.arrayBuffer();
    res.status(200).send(Buffer.from(arrayBuffer));
  } catch {
    return res.status(500).json({ message: "Unknown error" });
  }
}