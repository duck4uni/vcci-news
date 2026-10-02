import type { Metadata } from "next";
import links from "@links/index";
import SiteMapListing from "./site-map-listing";

export const metadata: Metadata = {
  title: "Sơ đồ trang web",
  description: "Sơ đồ trang web VCCI-HCM: tổng quan các chuyên mục và bài viết trên website.",
  alternates: {
    canonical: `${links.siteURL.replace(/\/+$/, "")}/site-map`,
  },
};

export default function SiteMapPage() {
  return <SiteMapListing />;
}
