export type HeaderCategoryType = "category" | "page" | "news";

export interface HeaderCategoryItem {
  id: string;
  name: string;
  slug: string;
  url?: string | null;
  sort_order: number;
  type: HeaderCategoryType;
  is_article?: boolean;
  parent_id: string | null;
  level: number;
  category_ids?: string[];
  tagsearch_values?: string[];
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
