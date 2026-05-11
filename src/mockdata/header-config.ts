"use client";

export type HeaderCategoryType = "category" | "page" | "news";

export interface HeaderCategoryItem {
  id: string;
  name: string;
  slug: string;
  static_link: string;
  sort_order: number;
  type: HeaderCategoryType;
  is_article: boolean;
  parent_id: string | null;
  level: number;
  category_ids: string[];
  tagsearch_values: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface HeaderCategoryTreeItem extends HeaderCategoryItem {
  children: HeaderCategoryTreeItem[];
}

export interface HeaderArticleCategoryOption {
  id: string;
  name: string;
}

export const HEADER_CONFIG_STORAGE_KEY = "vcci-news.header-config.data.v1";

const DEFAULT_HEADER_CATEGORY_SEARCH_TAGS: Record<string, string[]> = {
  "activity-news": [
    "Doanh nghiệp hội viên",
    "Xúc tiến thương mại",
    "Chuyển đổi số",
    "Kết nối giao thương",
    "Bản tin nổi bật",
  ],
  "activity-events": [
    "Hội thảo",
    "Đăng ký",
    "Sự kiện nổi bật",
    "Lịch sự kiện",
    "Mời tham dự",
  ],
  "library-highlight": [
    "Album ảnh",
    "Thư viện số",
    "Khoảnh khắc nổi bật",
    "Hình ảnh sự kiện",
  ],
};

export const headerCategorySeed: HeaderCategoryItem[] = [
  {
    id: "root-home",
    name: "Trang chủ",
    slug: "",
    static_link: "/",
    sort_order: 1,
    type: "page",
    is_article: false,
    parent_id: null,
    level: 1,
    category_ids: [],
    tagsearch_values: [],
    description: "Trang gốc của website",
  },
  {
    id: "intro",
    name: "Giới thiệu",
    slug: "gioi-thieu",
    static_link: "/gioi-thieu",
    sort_order: 2,
    type: "category",
    is_article: false,
    parent_id: null,
    level: 1,
    category_ids: [],
    tagsearch_values: [],
    description: "Nhóm nội dung giới thiệu",
  },
  {
    id: "intro-about",
    name: "Về VCCI News",
    slug: "ve-vcci-news",
    static_link: "/gioi-thieu/ve-vcci-news",
    sort_order: 1,
    type: "page",
    is_article: false,
    parent_id: "intro",
    level: 2,
    category_ids: [],
    tagsearch_values: [],
    description: "Trang nội dung giới thiệu hệ thống",
  },
  {
    id: "intro-org",
    name: "Cơ cấu tổ chức",
    slug: "co-cau-to-chuc",
    static_link: "/gioi-thieu/co-cau-to-chuc",
    sort_order: 2,
    type: "page",
    is_article: false,
    parent_id: "intro",
    level: 2,
    category_ids: [],
    tagsearch_values: [],
    description: "Trang thông tin cơ cấu tổ chức",
  },
  {
    id: "activity",
    name: "Hoạt động",
    slug: "hoat-dong",
    static_link: "/hoat-dong",
    sort_order: 3,
    type: "category",
    is_article: false,
    parent_id: null,
    level: 1,
    category_ids: [],
    tagsearch_values: [],
    description: "Nhóm nội dung tin tức và hoạt động",
  },
  {
    id: "activity-news",
    name: "Tin tức",
    slug: "tin-tuc",
    static_link: "/hoat-dong/tin-tuc",
    sort_order: 1,
    type: "news",
    is_article: true,
    parent_id: "activity",
    level: 2,
    category_ids: ["cat-news", "cat-activity"],
    tagsearch_values: [
      "Doanh nghiệp hội viên",
      "Xúc tiến thương mại",
      "Chuyển đổi số",
    ],
    description: "Danh mục tin tức tổng hợp",
  },
  {
    id: "activity-events",
    name: "Sự kiện",
    slug: "su-kien",
    static_link: "/hoat-dong/su-kien",
    sort_order: 2,
    type: "news",
    is_article: true,
    parent_id: "activity",
    level: 2,
    category_ids: ["cat-event"],
    tagsearch_values: ["Hội thảo", "Đăng ký", "Sự kiện nổi bật"],
    description: "Danh mục sự kiện",
  },
  {
    id: "library",
    name: "Thư viện ảnh",
    slug: "thu-vien-anh",
    static_link: "/thu-vien-anh",
    sort_order: 4,
    type: "category",
    is_article: false,
    parent_id: null,
    level: 1,
    category_ids: [],
    tagsearch_values: [],
    description: "Khu vực ảnh và album",
  },
  {
    id: "library-highlight",
    name: "Album nổi bật",
    slug: "album-noi-bat",
    static_link: "/thu-vien-anh/album-noi-bat",
    sort_order: 1,
    type: "news",
    is_article: true,
    parent_id: "library",
    level: 2,
    category_ids: [],
    tagsearch_values: ["Album ảnh", "Thư viện số"],
    description: "Album ảnh nổi bật",
  },
];

export const headerArticleCategoryOptions: HeaderArticleCategoryOption[] = [
  { id: "cat-news", name: "Tin tổng hợp" },
  { id: "cat-activity", name: "Hoạt động VCCI" },
  { id: "cat-event", name: "Sự kiện" },
  { id: "cat-policy", name: "Chính sách" },
];

export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeTagsearchValues(values?: string[]) {
  if (!Array.isArray(values)) return [];

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
}

function getDefaultTagsearchValues(itemId: string) {
  return DEFAULT_HEADER_CATEGORY_SEARCH_TAGS[itemId] ?? [];
}

function buildStaticLink(
  item: Pick<HeaderCategoryItem, "slug" | "parent_id">,
  items: HeaderCategoryItem[],
) {
  if (!item.slug.trim()) return "/";

  const segments = [item.slug.trim()];
  let currentParentId = item.parent_id;

  while (currentParentId) {
    const parent = items.find((entry) => entry.id === currentParentId);
    if (!parent) break;

    if (parent.slug.trim()) {
      segments.unshift(parent.slug.trim());
    }

    currentParentId = parent.parent_id;
  }

  return `/${segments.join("/")}`;
}

function assignLevel(item: HeaderCategoryItem, items: HeaderCategoryItem[]) {
  let level = 1;
  let currentParentId = item.parent_id;

  while (currentParentId) {
    const parent = items.find((entry) => entry.id === currentParentId);
    if (!parent) break;
    level += 1;
    currentParentId = parent.parent_id;
  }

  return level;
}

export function normalizeHeaderCategories(items: HeaderCategoryItem[]) {
  const sanitizedItems = items.map((item) => {
    const normalizedType =
      (item.type as unknown as string) === "image" ? "news" : item.type;

    return {
      ...item,
      type: normalizedType as HeaderCategoryType,
      is_article: normalizedType === "news",
      category_ids: Array.isArray(item.category_ids) ? item.category_ids : [],
      tagsearch_values: normalizeTagsearchValues(item.tagsearch_values),
    };
  });

  const parentIds = new Set(
    sanitizedItems
      .filter((item) => item.parent_id)
      .map((item) => item.parent_id as string),
  );

  return sanitizedItems.map((item) => {
    const next = { ...item };

    if (parentIds.has(next.id)) {
      next.type = "category";
      next.category_ids = [];
      next.tagsearch_values = [];
    }

    next.level = assignLevel(next, sanitizedItems);
    next.static_link =
      next.slug === "" && !next.parent_id ? "/" : buildStaticLink(next, sanitizedItems);
    next.is_article = next.type === "news";

    if (next.type !== "news") {
      next.category_ids = [];
      next.tagsearch_values = [];
    } else if (next.tagsearch_values.length === 0) {
      next.tagsearch_values = getDefaultTagsearchValues(next.id);
    }

    return next;
  });
}

export function buildHeaderCategoryTree(items: HeaderCategoryItem[]): HeaderCategoryTreeItem[] {
  const normalized = normalizeHeaderCategories(items);
  const map = new Map<string, HeaderCategoryTreeItem>();

  normalized.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  const roots: HeaderCategoryTreeItem[] = [];

  normalized.forEach((item) => {
    const current = map.get(item.id);
    if (!current) return;

    if (item.parent_id) {
      const parent = map.get(item.parent_id);
      if (parent) {
        parent.children.push(current);
        parent.children.sort(
          (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "vi"),
        );
      } else {
        roots.push(current);
      }
    } else {
      roots.push(current);
    }
  });

  return roots.sort(
    (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "vi"),
  );
}

export function getHeaderCategoryTypeLabel(type: HeaderCategoryType) {
  switch (type) {
    case "category":
      return "Danh mục";
    case "page":
      return "Bài viết trang";
    case "news":
      return "Tin tức";
    default:
      return type;
  }
}

export function createHeaderCategoryId() {
  return `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getHeaderCategorySeed() {
  return normalizeHeaderCategories(headerCategorySeed);
}
