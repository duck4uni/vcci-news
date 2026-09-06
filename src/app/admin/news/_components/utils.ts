import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  type AdminNewsItem,
} from "@/mockdata/admin-news";
import {
  type HeaderCategoryItem,
  type HeaderCategoryTreeItem,
} from "@/mockdata/header-config";

export type FlattenedHeaderCategory = HeaderCategoryItem & { depth: number };

export function flattenHeaderTree(
  items: HeaderCategoryTreeItem[],
  depth = 0,
): Array<HeaderCategoryItem & { depth: number }> {
  return items.flatMap((item) => [
    { ...item, depth },
    ...flattenHeaderTree(item.children, depth + 1),
  ]);
}

export function formatHeaderCategoryOptionLabel(option: { name: string; depth: number }) {
  return `${"-- ".repeat(option.depth)}${option.name}`;
}

export function formatDateTime(value: string) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

export function getDisplayCategoryNames(
  item: AdminNewsItem,
  categories: HeaderCategoryItem[],
) {
  const categoryIds = Array.from(
    new Set([
      ...item.category_ids,
      ...(item.header_category_id ? [item.header_category_id] : []),
    ]),
  );

  return categoryIds
    .map((categoryId) => categories.find((entry) => entry.id === categoryId)?.name)
    .filter((name): name is string => Boolean(name));
}

export function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}
