import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "vcci-hcm.org.vn",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "vcci-hcm.org.vn",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "vccihcm.vn",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "news.vccihcm.vn",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
