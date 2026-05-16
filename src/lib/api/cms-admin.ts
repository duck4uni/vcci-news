"use client";

import { useCustomClient } from "@/api/mutator/custom-client";
import { categoryFallbackRows } from "@/mockdata/categories";

export type CmsHeaderCategoryType = "category" | "page" | "news";

export interface CmsTagItem {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface CmsCategoryItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  url?: string | null;
  sort_order?: number | null;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CmsFileItem {
  id: string;
  path?: string;
  original?: string;
  mime?: string;
}

export interface CmsPostContentImage {
  position: number;
  image: {
    id: string;
    name: string;
    alt: string;
    url: string;
  };
}

export interface CmsPostContentSection {
  id: string;
  type: "text" | "image";
  position: number;
  content: string;
  image_columns: number;
  image_rows: number;
  images: CmsPostContentImage[];
}

export interface CmsNewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: "tintuc" | "baiviettrang";
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  tag_ids: string[];
  is_featured: boolean;
  thumbnail: {
    id: string;
    name: string;
    alt: string;
    url: string;
  } | null;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  expired_at: string;
  started_at: string;
  ended_at: string;
  registration_deadline: string;
  location: string;
  participation_fee: string;
  post_content: CmsPostContentSection[];
}

export interface CmsHeaderCategoryItem {
  id: string;
  code: string;
  name: string;
  slug: string;
  static_link: string;
  sort_order: number;
  type: CmsHeaderCategoryType;
  is_article: boolean;
  parent_id: string | null;
  api_parent_id: string | null;
  level: number;
  category_ids: string[];
  tagsearch_values: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface CmsApiEnvelope<T> {
  message?: string;
  message_en?: string;
  responseData?: T;
  data?: T;
  error?: string;
  status?: string;
  violation?: Array<{ field?: string; message?: string }>;
}

interface CmsPagedResult<T> {
  count: number;
  page?: number;
  pageSize?: number;
  rows: T[];
}

interface CmsPageConfigNode {
  id: string;
  code?: string | null;
  name?: string | null;
  static_link?: string | null;
  static_link_en?: string | null;
  is_article?: boolean | null;
  level?: number | null;
  sort_order?: number | null;
  slug?: string | null;
  description?: string | null;
  type?: string | null;
  categories?: string[];
  children?: CmsPageConfigNode[];
}

interface CmsCategoryNode extends CmsCategoryItem {
  children?: CmsCategoryNode[];
}

interface CmsRawPostItem {
  id?: string;
  title?: string;
  external_link?: string | null;
  content?: string | null;
  release_at?: string | null;
  is_active?: boolean | null;
  release_mode?: string | null;
  slug?: string | null;
  summary?: string | null;
  page_config_id?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  status?: string | null;
  type?: string | null;
  categories?: CmsCategoryItem[];
  thumbnail?: CmsFileItem | null;
  is_featured?: boolean | null;
  is_hidden?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
  expired_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  registration_deadline?: string | null;
  location?: string | null;
  participation_fee?: string | null;
  content_structure?: Record<string, unknown> | null;
}

interface CmsPivotItem {
  post_id?: string;
  category_id?: string;
  tag_id?: string;
  created_at?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readMessage = (payload: unknown) => {
  if (!isObject(payload)) return "Request failed";
  if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
  if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  return "Request failed";
};

const authHeaders = (withJson = true) => {
  const headers = new Headers();

  if (withJson) {
    headers.set("Content-Type", "application/json");
  }

  return headers;
};

async function cmsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const payload = await useCustomClient<CmsApiEnvelope<T> | T>(path, {
    ...init,
    headers: init?.headers ?? authHeaders(init?.body !== undefined),
  });

  if (isObject(payload) && "statusCode" in payload) {
    const statusCode = Number(payload.statusCode);

    if (statusCode >= 400) {
      throw new Error(readMessage(payload));
    }
  }

  if (isObject(payload) && ("responseData" in payload || "data" in payload)) {
    return ((payload.responseData ?? payload.data) as T) ?? ({} as T);
  }

  return (payload ?? {}) as T;
}

const normalizeDateTimeInput = (value?: string | null) => {
  if (!value) return "";
  return value.length >= 16 ? value.slice(0, 16) : value;
};

const toSlugFromPath = (staticLink?: string | null) => {
  const normalized = (staticLink ?? "").trim();
  if (!normalized || normalized === "/") return "";
  const segments = normalized.split("/").filter(Boolean);
  return segments.at(-1) ?? "";
};

const deriveHeaderType = (node: CmsPageConfigNode): CmsHeaderCategoryType => {
  if ((node.children?.length ?? 0) > 0) return "category";
  if (node.type === "news" || node.type === "page" || node.type === "category") {
    return node.type;
  }
  return node.is_article ? "news" : "page";
};

const deriveCategoryHeaderType = (type?: string | null): CmsHeaderCategoryType => {
  if (type === "category") return "category";
  if (type === "news") return "news";
  return "page";
};

const normalizeTagNames = (values: string[]) => {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter((value) => {
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const parsePostContent = (contentStructure?: Record<string, unknown> | null): CmsPostContentSection[] => {
  const sections = Array.isArray(contentStructure?.post_content)
    ? (contentStructure?.post_content as Record<string, unknown>[])
    : [];

  return sections.map((section, index) => {
    const images = Array.isArray(section.images) ? (section.images as Record<string, unknown>[]) : [];

    return {
      id: typeof section.id === "string" ? section.id : `section-${index + 1}`,
      type: section.type === "image" ? "image" : "text",
      position: typeof section.position === "number" ? section.position : index + 1,
      content: typeof section.content === "string" ? section.content : "",
      image_columns:
        typeof section.image_columns === "number" ? section.image_columns : 2,
      image_rows: typeof section.image_rows === "number" ? section.image_rows : 2,
      images: images.map((image, imageIndex) => ({
        position: typeof image.position === "number" ? image.position : imageIndex + 1,
        image: {
          id: typeof image.image === "object" && image.image && "id" in image.image
            ? String((image.image as Record<string, unknown>).id ?? "")
            : "",
          name:
            typeof image.image === "object" && image.image && "name" in image.image
              ? String((image.image as Record<string, unknown>).name ?? "")
              : "",
          alt:
            typeof image.image === "object" && image.image && "alt" in image.image
              ? String((image.image as Record<string, unknown>).alt ?? "")
              : "",
          url:
            typeof image.image === "object" && image.image && "url" in image.image
              ? String((image.image as Record<string, unknown>).url ?? "")
              : "",
        },
      })),
    };
  });
};

const parseLegacyPostContent = (content?: string | null): CmsPostContentSection[] => {
  const normalizedContent = typeof content === "string" ? content.trim() : "";

  if (!normalizedContent) {
    return [];
  }

  return [
    {
      id: "legacy-content-section",
      type: "text",
      position: 1,
      content: normalizedContent,
      image_columns: 2,
      image_rows: 2,
      images: [],
    },
  ];
};

const transformPost = (
  post: CmsRawPostItem,
  tagMap?: Map<string, CmsTagItem[]>,
): CmsNewsItem => {
  const tagItems = tagMap?.get(post.id ?? "") ?? [];
  const categories = Array.isArray(post.categories) ? post.categories : [];
  const primaryCategory = categories[0] ?? null;
  const primaryCategoryType = primaryCategory?.type ?? null;
  const structuredContent = parsePostContent(post.content_structure);
  const fallbackContent =
    structuredContent.length > 0 ? structuredContent : parseLegacyPostContent(post.content);

  return {
    id: post.id ?? "",
    title: post.title ?? "",
    slug: post.slug ?? "",
    summary: post.summary ?? "",
    type:
      post.type === "page" ||
      primaryCategoryType === "post" ||
      primaryCategoryType === "page"
        ? "baiviettrang"
        : "tintuc",
    header_category_id: primaryCategory?.id ?? "",
    category_ids: categories.map((item) => item.id),
    tagsearch_values: tagItems.map((item) => item.name),
    tag_ids: tagItems.map((item) => item.id),
    is_featured: Boolean(post.is_featured),
    thumbnail: post.thumbnail?.id
      ? {
          id: post.thumbnail.id,
          name: post.thumbnail.original ?? post.thumbnail.path ?? "thumbnail",
          alt: post.thumbnail.original ?? post.thumbnail.path ?? "thumbnail",
          url: post.thumbnail.path ?? "",
        }
      : null,
    is_hidden: Boolean(post.is_hidden),
    created_at: post.created_at ?? "",
    updated_at: post.updated_at ?? "",
    published_at: normalizeDateTimeInput(post.published_at ?? post.release_at),
    expired_at: normalizeDateTimeInput(post.expired_at),
    started_at: normalizeDateTimeInput(post.started_at),
    ended_at: normalizeDateTimeInput(post.ended_at),
    registration_deadline: normalizeDateTimeInput(post.registration_deadline),
    location: post.location ?? "",
    participation_fee: post.participation_fee ?? "",
    post_content: fallbackContent,
  };
};

async function fetchAllTagsInternal() {
  const result = await cmsRequest<CmsPagedResult<CmsTagItem>>(
    "/tag?page=1&pageSize=200&sortField=name&sortOrder=ASC",
  );
  return result.rows ?? [];
}

async function fetchTagsForPost(postId: string) {
  const result = await cmsRequest<CmsPagedResult<CmsPivotItem>>(`/postTag/${postId}`);
  const tagIds = (result.rows ?? []).map((item) => item.tag_id).filter(Boolean) as string[];

  if (tagIds.length === 0) return [];

  return cmsRequest<CmsTagItem[]>("/tag/ids", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ tag_ids: tagIds }),
  });
}

function buildHeaderItemsFromTree(
  node: CmsPageConfigNode,
  rootId: string,
  parentId: string | null = null,
): CmsHeaderCategoryItem[] {
  const rows: CmsHeaderCategoryItem[] = [];
  const children = Array.isArray(node.children) ? node.children : [];

  children.forEach((child) => {
    rows.push({
      id: child.id,
      code: child.code ?? toSlugFromPath(child.static_link) ?? child.id,
      name: child.name ?? "",
      slug: child.slug ?? toSlugFromPath(child.static_link),
      static_link: child.static_link ?? "",
      sort_order: child.sort_order ?? 0,
      type: deriveHeaderType(child),
      is_article: Boolean(child.is_article),
      parent_id: parentId,
      api_parent_id: child.id ? node.id : rootId,
      level: child.level ?? (parentId ? 2 : 1),
      category_ids: Array.isArray(child.categories) ? child.categories : [],
      tagsearch_values: [],
      description: child.description ?? "",
    });

    rows.push(...buildHeaderItemsFromTree(child, rootId, child.id));
  });

  return rows;
}

function buildCategoryTree(rows: CmsCategoryItem[]) {
  const nodeMap = new Map<string, CmsCategoryNode>();
  const roots: CmsCategoryNode[] = [];
  const sortNodes = (nodes: CmsCategoryNode[]) => {
    nodes.sort((left, right) => {
      const leftOrder = left.sort_order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.sort_order ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.name.localeCompare(right.name, "vi");
    });
  };

  rows.forEach((row) => {
    nodeMap.set(row.id, { ...row, children: [] });
  });

  rows.forEach((row) => {
    const node = nodeMap.get(row.id);
    if (!node) return;

    if (row.parent_id) {
      const parent = nodeMap.get(row.parent_id);
      if (parent) {
        parent.children?.push(node);
        sortNodes(parent.children ?? []);
        return;
      }
    }

    roots.push(node);
  });

  sortNodes(roots);
  return roots;
}

function buildHeaderItemsFromCategories(
  nodes: CmsCategoryNode[],
  parentId: string | null = null,
  depth = 0,
): CmsHeaderCategoryItem[] {
  return nodes.flatMap((node, index) => {
    const type = deriveCategoryHeaderType(node.type);
    const item: CmsHeaderCategoryItem = {
      id: node.id,
      code: node.slug || node.id,
      name: node.name,
      slug: node.slug,
      static_link: node.url ?? "",
      sort_order: node.sort_order ?? index + 1,
      type,
      is_article: type === "news",
      parent_id: parentId,
      api_parent_id: node.parent_id ?? null,
      level: depth + 1,
      category_ids: type === "category" ? [] : [node.id],
      tagsearch_values: [],
      description: "",
      created_at: node.created_at,
      updated_at: node.updated_at,
    };

    return [
      item,
      ...buildHeaderItemsFromCategories(node.children ?? [], node.id, depth + 1),
    ];
  });
}

const buildStaticLink = (slug: string, parentStaticLink?: string | null) => {
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, "");
  if (!cleanSlug) {
    return parentStaticLink?.trim() || "/";
  }

  const cleanParent = (parentStaticLink ?? "").trim().replace(/\/+$/, "");
  if (!cleanParent || cleanParent === "/") {
    return `/${cleanSlug}`;
  }

  return `${cleanParent}/${cleanSlug}`;
};

const toCategoryApiType = (type: CmsHeaderCategoryType) => {
  if (type === "category") return "category";
  if (type === "news") return "news";
  return "page";
};

const toTagSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export async function fetchCmsCategories() {
  const result = await cmsRequest<CmsPagedResult<CmsCategoryItem>>(
    "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
  ).catch(() => ({
    count: categoryFallbackRows.length,
    page: 1,
    pageSize: 50,
    rows: categoryFallbackRows as CmsCategoryItem[],
  }));

  return (result.rows ?? []).filter((item) => item.type !== "category");
}

export async function fetchCmsTags() {
  return fetchAllTagsInternal();
}

export async function fetchCmsTagsPage(params?: {
  page?: number;
  pageSize?: number;
}) {
  const searchParams = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 10),
    sortField: "name",
    sortOrder: "ASC",
  });

  const result = await cmsRequest<CmsPagedResult<CmsTagItem>>(
    `/tag?${searchParams.toString()}`,
  );

  return {
    items: result.rows ?? [],
    total: result.count ?? 0,
    page: result.page ?? params?.page ?? 1,
    pageSize: result.pageSize ?? params?.pageSize ?? 10,
  };
}

export async function createCmsTag(input: { name: string; slug?: string }) {
  return cmsRequest<CmsTagItem>("/tag", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      name: input.name.trim(),
      slug: input.slug?.trim() || toTagSlug(input.name),
    }),
  });
}

export async function updateCmsTag(
  id: string,
  input: { name: string; slug?: string },
) {
  return cmsRequest<CmsTagItem>(`/tag/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({
      name: input.name.trim(),
      slug: input.slug?.trim() || toTagSlug(input.name),
    }),
  });
}

export async function deleteCmsTag(id: string) {
  await cmsRequest(`/tag/${id}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });
}

export async function ensureTagsExist(names: string[]) {
  const normalizedNames = normalizeTagNames(names);
  if (normalizedNames.length === 0) return [];

  const existingTags = await fetchAllTagsInternal();
  const tagMap = new Map(
    existingTags.map((item) => [item.name.trim().toLowerCase(), item]),
  );

  for (const name of normalizedNames) {
    const key = name.toLowerCase();
    if (tagMap.has(key)) continue;

    const created = await cmsRequest<CmsTagItem>("/tag", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        name,
        slug: toTagSlug(name),
      }),
    });

    tagMap.set(key, created);
  }

  return normalizedNames
    .map((name) => tagMap.get(name.toLowerCase()))
    .filter((item): item is CmsTagItem => Boolean(item));
}

export async function syncPostTags(postId: string, tagIds: string[]) {
  const current = await cmsRequest<CmsPagedResult<CmsPivotItem>>(`/postTag/${postId}`);
  const currentIds = new Set(
    (current.rows ?? []).map((item) => item.tag_id).filter(Boolean) as string[],
  );
  const nextIds = new Set(tagIds.filter(Boolean));

  const toCreate = Array.from(nextIds).filter((id) => !currentIds.has(id));
  const toDelete = Array.from(currentIds).filter((id) => !nextIds.has(id));

  if (toCreate.length > 0) {
    await cmsRequest(`/postTag/${postId}/bulk`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ tag_ids: toCreate }),
    });
  }

  await Promise.all(
    toDelete.map((tagId) =>
      cmsRequest(`/postTag/${postId}?tag_id=${encodeURIComponent(tagId)}`, {
        method: "DELETE",
        headers: authHeaders(false),
      }),
    ),
  );
}

export async function fetchHeaderConfigItems() {
  const result = await cmsRequest<CmsPagedResult<CmsCategoryItem>>(
    "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
  ).catch(() => ({
    count: categoryFallbackRows.length,
    page: 1,
    pageSize: 50,
    rows: categoryFallbackRows as CmsCategoryItem[],
  }));
  const roots = buildCategoryTree(result.rows ?? []);
  const items = buildHeaderItemsFromCategories(roots);

  return {
    rootId: "",
    rootStaticLink: "/",
    items,
  };
}

export async function createHeaderConfigItem(input: {
  name: string;
  slug: string;
  sort_order: number;
  type: CmsHeaderCategoryType;
  ui_parent_id?: string | null;
  api_parent_id: string;
  parent_static_link?: string | null;
}) {
  const payload = {
    name: input.name,
    slug: input.slug || toTagSlug(input.name),
    url: buildStaticLink(input.slug, input.parent_static_link),
    sort_order: input.sort_order,
    parent_id: input.api_parent_id || undefined,
    type: toCategoryApiType(input.type),
  };

  return cmsRequest<CmsCategoryItem>("/category", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function updateHeaderConfigItem(
  id: string,
  input: {
    name: string;
    slug: string;
    sort_order: number;
    type: CmsHeaderCategoryType;
    api_parent_id: string;
    parent_static_link?: string | null;
  },
) {
  const payload = {
    name: input.name,
    slug: input.slug || toTagSlug(input.name),
    url: buildStaticLink(input.slug, input.parent_static_link),
    sort_order: input.sort_order,
    parent_id: input.api_parent_id || undefined,
    type: toCategoryApiType(input.type),
  };

  return cmsRequest<CmsCategoryItem>(`/category/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function deleteHeaderConfigItem(id: string) {
  await cmsRequest(`/category/${id}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });
}

export async function fetchCmsNewsItems(params?: {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
  filters?: string;
}) {
  const queryParams = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 20),
    sortField: params?.sortField ?? "created_at",
    sortOrder: params?.sortOrder ?? "desc",
  });

  if (params?.filters?.trim()) {
    queryParams.set("filters", params.filters.trim());
  }

  const result = await cmsRequest<CmsPagedResult<CmsRawPostItem>>(
    `/post?${queryParams.toString()}`,
  );

  const rows = result.rows ?? [];

  return {
    items: rows.map((item) => transformPost(item)),
    total: result.count ?? 0,
    page: result.page ?? 1,
    pageSize: result.pageSize ?? 20,
  };
}

export async function fetchCmsPostCount(filters?: string) {
  const queryParams = new URLSearchParams();

  if (filters?.trim()) {
    queryParams.set("filters", filters.trim());
  }

  queryParams.set("page", "1");
  queryParams.set("pageSize", "1");

  const result = await cmsRequest<CmsPagedResult<CmsRawPostItem>>(
    `/post?${queryParams.toString()}`,
  );

  return result.count ?? 0;
}

export async function fetchCmsNewsItem(id: string) {
  const post = await cmsRequest<CmsRawPostItem>(`/post/${id}`);
  const tags = post.id ? await fetchTagsForPost(post.id) : [];
  const tagMap = new Map<string, CmsTagItem[]>([[post.id ?? "", tags]]);
  return transformPost(post, tagMap);
}

export async function createCmsNewsItem(input: {
  title: string;
  slug: string;
  summary: string;
  type: "tintuc" | "baiviettrang";
  header_category_id: string;
  category_ids: string[];
  tag_ids: string[];
  is_featured: boolean;
  thumbnail_id?: string | null;
  is_hidden: boolean;
  published_at?: string | null;
  expired_at?: string | null;
  started_at?: string | null;
  ended_at?: string | null;
  registration_deadline?: string | null;
  location?: string;
  participation_fee?: string;
  post_content: CmsPostContentSection[];
}) {
  const payload = {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    type: input.type === "baiviettrang" ? "page" : "news",
    external_link: input.slug ? `/${input.slug}` : "/",
    content: input.summary || "",
    category_ids: input.category_ids,
    thumbnail_id: input.thumbnail_id ?? null,
    is_featured: input.is_featured,
    is_hidden: input.is_hidden,
    is_active: !input.is_hidden,
    published_at: input.published_at || null,
    expired_at: input.expired_at || null,
    started_at: input.started_at || null,
    ended_at: input.ended_at || null,
    registration_deadline: input.registration_deadline || null,
    location: input.location?.trim() || null,
    participation_fee: input.participation_fee?.trim() || null,
    release_mode: input.published_at ? "SCHEDULED" : "NOW",
    release_at: input.published_at || null,
    content_structure: {
      post_content: input.post_content,
    },
  };

  const created = await cmsRequest<CmsRawPostItem>("/post", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (created.id) {
    await syncPostTags(created.id, input.tag_ids);
  }

  return created;
}

export async function updateCmsNewsItem(
  id: string,
  input: {
    title: string;
    slug: string;
    summary: string;
    type: "tintuc" | "baiviettrang";
    header_category_id: string;
    category_ids: string[];
    tag_ids: string[];
    is_featured: boolean;
    thumbnail_id?: string | null;
    is_hidden: boolean;
    published_at?: string | null;
    expired_at?: string | null;
    started_at?: string | null;
    ended_at?: string | null;
    registration_deadline?: string | null;
    location?: string;
    participation_fee?: string;
    post_content: CmsPostContentSection[];
  },
) {
  const payload = {
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    type: input.type === "baiviettrang" ? "page" : "news",
    external_link: input.slug ? `/${input.slug}` : "/",
    content: input.summary || "",
    category_ids: input.category_ids,
    thumbnail_id: input.thumbnail_id ?? null,
    is_featured: input.is_featured,
    is_hidden: input.is_hidden,
    is_active: !input.is_hidden,
    published_at: input.published_at || null,
    expired_at: input.expired_at || null,
    started_at: input.started_at || null,
    ended_at: input.ended_at || null,
    registration_deadline: input.registration_deadline || null,
    location: input.location?.trim() || null,
    participation_fee: input.participation_fee?.trim() || null,
    release_mode: input.published_at ? "SCHEDULED" : "NOW",
    release_at: input.published_at || null,
    content_structure: {
      post_content: input.post_content,
    },
  };

  const updated = await cmsRequest<CmsRawPostItem>(`/post/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  await syncPostTags(id, input.tag_ids);

  return updated;
}

export async function deleteCmsNewsItem(id: string) {
  await cmsRequest(`/post/${id}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });
}
