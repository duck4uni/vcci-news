import type {
  Banner,
  BannerMutate,
  Logo,
  SiteInformationBranch,
  SiteInformationBranchMutate,
  SiteInformationData,
  SiteInformationSocialLink,
  SiteInformationSocialMutate,
} from "@/api/vcci-news/models";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import links from "@/links";
import {
  type BaseConfigBannerItem,
  type BaseConfigBranchItem,
  type BaseConfigData,
  type BaseConfigLogoItem,
  type BaseConfigSocialItem,
  createBaseConfigItemId,
} from "@/mockdata/base-config";
import type {
  ApiEnvelope,
  ConfigItemForm,
  LogoMediaItem,
} from "./types";

export function emptyItemForm(): ConfigItemForm {
  return {
    name: "",
    imageId: "",
    isActive: true,
    displayTimeSeconds: 5,
    sortOrder: 1,
  };
}

export function resolveMediaItem(
  mediaMap: Map<string, AdminMediaItem>,
  imageId: string,
) {
  return mediaMap.get(imageId) ?? null;
}

export function getEnvelopeData<T>(payload: unknown): T | undefined {
  const root = payload as ApiEnvelope<T>;
  return root.responseData ?? root.data?.responseData;
}

export function mapApiBranchToConfig(
  branch: SiteInformationBranch,
): BaseConfigBranchItem {
  return {
    id: branch.id ?? createBaseConfigItemId("branch"),
    branchName: branch.branch_name ?? "",
    address: branch.address ?? "",
    hotline: branch.hotline ?? branch.telephone ?? "",
    email: branch.email ?? "",
    fax: branch.fax ?? "",
    mapsEmbedUrl: branch.googlemap_link ?? "",
    sortOrder: branch.sort_order ?? 1,
    isVisible: branch.is_active ?? true,
  };
}

export function mapConfigBranchToApi(
  branch: BaseConfigBranchItem,
  index: number,
): SiteInformationBranchMutate {
  return {
    branch_name: branch.branchName.trim() || null,
    address: branch.address.trim() || null,
    hotline: branch.hotline.trim() || null,
    email: branch.email.trim() || null,
    fax: branch.fax.trim() || null,
    googlemap_link: branch.mapsEmbedUrl.trim() || null,
    sort_order: Number.isFinite(branch.sortOrder)
      ? branch.sortOrder
      : index + 1,
    is_active: branch.isVisible,
  };
}

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

export function mapConfigBannerToApi(banner: BaseConfigBannerItem): BannerMutate {
  return {
    banner_name: banner.name.trim(),
    file_id: banner.imageId,
    display_order: banner.sortOrder,
    display_time: Math.max(1, banner.displayTimeSeconds || 1),
    status: banner.isActive ? "ACTIVE" : "INACTIVE",
  };
}

export function mapApiLogoToConfig(logo: Logo): {
  logo: BaseConfigLogoItem | null;
  media: LogoMediaItem | null;
} | null {
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

export function applySiteInformationToConfig(
  baseConfig: BaseConfigData,
  siteInformation: SiteInformationData,
  logo?: Logo | null,
): BaseConfigData {
  const logoConfig = logo ? mapApiLogoToConfig(logo) : null;

  return {
    ...baseConfig,
    logo: logoConfig?.logo ?? baseConfig.logo,
    websiteName: siteInformation.website_name ?? baseConfig.websiteName,
    websiteLink: siteInformation.website_link ?? baseConfig.websiteLink,
    branches: Array.isArray(siteInformation.branches)
      ? siteInformation.branches.map(mapApiBranchToConfig)
      : baseConfig.branches,
    socials: Array.isArray(siteInformation.socials)
      ? siteInformation.socials.map(mapApiSocialToConfig)
      : baseConfig.socials,
  };
}
