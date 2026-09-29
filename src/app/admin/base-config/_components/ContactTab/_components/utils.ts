import type {
  SiteInformationBranch,
  SiteInformationBranchMutate,
} from "@/api/vcci-news/models";
import type { BaseConfigBranchItem } from "@/mockdata/base-config";
import { createBaseConfigItemId } from "@/mockdata/base-config";

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
