"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCustomClient } from "@/api/mutator/custom-client";
import Links, { resolveUploadUrl } from "@/links";
import { MOCK_HOME_POSTS } from "@lib/mock-home-posts";

type RawHomeCategory = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  url?: string | null;
  type?: string | null;
};

type RawHomeThumbnail = {
  path?: string | null;
  original?: string | null;
};

type RawHomePost = {
  id?: string | null;
  title?: string | null;
  external_link?: string | null;
  summary?: string | null;
  content?: string | null;
  release_at?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  registration_deadline?: string | null;
  location?: string | null;
  participation_fee?: string | null;
  expired_at?: string | null;
  is_featured?: boolean | null;
  is_hidden?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
  type?: string | null;
  categories?: RawHomeCategory[] | null;
  thumbnail?: RawHomeThumbnail | null;
  content_structure?: {
    post_content?: Array<{
      content?: string | null;
    }> | null;
  } | null;
};

type HomeEnvelope<T> = {
  responseData?: T;
};

type HomePagedResult<T> = {
  rows?: T[];
};

export type HomePostCategory = {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: string;
};

export type HomePostItem = {
  id: string;
  title: string;
  externalLink: string;
  summary: string;
  contentText: string;
  createdAt: string;
  publishedAt: string;
  startedAt: string;
  endedAt: string;
  registrationDeadline: string;
  location: string;
  participationFee: string;
  expiredAt: string;
  isFeatured: boolean;
  isHidden: boolean;
  isActive: boolean;
  status: string;
  type: string;
  categories: HomePostCategory[];
  thumbnail: {
    url: string;
    alt: string;
  } | null;
};

const HOME_POSTS_QUERY_KEY = ["home-page-posts", "featured-page-size-3"] as const;

const HOME_CATEGORY_NAMES = {
  tinVcci: "Tin VCCI",
  tinKinhTe: "Tin Kinh tế",
  chuyenDe: "Chuyên đề",
  suKien: "Sự kiện",
  daoTao: "Đào tạo",
  coHoiKinhDoanh: "Cơ hội kinh doanh",
  chinhSachPhapLuat: "Thông tin Chính sách và Pháp luật",
  ketNoiHoiVien: "Kết nối hội viên",
} as const;

const normalizeText = (value?: string | null) => value?.trim().toLowerCase() ?? "";

const normalizeSearchText = (value?: string | null) =>
  normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/&/g, " va ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const normalizeSlug = (value?: string | null) =>
  normalizeSearchText(value).replace(/\s+/g, "-");

const HOME_CATEGORY_ALIASES = {
  tinVcci: ["Tin VCCI", "tin-vcci"],
  tinKinhTe: ["Tin Kinh tế", "tin-kinh-te"],
  chuyenDe: ["Chuyên đề", "chuyen-de"],
  suKien: ["Sự kiện", "su-kien"],
  daoTao: ["Đào tạo", "dao-tao"],
  coHoiKinhDoanh: ["Cơ hội kinh doanh", "co-hoi-kinh-doanh"],
  chinhSachPhapLuat: [
    "Thông tin Chính sách và Pháp luật",
    "Chính sách và Pháp luật",
    "Chính sách & Pháp luật",
    "Chính sách Pháp luật",
    "thong-tin-chinh-sach-va-phap-luat",
    "chinh-sach-va-phap-luat",
    "chinh-sach-phap-luat",
  ],
  ketNoiHoiVien: ["Kết nối hội viên", "ket-noi-hoi-vien"],
} as const;

const HOME_CATEGORY_IDS = {
  tinVcci: "b89b2ba6-a699-47cb-87e4-0643aea549a9",
  tinKinhTe: "755106b6-1aca-47dc-9a9c-d434736c33a1",
  chuyenDe: "8e7090e5-bfc3-4128-81a5-37ec78c33bad",
  suKien: "b85f6710-bcbc-4c0b-8b3a-09fff0e5e51a",
  daoTao: "36df7021-9a74-43d6-9084-0d5ed347b7f4",
  coHoiKinhDoanh: "0a460499-89c1-4f52-8592-1fb7bb69c4a2",
  ketNoiHoiVien: "a37b8a02-e8b3-42ce-9225-6dae460fed99",
  chinhSachPhapLuat: "cc448be9-b9ea-46a8-aa7b-0584803330e8",
  lienKetNhanh: "d7f05384-b1b4-428e-b9b3-37e0e1b0cecd",
} as const;

const normalizeLink = (value?: string | null, fallback = "/") => {
  const trimmed = value?.trim();

  if (!trimmed) return fallback;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;

  return `/${trimmed}`;
};

const buildPostLink = (path?: string | null, id?: string | null, fallback = "#") => {
  const normalizedPath = normalizeLink(path, fallback);
  const trimmedId = id?.trim() ?? "";

  if (!trimmedId || normalizedPath === "#") return normalizedPath;

  const params = new URLSearchParams({ id: trimmedId });
  return `${normalizedPath}?${params.toString()}`;
};

const resolveAssetUrl = (value?: string | null) => {
  const trimmed = value?.trim();

  if (!trimmed) return "/thumbnail.png";

  return resolveUploadUrl(trimmed);
};

const sortByPublishedDesc = (items: HomePostItem[]) =>
  [...items].sort((left, right) => {
    const leftTime = new Date(left.publishedAt || left.createdAt).getTime();
    const rightTime = new Date(right.publishedAt || right.createdAt).getTime();

    return rightTime - leftTime;
  });

const sortByEventStartAsc = (items: HomePostItem[]) =>
  [...items].sort((left, right) => {
    const leftTime = new Date(left.startedAt || left.publishedAt || left.createdAt).getTime();
    const rightTime = new Date(right.startedAt || right.publishedAt || right.createdAt).getTime();

    return leftTime - rightTime;
  });

const uniquePosts = (items: HomePostItem[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (!item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const matchesCategoryName = (item: HomePostItem, categoryName: string) => {
  const normalizedTarget = normalizeText(categoryName);

  return item.categories.some(
    (category) => normalizeText(category.name) === normalizedTarget,
  );
};

const matchesCategoryAliases = (
  item: HomePostItem,
  aliases: readonly string[],
) => {
  const aliasKeys = new Set(aliases.map(normalizeSearchText));
  const aliasSlugs = new Set(aliases.map(normalizeSlug));

  return item.categories.some((category) => {
    const categoryNameKey = normalizeSearchText(category.name);
    const categorySlugKey = normalizeSlug(category.slug || category.name);
    const categoryUrlKey = normalizeSlug(category.url);
    const categoryUrlSegments = category.url
      .split("/")
      .map((segment) => normalizeSlug(segment))
      .filter(Boolean);

    return (
      aliasKeys.has(categoryNameKey) ||
      aliasSlugs.has(categorySlugKey) ||
      categoryUrlSegments.some((segment) => aliasSlugs.has(segment)) ||
      Array.from(aliasSlugs).some((slug) => categoryUrlKey.endsWith(slug))
    );
  });
};

const isVisibleNewsPost = (item: HomePostItem) => {
  if (item.type && item.type !== "news") return false;
  if (item.isHidden) return false;
  if (!item.isActive) return false;
  return true;
};

const hasCategoryId = (item: HomePostItem, categoryId: string) =>
  item.categories.some((category) => category.id === categoryId);

async function fetchHomePostRows(path: string) {
  const response = await useCustomClient<HomeEnvelope<HomePagedResult<RawHomePost>>>(path);
  return response.responseData?.rows ?? [];
}

function createCategoryPostsQuery(categoryId: string, pageSize: string) {
  return new URLSearchParams({
    page: "1",
    pageSize,
    sortField: "release_at",
    sortOrder: "desc",
    filters: [
      `category.id==${categoryId}`,
      "is_hidden==false",
      "is_active==true",
      "type==news",
    ].join(","),
  });
}

function createMultiCategoryPostsQuery(categoryIds: string[], pageSize: string) {
  return new URLSearchParams({
    page: "1",
    pageSize,
    sortField: "release_at",
    sortOrder: "desc",
    filters: [
      `category.id==(${categoryIds.join("|")})`,
      "is_hidden==false",
      "is_active==true",
      "type==news",
    ].join(","),
  });
}

function createEventCalendarQuery(currentMonth: Date) {
  // We'll filter by date on client-side for more flexibility
  return new URLSearchParams({
    page: "1",
    pageSize: "100",
    sortField: "started_at",
    sortOrder: "asc",
    filters: [
      `category.id==(${HOME_CATEGORY_IDS.suKien}|${HOME_CATEGORY_IDS.daoTao})`,
      "is_hidden==false",
      "is_active==true",
      "type==news",
    ].join(","),
  });
}

async function fetchHomePosts() {
  // Trả về mock ngay khi CMS/BE gặp sự cố — website vẫn hiển thị được nội dung cơ bản.
  try {
    return await fetchHomePostsFromApi();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[useHomePosts] CMS unavailable, falling back to mock data", error);
    return MOCK_HOME_POSTS;
  }
}

async function fetchHomePostsFromApi() {
  const featuredQuery = new URLSearchParams({
    page: "1",
    pageSize: "3",
    sortField: "release_at",
    sortOrder: "desc",
    filters: [
      "is_featured==true",
      "is_hidden==false",
      "is_active==true",
      "type==news",
    ].join(","),
  });
  const tinVcciQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.tinVcci, "6");
  const tinKinhTeQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.tinKinhTe, "6");
  const chuyenDeQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.chuyenDe, "6");
  const eventQuery = createMultiCategoryPostsQuery(
    [HOME_CATEGORY_IDS.suKien, HOME_CATEGORY_IDS.daoTao],
    "5"
  );
  const policyQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.chinhSachPhapLuat, "6");
  const quickLinksQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.lienKetNhanh, "6");
  const trainingQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.daoTao, "10");
  const businessQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.coHoiKinhDoanh, "10");
  const memberConnectionQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.ketNoiHoiVien, "10");

  const [
    featuredRows,
    tinVcciRows,
    tinKinhTeRows,
    chuyenDeRows,
    policyRows,
    eventRows,
    quickLinkRows,
    trainingRows,
    businessRows,
    memberConnectionRows,
  ] = await Promise.all([
    fetchHomePostRows(`/post?${featuredQuery.toString()}`),
    fetchHomePostRows(`/post?${tinVcciQuery.toString()}`),
    fetchHomePostRows(`/post?${tinKinhTeQuery.toString()}`),
    fetchHomePostRows(`/post?${chuyenDeQuery.toString()}`),
    fetchHomePostRows(`/post?${policyQuery.toString()}`),
    fetchHomePostRows(`/post?${eventQuery.toString()}`),
    fetchHomePostRows(`/post?${quickLinksQuery.toString()}`),
    fetchHomePostRows(`/post?${trainingQuery.toString()}`),
    fetchHomePostRows(`/post?${businessQuery.toString()}`),
    fetchHomePostRows(`/post?${memberConnectionQuery.toString()}`),
  ]);

  const rows = [
    ...featuredRows,
    ...tinVcciRows,
    ...tinKinhTeRows,
    ...chuyenDeRows,
    ...policyRows,
    ...eventRows,
    ...trainingRows,
    ...quickLinkRows,
    ...businessRows,
    ...memberConnectionRows,
  ];

  return rows
    .map<HomePostItem>((item) => {
      const categories = (item.categories ?? [])
        .filter((category) => category?.id && category?.name)
        .map((category) => ({
          id: String(category.id),
          name: String(category.name),
          slug: String(category.slug ?? ""),
          url: normalizeLink(category.url, "#"),
          type: String(category.type ?? ""),
        }));

      const thumbnailPath = item.thumbnail?.path ?? item.thumbnail?.original ?? null;
      const title = String(item.title ?? "").trim();
      const externalLink = buildPostLink(
        item.external_link || (title ? `/${title}` : undefined),
        item.id ? String(item.id) : "",
        "#",
      );

      return {
        id: String(item.id ?? ""),
        title,
        externalLink,
        summary: String(item.summary ?? item.content ?? ""),
        contentText: String(
          item.content_structure?.post_content?.[0]?.content ??
            item.summary ??
            item.content ??
            ""
        ),
        createdAt: String(item.created_at ?? ""),
        publishedAt: String(item.published_at ?? item.release_at ?? item.created_at ?? ""),
        startedAt: String(item.started_at ?? ""),
        endedAt: String(item.ended_at ?? ""),
        registrationDeadline: String(item.registration_deadline ?? ""),
        location: String(item.location ?? ""),
        participationFee: String(item.participation_fee ?? ""),
        expiredAt: String(item.expired_at ?? ""),
        isFeatured: Boolean(item.is_featured),
        isHidden: Boolean(item.is_hidden),
        isActive: item.is_active !== false,
        status: String(item.status ?? ""),
        type: String(item.type ?? ""),
        categories,
        thumbnail: thumbnailPath
          ? {
              url: resolveAssetUrl(thumbnailPath),
              alt: title,
            }
          : null,
      };
    })
    .filter((item) => item.id && item.title);
}

export function useHomePosts() {
  const query = useQuery({
    queryKey: HOME_POSTS_QUERY_KEY,
    queryFn: fetchHomePosts,
    staleTime: 5 * 60 * 1000,
  });

  const allPosts = React.useMemo(
    () => uniquePosts(query.data ?? []),
    [query.data],
  );

  const posts = React.useMemo(
    () => allPosts.filter(isVisibleNewsPost),
    [allPosts],
  );

  const categoryLinks = React.useMemo(() => {
    const entries = posts.flatMap((item) => item.categories);
    const map = new Map<string, string>();

    entries.forEach((category) => {
      const key = normalizeText(category.name);
      if (!key || map.has(key) || !category.url || category.url === "#") return;
      map.set(key, category.url);
    });

    return map;
  }, [posts]);

  const tinVcciPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.tinVcci),
        ),
      ),
    [posts],
  );

  const tinKinhTePosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.tinKinhTe),
        ),
      ),
    [posts],
  );

  const chuyenDePosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.chuyenDe),
        ),
      ),
    [posts],
  );

  const featuredPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        allPosts.filter((item) => item.isFeatured && !item.isHidden),
      ),
    [allPosts],
  );

  const eventPosts = React.useMemo(
    () =>
      sortByEventStartAsc(
        posts.filter(
          (item) =>
            matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.suKien),
        ),
      ),
    [posts],
  );

  const eventCalendarPosts = React.useMemo(
    () =>
      sortByEventStartAsc(
        posts.filter(
          (item) =>
            Boolean(item.registrationDeadline) &&
            (matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.suKien) ||
              matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.daoTao)),
        ),
      ),
    [posts],
  );

  const businessPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.coHoiKinhDoanh),
        ),
      ),
    [posts],
  );

  const policyPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.chinhSachPhapLuat),
        ),
      ),
    [posts],
  );

  const memberConnectionPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryAliases(item, HOME_CATEGORY_ALIASES.ketNoiHoiVien),
        ),
      ),
    [posts],
  );

  const quickLinkPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) => hasCategoryId(item, HOME_CATEGORY_IDS.lienKetNhanh)),
      ),
    [posts],
  );

  const allNewsPosts = React.useMemo(
    () => uniquePosts([...tinVcciPosts, ...tinKinhTePosts, ...chuyenDePosts]),
    [chuyenDePosts, tinKinhTePosts, tinVcciPosts],
  );

  return {
    ...query,
    allPosts,
    posts,
    featuredPosts,
    eventPosts,
    eventCalendarPosts,
    businessPosts,
    policyPosts,
    memberConnectionPosts,
    quickLinkPosts,
    newsTabs: {
      all: allNewsPosts,
      tinVcci: tinVcciPosts,
      tinKinhTe: tinKinhTePosts,
      chuyenDe: chuyenDePosts,
    },
    categoryLinks,
    categoryNames: HOME_CATEGORY_NAMES,
  };
}

export function useEventCalendarPosts(currentMonth: Date) {
  const query = useQuery({
    queryKey: ["event-calendar-posts", currentMonth.getFullYear(), currentMonth.getMonth()],
    queryFn: async () => {
      const queryParams = createEventCalendarQuery(currentMonth);

      try {
        const response = await useCustomClient<HomeEnvelope<HomePagedResult<RawHomePost>>>(
          `/post?${queryParams.toString()}`,
        );

        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59, 999);

        const mappedPosts = (response.responseData?.rows ?? []).map((item) => {
          const categories = (item.categories ?? [])
            .filter((category) => category?.id && category?.name)
            .map((category) => ({
              id: String(category.id),
              name: String(category.name),
              slug: String(category.slug ?? ""),
              url: normalizeLink(category.url, "#"),
              type: String(category.type ?? ""),
            }));

          const thumbnailPath = item.thumbnail?.path ?? item.thumbnail?.original ?? null;
          const title = String(item.title ?? "").trim();
          const externalLink = buildPostLink(
            item.external_link || (title ? `/${title}` : undefined),
            item.id ? String(item.id) : "",
            "#",
          );

          return {
            id: String(item.id ?? ""),
            title,
            externalLink,
            summary: String(item.summary ?? item.content ?? ""),
            contentText: String(
              item.content_structure?.post_content?.[0]?.content ??
                item.summary ??
                item.content ??
                ""
            ),
            createdAt: String(item.created_at ?? ""),
            publishedAt: String(item.published_at ?? item.release_at ?? item.created_at ?? ""),
            startedAt: String(item.started_at ?? ""),
            endedAt: String(item.ended_at ?? ""),
            registrationDeadline: String(item.registration_deadline ?? ""),
            location: String(item.location ?? ""),
            participationFee: String(item.participation_fee ?? ""),
            expiredAt: String(item.expired_at ?? ""),
            isFeatured: Boolean(item.is_featured),
            isHidden: Boolean(item.is_hidden),
            isActive: item.is_active !== false,
            status: String(item.status ?? ""),
            type: String(item.type ?? ""),
            categories,
            thumbnail: thumbnailPath
              ? {
                  url: resolveAssetUrl(thumbnailPath),
                  alt: title,
                }
              : null,
          } satisfies HomePostItem;
        });

        // Filter posts that have at least one date (startedAt, endedAt, or registrationDeadline)
        // falling within the current month
        return mappedPosts.filter((item) => {
          const startedAt = item.startedAt ? dayjs(item.startedAt) : null;
          const endedAt = item.endedAt ? dayjs(item.endedAt) : null;
          const registrationDeadline = item.registrationDeadline ? dayjs(item.registrationDeadline) : null;

          // If no dates at all, exclude
          if (!startedAt && !endedAt && !registrationDeadline) return false;

          const monthStartDay = dayjs(monthStart);
          const monthEndDay = dayjs(monthEnd);

          // Check if any date falls within the current month
          const hasDateInMonth = (date: dayjs.Dayjs | null): boolean => {
            return date !== null && !date.isBefore(monthStartDay, "day") && !date.isAfter(monthEndDay, "day");
          };

          // Check if event overlaps with current month (spans across the month)
          const eventStartDate = startedAt || registrationDeadline;
          const eventEndDate = endedAt || registrationDeadline || startedAt;

          if (eventStartDate && eventEndDate) {
            // Event overlaps with month if it starts before month end AND ends after month start
            return !eventStartDate.isAfter(monthEndDay, "day") && !eventEndDate.isBefore(monthStartDay, "day");
          }

          // Fallback: check individual dates
          if (startedAt && hasDateInMonth(startedAt)) return true;
          if (endedAt && hasDateInMonth(endedAt)) return true;
          if (registrationDeadline && hasDateInMonth(registrationDeadline)) return true;

          return false;
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[useEventCalendarPosts] CMS unavailable, falling back to mock data", error);
        return MOCK_HOME_POSTS;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return query;
}
