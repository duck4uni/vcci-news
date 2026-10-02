'use client';

import { useGetApiV10Post } from "@/api/vcci-news/endpoints/post";
import type { RawPostWithContent } from "@/api/vcci-news/types/post-raw";
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
import { useMemo, useState } from "react";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "tin-vcci", label: "Tin VCCI" },
  { id: "tin-kinh-te", label: "Tin Kinh tế" },
  { id: "chuyen-de", label: "Chuyên đề" },
];

const NEWS_SECTION_LINK_FALLBACK = "/hoat-dong/tin-tuc";
const NEWS_PAGE_SIZE = 6;

const NEWS_CATEGORY_IDS = {
  tinVcci: "b89b2ba6-a699-47cb-87e4-0643aea549a9",
  tinKinhTe: "755106b6-1aca-47dc-9a9c-d434736c33a1",
  chuyenDe: "8e7090e5-bfc3-4128-81a5-37ec78c33bad",
} as const;

const NEWS_CATEGORY_ALIASES = {
  tinVcci: ["Tin VCCI", "tin-vcci"],
  tinKinhTe: ["Tin Kinh tế", "tin-kinh-te"],
  chuyenDe: ["Chuyên đề", "chuyen-de"],
} as const;

type NewsCategoryKey = keyof typeof NEWS_CATEGORY_IDS;

type RawNewsPost = RawPostWithContent & {
  thumbnail?: { path?: string | null; original?: string | null } | null;
};

type NewsPostItem = {
  id: string;
  title: string;
  externalLink: string;
  summary: string;
  contentText: string;
  createdAt: string;
  publishedAt: string;
  categoryName: string;
  thumbnail: { url: string; alt: string } | null;
};

const toNewsPostItem = (post: RawNewsPost): NewsPostItem => {
  const title = String(post.title ?? "").trim();
  const thumbnailPath = post.thumbnail?.path ?? post.thumbnail?.original ?? null;

  return {
    id: String(post.id ?? ""),
    title,
    externalLink: buildPostLink(
      post.slug ? `/${post.slug}` : (title ? `/${title}` : undefined),
      post.id ? String(post.id) : "",
    ),
    summary: String(post.summary ?? post.content ?? ""),
    contentText: String(
      post.content_structure?.post_content?.[0]?.content ??
      post.summary ??
      post.content ??
      "",
    ),
    createdAt: String(post.created_at ?? ""),
    publishedAt: String(post.published_at ?? post.release_at ?? post.created_at ?? ""),
    categoryName: String(post.categories?.[0]?.name ?? ""),
    thumbnail: thumbnailPath
      ? { url: resolveAssetUrl(thumbnailPath), alt: title }
      : null,
  };
};

/** Link danh mục tương ứng từ chính posts, fallback nếu không có. */
const resolveSectionLink = (
  posts: RawNewsPost[],
  categoryId: string,
  aliases: readonly string[],
) => {
  for (const post of posts) {
    const category = post.categories?.find(
      (item) =>
        item?.id === categoryId &&
        item?.url &&
        item.url !== "#" &&
        item.url !== "/",
    );
    if (category?.url) return normalizeLink(category.url, NEWS_SECTION_LINK_FALLBACK);
  }

  // Fallback: khớp theo tên/slug alias.
  const aliasSlugs = aliases.map((alias) =>
    alias
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  );
  for (const post of posts) {
    const category = post.categories?.find(
      (item) =>
        item?.url &&
        item.url !== "#" &&
        item.url !== "/" &&
        aliasSlugs.some((slug) =>
          (item.slug ?? "").toLowerCase().includes(slug) ||
          item.url!.toLowerCase().includes(slug),
        ),
    );
    if (category?.url) return normalizeLink(category.url, NEWS_SECTION_LINK_FALLBACK);
  }

  return NEWS_SECTION_LINK_FALLBACK;
};

const matchesNewsAliases = (
  item: (typeof MOCK_HOME_POSTS)[number],
  categoryId: string,
  aliases: readonly string[],
) =>
  item.categories.some(
    (category) =>
      category.id === categoryId ||
      aliases.some((alias) => category.name.toLowerCase() === alias.toLowerCase()),
  );

const toNewsTabResult = (
  response: unknown,
  categoryId: string,
  aliases: readonly string[],
): { posts: NewsPostItem[]; sectionLink: string } => {
  const rows =
    (response as { responseData?: { rows?: RawNewsPost[] } } | undefined)
      ?.responseData?.rows ?? [];

  if (rows.length === 0) {
    // Fallback mock khi BE lỗi hoặc trả rỗng.
    const mockPosts = MOCK_HOME_POSTS.filter((item) =>
      matchesNewsAliases(item, categoryId, aliases),
    ).slice(0, NEWS_PAGE_SIZE);

    return {
      posts: mockPosts.map((item) => ({
        id: item.id,
        title: item.title,
        externalLink: item.externalLink,
        summary: item.summary,
        contentText: item.contentText,
        createdAt: item.createdAt,
        publishedAt: item.publishedAt,
        categoryName: item.categories[0]?.name ?? "",
        thumbnail: item.thumbnail,
      })),
      sectionLink: NEWS_SECTION_LINK_FALLBACK,
    };
  }

  return {
    posts: rows.map(toNewsPostItem),
    sectionLink: resolveSectionLink(rows, categoryId, aliases),
  };
};

function useNewsTabPosts(key: NewsCategoryKey) {
  const categoryId = NEWS_CATEGORY_IDS[key];
  const aliases = NEWS_CATEGORY_ALIASES[key];

  return useGetApiV10Post(
    {
      page: 1,
      pageSize: NEWS_PAGE_SIZE,
      sortField: "created_at",
      sortOrder: "desc",
      priorityFeatured: false,
      filters: [
        `category.id==${categoryId}`,
        "is_hidden==false",
        "is_active==true",
        "type==news",
      ].join(","),
    },
    {
      query: {
        staleTime: 60 * 1000,
        select: (response: unknown) => toNewsTabResult(response, categoryId, aliases),
      },
    },
  );
}

const uniquePosts = (items: NewsPostItem[]) => {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export function News() {
  const [tab, setTab] = useState("all");

  const tinVcciQuery = useNewsTabPosts("tinVcci");
  const tinKinhTeQuery = useNewsTabPosts("tinKinhTe");
  const chuyenDeQuery = useNewsTabPosts("chuyenDe");

  const tinVcciPosts = tinVcciQuery.data?.posts ?? [];
  const tinKinhTePosts = tinKinhTeQuery.data?.posts ?? [];
  const chuyenDePosts = chuyenDeQuery.data?.posts ?? [];

  const allPosts = useMemo(
    () => uniquePosts([...tinVcciPosts, ...tinKinhTePosts, ...chuyenDePosts]),
    [tinVcciPosts, tinKinhTePosts, chuyenDePosts],
  );

  const filteredItems = useMemo(() => {
    if (tab === "all") return allPosts;
    if (tab === "tin-kinh-te") return tinKinhTePosts;
    if (tab === "chuyen-de") return chuyenDePosts;
    return tinVcciPosts;
  }, [allPosts, tinKinhTePosts, chuyenDePosts, tinVcciPosts, tab]);

  const overviewLink = useMemo(() => {
    if (tab === "tin-kinh-te") return tinKinhTeQuery.data?.sectionLink ?? NEWS_SECTION_LINK_FALLBACK;
    if (tab === "chuyen-de") return chuyenDeQuery.data?.sectionLink ?? NEWS_SECTION_LINK_FALLBACK;
    return tinVcciQuery.data?.sectionLink ?? NEWS_SECTION_LINK_FALLBACK;
  }, [tinVcciQuery.data, tinKinhTeQuery.data, chuyenDeQuery.data, tab]);

  const featuredArticle = filteredItems[0] ?? allPosts[0];
  const listArticles = filteredItems.slice(1, 5);

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Tin tức
            </h2>
            <div className="mt-3 h-[5px] w-[68px] rounded-full bg-[#f7b500]" />
          </div>
          <Link
            href="/news"
            aria-label="Xem tất cả tin tức"
            className="text-[#2b56c0] transition-colors hover:text-[#173f9f]"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          {tabs.map((item) => {
            const active = item.id === tab;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all ${active
                  ? "bg-[#1f5ba9] text-white shadow-[0_10px_20px_rgba(31,91,169,0.18)]"
                  : "bg-[#f4f7fb] text-[#7f8eab] hover:bg-[#eaf0f8]"
                  }`}
              >
                {item.label}
              </button>
            );
          })}
          <Link
            href={overviewLink}
            className="ml-auto text-[#24469c] transition-colors hover:text-[#1b55a1] xl:hidden"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Desktop: Featured card + side list */}
      <div className="hidden lg:block">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
          {/* Featured Article */}
          {featuredArticle ? (
            <Link
              href={featuredArticle.externalLink}
              className="group block cursor-pointer overflow-hidden rounded-[16px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]"
            >
              <div className="relative aspect-[1.4/1] overflow-hidden">
                <Image
                  src={featuredArticle.thumbnail?.url ?? "/thumbnail.png"}
                  alt={featuredArticle.thumbnail?.alt || featuredArticle.title}
                  width={720}
                  height={580}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex rounded-full bg-[#f7b500] px-3 py-1 text-[12px] font-bold text-[#15357a]">
                  {featuredArticle.categoryName || "Tin tức"}
                </span>
              </div>

              <div className="space-y-1.5 p-3">
                <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.28] text-[#20408f] transition-colors duration-200 group-hover:text-[#f7b500]">
                  {featuredArticle.title}
                </h3>

                <p className="line-clamp-2 text-[13px] leading-[1.45] text-[#6c7b96]">
                  {stripHtml(featuredArticle.contentText || featuredArticle.summary) || "-"}
                </p>

                <p className="text-[14px] text-[#8a9bb6]">
                  {dayjs(featuredArticle.publishedAt || featuredArticle.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </Link>
          ) : (
            <div className="overflow-hidden rounded-[16px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]">
              <div className="aspect-[1.75/1] bg-[#eef3fb]" />
              <div className="space-y-2 p-3">
                <div className="h-5 w-24 rounded bg-[#eef3fb]" />
                <div className="h-6 w-5/6 rounded bg-[#eef3fb]" />
                <div className="h-4 w-full rounded bg-[#f4f7fb]" />
                <div className="h-4 w-3/4 rounded bg-[#f4f7fb]" />
              </div>
            </div>
          )}

          {/* Side Articles */}
          <div className="flex h-full flex-col gap-3">
            {Array.from({ length: 4 }, (_, index) => {
              const news = listArticles[index];
              return news ? (
                <Link
                  key={news.id}
                  href={news.externalLink}
                  className="group flex flex-1 cursor-pointer items-center gap-3 rounded-[16px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,59,124,0.12)]"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[14px]">
                    <Image
                      src={news.thumbnail?.url ?? "/thumbnail.png"}
                      alt={news.thumbnail?.alt || news.title}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="line-clamp-1 text-[15px] font-bold leading-[1.28] text-[#21408f] transition-colors duration-200 group-hover:text-[#f7b500]">
                      {news.title}
                    </h4>
                    {(() => {
                      const textOnly = stripHtml(news.contentText || news.summary);
                      return textOnly.length > 10 ? (
                        <p className="mt-1 line-clamp-1 text-[13px] leading-normal text-[#6c7b96]">
                          {textOnly}
                        </p>
                      ) : null;
                    })()}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[12px] font-medium text-[#e2a500]">
                        {news.categoryName}
                      </span>
                      {news.categoryName && (
                        <span className="text-[12px] text-[#8a9bb6]">•</span>
                      )}
                      <p className="text-[13px] text-[#8a9bb6]">
                        {dayjs(news.publishedAt || news.createdAt).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={`news-placeholder-${index}`}
                  className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.06)]"
                >
                  <div className="h-20 w-20 shrink-0 rounded-[14px] bg-[#eef3fb]" />
                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-5/6 rounded bg-[#eef3fb]" />
                    <div className="mt-1 h-4 w-24 rounded bg-[#f4f7fb]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet: Featured card on top + side cards grid */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Featured Article */}
        {featuredArticle ? (
          <Link
            href={featuredArticle.externalLink}
            className="group block cursor-pointer overflow-hidden rounded-[16px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={featuredArticle.thumbnail?.url ?? "/thumbnail.png"}
                alt={featuredArticle.thumbnail?.alt || featuredArticle.title}
                width={720}
                height={580}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex rounded-full bg-[#f7b500] px-3 py-1 text-[12px] font-bold text-[#15357a]">
                {featuredArticle.categoryName || "Tin tức"}
              </span>
            </div>

            <div className="space-y-1.5 p-3">
              <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.28] text-[#20408f] transition-colors duration-200 group-hover:text-[#f7b500]">
                {featuredArticle.title}
              </h3>
              {(() => {
                const textOnly = stripHtml(featuredArticle.contentText || featuredArticle.summary);
                return textOnly.length > 10 ? (
                  <p className="line-clamp-2 text-[13px] leading-[1.45] text-[#6c7b96]">
                    {textOnly}
                  </p>
                ) : null;
              })()}
              <p className="text-[14px] text-[#8a9bb6]">
                {dayjs(featuredArticle.publishedAt || featuredArticle.createdAt).format("DD/MM/YYYY")}
              </p>
            </div>
          </Link>
        ) : (
          <div className="overflow-hidden rounded-[16px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]">
            <div className="aspect-[16/9] bg-[#eef3fb]" />
            <div className="space-y-2 p-3">
              <div className="h-5 w-24 rounded bg-[#eef3fb]" />
              <div className="h-6 w-5/6 rounded bg-[#eef3fb]" />
            </div>
          </div>
        )}

        {/* Side Articles */}
        <div className="flex flex-col gap-3">
          {listArticles.map((news, index) => {
            return news ? (
              <Link
                key={news.id}
                href={news.externalLink}
                className="group flex cursor-pointer items-center gap-3 rounded-[16px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,59,124,0.12)]"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[14px]">
                  <Image
                    src={news.thumbnail?.url ?? "/thumbnail.png"}
                    alt={news.thumbnail?.alt || news.title}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-[15px] font-bold leading-[1.28] text-[#21408f] transition-colors duration-200 group-hover:text-[#f7b500]">
                    {news.title}
                  </h4>
                  {(() => {
                    const textOnly = stripHtml(news.contentText || news.summary);
                    return textOnly.length > 10 ? (
                      <p className="mt-1 line-clamp-1 text-[13px] leading-normal text-[#6c7b96]">
                        {textOnly}
                      </p>
                    ) : null;
                  })()}
                  <div className="mt-1 flex items-center gap-2">
                    {news.categoryName && (
                      <>
                        <span className="text-[12px] font-medium text-[#e2a500]">
                          {news.categoryName}
                        </span>
                        <span className="text-[12px] text-[#8a9bb6]">•</span>
                      </>
                    )}
                    <p className="text-[12px] text-[#8a9bb6]">
                      {dayjs(news.publishedAt || news.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={`news-placeholder-${index}`}
                className="flex items-center gap-3 rounded-[16px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.06)]"
              >
                <div className="h-20 w-20 shrink-0 rounded-[14px] bg-[#eef3fb]" />
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-5/6 rounded bg-[#eef3fb]" />
                  <div className="mt-2 h-3 w-24 rounded bg-[#f4f7fb]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}