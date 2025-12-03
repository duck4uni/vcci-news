import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hiea.meu-solutions.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "vcci-hcm.org.vn",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
