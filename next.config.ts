import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hiea.meu-solutions.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "hiea.meu-solutions.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "vcci-hcm.org.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "103.72.98.149",
        port: "7041",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
