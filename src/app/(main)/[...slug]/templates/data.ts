import type { Category } from "@/api/vcci-news/models/category";
import { getApiV10Category, useGetApiV10Category } from "@/api/vcci-news/endpoints/category";
import { getApiV10Post, getApiV10PostId, useGetApiV10Post } from "@/api/vcci-news/endpoints/post";
import Links from "@/links";
import { getCategoryFallbackResponse } from "@/mockdata/categories";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  DynamicCategoryMenuItem,
  DynamicCategoryRouteItem,
  DynamicCategoryType,
  DynamicPostContentSection,
  DynamicPostItem,
  DynamicPostThumbnail,
  DynamicPostUser,
} from "./types";

type CategoryListResponse = {
  responseData?: {
    rows?: Category[];
  };
};

type RawPostCategory = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
  url?: string | null;
  type?: string | null;
};

type RawPostThumbnail = {
  path?: string | null;
  original?: string | null;
  url?: string | null;
};

type RawPostUser = {
  id?: string | null;
  email?: string | null;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
} | null;

type RawPostSectionImage = {
  position?: number | null;
  image?: {
    id?: string | null;
    name?: string | null;
    alt?: string | null;
    url?: string | null;
    path?: string | null;
    original?: string | null;
  } | null;
};

type RawPostItem = {
  id?: string | null;
  title?: string | null;
  slug?: string | null;
  external_link?: string | null;
  content?: string | null;
  summary?: string | null;
  release_at?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  expired_at?: string | null;
  registration_deadline?: string | null;
  location?: string | null;
  participation_fee?: string | null;
  is_featured?: boolean | null;
  is_hidden?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
  type?: string | null;
  thumbnail?: RawPostThumbnail | null;
  categories?: RawPostCategory[] | null;
  creator?: RawPostUser;
  editor?: RawPostUser;
  content_structure?: {
    post_content?: Array<{
      id?: string | null;
      type?: string | null;
      content?: string | null;
      position?: number | null;
      image_rows?: number | null;
      image_columns?: number | null;
      images?: RawPostSectionImage[] | null;
    }> | null;
  } | null;
};

type PostListResponse = {
  responseData?: {
    count?: number;
    page?: number;
    pageSize?: number;
    rows?: RawPostItem[];
  };
};

type PostDetailResponse = RawPostItem;
type PostDetailEnvelope = {
  responseData?: RawPostItem | null;
  data?: {
    responseData?: RawPostItem | null;
  } | null;
};

export type DynamicPostListResult = {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  rows: DynamicPostItem[];
};

const normalizePath = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
};

export const buildDynamicPostHref = (
  path?: string | null,
  id?: string | null,
  categoryId?: string | null,
) => {
  const normalizedPath = normalizePath(path);
  const trimmedId = id?.trim() ?? "";
  const trimmedCategoryId = categoryId?.trim() ?? "";

  if ((!trimmedId && !trimmedCategoryId) || normalizedPath === "/") {
    return normalizedPath;
  }

  const params = new URLSearchParams();
  if (trimmedId) {
    params.set("id", trimmedId);
  }
  if (trimmedCategoryId) {
    params.set("categoryId", trimmedCategoryId);
  }

  return `${normalizedPath}?${params.toString()}`;
};

const getSlugFromPath = (value?: string | null) => {
  const normalizedPath = normalizePath(value);
  const segments = normalizedPath.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);

  if (!lastSegment) return "";

  try {
    return decodeURIComponent(lastSegment).trim();
  } catch {
    return lastSegment.trim();
  }
};

const normalizeCategoryType = (value?: string | null): DynamicCategoryType | null => {
  if (value === "category" || value === "page" || value === "news") return value;
  return null;
};

const sortCategories = (items: DynamicCategoryRouteItem[]) =>
  [...items].sort((left, right) => {
    const leftOrder = left.sort_order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.sort_order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) return leftOrder - rightOrder;
    return left.name.localeCompare(right.name, "vi");
  });

const mapPostContentSections = (item: RawPostItem): DynamicPostContentSection[] => {
  const sections = Array.isArray(item.content_structure?.post_content)
    ? item.content_structure.post_content
    : [];

  return sections.map((section, index) => ({
    id: String(section?.id ?? `section-${index + 1}`),
    type: String(section?.type ?? "text"),
    content: String(section?.content ?? ""),
    position:
      typeof section?.position === "number"
        ? section.position
        : index + 1,
    image_rows:
      typeof section?.image_rows === "number" && section.image_rows > 0
        ? section.image_rows
        : 1,
    image_columns:
      typeof section?.image_columns === "number" && section.image_columns > 0
        ? section.image_columns
        : 1,
    images: (section?.images ?? [])
      .map((item, imageIndex) => ({
        position:
          typeof item?.position === "number"
            ? item.position
            : imageIndex + 1,
        image: item?.image
          ? {
            id: String(item.image.id ?? ""),
            name: String(item.image.name ?? item.image.original ?? ""),
            alt: String(item.image.alt ?? item.image.name ?? ""),
            url: Links.resolveImageUrl(item.image.url ?? item.image.path ?? item.image.original ?? ""),
            path: item.image.path ?? null,
            original: item.image.original ?? null,
          }
          : null,
      }))
      .filter((item) => Boolean(item.image?.url))
      .sort((left, right) => left.position - right.position),
  }));
};

const mapPostUser = (user: RawPostUser | undefined): DynamicPostUser => {
  if (!user || typeof user !== "object") return null;
  const firstName = String(user.first_name ?? "").trim();
  const lastName = String(user.last_name ?? "").trim();
  const fullName =
    String(user.full_name ?? "").trim() ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    String(user.username ?? "").trim() ||
    String(user.email ?? "").trim();
  return {
    id: String(user.id ?? ""),
    email: String(user.email ?? ""),
    username: user.username ? String(user.username) : null,
    first_name: firstName || null,
    last_name: lastName || null,
    full_name: fullName,
    avatar_url: user.avatar_url ? String(user.avatar_url) : null,
  };
};

export const mapPost = (item: RawPostItem): DynamicPostItem => ({
  id: String(item.id ?? ""),
  title: String(item.title ?? "").trim(),
  slug: String(item.slug ?? "").trim(),
  external_link: normalizePath(item.external_link),
  content: String(item.content ?? ""),
  summary: String(item.summary ?? ""),
  release_at: item.release_at ?? null,
  published_at: item.published_at ?? null,
  created_at: item.created_at ?? null,
  started_at: item.started_at ?? null,
  ended_at: item.ended_at ?? null,
  expired_at: item.expired_at ?? null,
  registration_deadline: item.registration_deadline ?? null,
  location: item.location ?? null,
  participation_fee: item.participation_fee ?? null,
  is_featured: Boolean(item.is_featured),
  is_hidden: Boolean(item.is_hidden),
  is_active: item.is_active !== false,
  status: String(item.status ?? ""),
  type: String(item.type ?? ""),
  thumbnail: (item.thumbnail ?? null) as DynamicPostThumbnail,
  categories: (item.categories ?? [])
    .filter((category) => category?.id && category?.name)
    .map((category) => ({
      id: String(category.id),
      name: String(category.name),
      slug: String(category.slug ?? ""),
      url: normalizePath(category.url),
      type: String(category.type ?? ""),
    })),
  content_structure: {
    post_content: mapPostContentSections(item),
  },
  creator: mapPostUser(item.creator),
  editor: mapPostUser(item.editor),
});

const buildPostFilters = (filters: Array<string | null | undefined>) =>
  filters
    .map((item) => item?.trim())
    .filter(Boolean)
    .join(",");

export const buildVisibleNewsFilters = (
  filters: Array<string | null | undefined> = [],
) =>
  buildPostFilters([
    ...filters,
    "is_hidden==false",
    "is_active==true",
    "type==news",
  ]);

export async function fetchDynamicCategories(): Promise<DynamicCategoryRouteItem[]> {
  const response = await getApiV10Category({
    page: 1,
    pageSize: 200,
    sortField: "sort_order",
    sortOrder: "asc",
  }).catch(() => getCategoryFallbackResponse());

  const rows = (response.responseData?.rows ?? []) as unknown as Category[];

  return sortCategories(
    rows
      .map((item) => {
        const type = normalizeCategoryType(item.type);
        if (!item.id || !item.name || !type) return null;

        return {
          id: item.id,
          name: item.name,
          slug: item.slug ?? "",
          url: normalizePath(item.url),
          type,
          parent_id: item.parent_id ?? null,
          sort_order: item.sort_order ?? null,
        } satisfies DynamicCategoryRouteItem;
      })
      .filter((item): item is DynamicCategoryRouteItem => Boolean(item)),
  );
}

export async function fetchDynamicPostList(params: {
  filters?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}): Promise<DynamicPostListResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 5;

  const response = await getApiV10Post({
    page,
    pageSize,
    sortField: params.sortField ?? "release_at",
    sortOrder: (params.sortOrder ?? "desc") as "asc" | "desc",
    filters: params.filters?.trim() || undefined,
  });
  const count = Number(response.responseData?.count ?? 0);

  return {
    count,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1,
    rows: ((response.responseData?.rows ?? []) as unknown as RawPostItem[]).map(mapPost).filter((item) => item.id && item.title),
  };
}

export async function fetchDynamicPostById(id: string) {
  const normalizedId = id.trim();

  if (!normalizedId) return null;

  const listResult = await fetchDynamicPostList({
    page: 1,
    pageSize: 1,
    filters: buildVisibleNewsFilters([`id==${normalizedId}`]),
  }).catch(() => null);

  if (listResult?.rows[0]) {
    return listResult.rows[0];
  }

  const postResponse = await getApiV10PostId(normalizedId).catch(() => null);
  const postRaw = (postResponse?.responseData ?? null) as unknown as RawPostItem | null;

  if (!postRaw) return null;

  const post = mapPost(postRaw);
  return post.id && post.title ? post : null;
}

export async function fetchDynamicPostByExternalLink(path: string) {
  const normalizedPath = normalizePath(path);
  const slug = getSlugFromPath(normalizedPath);

  if (slug) {
    const slugResult = await fetchDynamicPostList({
      page: 1,
      pageSize: 1,
      filters: buildVisibleNewsFilters([`slug==${slug}`]),
    });

    if (slugResult.rows[0]) {
      return slugResult.rows[0];
    }
  }

  const result = await fetchDynamicPostList({
    page: 1,
    pageSize: 1,
    filters: buildVisibleNewsFilters([`external_link==${normalizedPath}`]),
  });

  return result.rows[0] ?? null;
}

export async function fetchDynamicSinglePagePost(categoryId: string) {
  const result = await fetchDynamicPostList({
    page: 1,
    pageSize: 1,
    filters: buildPostFilters([
      `category.id==${categoryId}`,
      "is_hidden==false",
      "is_active==true",
      "type==page",
    ]),
  });

  return result.rows[0] ?? null;
}

export function findDynamicCategoryByPath(
  categories: DynamicCategoryRouteItem[],
  path: string,
) {
  const normalizedPath = normalizePath(path);
  return categories.find((item) => normalizePath(item.url) === normalizedPath) ?? null;
}

export function findMenuCategoryForPost(
  post: DynamicPostItem | null,
  categories: DynamicCategoryRouteItem[],
) {
  if (!post) return null;

  for (const category of post.categories) {
    const matched = categories.find((item) => item.id === category.id);
    if (matched) return matched;
  }

  return null;
}

export function findDisplayCategoryForPost(
  post: DynamicPostItem | null,
  activeCategory: DynamicCategoryRouteItem | null,
  categories: DynamicCategoryRouteItem[] = [],
) {
  if (!post) return null;

  if (activeCategory) {
    const matchedPostCategory =
      post.categories.find((item) => item.id === activeCategory.id) ??
      post.categories.find((item) => normalizePath(item.url) === normalizePath(activeCategory.url));

    if (matchedPostCategory) {
      return {
        id: matchedPostCategory.id,
        name: matchedPostCategory.name,
        url: normalizePath(matchedPostCategory.url),
        type: matchedPostCategory.type,
      };
    }

    const matchedTreeCategory = categories.find((item) => item.id === activeCategory.id);
    if (matchedTreeCategory) {
      return {
        id: matchedTreeCategory.id,
        name: matchedTreeCategory.name,
        url: normalizePath(matchedTreeCategory.url),
        type: matchedTreeCategory.type,
      };
    }
  }

  const firstCategory = post.categories[0];
  if (firstCategory) {
    return {
      id: firstCategory.id,
      name: firstCategory.name,
      url: normalizePath(firstCategory.url),
      type: firstCategory.type,
    };
  }

  return null;
}

export function buildDynamicCategoryMenu(
  activeCategory: DynamicCategoryRouteItem | null,
  categories: DynamicCategoryRouteItem[],
): DynamicCategoryMenuItem[] {
  if (!activeCategory) return [];

  const relatedItems = activeCategory.parent_id
    ? categories.filter((item) => item.parent_id === activeCategory.parent_id)
    : categories.filter((item) => item.parent_id === activeCategory.id);

  return sortCategories(relatedItems).map((item) => ({
    id: item.id,
    name: item.name,
    static_link: item.url,
  }));
}

export function findFirstChildCategory(
  category: DynamicCategoryRouteItem,
  categories: DynamicCategoryRouteItem[],
) {
  return sortCategories(categories.filter((item) => item.parent_id === category.id))[0] ?? null;
}

export function resolveDynamicPostImage(thumbnail?: DynamicPostThumbnail) {
  const value = thumbnail?.path ?? thumbnail?.original ?? thumbnail?.url ?? "";

  if (!value) return "/thumbnail.png";

  return Links.resolveImageUrl(value);
}

export function extractFirstImageFromHtml(html?: string | null): string {
  if (!html) return "";

  const imgRegex = /<img[^>]*\ssrc=["']([^"']+)["']/i;
  const match = html.match(imgRegex);

  return match?.[1]?.trim() ?? "";
}

export function getDynamicPostSeoImage(post: DynamicPostItem | null): string {
  if (!post) return "/thumbnail.png";

  if (post.thumbnail) {
    const resolved = resolveDynamicPostImage(post.thumbnail);
    if (resolved && resolved !== "/thumbnail.png") return resolved;
  }

  const sections = post.content_structure?.post_content ?? [];
  for (const section of sections) {
    for (const item of section.images) {
      const url = item.image?.url;
      if (url) return url;
    }
  }

  for (const section of sections) {
    const htmlImage = extractFirstImageFromHtml(section.content);
    if (htmlImage) return Links.resolveImageUrl(htmlImage);
  }

  const htmlImage = extractFirstImageFromHtml(post.content) || extractFirstImageFromHtml(post.summary);
  if (htmlImage) return Links.resolveImageUrl(htmlImage);

  return "/thumbnail.png";
}

export function stripHtml(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/\[caption[^\]]*]/gi, " ")
    .replace(/\[\/caption]/gi, " ")
    .replace(/\[[^[\]]+]/g, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getDynamicPostExcerpt(post: DynamicPostItem | null) {
  if (!post) return "";

  const structuredContentText = (post.content_structure?.post_content ?? [])
    .map((section) => stripHtml(section.content))
    .filter(Boolean)
    .join(" ");

  const candidates = [
    stripHtml(post.summary),
    stripHtml(post.content),
    structuredContentText,
  ].filter(Boolean);

  const parts: string[] = [];

  for (const candidate of candidates) {
    const normalizedCandidate = candidate.trim();
    if (!normalizedCandidate) continue;

    const isDuplicated = parts.some((part) => {
      return (
        part === normalizedCandidate ||
        part.includes(normalizedCandidate) ||
        normalizedCandidate.includes(part)
      );
    });

    if (!isDuplicated) {
      parts.push(normalizedCandidate);
    }
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function getDynamicPostBodyHtml(post: DynamicPostItem | null) {
  if (!post) return "";

  const primaryContent = post.content?.trim();
  if (primaryContent) return primaryContent;

  const structuredContent = (post.content_structure?.post_content ?? [])
    .sort((left, right) => left.position - right.position)
    .map((section) => section.content?.trim() ?? "")
    .filter(Boolean)
    .join("\n");

  return structuredContent || post.summary?.trim() || "";
}

export function matchesDynamicPostCategory(post: DynamicPostItem, categoryId: string) {
  return post.categories.some((category) => category.id === categoryId);
}

export function isDynamicPostVisible(post: DynamicPostItem) {
  if (post.is_hidden) return false;
  if (!post.is_active) return false;
  if (post.status && post.status !== "published") return false;
  return true;
}

export { buildPostFilters, normalizePath };

export type UseDynamicPostListOptions = {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
  filters?: string;
  enabled?: boolean;
  staleTime?: number;
};

export function useDynamicPostList(options: UseDynamicPostListOptions) {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 5;

  return useGetApiV10Post(
    {
      page,
      pageSize,
      sortField: options.sortField ?? "release_at",
      sortOrder: (options.sortOrder ?? "desc") as "asc" | "desc",
      filters: options.filters?.trim() || undefined,
    },
    {
      query: {
        enabled: options.enabled !== false,
        staleTime: options.staleTime ?? 60 * 1000,
        select: (response): DynamicPostListResult => {
          const data = response?.responseData;
          const count = Number(data?.count ?? 0);
          return {
            count,
            page,
            pageSize,
            totalPages: pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1,
            rows: ((data?.rows ?? []) as unknown as RawPostItem[])
              .map(mapPost)
              .filter((item) => item.id && item.title),
          };
        },
      },
    },
  );
}

export type UseDynamicCategoriesOptions = {
  enabled?: boolean;
  staleTime?: number;
};

export function useDynamicCategories(options: UseDynamicCategoriesOptions = {}) {
  return useGetApiV10Category(
    {
      page: 1,
      pageSize: 200,
      sortField: "sort_order",
      sortOrder: "asc",
    },
    {
      query: {
        enabled: options.enabled !== false,
        staleTime: options.staleTime ?? 5 * 60 * 1000,
        select: (response): DynamicCategoryRouteItem[] => {
          const rows = (response?.responseData?.rows ?? []) as unknown as Category[];
          return sortCategories(
            rows
              .map((item) => {
                const type = normalizeCategoryType(item.type);
                if (!item.id || !item.name || !type) return null;
                return {
                  id: item.id,
                  name: item.name,
                  slug: item.slug ?? "",
                  url: normalizePath(item.url),
                  type,
                  sort_order: item.sort_order ?? null,
                  parent_id: item.parent_id ?? null,
                } as DynamicCategoryRouteItem;
              })
              .filter((item): item is DynamicCategoryRouteItem => item !== null),
          );
        },
      },
    },
  );
}

export function useDynamicPostDetail(postId: string, routePath: string, options: {
  enabled?: boolean;
  staleTime?: number;
} = {}) {
  return useQuery({
    queryKey: ["dynamic-post-detail", postId || routePath],
    queryFn: () =>
      postId
        ? fetchDynamicPostById(postId)
        : fetchDynamicPostByExternalLink(routePath),
    enabled: options.enabled !== false,
    staleTime: options.staleTime ?? 60 * 1000,
  });
}

export function useDynamicSinglePagePost(categoryId: string | undefined, options: {
  enabled?: boolean;
  staleTime?: number;
} = {}) {
  return useQuery({
    queryKey: ["dynamic-single-page-post", categoryId],
    queryFn: () => fetchDynamicSinglePagePost(categoryId!),
    enabled: (options.enabled !== false) && Boolean(categoryId),
    staleTime: options.staleTime ?? 60 * 1000,
  });
}
