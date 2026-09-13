"use client";

import { toCmsSlug } from "@/lib/utils/cms-slug";
import type {
  HeaderCategoryType,
  HeaderCategoryItem,
  HeaderCategoryTreeItem,
  HeaderArticleCategoryOption,
} from "@/api/vcci-news/types/header-config";

export type {
  HeaderCategoryType,
  HeaderCategoryItem,
  HeaderCategoryTreeItem,
  HeaderArticleCategoryOption,
} from "@/api/vcci-news/types/header-config";

export const HEADER_CONFIG_STORAGE_KEY = "vcci-news.header-config.data.v1";

export const headerCategorySeed: HeaderCategoryItem[] = [
  {
    id: "root-home",
    name: "Trang chủ",
    slug: "",
    url: "/",
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
    url: "/gioi-thieu",
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
    url: "/gioi-thieu/ve-vcci-news",
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
    url: "/gioi-thieu/co-cau-to-chuc",
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
    url: "/hoat-dong",
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
    url: "/hoat-dong/tin-tuc",
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
    url: "/hoat-dong/su-kien",
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
    url: "/thu-vien-anh",
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
    url: "/thu-vien-anh/album-noi-bat",
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
  return toCmsSlug(value);
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
  return headerCategorySeed;
}
