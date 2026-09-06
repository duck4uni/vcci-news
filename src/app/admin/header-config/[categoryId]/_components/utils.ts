import dayjs from "dayjs";

import { buildHeaderCategoryTree } from "@/mockdata/header-config";

export const PAGE_SIZE = 10;

export type HeaderCategoryTreeNode = ReturnType<typeof buildHeaderCategoryTree>;

export function formatDateTime(value: string) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

export function flattenTree(items: HeaderCategoryTreeNode) {
  const rows: HeaderCategoryTreeNode = [];

  const walk = (nodes: HeaderCategoryTreeNode) => {
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
