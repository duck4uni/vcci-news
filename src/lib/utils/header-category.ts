import { toCmsSlug } from "@/lib/utils/cms-slug";
import type { HeaderCategoryType } from "@/api/vcci-news/types/header-config";

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
