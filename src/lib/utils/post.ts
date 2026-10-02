import Links from "@/links";

/**
 * Helpers dùng chung cho các component hiển thị post (home, sections...).
 * Toàn bộ là hàm thuần — an toàn khi dùng ở cả Server Components và client.
 */

/** Chuẩn hoá link: giữ http(s)/path, tự thêm "/" nếu thiếu, fallback nếu rỗng. */
export const normalizeLink = (value?: string | null, fallback = "/") => {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  return `/${trimmed}`;
};

/** Link chi tiết bài viết: slug/title + ?id=<postId> nếu có id. */
export const buildPostLink = (
  path?: string | null,
  id?: string | null,
  fallback = "/",
) => {
  const normalizedPath = normalizeLink(path, fallback);
  const trimmedId = id?.trim() ?? "";
  if (!trimmedId || normalizedPath === "#") return normalizedPath;
  const params = new URLSearchParams({ id: trimmedId });
  return `${normalizedPath}?${params.toString()}`;
};

/** Resolve URL asset (thumbnail...) qua Links.resolveImageUrl, fallback mặc định. */
export const resolveAssetUrl = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return "/thumbnail.png";
  return Links.resolveImageUrl(trimmed);
};

/** Bỏ caption/figure/img/tags + entities, trả text thuần dùng cho excerpt. */
export const stripHtml = (raw?: string | null) =>
  (raw ?? "")
    .replace(/\[caption[^\]]*\].*?\[\/caption\]/gi, "")
    .replace(/<figure[^>]*>.*?<\/figure>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/–/g, "–")
    .replace(/\s+/g, " ")
    .trim();
