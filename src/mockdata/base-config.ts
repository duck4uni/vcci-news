"use client";

import type { AdminMediaItem } from "@/mockdata/admin-news";
import { readAdminMediaItems } from "@/mockdata/admin-news";

export const BASE_CONFIG_STORAGE_KEY = "vcci-news.admin-base-config.data.v1";

export interface BaseConfigLogoItem {
  id: string;
  name: string;
  imageId: string;
  isActive: boolean;
}

export interface BaseConfigBannerItem {
  id: string;
  name: string;
  imageId: string;
  isActive: boolean;
  displayTimeSeconds: number;
  sortOrder: number;
}

export interface BaseConfigBranchItem {
  id: string;
  branchName: string;
  address: string;
  hotline: string;
  email: string;
  fax: string;
  mapsEmbedUrl: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface BaseConfigSocialItem {
  id: string;
  label: string;
  url: string;
  isVisible: boolean;
  sortOrder: number;
}

export interface BaseConfigData {
  logo: BaseConfigLogoItem | null;
  banners: BaseConfigBannerItem[];
  websiteName: string;
  websiteLink: string;
  socials: BaseConfigSocialItem[];
  branches: BaseConfigBranchItem[];
}

export const EMPTY_BASE_CONFIG_BRANCH: BaseConfigBranchItem = {
  id: "",
  branchName: "",
  address: "",
  hotline: "",
  email: "",
  fax: "",
  mapsEmbedUrl: "",
  sortOrder: 1,
  isVisible: true,
};

export const BASE_CONFIG_SOCIAL_SEED: BaseConfigSocialItem[] = [
  { id: "facebook", label: "Facebook", url: "", isVisible: true, sortOrder: 1 },
  { id: "zalo", label: "Zalo", url: "", isVisible: true, sortOrder: 2 },
  { id: "twitter", label: "Twitter", url: "", isVisible: false, sortOrder: 3 },
  { id: "youtube", label: "Youtube", url: "", isVisible: true, sortOrder: 4 },
  { id: "linkedin", label: "Linkedin", url: "", isVisible: false, sortOrder: 5 },
];

const BASE_CONFIG_SEED: BaseConfigData = {
  logo: {
    id: "base-logo-001",
    name: "Logo chính VCCI News",
    imageId: "media-thumbnail",
    isActive: true,
  },
  websiteName: "VCCI News",
  websiteLink: "https://vccinews.vn",
  socials: [
    {
      id: "facebook",
      label: "Facebook",
      url: "https://facebook.com/vccinews",
      isVisible: true,
      sortOrder: 1,
    },
    {
      id: "zalo",
      label: "Zalo",
      url: "https://zalo.me/vccinews",
      isVisible: true,
      sortOrder: 2,
    },
    {
      id: "twitter",
      label: "Twitter",
      url: "",
      isVisible: false,
      sortOrder: 3,
    },
    {
      id: "youtube",
      label: "Youtube",
      url: "https://youtube.com/@vccinews",
      isVisible: true,
      sortOrder: 4,
    },
    {
      id: "linkedin",
      label: "Linkedin",
      url: "",
      isVisible: false,
      sortOrder: 5,
    },
  ],
  banners: [
    {
      id: "base-banner-001",
      name: "Banner trang chủ 01",
      imageId: "media-banner",
      isActive: true,
      displayTimeSeconds: 5,
      sortOrder: 1,
    },
    {
      id: "base-banner-002",
      name: "Banner hoạt động hội viên",
      imageId: "media-home-01",
      isActive: true,
      displayTimeSeconds: 5,
      sortOrder: 2,
    },
    {
      id: "base-banner-003",
      name: "Banner sự kiện nổi bật",
      imageId: "media-home-02",
      isActive: false,
      displayTimeSeconds: 5,
      sortOrder: 3,
    },
  ],
  branches: [
    {
      id: "base-branch-001",
      branchName: "Trụ sở chính VCCI News",
      address: "171 Võ Thị Sáu, Phường Võ Thị Sáu, Quận 3, TP.HCM",
      hotline: "028 3932 6598",
      email: "info@vccinews.vn",
      fax: "028 3932 5789",
      mapsEmbedUrl: "https://maps.google.com/?q=171+Vo+Thi+Sau+Quan+3+TPHCM",
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: "base-branch-002",
      branchName: "Chi nhánh Hà Nội",
      address: "9 Đào Duy Anh, Phường Phương Mai, Quận Đống Đa, Hà Nội",
      hotline: "024 3577 0632",
      email: "hanoi@vccinews.vn",
      fax: "024 3574 2020",
      mapsEmbedUrl: "https://maps.google.com/?q=9+Dao+Duy+Anh+Dong+Da+Ha+Noi",
      sortOrder: 2,
      isVisible: true,
    },
  ],
};

export function createBaseConfigItemId(prefix: "logo" | "banner" | "branch") {
  return `base-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function cloneBaseConfigData(data: BaseConfigData): BaseConfigData {
  return {
    logo: data.logo ? { ...data.logo } : null,
    banners: data.banners.map((item) => ({ ...item })),
    websiteName: data.websiteName,
    websiteLink: data.websiteLink,
    socials: data.socials.map((item) => ({ ...item })),
    branches: data.branches.map((item) => ({ ...item })),
  };
}

export function readBaseConfig(): BaseConfigData {
  if (typeof window === "undefined") return cloneBaseConfigData(BASE_CONFIG_SEED);

  const raw = window.localStorage.getItem(BASE_CONFIG_STORAGE_KEY);
  if (!raw) return cloneBaseConfigData(BASE_CONFIG_SEED);

  try {
    const parsed = JSON.parse(raw) as BaseConfigData & {
      logos?: BaseConfigLogoItem[];
      contactInfo?: Record<string, string>;
    };
    if (!parsed || typeof parsed !== "object") {
      return cloneBaseConfigData(BASE_CONFIG_SEED);
    }

    const fallbackBranchFromLegacyContact =
      parsed.contactInfo && typeof parsed.contactInfo === "object"
        ? [
            {
              id: createBaseConfigItemId("branch"),
              branchName: parsed.contactInfo.officeName || "Chi nhánh mặc định",
              address: parsed.contactInfo.address || "",
              hotline: parsed.contactInfo.hotline || "",
              email: parsed.contactInfo.email || "",
              fax: parsed.contactInfo.fax || "",
              mapsEmbedUrl: parsed.contactInfo.mapsEmbedUrl || "",
              sortOrder: 1,
              isVisible: true,
            },
          ]
        : BASE_CONFIG_SEED.branches;

    return {
      logo:
        parsed.logo && typeof parsed.logo === "object"
          ? { ...parsed.logo }
          : Array.isArray(parsed.logos) && parsed.logos[0]
            ? { ...parsed.logos[0] }
            : BASE_CONFIG_SEED.logo
              ? { ...BASE_CONFIG_SEED.logo }
              : null,
      banners: Array.isArray(parsed.banners)
        ? parsed.banners.map((item, index) => ({
            ...item,
            sortOrder:
              typeof (item as BaseConfigBannerItem & { sortOrder?: number }).sortOrder === "number"
                ? (item as BaseConfigBannerItem & { sortOrder?: number }).sortOrder ?? index + 1
                : index + 1,
          }))
        : [],
      websiteName:
        typeof (parsed as BaseConfigData & { websiteName?: string }).websiteName === "string"
          ? (parsed as BaseConfigData & { websiteName?: string }).websiteName ?? ""
          : BASE_CONFIG_SEED.websiteName,
      websiteLink:
        typeof (parsed as BaseConfigData & { websiteLink?: string }).websiteLink === "string"
          ? (parsed as BaseConfigData & { websiteLink?: string }).websiteLink ?? ""
          : BASE_CONFIG_SEED.websiteLink,
      socials: Array.isArray((parsed as BaseConfigData & { socials?: BaseConfigSocialItem[] }).socials)
        ? BASE_CONFIG_SOCIAL_SEED.map((seedItem, index) => {
            const matchedItem = (
              (parsed as BaseConfigData & { socials?: BaseConfigSocialItem[] }).socials ?? []
            ).find((item) => item?.id === seedItem.id);

            return {
              ...seedItem,
              ...matchedItem,
              url: typeof matchedItem?.url === "string" ? matchedItem.url : seedItem.url,
              isVisible:
                typeof matchedItem?.isVisible === "boolean"
                  ? matchedItem.isVisible
                  : seedItem.isVisible,
              sortOrder:
                typeof matchedItem?.sortOrder === "number"
                  ? matchedItem.sortOrder
                  : index + 1,
            };
          })
        : BASE_CONFIG_SOCIAL_SEED.map((item) => ({ ...item })),
      branches: Array.isArray(parsed.branches)
        ? parsed.branches.map((item, index) => ({
            ...EMPTY_BASE_CONFIG_BRANCH,
            ...item,
            fax:
              typeof (item as BaseConfigBranchItem & { fax?: string }).fax === "string"
                ? (item as BaseConfigBranchItem & { fax?: string }).fax ?? ""
                : "",
            sortOrder:
              typeof (item as BaseConfigBranchItem & { sortOrder?: number }).sortOrder === "number"
                ? (item as BaseConfigBranchItem & { sortOrder?: number }).sortOrder ?? index + 1
                : index + 1,
            isVisible:
              typeof (item as BaseConfigBranchItem & { isVisible?: boolean }).isVisible === "boolean"
                ? (item as BaseConfigBranchItem & { isVisible?: boolean }).isVisible
                : true,
          }))
        : fallbackBranchFromLegacyContact,
    };
  } catch {
    return cloneBaseConfigData(BASE_CONFIG_SEED);
  }
}

export function persistBaseConfig(data: BaseConfigData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BASE_CONFIG_STORAGE_KEY, JSON.stringify(data));
}

export function getMediaMap(items?: AdminMediaItem[]) {
  const mediaItems = items ?? readAdminMediaItems();
  return new Map(mediaItems.map((item) => [item.id, item]));
}

export function sortBaseConfigBanners(items: BaseConfigBannerItem[]) {
  return [...items].sort((first, second) => {
    if (first.sortOrder !== second.sortOrder) return first.sortOrder - second.sortOrder;
    return first.name.localeCompare(second.name, "vi");
  });
}

export function sortBaseConfigSocials(items: BaseConfigSocialItem[]) {
  return [...items].sort((first, second) => {
    if (first.sortOrder !== second.sortOrder) return first.sortOrder - second.sortOrder;
    return first.label.localeCompare(second.label, "vi");
  });
}

export function sortBaseConfigBranches(items: BaseConfigBranchItem[]) {
  return [...items].sort((first, second) => {
    if (first.sortOrder !== second.sortOrder) return first.sortOrder - second.sortOrder;
    return first.branchName.localeCompare(second.branchName, "vi");
  });
}
