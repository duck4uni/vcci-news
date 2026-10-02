import type { Metadata } from "next";
import links from "@links/index";
import VideoListing from "./video-listing";

export const metadata: Metadata = {
  title: "Video",
  description:
    "Thư viện video VCCI-HCM: các phóng sự, sự kiện, hội thảo và hoạt động xúc tiến thương mại.",
  alternates: {
    canonical: `${links.siteURL.replace(/\/+$/, "")}/video`,
  },
};

type VideoPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default function VideoPage({ searchParams }: VideoPageProps) {
  return <VideoListing searchParams={searchParams} />;
}
