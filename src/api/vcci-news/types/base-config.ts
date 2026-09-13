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
