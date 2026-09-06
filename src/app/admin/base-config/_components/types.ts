import type { Logo } from "@/api/vcci-news/models";
import type { AdminMediaItem } from "@/mockdata/admin-news";

export const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

export type ConfigItemMode = "logo" | "banner";
export type ApiEnvelope<T> = {
  responseData?: T;
  data?: {
    responseData?: T;
  };
};

export type LogoMediaItem = AdminMediaItem & {
  logoId?: string;
};

export type LogoListResponse = {
  rows?: Logo[];
};

export type PageEnvelope<T> = {
  rows?: T[];
  count?: number;
  page?: number;
  pageSize?: number;
};

export type ConfigItemForm = {
  name: string;
  imageId: string;
  isActive: boolean;
  displayTimeSeconds: number;
  sortOrder: number;
};
