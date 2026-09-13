import dayjs from "dayjs";

import type { HeaderCategoryTreeItem } from "@/api/vcci-news/types/header-config";

export const PAGE_SIZE = 10;

export function formatDateTime(value: string) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

export function flattenTree(items: HeaderCategoryTreeItem[]) {
  const rows: HeaderCategoryTreeItem[] = [];

  const walk = (nodes: HeaderCategoryTreeItem[]) => {
    nodes.forEach((item) => {
      rows.push(item);
      if (item.children.length > 0) {
        walk(item.children);
      }
    });
  };

  walk(items);
  return rows;
}
