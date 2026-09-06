"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  ImagePlus,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteApiV10SiteInformationBranchesId,
  getApiV10SiteInformation,
  patchApiV10SiteInformationBranchesId,
  patchApiV10SiteInformationSocialsId,
  postApiV10SiteInformationBranches,
  putApiV10SiteInformation,
} from "@/api/vcci-news/endpoints/site-information";
import {
  deleteApiV10LogoId,
  getApiV10Logo,
  getApiV10LogoId,
  postApiV10Logo,
  putApiV10LogoId,
} from "@/api/vcci-news/endpoints/logo";
import {
  deleteApiV10BannerId,
  getApiV10Banner,
  postApiV10Banner,
  putApiV10BannerId,
} from "@/api/vcci-news/endpoints/banner";
import type {
  Banner,
  Logo,
  SiteInformationBranch,
  SiteInformationData,
} from "@/api/vcci-news/models";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import { toAdminMediaItem } from "@/lib/utils/file";
import { getApiV10FileId } from "@/api/vcci-news/endpoints/file";
import {
  type BaseConfigBannerItem,
  type BaseConfigBranchItem,
  type BaseConfigData,
  type BaseConfigLogoItem,
  type BaseConfigSocialItem,
  EMPTY_BASE_CONFIG_BRANCH,
  cloneBaseConfigData,
  createBaseConfigItemId,
  persistBaseConfig,
  readBaseConfig,
  sortBaseConfigBanners,
  sortBaseConfigBranches,
  sortBaseConfigSocials,
} from "@/mockdata/base-config";
import { BranchCard } from "./_components/branch-card";
import { ConfigItemDialog } from "./_components/config-item-dialog";
import { ConfigItemPreview } from "./_components/config-item-preview";
import {
  fieldClassName,
  type ConfigItemForm,
  type ConfigItemMode,
  type LogoListResponse,
  type PageEnvelope,
} from "./_components/types";
import {
  applySiteInformationToConfig,
  emptyItemForm,
  getEnvelopeData,
  mapApiBannerToConfig,
  mapApiBranchToConfig,
  mapApiLogoToConfig,
  mapConfigBannerToApi,
  mapConfigBranchToApi,
  mapConfigSocialToApi,
  resolveMediaItem,
} from "./_components/utils";

export default function AdminBaseConfigPage() {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<BaseConfigData | null>(null);
  const [mediaItems, setMediaItems] = useState<AdminMediaItem[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
  const [currentBranchId, setCurrentBranchId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("branding");
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemDialogMode, setItemDialogMode] =
    useState<ConfigItemMode>("logo");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemForm, setItemForm] =
    useState<ConfigItemForm>(emptyItemForm());
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [savingWebsiteInfo, setSavingWebsiteInfo] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [savingSocials, setSavingSocials] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    mode: ConfigItemMode;
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    const baseConfig = readBaseConfig();
    setConfig(baseConfig);

    const loadSiteInformation = async () => {
      try {
        const [siteInformationResponse, logoResponse] = await Promise.all([
          getApiV10SiteInformation(),
          getApiV10Logo({
            page: 1,
            pageSize: 1,
            sortField: "updated_at",
            sortOrder: "desc",
          }),
        ]);

        const siteInformation = getEnvelopeData<SiteInformationData>(
          siteInformationResponse,
        );
        const logoPage = getEnvelopeData<LogoListResponse>(logoResponse);
        const currentLogo = logoPage?.rows?.[0] ?? null;

        if (!mounted) return;

        if (currentLogo) {
          const logoConfig = mapApiLogoToConfig(currentLogo);
          if (logoConfig?.media) {
            const logoMedia = logoConfig.media;
            setMediaItems((previous) => {
              const nextMap = new Map(
                previous.map((entry) => [entry.id, entry]),
              );
              nextMap.set(logoMedia.id, logoMedia);
              return Array.from(nextMap.values());
            });
          }
        }

        if (siteInformation) {
          setConfig((previous) =>
            applySiteInformationToConfig(
              previous ?? baseConfig,
              siteInformation,
              currentLogo,
            ),
          );
          return;
        }

        if (currentLogo) {
          const logoConfig = mapApiLogoToConfig(currentLogo);
          setConfig((previous) =>
            previous
              ? {
                ...previous,
                logo: logoConfig?.logo ?? previous.logo,
              }
              : {
                ...baseConfig,
                logo: logoConfig?.logo ?? baseConfig.logo,
              },
          );
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          toast.error("Không thể tải thông tin liên hệ website");
        }
      }
    };

    void loadSiteInformation();

    const loadBanners = async () => {
      try {
        const response = await getApiV10Banner({
          page: 1,
          pageSize: 100,
          sortField: "display_order",
          sortOrder: "asc",
        });
        const pageData = getEnvelopeData<PageEnvelope<Banner>>(response);
        const bannerRows = pageData?.rows ?? [];

        const mediaRows = await Promise.all(
          bannerRows
            .map((banner) => banner.file_id)
            .filter((fileId): fileId is string => Boolean(fileId))
            .map(async (fileId) => {
              const response = await getApiV10FileId(fileId).catch(() => null);
              const file = response?.responseData ?? null;
              return file ? toAdminMediaItem(file) : null;
            }),
        );

        if (!mounted) return;

        const nextBanners = bannerRows.map(mapApiBannerToConfig);
        setMediaItems((previous) => {
          const nextMap = new Map(previous.map((entry) => [entry.id, entry]));
          mediaRows.forEach((item) => {
            if (item) nextMap.set(item.id, item);
          });
          return Array.from(nextMap.values());
        });
        setConfig((previous) =>
          previous
            ? {
              ...previous,
              banners: nextBanners,
            }
            : previous,
        );
        setCurrentBannerIndex(0);
      } catch (error) {
        console.error(error);
        if (mounted) {
          toast.error("Không thể tải danh sách banner");
        }
      }
    };

    void loadBanners();

    return () => {
      mounted = false;
    };
  }, []);

  const mediaMap = useMemo(
    () => new Map(mediaItems.map((item) => [item.id, item])),
    [mediaItems],
  );
  const sortedBanners = useMemo(
    () => (config ? sortBaseConfigBanners(config.banners) : []),
    [config],
  );
  const sortedSocials = useMemo(
    () => (config ? sortBaseConfigSocials(config.socials) : []),
    [config],
  );
  const sortedBranches = useMemo(
    () => (config ? sortBaseConfigBranches(config.branches) : []),
    [config],
  );

  const currentLogo = config?.logo ?? null;
  const currentBanner = sortedBanners[currentBannerIndex] ?? null;
  const currentBranch =
    (currentBranchId
      ? sortedBranches.find((branch) => branch.id === currentBranchId)
      : null) ??
    sortedBranches[currentBranchIndex] ??
    null;
  const currentLogoMedia = currentLogo
    ? resolveMediaItem(mediaMap, currentLogo.imageId)
    : null;
  const currentBannerMedia = currentBanner
    ? resolveMediaItem(mediaMap, currentBanner.imageId)
    : null;
  const previewMedia = resolveMediaItem(mediaMap, itemForm.imageId);

  const saveConfig = useCallback((nextConfig: BaseConfigData) => {
    setConfig(nextConfig);
    persistBaseConfig(nextConfig);
  }, []);

  const openCreateDialog = (mode: ConfigItemMode) => {
    setItemDialogMode(mode);
    setEditingItemId(null);
    setItemForm({
      ...emptyItemForm(),
      sortOrder:
        mode === "banner" ? (config ? config.banners.length + 1 : 1) : 1,
    });
    setItemDialogOpen(true);
  };

  const openEditDialog = (
    mode: ConfigItemMode,
    item: BaseConfigLogoItem | BaseConfigBannerItem,
  ) => {
    setItemDialogMode(mode);
    setEditingItemId(item.id);
    setItemForm({
      name: item.name,
      imageId: item.imageId,
      isActive: item.isActive,
      displayTimeSeconds:
        "displayTimeSeconds" in item ? item.displayTimeSeconds : 5,
      sortOrder: "sortOrder" in item ? item.sortOrder : 1,
    });
    setItemDialogOpen(true);
  };

  const handleSubmitItem = async () => {
    if (!config) return;

    const trimmedName = itemForm.name.trim();
    if (!trimmedName) {
      toast.error("Vui lòng nhập tên hiển thị");
      return;
    }

    if (!itemForm.imageId) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    setSavingItem(true);

    if (itemDialogMode === "logo") {
      const selectedMedia = resolveMediaItem(mediaMap, itemForm.imageId);
      const currentLogoId = editingItemId || currentLogo?.id || null;

      try {
        let apiLogoId: string | null = null;

        // If we have a currentLogoId, resolve it to actual UUID
        if (currentLogoId) {
          try {
            const logoResponse = await getApiV10LogoId(currentLogoId);
            const existingLogo = getEnvelopeData<Logo>(logoResponse);
            // Only use if it's a valid UUID (32+ chars with hyphens)
            if (existingLogo?.id && existingLogo.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
              apiLogoId = existingLogo.id;
            }
          } catch {
            // currentLogoId is not a valid UUID or fetch failed, treat as create new
            apiLogoId = null;
          }
        }

        const response = apiLogoId
          ? await putApiV10LogoId(apiLogoId, {
            logo_name: trimmedName,
            logo_url: selectedMedia?.url ?? null,
            file_id: itemForm.imageId,
          })
          : await postApiV10Logo({
            logo_name: trimmedName,
            logo_url: selectedMedia?.url ?? null,
            file_id: itemForm.imageId,
          });
        const savedLogo =
          getEnvelopeData<Logo>(response);
        const nextConfig = cloneBaseConfigData(config);

        nextConfig.logo = {
          id: savedLogo?.id ?? apiLogoId ?? createBaseConfigItemId("logo"),
          name: savedLogo?.logo_name ?? trimmedName,
          imageId: savedLogo?.file_id ?? itemForm.imageId,
          isActive: true,
        };

        saveConfig(nextConfig);
        setSavingItem(false);
        setItemDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["/logo"] });
        toast.success("Đã lưu cấu hình logo");
      } catch (error) {
        console.error(error);
        setSavingItem(false);
        toast.error("Không thể lưu cấu hình logo");
      }
      return;
    }

    const bannerDraft: BaseConfigBannerItem = {
      id: editingItemId || createBaseConfigItemId("banner"),
      name: trimmedName,
      imageId: itemForm.imageId,
      isActive: itemForm.isActive,
      displayTimeSeconds: itemForm.displayTimeSeconds,
      sortOrder: itemForm.sortOrder,
    };

    try {
      const response = editingItemId
        ? await putApiV10BannerId(editingItemId, mapConfigBannerToApi(bannerDraft))
        : await postApiV10Banner(mapConfigBannerToApi(bannerDraft));
      const savedBanner = getEnvelopeData<Banner>(response);
      const nextBanner = savedBanner
        ? mapApiBannerToConfig(savedBanner)
        : bannerDraft;
      const nextConfig = cloneBaseConfigData(config);

      if (editingItemId) {
        nextConfig.banners = nextConfig.banners.map((item) =>
          item.id === editingItemId ? nextBanner : item,
        );
      } else {
        nextConfig.banners.push(nextBanner);
        setCurrentBannerIndex(Math.max(nextConfig.banners.length - 1, 0));
      }

      setConfig(nextConfig);
      setSavingItem(false);
      setItemDialogOpen(false);
      toast.success("Đã lưu cấu hình banner");
    } catch (error) {
      console.error(error);
      setSavingItem(false);
      toast.error("Không thể lưu cấu hình banner");
    }
    return;

    const nextConfig = cloneBaseConfigData(config!);

    if (editingItemId) {
      nextConfig.banners = nextConfig.banners.map((item) =>
        item.id === editingItemId
          ? {
            ...item,
            name: trimmedName,
            imageId: itemForm.imageId,
            isActive: itemForm.isActive,
            displayTimeSeconds: itemForm.displayTimeSeconds,
            sortOrder: itemForm.sortOrder,
          }
          : item,
      );
    } else {
      nextConfig.banners.push({
        id: createBaseConfigItemId("banner"),
        name: trimmedName,
        imageId: itemForm.imageId,
        isActive: itemForm.isActive,
        displayTimeSeconds: itemForm.displayTimeSeconds,
        sortOrder: itemForm.sortOrder,
      });
      setCurrentBannerIndex(Math.max(nextConfig.banners.length - 1, 0));
    }

    saveConfig(nextConfig);
    setSavingItem(false);
    setItemDialogOpen(false);
    toast.success(false ? "Đã lưu cấu hình logo" : "Đã lưu cấu hình banner");
  };

  const handleDeleteItem = async () => {
    if (!config || !deleteTarget) return;

    try {
      const nextConfig = cloneBaseConfigData(config);

      if (deleteTarget.mode === "logo") {
        try {
          await deleteApiV10LogoId(deleteTarget.id);
          nextConfig.logo = null;
          queryClient.invalidateQueries({ queryKey: ["/logo"] });
        } catch (error) {
          console.error(error);
          toast.error("Không thể xóa cấu hình logo");
          setDeleteTarget(null);
          return;
        }
      } else {
        await deleteApiV10BannerId(deleteTarget.id);
        nextConfig.banners = nextConfig.banners.filter(
          (item) => item.id !== deleteTarget.id,
        );
        setCurrentBannerIndex((previous) =>
          Math.max(0, Math.min(previous, nextConfig.banners.length - 1)),
        );
      }

      saveConfig(nextConfig);
      toast.success("Đã xóa cấu hình");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không thể xóa cấu hình",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleBranchChange = <K extends keyof BaseConfigBranchItem>(
    key: K,
    value: BaseConfigBranchItem[K],
  ) => {
    if (!config || !currentBranch) return;

    setConfig((previous) =>
      previous
        ? {
          ...previous,
          branches: previous.branches.map((branch) =>
            branch.id === currentBranch.id
              ? { ...branch, [key]: value }
              : branch,
          ),
        }
        : previous,
    );
  };

  const handleAddBranch = () => {
    if (!config) return;

    const nextBranch: BaseConfigBranchItem = {
      ...EMPTY_BASE_CONFIG_BRANCH,
      id: createBaseConfigItemId("branch"),
      branchName: `Chi nhánh ${config.branches.length + 1}`,
    };

    const nextConfig = cloneBaseConfigData(config);
    nextConfig.branches.push(nextBranch);
    saveConfig(nextConfig);
    setCurrentBranchIndex(nextConfig.branches.length - 1);
    toast.success("Đã thêm chi nhánh mới");
  };

  const handleDeleteBranch = (branchId: string) => {
    if (!config) return;

    const nextConfig = cloneBaseConfigData(config);
    nextConfig.branches = nextConfig.branches.filter(
      (branch) => branch.id !== branchId,
    );
    saveConfig(nextConfig);
    setCurrentBranchIndex((previous) =>
      Math.max(
        0,
        Math.min(previous, Math.max(nextConfig.branches.length - 1, 0)),
      ),
    );
    toast.success("Đã xóa chi nhánh");
  };

  const handleSaveBranches = () => {
    if (!config) return;
    setSavingContact(true);
    persistBaseConfig(config);
    setSavingContact(false);
    toast.success("Đã lưu danh sách chi nhánh liên hệ");
  };

  const handleAddBranchApi = async () => {
    if (!config) return;

    setSavingContact(true);

    try {
      const response = await postApiV10SiteInformationBranches({
        branch_name: `Chi nhánh ${config.branches.length + 1}`,
        sort_order: config.branches.length + 1,
        is_active: true,
      });
      const createdBranch = getEnvelopeData<SiteInformationBranch>(response);
      const nextBranch = createdBranch
        ? mapApiBranchToConfig(createdBranch)
        : {
          id: createBaseConfigItemId("branch"),
          branchName: `Chi nhánh ${config.branches.length + 1}`,
          address: "",
          hotline: "",
          email: "",
          fax: "",
          mapsEmbedUrl: "",
          sortOrder: config.branches.length + 1,
          isVisible: true,
        };

      const nextConfig = cloneBaseConfigData(config);
      nextConfig.branches.push(nextBranch);
      setConfig(nextConfig);
      setCurrentBranchIndex(nextConfig.branches.length - 1);
      setCurrentBranchId(nextBranch.id);
      toast.success("Đã thêm chi nhánh mới");
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm chi nhánh");
    } finally {
      setSavingContact(false);
    }
  };

  const handleDeleteBranchApi = async (branchId: string) => {
    if (!config) return;

    setSavingContact(true);

    try {
      await deleteApiV10SiteInformationBranchesId(branchId);

      const nextConfig = cloneBaseConfigData(config);
      nextConfig.branches = nextConfig.branches.filter(
        (branch) => branch.id !== branchId,
      );
      setConfig(nextConfig);
      setCurrentBranchIndex((previous) =>
        Math.max(
          0,
          Math.min(previous, Math.max(nextConfig.branches.length - 1, 0)),
        ),
      );
      setCurrentBranchId(null);
      toast.success("Đã xóa chi nhánh");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa chi nhánh");
    } finally {
      setSavingContact(false);
    }
  };

  const handleSaveBranchesApi = async () => {
    if (!config) return;
    setSavingContact(true);

    try {
      await Promise.all(
        sortBaseConfigBranches(config.branches).map((branch, index) =>
          patchApiV10SiteInformationBranchesId(
            branch.id,
            mapConfigBranchToApi(branch, index),
          ),
        ),
      );
      setConfig(config);
      toast.success("Đã lưu danh sách chi nhánh liên hệ");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu danh sách chi nhánh");
    } finally {
      setSavingContact(false);
    }
  };

  const handleWebsiteInfoChange = (
    key: "websiteName" | "websiteLink",
    value: string,
  ) => {
    setConfig((previous) =>
      previous ? { ...previous, [key]: value } : previous,
    );
  };

  const handleSaveWebsiteInfo = async () => {
    if (!config) return;
    setSavingWebsiteInfo(true);

    try {
      const response = await putApiV10SiteInformation({
        website_name: config.websiteName.trim() || null,
        website_link: config.websiteLink.trim() || null,
      });
      const siteInformation = getEnvelopeData<SiteInformationData>(response);

      if (siteInformation) {
        setConfig((previous) =>
          applySiteInformationToConfig(previous ?? config, siteInformation),
        );
      } else {
        setConfig(config);
      }

      toast.success("Đã lưu thông tin website");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu thông tin website");
    } finally {
      setSavingWebsiteInfo(false);
    }
  };

  const handleSocialChange = <K extends keyof BaseConfigSocialItem>(
    socialId: string,
    key: K,
    value: BaseConfigSocialItem[K],
  ) => {
    setConfig((previous) =>
      previous
        ? {
          ...previous,
          socials: previous.socials.map((item) =>
            item.id === socialId ? { ...item, [key]: value } : item,
          ),
        }
        : previous,
    );
  };

  const handleSaveSocials = () => {
    if (!config) return;
    saveConfig(config);
    toast.success("Đã lưu cấu hình mạng xã hội");
  };

  const handleSaveSocialsApi = async () => {
    if (!config) return;
    setSavingSocials(true);

    try {
      await Promise.all(
        config.socials.map((social) =>
          patchApiV10SiteInformationSocialsId(
            social.id,
            mapConfigSocialToApi(social),
          ),
        ),
      );
      setConfig(config);
      toast.success("Đã lưu cấu hình mạng xã hội");
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu cấu hình mạng xã hội");
    } finally {
      setSavingSocials(false);
    }
  };

  if (!config) {
    return (
      <div className="rounded-3xl border border-[#063e8e]/10 bg-white p-10 text-center text-gray-500">
        Đang tải cấu hình chung...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-5"
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto min-w-max rounded-2xl bg-[#eaf2ff] p-1.5">
            <TabsTrigger
              value="branding"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Nhận diện thương hiệu
            </TabsTrigger>
            <TabsTrigger
              value="banner"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Banner trang chủ
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Thông tin liên hệ
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#063e8e] data-[state=active]:bg-white data-[state=active]:text-[#063e8e]"
            >
              Mạng xã hội
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="branding" className="mt-0">
          <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
            <CardHeader className="pb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#163b73]">
                    Nhận diện thương hiệu
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý logo hiển thị trên website.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {currentLogo ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openEditDialog("logo", currentLogo)}
                        className="rounded-xl border-[#063e8e]/15 text-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Cập nhật logo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setDeleteTarget({
                            mode: "logo",
                            id: currentLogo.id,
                            name: currentLogo.name,
                          })
                        }
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => openCreateDialog("logo")}
                      className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Thiết lập logo
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-4 sm:px-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_360px]">
                <div className="rounded-[28px] border border-[#063e8e]/10 bg-gradient-to-br from-[#f8fbff] to-white p-4 sm:p-5">
                  <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-[#063e8e]/18 bg-[#eef4ff]">
                    {currentLogoMedia ? (
                      <div className="relative h-[220px] w-[220px]">
                        <SafeNextImage
                          src={currentLogoMedia.url}
                          alt={currentLogoMedia.alt || currentLogoMedia.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <ImagePlus className="mx-auto mb-3 h-10 w-10 text-[#4b74b8]" />
                        Chưa có logo nào được cấu hình
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-4 sm:p-5">
                  {currentLogo ? (
                    <div className="space-y-4 rounded-3xl border border-[#063e8e]/12 bg-white p-5 text-sm text-slate-600 shadow-sm">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b74b8]">
                          Logo website
                        </div>
                        <div className="mt-3 font-semibold text-[#163b73]">
                          {currentLogo.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Tên website</Label>
                        <Input
                          value={config.websiteName}
                          onChange={(event) =>
                            handleWebsiteInfoChange(
                              "websiteName",
                              event.target.value,
                            )
                          }
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Link website</Label>
                        <Input
                          value={config.websiteLink}
                          onChange={(event) =>
                            handleWebsiteInfoChange(
                              "websiteLink",
                              event.target.value,
                            )
                          }
                          className={fieldClassName}
                        />
                      </div>
                      <div className="hidden rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                          Trạng thái
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-[#063e8e]/20 text-[#063e8e]"
                          >
                            {currentLogo.isActive ? "Đang hiển thị" : "Đang ẩn"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleSaveWebsiteInfo}
                        disabled={savingWebsiteInfo}
                        className="w-full rounded-xl bg-[#163b73] text-white hover:bg-[#163b73]/90"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {savingWebsiteInfo
                          ? "Đang lưu..."
                          : "Lưu thông tin website"}
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-[#063e8e]/15 bg-white px-5 py-8 text-center text-sm text-gray-500">
                      Chưa có logo nào, hãy thiết lập logo cho website.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banner" className="mt-0">
          <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
            <CardHeader className="pb-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#163b73]">
                    Banner trang chủ
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý hình ảnh slider chỉ dùng cho khu vực banner trang
                    chủ của website.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => openCreateDialog("banner")}
                    className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm banner
                  </Button>
                  {currentBanner ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => openEditDialog("banner", currentBanner)}
                        className="rounded-xl border-[#063e8e]/15 text-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Sửa
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setDeleteTarget({
                            mode: "banner",
                            id: currentBanner.id,
                            name: currentBanner.name,
                          })
                        }
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-4 sm:px-6">
              <div className="rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-4 sm:p-5">
                <div className="relative aspect-[16/6] overflow-hidden rounded-[24px] border border-[#063e8e]/12 bg-[#eef4ff]">
                  {currentBannerMedia ? (
                    <SafeNextImage
                      src={currentBannerMedia.url}
                      alt={currentBannerMedia.alt || currentBannerMedia.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500">
                      Chưa có banner được chọn
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[#4b74b8]">
                  Danh sách banner trang chủ
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-[#063e8e]/15"
                    onClick={() =>
                      setCurrentBannerIndex((previous) =>
                        previous <= 0
                          ? Math.max(sortedBanners.length - 1, 0)
                          : previous - 1,
                      )
                    }
                    disabled={sortedBanners.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-[#063e8e]/15"
                    onClick={() =>
                      setCurrentBannerIndex((previous) =>
                        sortedBanners.length === 0
                          ? 0
                          : (previous + 1) % sortedBanners.length,
                      )
                    }
                    disabled={sortedBanners.length <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedBanners.map((item, index) => (
                  <ConfigItemPreview
                    key={item.id}
                    title={`Banner ${index + 1}`}
                    item={item}
                    media={resolveMediaItem(mediaMap, item.imageId)}
                    current={index === currentBannerIndex}
                    onSelect={() => setCurrentBannerIndex(index)}
                  />
                ))}
              </div>

              {currentBanner ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                      Tên banner
                    </div>
                    <div className="mt-2 font-semibold text-[#163b73]">
                      {currentBanner.name}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                      Thứ tự hiển thị
                    </div>
                    <div className="mt-2 font-semibold text-[#163b73]">
                      {currentBanner.sortOrder}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                      Thời gian hiển thị
                    </div>
                    <div className="mt-2 font-semibold text-[#163b73]">
                      {currentBanner.displayTimeSeconds} giây
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                      Trạng thái
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className="border-[#063e8e]/20 text-[#063e8e]"
                      >
                        {currentBanner.isActive ? "Đang hiển thị" : "Đang ẩn"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-0">
          <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#163b73]">
                    Thông tin liên hệ website
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý nhiều địa chỉ chi nhánh để hiển thị trên website.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleAddBranchApi}
                    className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm chi nhánh
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveBranchesApi}
                    disabled={savingContact}
                    className="rounded-xl bg-[#163b73] text-white hover:bg-[#163b73]/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {savingContact ? "Đang lưu..." : "Lưu danh sách chi nhánh"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-6 px-4 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)]">
              <div className="space-y-4 rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-4 sm:p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.15em] text-[#4b74b8]">
                  Danh sách chi nhánh
                </div>
                <div className="space-y-3">
                  {sortedBranches.map((branch, index) => (
                    <BranchCard
                      key={branch.id}
                      branch={branch}
                      current={currentBranch?.id === branch.id}
                      onSelect={() => {
                        setCurrentBranchIndex(index);
                        setCurrentBranchId(branch.id);
                      }}
                      onDelete={() => handleDeleteBranchApi(branch.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-5 rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-4 sm:p-5">
                {currentBranch ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Tên chi nhánh</Label>
                      <Input
                        value={currentBranch.branchName}
                        onChange={(event) =>
                          handleBranchChange("branchName", event.target.value)
                        }
                        className={fieldClassName}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Địa chỉ</Label>
                      <Textarea
                        value={currentBranch.address}
                        onChange={(event) =>
                          handleBranchChange("address", event.target.value)
                        }
                        className={`${fieldClassName} min-h-[110px]`}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Hotline</Label>
                        <Input
                          value={currentBranch.hotline}
                          onChange={(event) =>
                            handleBranchChange("hotline", event.target.value)
                          }
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Email</Label>
                        <Input
                          value={currentBranch.email}
                          onChange={(event) =>
                            handleBranchChange("email", event.target.value)
                          }
                          className={fieldClassName}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Hotline 2</Label>
                        <Input
                          value={currentBranch.fax}
                          onChange={(event) =>
                            handleBranchChange("fax", event.target.value)
                          }
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Google Maps</Label>
                        <Input
                          value={currentBranch.mapsEmbedUrl}
                          onChange={(event) =>
                            handleBranchChange(
                              "mapsEmbedUrl",
                              event.target.value,
                            )
                          }
                          className={fieldClassName}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Thứ tự hiển thị</Label>
                        <Input
                          type="number"
                          min={1}
                          value={currentBranch.sortOrder}
                          onChange={(event) =>
                            handleBranchChange(
                              "sortOrder",
                              Number(event.target.value || 1),
                            )
                          }
                          className={fieldClassName}
                        />
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-[#163b73]">
                            Trạng thái hiển thị
                          </div>
                          <div className="text-xs text-gray-500">
                            {currentBranch.isVisible
                              ? "Đang hiển thị"
                              : "Đang ẩn"}
                          </div>
                        </div>
                        <Switch
                          checked={currentBranch.isVisible}
                          onCheckedChange={(value) =>
                            handleBranchChange("isVisible", value)
                          }
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#063e8e]/15 bg-white px-5 py-10 text-center text-sm text-gray-500">
                    Chưa có chi nhánh nào. Hãy thêm chi nhánh để bắt đầu cấu
                    hình
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-0">
          <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-2xl text-[#163b73]">
                    Mạng xã hội
                  </CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý link mạng xã hội và thứ tự hiển thị trên website.
                  </CardDescription>
                </div>

                <Button
                  type="button"
                  onClick={handleSaveSocialsApi}
                  disabled={savingSocials}
                  className="rounded-xl bg-[#163b73] text-white hover:bg-[#163b73]/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Lưu cấu hình
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 px-4 sm:px-6">
              {sortedSocials.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-4 sm:p-5"
                >
                  <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)_180px] lg:items-end">
                    <div className="flex items-center gap-3 rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-4">
                      <Checkbox
                        checked={item.isVisible}
                        onCheckedChange={(checked) =>
                          handleSocialChange(
                            item.id,
                            "isVisible",
                            checked === true,
                          )
                        }
                      />
                      <div>
                        <div className="font-semibold text-[#163b73]">
                          {item.label}
                        </div>
                        <div className="text-sm text-slate-500">
                          {item.isVisible ? "Đang hiển thị" : "Đang ẩn"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Link URL</Label>
                      <Input
                        value={item.url}
                        onChange={(event) =>
                          handleSocialChange(item.id, "url", event.target.value)
                        }
                        placeholder={`Nhập link ${item.label}...`}
                        className={fieldClassName}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Thứ tự hiển thị</Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.sortOrder}
                        onChange={(event) =>
                          handleSocialChange(
                            item.id,
                            "sortOrder",
                            Number(event.target.value || 1),
                          )
                        }
                        className={fieldClassName}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfigItemDialog
        open={itemDialogOpen}
        mode={itemDialogMode}
        form={itemForm}
        previewMedia={previewMedia}
        saving={savingItem}
        title={
          editingItemId
            ? itemDialogMode === "logo"
              ? "Cập nhật logo"
              : "Chỉnh sửa banner"
            : itemDialogMode === "logo"
              ? "Thiết lập logo"
              : "Thêm banner mới"
        }
        description={
          itemDialogMode === "logo"
            ? "Thiết lập logo hiển thị cho website."
            : "Thiết lập banner hiển thị cho trang chủ."
        }
        onOpenChange={setItemDialogOpen}
        onChange={(key, value) =>
          setItemForm((previous) => ({ ...previous, [key]: value }))
        }
        onPickImage={() => setImagePickerOpen(true)}
        onSubmit={handleSubmitItem}
      />

      <AdminImagePicker
        open={imagePickerOpen}
        selectedId={itemForm.imageId}
        onOpenChange={setImagePickerOpen}
        onSelect={(item) => {
          setMediaItems((previous) => {
            const nextMap = new Map(previous.map((entry) => [entry.id, entry]));
            nextMap.set(item.id, item);
            return Array.from(nextMap.values());
          });
          setItemForm((previous) => ({ ...previous, imageId: item.id }));
        }}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa cấu hình"
        description={
          <>
            Bạn có chắc muốn xóa{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>? Hành
            động này không thể hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
}
