"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Globe,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { AdminMediaItem } from "@/mockdata/admin-news";
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
  sortBaseConfigSocials,
} from "@/mockdata/base-config";

const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

type ConfigItemMode = "logo" | "banner";
type ConfigItemForm = {
  name: string;
  imageId: string;
  isActive: boolean;
  displayTimeSeconds: number;
  sortOrder: number;
};

function emptyItemForm(): ConfigItemForm {
  return {
    name: "",
    imageId: "",
    isActive: true,
    displayTimeSeconds: 5,
    sortOrder: 1,
  };
}

function resolveMediaItem(mediaMap: Map<string, AdminMediaItem>, imageId: string) {
  return mediaMap.get(imageId) ?? null;
}

function ConfigItemPreview({
  title,
  item,
  media,
  current,
  onSelect,
}: {
  title: string;
  item: BaseConfigBannerItem;
  media: AdminMediaItem | null;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-3xl border text-left transition-all ${
        current
          ? "border-[#063e8e]/35 bg-[#edf4ff] shadow-[0_10px_24px_rgba(6,62,142,0.12)]"
          : "border-[#063e8e]/10 bg-white hover:border-[#063e8e]/25 hover:shadow-sm"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef4ff]">
        {media ? (
          <SafeNextImage src={media.url} alt={media.alt || media.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Chưa chọn hình ảnh
          </div>
        )}
      </div>
      <div className="space-y-2 px-4 py-3">
        <div className="line-clamp-1 text-sm font-semibold text-[#163b73]">{title}</div>
        <div className="line-clamp-2 text-sm text-gray-600">{item.name}</div>
      </div>
    </button>
  );
}

function ConfigItemDialog({
  open,
  mode,
  form,
  previewMedia,
  saving,
  title,
  description,
  onOpenChange,
  onChange,
  onPickImage,
  onSubmit,
}: {
  open: boolean;
  mode: ConfigItemMode;
  form: ConfigItemForm;
  previewMedia: AdminMediaItem | null;
  saving: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onChange: <K extends keyof ConfigItemForm>(key: K, value: ConfigItemForm[K]) => void;
  onPickImage: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] max-w-xl flex-col overflow-hidden rounded-3xl border-[#063e8e]/15 bg-white p-0">
        <DialogHeader>
          <div className="border-b border-[#063e8e]/10 px-6 py-5">
            <DialogTitle className="text-xl text-[#063e8e]">{title}</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600">{description}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-700">Tên hiển thị</Label>
              <Input
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder={mode === "logo" ? "Nhập tên logo..." : "Nhập tên banner..."}
                className={fieldClassName}
              />
            </div>

            {mode === "banner" ? (
              <div className="space-y-2">
                <Label className="text-gray-700">Thời gian hiển thị (giây)</Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.displayTimeSeconds}
                  onChange={(event) =>
                    onChange("displayTimeSeconds", Number(event.target.value || 1))
                  }
                  className={fieldClassName}
                />
              </div>
            ) : null}

            {mode === "banner" ? (
              <div className="space-y-2">
                <Label className="text-gray-700">Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.sortOrder}
                  onChange={(event) => onChange("sortOrder", Number(event.target.value || 1))}
                  className={fieldClassName}
                />
              </div>
            ) : null}

            <div className="space-y-3">
              <Label className="text-gray-700">Hình ảnh</Label>
              <div className="overflow-hidden rounded-3xl border border-dashed border-[#063e8e]/20 bg-[#eef4ff]/60">
                <div className="relative aspect-[16/9]">
                  {previewMedia ? (
                    <SafeNextImage
                      src={previewMedia.url}
                      alt={previewMedia.alt || previewMedia.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Chưa chọn hình ảnh
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onPickImage}
                className="rounded-xl border-[#063e8e]/15 text-gray-700 hover:bg-[#edf4ff]"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Chọn từ thư viện
              </Button>
            </div>

            {mode === "banner" ? (
              <div className="flex items-center justify-between rounded-2xl border border-[#063e8e]/10 bg-[#f7faff] px-4 py-3">
              <div>
                <div className="text-sm font-medium text-[#163b73]">Trạng thái hiển thị</div>
                <div className="text-xs text-gray-500">
                  {form.isActive ? "Đang bật hiển thị" : "Đang tắt hiển thị"}
                </div>
              </div>
                <Switch checked={form.isActive} onCheckedChange={(value) => onChange("isActive", value)} />
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="border-t border-[#063e8e]/10 px-6 py-4">
          <div className="flex w-full justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[#063e8e]/15 text-gray-700"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Đang lưu..." : "Lưu cấu hình"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BranchCard({
  branch,
  current,
  onSelect,
  onDelete,
}: {
  branch: BaseConfigBranchItem;
  current: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 transition-all ${
        current
          ? "border-[#063e8e]/30 bg-[#eef5ff] shadow-[0_10px_24px_rgba(6,62,142,0.1)]"
          : "border-[#063e8e]/10 bg-white"
      }`}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="text-sm font-semibold text-[#163b73]">{branch.branchName || "Chi nhánh mới"}</div>
        <div className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {branch.address || "Chưa cập nhật địa chỉ"}
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">{branch.hotline || "Chưa có hotline"}</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AdminBaseConfigPage() {
  const [config, setConfig] = React.useState<BaseConfigData | null>(null);
  const [mediaItems, setMediaItems] = React.useState<AdminMediaItem[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = React.useState(0);
  const [currentBranchIndex, setCurrentBranchIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("branding");
  const [itemDialogOpen, setItemDialogOpen] = React.useState(false);
  const [itemDialogMode, setItemDialogMode] = React.useState<ConfigItemMode>("logo");
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);
  const [itemForm, setItemForm] = React.useState<ConfigItemForm>(emptyItemForm());
  const [imagePickerOpen, setImagePickerOpen] = React.useState(false);
  const [savingItem, setSavingItem] = React.useState(false);
  const [savingContact, setSavingContact] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    mode: ConfigItemMode;
    id: string;
    name: string;
  } | null>(null);

  React.useEffect(() => {
    setConfig(readBaseConfig());
  }, []);

  const mediaMap = React.useMemo(
    () => new Map(mediaItems.map((item) => [item.id, item])),
    [mediaItems],
  );
  const sortedBanners = React.useMemo(
    () => (config ? sortBaseConfigBanners(config.banners) : []),
    [config],
  );
  const sortedSocials = React.useMemo(
    () => (config ? sortBaseConfigSocials(config.socials) : []),
    [config],
  );

  const currentLogo = config?.logo ?? null;
  const currentBanner = sortedBanners[currentBannerIndex] ?? null;
  const currentBranch = config?.branches[currentBranchIndex] ?? null;
  const currentLogoMedia = currentLogo ? resolveMediaItem(mediaMap, currentLogo.imageId) : null;
  const currentBannerMedia = currentBanner
    ? resolveMediaItem(mediaMap, currentBanner.imageId)
    : null;
  const previewMedia = resolveMediaItem(mediaMap, itemForm.imageId);

  const saveConfig = React.useCallback((nextConfig: BaseConfigData) => {
    setConfig(nextConfig);
    persistBaseConfig(nextConfig);
  }, []);

  const openCreateDialog = (mode: ConfigItemMode) => {
    setItemDialogMode(mode);
    setEditingItemId(null);
    setItemForm({
      ...emptyItemForm(),
      sortOrder: mode === "banner" ? (config ? config.banners.length + 1 : 1) : 1,
    });
    setItemDialogOpen(true);
  };

  const openEditDialog = (mode: ConfigItemMode, item: BaseConfigLogoItem | BaseConfigBannerItem) => {
    setItemDialogMode(mode);
    setEditingItemId(item.id);
    setItemForm({
      name: item.name,
      imageId: item.imageId,
      isActive: item.isActive,
      displayTimeSeconds: "displayTimeSeconds" in item ? item.displayTimeSeconds : 5,
      sortOrder: "sortOrder" in item ? item.sortOrder : 1,
    });
    setItemDialogOpen(true);
  };

  const handleSubmitItem = () => {
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

    const nextConfig = cloneBaseConfigData(config);

    if (itemDialogMode === "logo") {
      nextConfig.logo = {
        id: editingItemId || currentLogo?.id || createBaseConfigItemId("logo"),
        name: trimmedName,
        imageId: itemForm.imageId,
        isActive: true,
      };
    } else {
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
    }

    saveConfig(nextConfig);
    setSavingItem(false);
    setItemDialogOpen(false);
    toast.success(
      itemDialogMode === "logo"
        ? "Đã lưu cấu hình logo"
        : "Đã lưu cấu hình banner",
    );
  };

  const handleDeleteItem = () => {
    if (!config || !deleteTarget) return;

    const nextConfig = cloneBaseConfigData(config);

    if (deleteTarget.mode === "logo") {
      nextConfig.logo = null;
    } else {
      nextConfig.banners = nextConfig.banners.filter((item) => item.id !== deleteTarget.id);
      setCurrentBannerIndex((previous) =>
        Math.max(0, Math.min(previous, nextConfig.banners.length - 1)),
      );
    }

    saveConfig(nextConfig);
    toast.success("Đã xóa cấu hình");
    setDeleteTarget(null);
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
            branches: previous.branches.map((branch, index) =>
              index === currentBranchIndex ? { ...branch, [key]: value } : branch,
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
    nextConfig.branches = nextConfig.branches.filter((branch) => branch.id !== branchId);
    saveConfig(nextConfig);
    setCurrentBranchIndex((previous) =>
      Math.max(0, Math.min(previous, Math.max(nextConfig.branches.length - 1, 0))),
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

  const handleWebsiteInfoChange = (key: "websiteName" | "websiteLink", value: string) => {
    setConfig((previous) => (previous ? { ...previous, [key]: value } : previous));
  };

  const handleSaveWebsiteInfo = () => {
    if (!config) return;
    saveConfig(config);
    toast.success("Đã lưu thông tin website");
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

  if (!config) {
    return (
      <div className="rounded-3xl border border-[#063e8e]/10 bg-white p-10 text-center text-gray-500">
        Đang tải cấu hình chung...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
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
                  <CardTitle className="text-2xl text-[#163b73]">Nhận diện thương hiệu</CardTitle>
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
                        <div className="mt-3 font-semibold text-[#163b73]">{currentLogo.name}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Tên website</Label>
                        <Input
                          value={config.websiteName}
                          onChange={(event) => handleWebsiteInfoChange("websiteName", event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Link website</Label>
                        <Input
                          value={config.websiteLink}
                          onChange={(event) => handleWebsiteInfoChange("websiteLink", event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div className="hidden rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                          Trạng thái
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="border-[#063e8e]/20 text-[#063e8e]">
                            {currentLogo.isActive ? "Đang hiển thị" : "Đang ẩn"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleSaveWebsiteInfo}
                        className="w-full rounded-xl bg-[#163b73] text-white hover:bg-[#163b73]/90"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thông tin website
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-[#063e8e]/15 bg-white px-5 py-8 text-center text-sm text-gray-500">
                      Chua c? logo n?o. H?y thi?t l?p logo cho website.
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
                  <CardTitle className="text-2xl text-[#163b73]">Banner trang chủ</CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý hình ảnh slider chỉ dùng cho khu vực banner trang chủ của website.
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
                        previous <= 0 ? Math.max(sortedBanners.length - 1, 0) : previous - 1,
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
                        sortedBanners.length === 0 ? 0 : (previous + 1) % sortedBanners.length,
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
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">Tên banner</div>
                    <div className="mt-2 font-semibold text-[#163b73]">{currentBanner.name}</div>
                  </div>
                  <div className="rounded-2xl border border-[#063e8e]/10 bg-white px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                      Thứ tự hiển thị
                    </div>
                    <div className="mt-2 font-semibold text-[#163b73]">{currentBanner.sortOrder}</div>
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
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">Trạng thái</div>
                    <div className="mt-2">
                      <Badge variant="outline" className="border-[#063e8e]/20 text-[#063e8e]">
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
                  <CardTitle className="text-2xl text-[#163b73]">Thông tin liên hệ website</CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý nhiều địa chỉ chi nhánh để hiển thị trên website.
                  </CardDescription>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleAddBranch}
                    className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm chi nhánh
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveBranches}
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
                  {config.branches.map((branch, index) => (
                    <BranchCard
                      key={branch.id}
                      branch={branch}
                      current={index === currentBranchIndex}
                      onSelect={() => setCurrentBranchIndex(index)}
                      onDelete={() => handleDeleteBranch(branch.id)}
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
                        onChange={(event) => handleBranchChange("branchName", event.target.value)}
                        className={fieldClassName}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Địa chỉ</Label>
                      <Textarea
                        value={currentBranch.address}
                        onChange={(event) => handleBranchChange("address", event.target.value)}
                        className={`${fieldClassName} min-h-[110px]`}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Hotline</Label>
                        <Input
                          value={currentBranch.hotline}
                          onChange={(event) => handleBranchChange("hotline", event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Email</Label>
                        <Input
                          value={currentBranch.email}
                          onChange={(event) => handleBranchChange("email", event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Fax</Label>
                        <Input
                          value={currentBranch.fax}
                          onChange={(event) => handleBranchChange("fax", event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Google Maps</Label>
                        <Input
                          value={currentBranch.mapsEmbedUrl}
                          onChange={(event) => handleBranchChange("mapsEmbedUrl", event.target.value)}
                          className={fieldClassName}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#063e8e]/15 bg-white px-5 py-10 text-center text-sm text-gray-500">
                    Chưa có chi nhánh nào. Hãy thêm chi nhánh để bắt đầu cấu hình
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
                  <CardTitle className="text-2xl text-[#163b73]">Mạng xã hội</CardTitle>
                  <CardDescription className="mt-2 text-sm text-slate-600">
                    Quản lý link mạng xã hội và thứ tự hiển thị trên website.
                  </CardDescription>
                </div>

                <Button
                  type="button"
                  onClick={handleSaveSocials}
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
                          handleSocialChange(item.id, "isVisible", checked === true)
                        }
                      />
                      <div>
                        <div className="font-semibold text-[#163b73]">{item.label}</div>
                        <div className="text-sm text-slate-500">
                          {item.isVisible ? "Đang hiển thị" : "Đang ẩn"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700">Link URL</Label>
                      <Input
                        value={item.url}
                        onChange={(event) => handleSocialChange(item.id, "url", event.target.value)}
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
                          handleSocialChange(item.id, "sortOrder", Number(event.target.value || 1))
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
        onChange={(key, value) => setItemForm((previous) => ({ ...previous, [key]: value }))}
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
            Bạn có chắc muốn xóa <span className="font-semibold">{deleteTarget?.name}</span>? Hành
            động này không thể hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
      />
    </div>
  );
}
