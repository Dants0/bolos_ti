import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.192",
        //hostname: "localhost",
        pathname: "/**", // Allow all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
