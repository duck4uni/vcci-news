export type DynamicCategoryType = "category" | "page" | "news";

export type DynamicCategoryRouteItem = {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: DynamicCategoryType;
  parent_id: string | null;
  sort_order: number | null;
};

export type DynamicCategoryMenuItem = {
  id: string;
  name: string;
  static_link: string;
};

export type DynamicPostCategoryItem = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type DynamicPostThumbnail = {
  path?: string | null;
  original?: string | null;
  url?: string | null;
} | null;

export type DynamicPostContentSection = {
  id: string;
  type: string;
  content: string;
  position: number;
};

export type DynamicPostItem = {
  id: string;
  title: string;
  slug: string;
  external_link: string;
  content: string;
  summary: string;
  release_at: string | null;
  published_at: string | null;
  created_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  expired_at: string | null;
  registration_deadline: string | null;
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
};
