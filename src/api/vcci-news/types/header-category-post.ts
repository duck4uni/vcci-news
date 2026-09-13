export interface HeaderCategoryPostItem {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  published_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeaderCategoryPostFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  published_at: string;
  is_active: boolean;
}
