import type { UserSummary } from "./user";

export const ADMIN_NEWS_TYPE_OPTIONS = [
  { value: "tintuc", label: "Tin tức" },
  { value: "baiviettrang", label: "Bài viết trang" },
] as const;

export type AdminNewsType = (typeof ADMIN_NEWS_TYPE_OPTIONS)[number]["value"];

export const ADMIN_NEWS_TYPE_LABELS: Record<AdminNewsType, string> =
  ADMIN_NEWS_TYPE_OPTIONS.reduce(
    (result, option) => {
      result[option.value] = option.label;
      return result;
    },
    {} as Record<AdminNewsType, string>,
  );

export interface AdminMediaItem {
  id: string;
  name: string;
  alt: string;
  url: string;
  mime: string;
  size: number;
  created_at: string;
  updated_at: string;
  source: "seed" | "upload";
}

export interface AdminNewsImageRef {
  id: string;
  name: string;
  alt: string;
  url: string;
}

export interface AdminNewsContentImage {
  position: number;
  image: AdminNewsImageRef;
  caption: string;
}

export interface AdminNewsContentSection {
  id: string;
  type: "text" | "image";
  position: number;
  content: string;
  image_columns: number;
  image_rows: number;
  images: AdminNewsContentImage[];
}

export interface AdminNewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: AdminNewsType;
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  is_featured: boolean;
  thumbnail: AdminNewsImageRef | null;
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
  event_dates?: string[];
  post_content: AdminNewsContentSection[];
  creator?: UserSummary | null;
  editor?: UserSummary | null;
}

export interface AdminNewsFormValues {
  title: string;
  slug: string;
  summary: string;
  type: AdminNewsType | "";
  header_category_id: string;
  category_ids: string[];
  tagsearch_values: string[];
  is_featured: boolean;
  thumbnail: AdminNewsImageRef | null;
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
  event_dates?: string[];
  post_content: AdminNewsContentSection[];
}

export type DynamicPostCategoryItem = {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: string;
};

export type DynamicPostThumbnail = {
  path?: string | null;
  original?: string | null;
  url?: string | null;
} | null;

export type DynamicPostUser = {
  id: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  avatar_url: string | null;
} | null;

export type DynamicPostContentSection = {
  id: string;
  type: string;
  content: string;
  position: number;
  image_rows: number;
  image_columns: number;
  images: Array<{
    position: number;
    caption: string | null;
    image: {
      id: string;
      name: string;
      alt: string;
      url: string;
      path?: string | null;
      original?: string | null;
    } | null;
  }>;
};

export type DynamicPostItem = {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  release_at: string | null;
  published_at: string | null;
  created_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  expired_at: string | null;
  registration_deadline: string | null;
  location: string | null;
  participation_fee: string | null;
  is_featured: boolean;
  is_hidden: boolean;
  is_active: boolean;
  status: string;
  type: string;
  thumbnail: DynamicPostThumbnail;
  categories: DynamicPostCategoryItem[];
  content_structure: {
    post_content: DynamicPostContentSection[];
  } | null;
  creator: DynamicPostUser;
  editor: DynamicPostUser;
};
