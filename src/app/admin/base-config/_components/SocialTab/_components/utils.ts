import type {
  SiteInformationSocialLink,
  SiteInformationSocialMutate,
} from "@/api/vcci-news/models";
import type { BaseConfigSocialItem } from "@/mockdata/base-config";

export function mapApiSocialToConfig(
  social: SiteInformationSocialLink,
): BaseConfigSocialItem {
  return {
    id: social.id,
    label: social.label,
    url: social.url ?? "",
    isVisible: social.is_active,
    sortOrder: social.sort_order,
  };
}

export function mapConfigSocialToApi(
  social: BaseConfigSocialItem,
): SiteInformationSocialMutate {
  return {
    url: social.url.trim() || null,
    sort_order: social.sortOrder,
    is_active: social.isVisible,
  };
}
