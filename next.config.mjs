/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // Allow local API image proxy with query params
    localPatterns: [
      {
        pathname: "/api/get-image-from-wp",
      },
    ],
  },
};

export default nextConfig;