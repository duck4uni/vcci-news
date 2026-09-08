import { toCmsSlug } from "@/lib/utils/cms-slug";

export const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

export const slugifyTag = (value: string) => toCmsSlug(value);
