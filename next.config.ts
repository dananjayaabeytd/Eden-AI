import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats; next/image falls back automatically for older browsers.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
