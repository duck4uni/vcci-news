"use client";

import { useGetApiV10AdvertisementPublic } from "@/api/vcci-news/endpoints/advertisement";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import type { GetApiV10AdvertisementPublicType } from "@/api/vcci-news/models/getApiV10AdvertisementPublicType";

/**
 * Hook đọc danh sách quảng cáo active theo loại từ API backend (public, không cần auth).
 * Backend đã lọc status=ACTIVE và sort theo sort_order ASC.
 * Mỗi record có `file` (path, mime) — dùng `links.resolveImageUrl(file.path)` để lấy URL ảnh.
 *
 * @param type - "square" | "horizontal"
 * @param limit - số lượng records tối đa (mặc định 20 cho square, 1 cho horizontal)
 */
export function useAdvertisements(
  type: "square" | "horizontal",
  limit?: number,
): Advertisement[] {
  const effectiveLimit = limit ?? (type === "horizontal" ? 1 : 5);

  const { data } = useGetApiV10AdvertisementPublic({
    type: type as GetApiV10AdvertisementPublicType,
    limit: effectiveLimit,
  });

  // Backend trả về { responseData: [...] }
  return (
    (data as unknown as { responseData?: Advertisement[] } | undefined)?.responseData ?? []
  );
}
