import type { NextConfig } from "next";
import links from "./src/links/index";
const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: links.backendHost,
        port: "",
        pathname: "/vcci/images/**",
      },
    ],
  },
};

export default nextConfig;
