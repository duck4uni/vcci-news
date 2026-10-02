import type { Metadata } from "next";
import links from "@links/index";
import NewsListing from "./news-listing";

export const metadata: Metadata = {
  title: "Tin tức",
  description:
    "Tổng hợp toàn bộ tin tức của VCCI HCM: tin VCCI, tin kinh tế, chuyên đề và các bài viết mới nhất.",
  alternates: {
    canonical: `${links.siteURL.replace(/\/+$/, "")}/news`,
  },
};

export default function NewsPage() {
  return <NewsListing />;
}
