"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Edit, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TabsContent } from "@/components/ui/tabs";
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
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { ConfigItemDialog } from "../config-item-dialog";
import {
  useDeleteApiV10LogoId,
  useGetApiV10Logo,
  usePostApiV10Logo,
  usePutApiV10LogoId,
} from "@/api/vcci-news/endpoints/logo";
import {
  useGetApiV10SiteInformation,
  usePutApiV10SiteInformation,
} from "@/api/vcci-news/endpoints/site-information";
import type { Logo } from "@/api/vcci-news/models";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import { mapApiLogoToConfig } from "./_components/utils";
import {
  fieldClassName,
  type ConfigItemForm,
  type LogoListResponse,
} from "../types";

export function BrandingTab() {
  const emptyForm = (): ConfigItemForm => ({
    name: "",
    imageId: "",
    isActive: true,
    displayTimeSeconds: 5,
    sortOrder: 1,
  });
  const {
    data: logoData,
    isLoading: isLogoLoading,
    refetch: refetchLogo,
  } = useGetApiV10Logo({
    page: 1,
    pageSize: 1,
    sortField: "updated_at",
    sortOrder: "desc",
  });
  const { data: siteData, isLoading: isSiteLoading } =
    useGetApiV10SiteInformation();
  const { mutateAsync: createLogo, isPending: isCreatingLogo } =
    usePostApiV10Logo();
  const { mutateAsync: updateLogo, isPending: isUpdatingLogo } =
    usePutApiV10LogoId();
  const { mutateAsync: deleteLogo } = useDeleteApiV10LogoId();
  const { mutateAsync: updateSite, isPending: isUpdatingSite } =
    usePutApiV10SiteInformation();
  const logoResponse = logoData as
    | {
      responseData?: LogoListResponse;
      data?: { responseData?: LogoListResponse };
    }
    | undefined;
  const logo =
    (logoResponse?.responseData ?? logoResponse?.data?.responseData)
      ?.rows?.[0] ?? null;
  const siteResponse = siteData as
    | {
      responseData?: { website_name?: string; website_link?: string };
      data?: {
        responseData?: { website_name?: string; website_link?: string };
      };
    }
    | undefined;
  const site = siteResponse?.responseData ?? siteResponse?.data?.responseData;
  const isLoading = isLogoLoading || isSiteLoading;
  const logoConfig = useMemo(
    () => (logo ? mapApiLogoToConfig(logo) : null),
    [logo],
  );
  const [websiteName, setWebsiteName] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [form, setForm] = useState<ConfigItemForm>(emptyForm());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<AdminMediaItem | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWebsiteName(site?.website_name ?? "");
    setWebsiteLink(site?.website_link ?? "");
  }, [site?.website_name, site?.website_link]);

  useEffect(() => {
    if (!logoConfig?.media) return;
    setSelectedMedia(logoConfig.media);
  }, [logoConfig]);

  const currentMedia = selectedMedia ?? logoConfig?.media ?? null;

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.imageId) {
      toast.error(
        !form.name.trim()
          ? "Vui lòng nhập tên hiển thị"
          : "Vui lòng chọn hình ảnh",
      );
      return;
    }
    setSaving(true);
    try {
      const data = {
        logo_name: form.name.trim(),
        logo_url: currentMedia?.url ?? null,
        file_id: form.imageId,
      };
      if (logo?.id) await updateLogo({ id: logo.id, data });
      else await createLogo({ data });
      setDialogOpen(false);
      await refetchLogo();
      toast.success("Đã lưu cấu hình logo");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể lưu cấu hình logo",
      );
    } finally {
      setSaving(false);
    }
  };

  const openEdit = () => {
    if (!logoConfig?.logo) return;
    setForm({
      name: logoConfig.logo.name,
      imageId: logoConfig.logo.imageId,
      isActive: true,
      displayTimeSeconds: 5,
      sortOrder: 1,
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!logo?.id) return;
    try {
      await deleteLogo({ id: logo.id });
      setDeleteOpen(false);
      await refetchLogo();
      toast.success("Đã xóa cấu hình logo");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa cấu hình logo",
      );
    }
  };

  const handleSaveSite = async () => {
    try {
      await updateSite({
        data: {
          website_name: websiteName.trim() || null,
          website_link: websiteLink.trim() || null,
        },
      });
      toast.success("Đã lưu thông tin website");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể lưu thông tin website",
      );
    }
  };

  return (
    <TabsContent value="branding" className="mt-0" aria-busy={isLoading}>
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
            <div className="flex flex-wrap gap-3">
              {logoConfig?.logo ? (
                <>
                  <Button type="button" variant="outline" onClick={openEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Cập nhật logo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteOpen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thiết lập logo
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_360px]">
            <div className="rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-5">
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[24px] bg-[#eef4ff]">
                {currentMedia ? (
                  <div className="relative h-[220px] w-[220px]">
                    <Image
                      src={currentMedia.url}
                      alt={currentMedia.alt || currentMedia.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImagePlus className="mx-auto mb-3 h-10 w-10" />
                    Chưa có logo nào được cấu hình
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-5">
              {logoConfig?.logo ? (
                <div className="space-y-4">
                  <div className="text-xs font-semibold uppercase text-[#4b74b8]">
                    Logo website
                  </div>
                  <div className="font-semibold text-[#163b73]">
                    {logoConfig.logo.name}
                  </div>
                  <div className="space-y-2">
                    <Label>Tên website</Label>
                    <Input
                      value={websiteName}
                      onChange={(event) => setWebsiteName(event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link website</Label>
                    <Input
                      value={websiteLink}
                      onChange={(event) => setWebsiteLink(event.target.value)}
                      className={fieldClassName}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSaveSite}
                    disabled={isUpdatingSite}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Lưu thông tin website
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-gray-500">
                  Chưa có logo nào, hãy thiết lập logo.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfigItemDialog
        open={dialogOpen}
        mode="logo"
        form={form}
        previewMedia={currentMedia}
        saving={saving || isCreatingLogo || isUpdatingLogo}
        title={logo ? "Cập nhật logo" : "Thiết lập logo"}
        description="Thiết lập logo hiển thị cho website."
        onOpenChange={setDialogOpen}
        onChange={(key, value) =>
          setForm((previous) => ({ ...previous, [key]: value }))
        }
        onPickImage={() => setPickerOpen(true)}
        onSubmit={handleSubmit}
      />
      <AdminImagePicker
        open={pickerOpen}
        selectedId={form.imageId}
        onOpenChange={setPickerOpen}
        onSelect={(item) => {
          setSelectedMedia(item);
          setForm((previous) => ({ ...previous, imageId: item.id }));
        }}
      />
      <AdminDeleteDialog
        open={deleteOpen}
        title="Xóa cấu hình"
        description={
          <>
            Bạn có chắc muốn xóa{" "}
            <span className="font-semibold">{logoConfig?.logo?.name}</span>?
          </>
        }
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </TabsContent>
  );
}
