/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Production deployments use the default HTTPS port and do not define this
  // local-development setting. Expose an empty suffix so API URL templates do
  // not render the literal string "undefined".
  env: {
    NEXT_PUBLIC_BASE_PORT: process.env.NEXT_PUBLIC_BASE_PORT ?? "",
  },
  images: {
    // Allow local API image proxy with query params
    localPatterns: [
      {
        pathname: "/api/get-image-from-wp",
      },
      {
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
