"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useCustomClient } from "@/api/mutator/custom-client";
import Links from "@/links";

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

const HOME_POSTS_QUERY_KEY = ["home-page-posts", "event-calendar-v1"] as const;

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

const resolveAssetUrl = (value?: string | null) => {
  const trimmed = value?.trim();

  if (!trimmed) return "/thumbnail.png";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) {
    return `${Links.imageEndpoint.replace(/\/+$/, "")}${trimmed}`;
  }

  return `${Links.imageEndpoint}${trimmed.replace(/^\/+/, "")}`;
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
  if (item.status && item.status !== "published") return false;
  return true;
};

const hasCategoryId = (item: HomePostItem, categoryId: string) =>
  item.categories.some((category) => category.id === categoryId);

async function fetchHomePostRows(path: string) {
  const response = await useCustomClient<HomeEnvelope<HomePagedResult<RawHomePost>>>(path);
  return response.responseData?.rows ?? [];
}

async function fetchHomeCategoryRows() {
  const response = await useCustomClient<HomeEnvelope<HomePagedResult<RawHomeCategory>>>(
    "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
  );
  return response.responseData?.rows ?? [];
}

function findCategoryIdByAliases(
  categories: RawHomeCategory[],
  aliases: readonly string[],
) {
  const aliasKeys = new Set(aliases.map(normalizeSearchText));
  const aliasSlugs = new Set(aliases.map(normalizeSlug));

  return categories.find((category) => {
    const categoryNameKey = normalizeSearchText(category.name);
    const categorySlugKey = normalizeSlug(category.slug || category.name);
    const categoryUrlKey = normalizeSlug(category.url);

    return (
      aliasKeys.has(categoryNameKey) ||
      aliasSlugs.has(categorySlugKey) ||
      Array.from(aliasSlugs).some((slug) => categoryUrlKey.endsWith(slug))
    );
  })?.id ?? null;
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
      "status==published",
      "type==news",
    ].join(","),
  });
}

async function fetchHomePosts() {
  const categoryRows = await fetchHomeCategoryRows().catch(() => []);
  const trainingCategoryId = findCategoryIdByAliases(
    categoryRows,
    HOME_CATEGORY_ALIASES.daoTao,
  );
  const businessCategoryId = findCategoryIdByAliases(
    categoryRows,
    HOME_CATEGORY_ALIASES.coHoiKinhDoanh,
  );
  const memberConnectionCategoryId = findCategoryIdByAliases(
    categoryRows,
    HOME_CATEGORY_ALIASES.ketNoiHoiVien,
  );
  const featuredQuery = new URLSearchParams({
    page: "1",
    pageSize: "10",
    sortField: "release_at",
    sortOrder: "desc",
    filters: [
      "is_featured==true",
      "is_hidden==false",
      "is_active==true",
      "status==published",
      "type==news",
    ].join(","),
  });
  const tinVcciQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.tinVcci, "6");
  const tinKinhTeQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.tinKinhTe, "6");
  const chuyenDeQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.chuyenDe, "6");
  const eventQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.suKien, "5");
  const policyQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.chinhSachPhapLuat, "6");
  const quickLinksQuery = createCategoryPostsQuery(HOME_CATEGORY_IDS.lienKetNhanh, "6");
  const trainingQuery = trainingCategoryId
    ? createCategoryPostsQuery(String(trainingCategoryId), "10")
    : null;
  const businessQuery = businessCategoryId
    ? createCategoryPostsQuery(String(businessCategoryId), "10")
    : null;
  const memberConnectionQuery = memberConnectionCategoryId
    ? createCategoryPostsQuery(String(memberConnectionCategoryId), "10")
    : null;

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
    trainingQuery ? fetchHomePostRows(`/post?${trainingQuery.toString()}`) : [],
    businessQuery ? fetchHomePostRows(`/post?${businessQuery.toString()}`) : [],
    memberConnectionQuery ? fetchHomePostRows(`/post?${memberConnectionQuery.toString()}`) : [],
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
      const externalLink = normalizeLink(
        item.external_link || (title ? `/${title}` : undefined),
        "#",
      );

      return {
        id: String(item.id ?? ""),
        title,
        externalLink,
        summary: String(item.summary ?? item.content ?? ""),
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
