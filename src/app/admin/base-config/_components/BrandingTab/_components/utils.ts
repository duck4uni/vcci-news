import type { Logo } from "@/api/vcci-news/models";
import type { BaseConfigLogoItem } from "@/mockdata/base-config";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import type { LogoMediaItem } from "../../types";
import links from "@/links";

export function mapApiLogoToConfig(logo: Logo): {
  logo: BaseConfigLogoItem;
  media: LogoMediaItem;
} {
  const media: LogoMediaItem = {
    id: logo.file_id,
    logoId: logo.id,
    name: logo.logo_name,
    alt: logo.logo_name,
    url: links.resolveImageUrl(logo.logo_url) || "/img-error.png",
    mime: "image/*",
    size: 0,
    created_at: logo.created_at,
    updated_at: logo.updated_at,
    source: "upload",
  };
  return {
    logo: {
      id: logo.id,
      name: logo.logo_name,
      imageId: logo.file_id,
      isActive: true,
    },
    media,
  };
}

export function toLogoMediaItem(logo: Logo): AdminMediaItem {
  return mapApiLogoToConfig(logo).media;
}
