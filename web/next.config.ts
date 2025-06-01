import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
