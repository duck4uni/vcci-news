import { toCmsSlug } from "@/lib/utils/cms-slug";
import {
  ADMIN_NEWS_TYPE_OPTIONS,
  type AdminNewsFormValues,
  type AdminNewsItem,
  type AdminNewsType,
} from "@/api/vcci-news/types/post";

export const EMPTY_ADMIN_NEWS_FORM: AdminNewsFormValues = {
  title: "",
  slug: "",
  summary: "",
  type: "tintuc",
  header_category_id: "",
  category_ids: [],
  tagsearch_values: [],
  is_featured: false,
  thumbnail: null,
  is_hidden: false,
  created_at: "",
  updated_at: "",
  published_at: "",
  expired_at: "",
  started_at: "",
  ended_at: "",
  registration_deadline: "",
  location: "",
  participation_fee: "",
  event_dates: [],
  post_content: [],
};

export function slugifyAdminNews(value: string) {
  return toCmsSlug(value);
}

export function resolveAdminNewsType(value?: string | null): AdminNewsType | undefined {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase();
  const compact = normalized.replace(/[\s_-]+/g, "");

  const direct = ADMIN_NEWS_TYPE_OPTIONS.find(
    (option) => option.value === normalized || option.value === compact,
  );

  if (direct) return direct.value;

  const aliases: Record<string, AdminNewsType> = {
    news: "tintuc",
    "tin tuc": "tintuc",
    "tin tức": "tintuc",
    pagepost: "baiviettrang",
    "bai viet trang": "baiviettrang",
    "bài viết trang": "baiviettrang",
  };

  return aliases[normalized] || aliases[compact];
}

export function cloneAdminNewsFormValues(item?: AdminNewsItem | null): AdminNewsFormValues {
  if (!item) {
    return {
      ...EMPTY_ADMIN_NEWS_FORM,
      category_ids: [],
      tagsearch_values: [],
      post_content: [],
    };
  }

  return {
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    type: item.type,
    header_category_id: item.header_category_id,
    category_ids: [...item.category_ids],
    tagsearch_values: [...(item.tagsearch_values ?? [])],
    is_featured: item.is_featured ?? false,
    thumbnail: item.thumbnail ? { ...item.thumbnail } : null,
    is_hidden: item.is_hidden,
    created_at: item.created_at,
    updated_at: item.updated_at,
    published_at: item.published_at,
    expired_at: item.expired_at,
    started_at: item.started_at,
    ended_at: item.ended_at,
    registration_deadline: item.registration_deadline,
    location: item.location,
    participation_fee: item.participation_fee,
    event_dates: [...(item.event_dates ?? [])],
    post_content: item.post_content.map((section) => ({
      ...section,
      images: section.images.map((image) => ({
        ...image,
        caption: image.caption ?? "",
        image: { ...image.image },
      })),
    })),
  };
}
