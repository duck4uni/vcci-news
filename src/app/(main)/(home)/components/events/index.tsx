import { getApiV10Post } from "@/api/vcci-news/endpoints/post";
import type { RawEventPost } from "@/api/vcci-news/types/post-raw";
import type { PagedResult } from "@/api/vcci-news/types/paged-result";
import {
  buildPostLink,
  normalizeLink,
  resolveAssetUrl,
  stripHtml,
} from "@/lib/utils/post";
import { MOCK_HOME_POSTS } from "@/mockdata/home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getFallbackImage } from "@/lib/utils/fallback-image";

const SU_KIEN_CATEGORY_ID = "b85f6710-bcbc-4c0b-8b3a-09fff0e5e51a";
const DAO_TAO_CATEGORY_ID = "36df7021-9a74-43d6-9084-0d5ed347b7f4";
const SECTION_LINK_FALLBACK = "/hoat-dong/su-kien";
const PAGE_SIZE = 5;

/** Multi-category filter (OR) — sắp xếp & lọc hoàn toàn ở BE. */
const SECTION_PARAMS = {
  page: 1,
  pageSize: PAGE_SIZE,
  sortField: "created_at",
  sortOrder: "desc",
  priorityFeatured: false,
  filters: [
    `category.id==(${SU_KIEN_CATEGORY_ID}|${DAO_TAO_CATEGORY_ID})`,
    "is_hidden==false",
    "is_active==true",
    "type==news",
  ].join(","),
} as const;

type EventItem = {
  id: string;
  title: string;
  externalLink: string;
  createdAt: string;
  publishedAt: string;
  startedAt: string;
  contentText: string;
  summary: string;
  /** Text đã strip HTML (caption/figure/img/tag/entity). */
  excerpt: string;
  categoryName: string;
  thumbnail: { url: string; alt: string } | null;
};


const toEventItem = (post: RawEventPost): EventItem => {
  const title = String(post.title ?? "").trim();
  const categories = post.categories ?? [];
  const thumbnailPath = post.thumbnail?.path ?? post.thumbnail?.original ?? null;
  const contentText = String(
    post.content_structure?.post_content?.[0]?.content ??
    post.summary ??
    post.content ??
    "",
  );
  const summary = String(post.summary ?? post.content ?? "");

  return {
    id: String(post.id ?? ""),
    title,
    externalLink: buildPostLink(
      post.slug ? `/${post.slug}` : (title ? `/${title}` : undefined),
      post.id ? String(post.id) : "",
    ),
    createdAt: String(post.created_at ?? ""),
    publishedAt: String(post.published_at ?? post.release_at ?? post.created_at ?? ""),
    startedAt: String(post.started_at ?? ""),
    contentText,
    summary,
    excerpt: stripHtml(contentText || summary),
    categoryName: String(categories[0]?.name ?? ""),
    thumbnail: thumbnailPath
      ? { url: resolveAssetUrl(thumbnailPath), alt: title }
      : null,
  };
};

/** Lấy url danh mục sự kiện/đào tạo từ chính danh sách posts, fallback nếu không có. */
const resolveSectionLink = (posts: RawEventPost[]) => {
  for (const post of posts) {
    const category = post.categories?.find(
      (item) =>
        (item?.id === SU_KIEN_CATEGORY_ID || item?.id === DAO_TAO_CATEGORY_ID) &&
        item?.url &&
        item.url !== "#",
    );
    if (category?.url) return normalizeLink(category.url, SECTION_LINK_FALLBACK);
  }
  return SECTION_LINK_FALLBACK;
};


const isEventCategoryId = (id?: string | null) =>
  id === SU_KIEN_CATEGORY_ID || id === DAO_TAO_CATEGORY_ID;

const fetchEventPosts = async (): Promise<{
  posts: EventItem[];
  sectionLink: string;
}> => {
  try {
    const response = await getApiV10Post(SECTION_PARAMS);
    const rows =
      (response as PagedResult<RawEventPost> | undefined)?.responseData?.rows ?? [];
    if (rows.length === 0) throw new Error("Empty rows");

    return {
      posts: rows.map(toEventItem),
      sectionLink: resolveSectionLink(rows),
    };
  } catch (error) {
    console.warn("[Events] CMS unavailable, falling back to mock data", error);

    const mockPosts = MOCK_HOME_POSTS.filter((item) =>
      item.categories.some((category) => isEventCategoryId(category.id)),
    );
    const mockSectionLink =
      mockPosts
        .flatMap((item) => item.categories)
        .find((category) => isEventCategoryId(category.id) && category.url !== "#")
        ?.url ?? SECTION_LINK_FALLBACK;

    return {
      posts: mockPosts.map((item) => ({
        id: item.id,
        title: item.title,
        externalLink: item.externalLink,
        createdAt: item.createdAt,
        publishedAt: item.publishedAt,
        startedAt: item.startedAt,
        contentText: item.contentText,
        summary: item.summary,
        excerpt: stripHtml(item.contentText || item.summary),
        categoryName: item.categories[0]?.name ?? "",
        thumbnail: item.thumbnail,
      })),
      sectionLink: mockSectionLink,
    };
  }
};

export function EventsSkeleton() {
  return (
    <div className="flex-1 rounded-[16px] bg-linear-to-br from-[#14488f] to-[#2d67bf] p-4 text-white shadow-[0_18px_38px_rgba(16,61,130,0.24)] md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="client-section-title uppercase text-white">
            Sự kiện sắp diễn ra
          </h2>
          <div className="mt-2.5 h-[4px] w-[60px] rounded-full bg-[#f7b500]" />
        </div>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1.02fr)_minmax(270px,0.98fr)]">
        <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-white text-[#20408f] shadow-[0_14px_28px_rgba(10,39,95,0.12)]">
          <div className="h-[180px] animate-pulse bg-[#d7e3f9] md:h-[220px] xl:h-[248px]" />
          <div className="space-y-2 p-3 pt-2.5">
            <div className="h-6 w-5/6 animate-pulse rounded bg-[#e7eefb]" />
            <div className="h-4 w-24 animate-pulse rounded bg-[#eef3fb]" />
          </div>
        </div>

        <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={`events-skeleton-${index}`}
              className="flex flex-1 items-center gap-3 rounded-[14px] bg-white/10 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              <div className="h-[64px] w-[64px] shrink-0 animate-pulse rounded-[14px] bg-white/20" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-5/6 animate-pulse rounded bg-white/25" />
                <div className="mt-2 h-3 w-20 animate-pulse rounded bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function Events() {
  const { posts, sectionLink } = await fetchEventPosts();
  // Giữ nguyên hành vi cũ: đảo ngược danh sách trước khi chọn bài featured
  const eventItems = [...posts].reverse();
  const [featuredEvent, ...sideEvents] = eventItems;
  const sideSlots = Array.from({ length: 4 }, (_, index) => sideEvents[index] ?? null);

  const featuredFallback = getFallbackImage(0);
  const sideFallbacks = Array.from({ length: 4 }, (_, i) => getFallbackImage(i + 1));

  return (
    <div className="flex-1 rounded-[16px] bg-linear-to-br from-[#14488f] to-[#2d67bf] p-4 text-white shadow-[0_18px_38px_rgba(16,61,130,0.24)] md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="client-section-title uppercase text-white">
            Sự kiện sắp diễn ra
          </h2>
          <div className="mt-2.5 h-[4px] w-[60px] rounded-full bg-[#f7b500]" />
        </div>

        <Link
          href={sectionLink}
          className="text-[#ffd34f] transition-colors hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1.02fr)_minmax(270px,0.98fr)]">
        {featuredEvent ? (
          <Link
            href={featuredEvent.externalLink}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[14px] bg-white text-[#20408f] shadow-[0_14px_28px_rgba(10,39,95,0.18)]"
          >
            <div className="relative h-[180px] overflow-hidden md:h-[220px] xl:h-[248px]">
              <Image
                src={featuredEvent.thumbnail?.url ?? featuredFallback}
                alt={featuredEvent.thumbnail?.alt || featuredEvent.title}
                width={720}
                height={520}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex rounded-full bg-[#f7b500] px-3 py-1 text-[12px] font-bold text-[#15357a]">
                {featuredEvent.categoryName || "Sự kiện"}
              </span>
            </div>

            <div className="flex flex-col p-3 pt-2.5">
              <h3 className="text-[16px] font-bold uppercase leading-[1.28] text-[#22459b] line-clamp-2 transition-colors duration-200 group-hover:text-[#f7b500] md:text-[18px]">
                {featuredEvent.title}
              </h3>
              {featuredEvent.excerpt.length > 10 ? (
                <p className="mt-2 line-clamp-1 text-[13px] leading-normal text-[#5f6f86]">
                  {featuredEvent.excerpt.substring(0, 150)}
                </p>
              ) : null}
              <p className="mt-auto pt-2 text-[13px] text-[#90a0bd]">
                {dayjs(
                  featuredEvent.startedAt || featuredEvent.publishedAt || featuredEvent.createdAt,
                ).format("DD/MM/YYYY")}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex h-full flex-col overflow-hidden rounded-[14px] bg-white text-[#20408f] shadow-[0_14px_28px_rgba(10,39,95,0.12)]">
            <div className="h-[180px] bg-[#d7e3f9] md:h-[220px] xl:h-[248px]" />
            <div className="space-y-2 p-3 pt-2.5">
              <div className="h-6 w-5/6 rounded bg-[#e7eefb]" />
              <div className="h-4 w-24 rounded bg-[#eef3fb]" />
            </div>
          </div>
        )}

        <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
          {sideSlots.map((item, index) =>
            item ? (
              <Link
                key={item.id}
                href={item.externalLink}
                className="group flex flex-1 cursor-pointer items-center gap-3 rounded-[14px] bg-white/10 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-sm transition-colors hover:bg-white/14"
              >
                <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[14px]">
                  <Image
                    src={item.thumbnail?.url ?? sideFallbacks[index] ?? featuredFallback}
                    alt={item.thumbnail?.alt || item.title}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="line-clamp-1 text-[15px] font-semibold leading-[1.35] text-white transition-colors duration-200 group-hover:text-[#f7b500]">
                    {item.title}
                  </h4>
                  {item.excerpt.length > 10 ? (
                    <p className="mt-1 line-clamp-1 text-[12px] text-white/78">
                      {item.excerpt.substring(0, 80)}
                    </p>
                  ) : null}
                  <div className="mt-1 flex items-center gap-2">
                    {item.categoryName && (
                      <span className="text-[12px] font-medium text-[#f7b500]">
                        {item.categoryName}
                      </span>
                    )}
                    {item.categoryName && (
                      <span className="text-[12px] text-white/50">•</span>
                    )}
                    <p className="text-[12px] text-white/78">
                      {dayjs(item.startedAt || item.publishedAt || item.createdAt).format(
                        "DD/MM/YYYY",
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={`event-placeholder-${index}`}
                className="flex flex-1 items-center gap-3 rounded-[14px] bg-white/10 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <div className="h-[64px] w-[64px] shrink-0 rounded-[14px] bg-white/20" />
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-5/6 rounded bg-white/25" />
                  <div className="mt-2 h-3 w-20 rounded bg-white/20" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
