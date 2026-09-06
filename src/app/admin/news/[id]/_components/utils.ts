import type { AdminMediaItem, AdminNewsImageRef, AdminNewsType } from "@/mockdata/admin-news";
import type { HeaderCategoryItem, HeaderCategoryTreeItem } from "@/mockdata/header-config";

export type HeaderCategoryOption = {
  id: string;
  name: string;
  type: HeaderCategoryItem["type"];
  depth: number;
};

export function flattenHeaderTree(
  items: HeaderCategoryTreeItem[],
  depth = 0,
): HeaderCategoryOption[] {
  return items.flatMap((item) => [
    { id: item.id, name: item.name, type: item.type, depth },
    ...flattenHeaderTree(item.children, depth + 1),
  ]);
}

export function isCategoryCompatible(
  headerType: HeaderCategoryItem["type"],
  postType: AdminNewsType | "",
) {
  if (!postType) return true;
  if (postType === "tintuc") return headerType === "news";
  if (postType === "baiviettrang") return headerType === "page";
  return false;
}

export function toImageRef(item: AdminMediaItem): AdminNewsImageRef {
  return {
    id: item.id,
    name: item.name,
    alt: item.alt,
    url: item.url,
  };
}

export function formatHeaderCategoryOptionLabel(option: {
  name: string;
  depth: number;
}) {
  return `${"-- ".repeat(option.depth)}${option.name}`;
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
