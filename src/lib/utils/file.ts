import links from "@/links";
import type { File as CmsFileItem } from "@/api/vcci-news/models/file";
import type { AdminMediaItem } from "@/mockdata/admin-news";

export type { CmsFileItem };

export const resolveCmsFileUrl = (path?: string | null) => {
  const value = path?.trim();
  if (!value) return "/img-error.png";
  return links.resolveImageUrl(value);
};

export const toAdminMediaItem = (item: CmsFileItem): AdminMediaItem => ({
  id: item.id ?? "",
  name: item.original || item.path || "",
  alt: item.original || item.path || "",
  url: resolveCmsFileUrl(item.path),
  mime: item.mime ?? "",
  size: 0,
  created_at: item.created_at ?? "",
  updated_at: item.created_at ?? "",
  source: "upload",
});
