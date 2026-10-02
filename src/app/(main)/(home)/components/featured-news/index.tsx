import { getApiV10Post } from "@/api/vcci-news/endpoints/post";
import type {
  RawPostWithThumbnail,
} from "@/api/vcci-news/types/post-raw";
import type { PagedResult } from "@/api/vcci-news/types/paged-result";
import {
  buildPostLink,
  normalizeLink,
  resolveAssetUrl,
} from "@/lib/utils/post";
import { MOCK_HOME_POSTS } from "@/mockdata/home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HorizontalAdBanner } from "@/app/(main)/(home)/components/horizontal-ad-banner";
import { getFallbackImage } from "@/lib/utils/fallback-image";

const TIN_VCCI_CATEGORY_ID = "b89b2ba6-a699-47cb-87e4-0643aea549a9";
const SECTION_LINK_FALLBACK = "/hoat-dong/tin-tuc";
const PAGE_SIZE = 3;

/** Featured posts: is_featured==true, ưu tiên bài featured, sort created_at desc ở BE. */
const SECTION_PARAMS = {
  page: 1,
  pageSize: PAGE_SIZE,
  sortField: "created_at",
  sortOrder: "desc",
  priorityFeatured: true,
  filters: ["is_featured==true", "is_hidden==false", "is_active==true", "type==news"].join(","),
} as const;

type FeaturedNewsItem = {
  id: string;
  title: string;
  externalLink: string;
  createdAt: string;
  publishedAt: string;
  categoryName: string;
  thumbnail: { url: string; alt: string } | null;
};

const toFeaturedNewsItem = (post: RawPostWithThumbnail): FeaturedNewsItem => {
  const title = String(post.title ?? "").trim();
  const thumbnailPath = post.thumbnail?.path ?? post.thumbnail?.original ?? null;

  return {
    id: String(post.id ?? ""),
    title,
    externalLink: buildPostLink(
      post.slug ? `/${post.slug}` : (title ? `/${title}` : undefined),
      post.id ? String(post.id) : "",
    ),
    createdAt: String(post.created_at ?? ""),
    publishedAt: String(post.published_at ?? post.release_at ?? post.created_at ?? ""),
    categoryName: String(post.categories?.[0]?.name ?? ""),
    thumbnail: thumbnailPath
      ? { url: resolveAssetUrl(thumbnailPath), alt: title }
      : null,
  };
};

/** Link danh mục Tin VCCI lấy từ chính danh sách posts, fallback nếu không có. */
const resolveSectionLink = (posts: RawPostWithThumbnail[]) => {
  for (const post of posts) {
    const category = post.categories?.find(
      (item) => item?.id === TIN_VCCI_CATEGORY_ID && item?.url && item.url !== "#",
    );
    if (category?.url) return normalizeLink(category.url, SECTION_LINK_FALLBACK);
  }
  return SECTION_LINK_FALLBACK;
};


const fetchFeaturedNewsPosts = async (): Promise<{
  posts: FeaturedNewsItem[];
  sectionLink: string;
}> => {
  try {
    const response = await getApiV10Post(SECTION_PARAMS);
    const rows =
      (response as PagedResult<RawPostWithThumbnail> | undefined)?.responseData?.rows ?? [];
    if (rows.length === 0) throw new Error("Empty rows");

    return {
      posts: rows.map(toFeaturedNewsItem),
      sectionLink: resolveSectionLink(rows),
    };
  } catch (error) {
    console.warn("[FeaturedNews] CMS unavailable, falling back to mock data", error);

    const mockPosts = MOCK_HOME_POSTS.filter(
      (item) => item.isFeatured && !item.isHidden,
    ).slice(0, PAGE_SIZE);
    const mockSectionLink =
      mockPosts
        .flatMap((item) => item.categories)
        .find((category) => category.id === TIN_VCCI_CATEGORY_ID && category.url !== "#")
        ?.url ?? SECTION_LINK_FALLBACK;

    return {
      posts: mockPosts.map((item) => ({
        id: item.id,
        title: item.title,
        externalLink: item.externalLink,
        createdAt: item.createdAt,
        publishedAt: item.publishedAt,
        categoryName: item.categories[0]?.name ?? "",
        thumbnail: item.thumbnail,
      })),
      sectionLink: mockSectionLink,
    };
  }
};

export function FeaturedNewsSkeleton() {
  const primaryFallback = getFallbackImage(0);

  return (
    <section className="py-8 md:py-10">
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Tin nổi bật
            </h2>
            <div className="mt-3 h-[5px] w-[68px] rounded-full bg-[#f7b500]" />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="relative overflow-hidden rounded-[16px] bg-[#e9eef8] shadow-[0_16px_32px_rgba(28,52,120,0.12)] md:rounded-[16px] md:min-h-[320px] lg:min-h-[380px]">
            <div className="flex h-full min-h-[195px] flex-col justify-end p-3.5 md:min-h-80 md:p-5 lg:min-h-[380px]">
              <span className="mb-2 h-8 w-28 animate-pulse rounded-[10px] bg-white/80" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-white/90 md:h-10" />
              <div className="mt-2 h-5 w-28 animate-pulse rounded bg-white/70" />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:min-h-[380px]">
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={`featured-news-skeleton-${index}`}
                  className="rounded-[16px] bg-[#dde5f3] shadow-[0_16px_32px_rgba(28,52,120,0.1)] min-h-[165px]"
                >
                  <div className="flex h-full min-h-[165px] flex-col justify-end p-3.5">
                    <span className="mb-2 h-7 w-24 animate-pulse rounded-[10px] bg-white/80" />
                    <div className="h-6 w-5/6 animate-pulse rounded bg-white/90" />
                    <div className="mt-2 h-4 w-24 animate-pulse rounded bg-white/70" />
                  </div>
                </div>
              ))}
            </div>

            <HorizontalAdBanner />
          </div>
        </div>
      </div>
    </section>
  );
}

export async function FeaturedNews() {
  const { posts, sectionLink } = await fetchFeaturedNewsPosts();
  const featuredNewsItems = posts.slice(0, 3);
  const [primaryItem, ...secondaryItems] = featuredNewsItems;
  const secondarySlots = Array.from({ length: 2 }, (_, index) => secondaryItems[index] ?? null);

  const primaryFallback = getFallbackImage(0);
  const secondaryFallbacks = [getFallbackImage(1), getFallbackImage(2)];

  return (
    <section className="py-8 md:py-10">
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Tin nổi bật
            </h2>
            <div className="mt-3 h-[5px] w-[68px] rounded-full bg-[#f7b500]" />
          </div>

          <Link
            href={sectionLink}
            className="text-[#2b56c0] transition-colors hover:text-[#173f9f]"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {primaryItem ? (
            <Link
              href={primaryItem.externalLink}
              className="group relative block cursor-pointer overflow-hidden rounded-[16px] bg-[#0d2f5f] shadow-[0_16px_32px_rgba(28,52,120,0.2)] md:rounded-[16px] md:min-h-[320px] lg:min-h-[380px]"
            >
              <div className="relative h-full min-h-[195px] md:min-h-[320px] lg:min-h-[380px]">
                <Image
                  src={primaryItem.thumbnail?.url ?? primaryFallback}
                  alt={primaryItem.thumbnail?.alt || primaryItem.title}
                  width={1200}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#26356d] via-[#53669b]/34 to-transparent" />

                <div className="relative flex h-full flex-col justify-end p-3.5 md:p-5">
                  <span className="mb-2 inline-flex w-fit rounded-[10px] bg-[#ffc400] px-3 py-1 text-sm font-bold text-[#1d3f90]">
                    {primaryItem.categoryName || "Tin nổi bật"}
                  </span>

                  <h3 className="max-w-3xl line-clamp-2 text-[16px] font-bold leading-[1.32] text-white transition-colors duration-200 group-hover:text-[#f7b500] md:line-clamp-3 md:text-[22px] lg:text-[24px]">
                    {primaryItem.title}
                  </h3>

                  <p className="mt-1.5 text-[15px] font-medium text-white/78 md:mt-2 md:text-[17px]">
                    {dayjs(primaryItem.publishedAt || primaryItem.createdAt).format(
                      "DD/MM/YYYY",
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative overflow-hidden rounded-[16px] bg-[#e9eef8] shadow-[0_16px_32px_rgba(28,52,120,0.12)] md:rounded-[16px] md:min-h-[320px] lg:min-h-[380px]">
              <div className="flex h-full min-h-[195px] flex-col justify-end p-3.5 md:min-h-80 md:p-5 lg:min-h-[380px]">
                <span className="mb-2 h-8 w-28 rounded-[10px] bg-white/80" />
                <div className="h-8 w-3/4 rounded bg-white/90 md:h-10" />
                <div className="mt-2 h-5 w-28 rounded bg-white/70" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 lg:min-h-[380px]">
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {secondarySlots.map((item, index) =>
                item ? (
                  <Link
                    key={item.id}
                    href={item.externalLink}
                    className="group relative block cursor-pointer overflow-hidden rounded-[16px] bg-[#27447f] shadow-[0_16px_32px_rgba(28,52,120,0.2)] min-h-[165px]"
                  >
                    <div className="relative flex h-full min-h-[165px]">
                      <Image
                        src={item.thumbnail?.url ?? secondaryFallbacks[index] ?? primaryFallback}
                        alt={item.thumbnail?.alt || item.title}
                        width={600}
                        height={420}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#5a6796] via-[#405083]/34 to-transparent" />

                      <div className="relative flex h-full flex-col justify-end p-3.5">
                        <span className="mb-2 inline-flex w-fit rounded-[10px] bg-[#ffc400] px-3 py-1 text-sm font-bold text-[#1d3f90]">
                          {item.categoryName || "Tin nổi bật"}
                        </span>

                        <h4 className="line-clamp-2 text-[16px] font-bold leading-[1.32] text-white transition-colors duration-200 group-hover:text-[#f7b500] md:text-[17px]">
                          {item.title}
                        </h4>

                        <p className="mt-1.5 text-[15px] font-medium text-white/78 md:text-base">
                          {dayjs(item.publishedAt || item.createdAt).format(
                            "DD/MM/YYYY",
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={`featured-placeholder-${index}`}
                    className="rounded-[16px] bg-[#dde5f3] shadow-[0_16px_32px_rgba(28,52,120,0.1)] min-h-[165px]"
                  >
                    <div className="flex h-full min-h-[165px] flex-col justify-end p-3.5">
                      <span className="mb-2 h-7 w-24 rounded-[10px] bg-white/80" />
                      <div className="h-6 w-5/6 rounded bg-white/90" />
                      <div className="mt-2 h-4 w-24 rounded bg-white/70" />
                    </div>
                  </div>
                ),
              )}
            </div>

            <HorizontalAdBanner />
          </div>
        </div>
      </div>
    </section>
  );
}
