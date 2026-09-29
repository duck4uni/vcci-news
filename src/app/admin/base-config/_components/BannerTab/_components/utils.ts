import type { Banner, BannerMutate } from "@/api/vcci-news/models";
import type { BaseConfigBannerItem } from "@/mockdata/base-config";
import { createBaseConfigItemId } from "@/mockdata/base-config";

export function mapApiBannerToConfig(banner: Banner): BaseConfigBannerItem {
  return {
    id: banner.id ?? createBaseConfigItemId("banner"),
    name: banner.banner_name ?? "",
    imageId: banner.file_id ?? "",
    isActive: banner.status !== "INACTIVE",
    displayTimeSeconds: banner.display_time ?? 5,
    sortOrder: banner.display_order ?? 1,
  };
}

export function mapConfigBannerToApi(
  banner: BaseConfigBannerItem,
): BannerMutate {
  return {
    banner_name: banner.name.trim(),
    file_id: banner.imageId,
    display_order: banner.sortOrder,
    display_time: Math.max(1, banner.displayTimeSeconds || 1),
    status: banner.isActive ? "ACTIVE" : "INACTIVE",
  };
}
