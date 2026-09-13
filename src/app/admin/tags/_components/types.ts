import type { TagItem } from "@/api/vcci-news/types/tag";

export interface TagFormValues {
  id?: string;
  name: string;
  slug: string;
}

export const PAGE_SIZE = 10;

export const EMPTY_FORM: TagFormValues = {
  name: "",
  slug: "",
};

export type { TagItem };
