"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useCustomClient } from "@/api/mutator/custom-client";
import Links from "@/links";

type RawHomeCategory = {
  id?: string | null;
  name?: string | null;
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

const HOME_POSTS_QUERY_KEY = ["home-page-posts"] as const;

const HOME_CATEGORY_NAMES = {
  tinVcci: "Tin VCCI",
  tinKinhTe: "Tin Kinh tế",
  chuyenDe: "Chuyên đề",
  suKien: "Sự kiện",
  coHoiKinhDoanh: "Cơ hội kinh doanh",
  chinhSachPhapLuat: "Thông tin Chính sách và Pháp luật",
  ketNoiHoiVien: "Kết nối hội viên",
} as const;

const normalizeText = (value?: string | null) => value?.trim().toLowerCase() ?? "";

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

const isVisibleNewsPost = (item: HomePostItem) => {
  if (item.type && item.type !== "news") return false;
  if (item.isHidden) return false;
  if (!item.isActive) return false;
  if (item.status && item.status !== "published") return false;
  return true;
};

async function fetchHomePosts() {
  const query = new URLSearchParams({
    page: "1",
    pageSize: "200",
    sortField: "created_at",
    sortOrder: "desc",
  });

  const response = await useCustomClient<HomeEnvelope<HomePagedResult<RawHomePost>>>(
    `/post?${query.toString()}`,
  );

  const rows = response.responseData?.rows ?? [];

  return rows
    .map<HomePostItem>((item) => {
      const categories = (item.categories ?? [])
        .filter((category) => category?.id && category?.name)
        .map((category) => ({
          id: String(category.id),
          name: String(category.name),
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
        posts.filter((item) => matchesCategoryName(item, HOME_CATEGORY_NAMES.tinVcci)),
      ),
    [posts],
  );

  const tinKinhTePosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) => matchesCategoryName(item, HOME_CATEGORY_NAMES.tinKinhTe)),
      ),
    [posts],
  );

  const chuyenDePosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) => matchesCategoryName(item, HOME_CATEGORY_NAMES.chuyenDe)),
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
            matchesCategoryName(item, HOME_CATEGORY_NAMES.suKien) &&
            Boolean(item.startedAt),
        ),
      ),
    [posts],
  );

  const businessPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryName(item, HOME_CATEGORY_NAMES.coHoiKinhDoanh),
        ),
      ),
    [posts],
  );

  const policyPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryName(item, HOME_CATEGORY_NAMES.chinhSachPhapLuat),
        ),
      ),
    [posts],
  );

  const memberConnectionPosts = React.useMemo(
    () =>
      sortByPublishedDesc(
        posts.filter((item) =>
          matchesCategoryName(item, HOME_CATEGORY_NAMES.ketNoiHoiVien),
        ),
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
    businessPosts,
    policyPosts,
    memberConnectionPosts,
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
