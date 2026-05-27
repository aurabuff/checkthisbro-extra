import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  basePath: "/extra",
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
