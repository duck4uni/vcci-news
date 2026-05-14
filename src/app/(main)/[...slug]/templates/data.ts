import type { Category } from "@/api/models/category";
import { useCustomClient } from "@/api/mutator/custom-client";
import Links from "@/links";
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

export async function fetchDynamicPostByExternalLink(path: string) {
  const result = await fetchDynamicPostList({
    page: 1,
    pageSize: 1,
    filters: buildPostFilters([
      `external_link==${normalizePath(path)}`,
      "is_hidden==false",
      "is_active==true",
      "status==published",
    ]),
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
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${Links.imageEndpoint.replace(/\/+$/, "")}${value}`;

  return `${Links.imageEndpoint}${value.replace(/^\/+/, "")}`;
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
