import type { NextConfig } from "next";
import links from "./src/links/index";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(links.backendHost
        ? [
            {
              protocol: links.backendProtocol as "http" | "https",
              hostname: links.backendHost,
              port: "",
              pathname: `${links.backendPathname === "/" ? "" : links.backendPathname}/**`,
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "vcci-hcm.org.vn", // WordPress / media host
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "vccihcm.vn",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
