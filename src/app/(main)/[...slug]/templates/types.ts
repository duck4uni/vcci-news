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
