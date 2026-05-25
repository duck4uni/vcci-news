import type { Category } from "@/api/models/category";
import { useCustomClient } from "@/api/mutator/custom-client";
import Links, { resolveUploadUrl } from "@/links";
import { getCategoryFallbackResponse } from "@/mockdata/categories";
import type {
  DynamicCategoryMenuItem,
  DynamicCategoryRouteItem,
  DynamicCategoryType,
  DynamicPostContentSection,
  DynamicPostItem,
  DynamicPostThumbnail,
} from "./types";

type CategoryListResponse = {
  responseData?: {
    rows?: Category[];
  };
};

type RawPostCategory = {
  id?: string | null;
  name?: string | null;
  url?: string | null;
  type?: string | null;
};

type RawPostThumbnail = {
  path?: string | null;
  original?: string | null;
  url?: string | null;
};

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
  is_featured?: boolean | null;
  is_hidden?: boolean | null;
  is_active?: boolean | null;
  status?: string | null;
  type?: string | null;
  thumbnail?: RawPostThumbnail | null;
  categories?: RawPostCategory[] | null;
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
              url: resolveUploadUrl(item.image.url ?? item.image.path ?? item.image.original ?? ""),
              path: item.image.path ?? null,
              original: item.image.original ?? null,
            }
          : null,
      }))
      .filter((item) => Boolean(item.image?.url))
      .sort((left, right) => left.position - right.position),
  }));
};

const mapPost = (item: RawPostItem): DynamicPostItem => ({
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
      url: normalizePath(category.url),
      type: String(category.type ?? ""),
    })),
  content_structure: {
    post_content: mapPostContentSections(item),
  },
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
  const response = await useCustomClient<CategoryListResponse>(
    "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
  ).catch(() => getCategoryFallbackResponse());

  const rows = response.responseData?.rows ?? [];

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

  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortField: params.sortField ?? "release_at",
    sortOrder: params.sortOrder ?? "desc",
  });

  if (params.filters?.trim()) {
    query.set("filters", params.filters.trim());
  }

  const response = await useCustomClient<PostListResponse>(`/post?${query.toString()}`);
  const count = Number(response.responseData?.count ?? 0);

  return {
    count,
    page,
    pageSize,
    totalPages: pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1,
    rows: (response.responseData?.rows ?? []).map(mapPost).filter((item) => item.id && item.title),
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

  const newsResponse = await useCustomClient<PostDetailEnvelope>(`/news/${normalizedId}`).catch(() => null);
  const newsItem = newsResponse?.responseData ?? newsResponse?.data?.responseData ?? null;

  if (newsItem) {
    const post = mapPost(newsItem);
    return post.id && post.title ? post : null;
  }

  const postResponse = await useCustomClient<PostDetailResponse>(`/post/${normalizedId}`).catch(() => null);

  if (!postResponse) return null;

  const post = mapPost(postResponse);
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

  return resolveUploadUrl(value);
}

export function stripHtml(value?: string | null) {
  if (!value) return "";
  return value
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
