import type { Metadata } from "next";
import links from "@links/index";
import SearchListing from "./search-listing";

type SearchPageProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const siteUrl = links.siteURL.replace(/\/+$/, "");

  return {
    title: query ? `Tìm kiếm: ${query}` : "Tìm kiếm",
    description: query
      ? `Kết quả tìm kiếm "${query}" trên cổng thông tin VCCI-HCM.`
      : "Tìm kiếm bài viết trên cổng thông tin VCCI-HCM.",
    alternates: {
      canonical: `${siteUrl}/search`,
    },
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return <SearchListing searchParams={searchParams} />;
}
