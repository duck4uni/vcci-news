"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
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
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { ConfigItemDialog } from "../config-item-dialog";
import { ConfigItemPreview } from "./_components/ConfigItemPreview";
import {
  useDeleteApiV10BannerId,
  useGetApiV10Banner,
  usePostApiV10Banner,
  usePutApiV10BannerId,
} from "@/api/vcci-news/endpoints/banner";
import { useGetApiV10FileId } from "@/api/vcci-news/endpoints/file";
import { toAdminMediaItem } from "@/lib/utils/file";
import type { Banner } from "@/api/vcci-news/models";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import {
  mapApiBannerToConfig,
  mapConfigBannerToApi,
} from "./_components/utils";
import { type ConfigItemForm, type PageEnvelope } from "../types";

function CurrentBannerImage({
  item,
}: {
  item: ReturnType<typeof mapApiBannerToConfig>;
}) {
  const { data } = useGetApiV10FileId(item.imageId, {
    query: {
      enabled: Boolean(item.imageId),
      select: (response) =>
        response.responseData ? toAdminMediaItem(response.responseData) : null,
    },
  });
  return data ? (
    <Image
      src={data.url}
      alt={data.alt || data.name}
      fill
      className="object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-gray-500">
      Chưa có banner được chọn
    </div>
  );
}

export function BannerTab() {
  const emptyForm = (): ConfigItemForm => ({
    name: "",
    imageId: "",
    isActive: true,
    displayTimeSeconds: 5,
    sortOrder: 1,
  });
  const {
    data: bannerData,
    isLoading: isBannerLoading,
    refetch: refetchBanners,
  } = useGetApiV10Banner({
    page: 1,
    pageSize: 100,
    sortField: "display_order",
    sortOrder: "asc",
  });
  const { mutateAsync: createBanner, isPending: isCreatingBanner } =
    usePostApiV10Banner();
  const { mutateAsync: updateBanner, isPending: isUpdatingBanner } =
    usePutApiV10BannerId();
  const { mutateAsync: deleteBanner } = useDeleteApiV10BannerId();
  const bannerResponse = bannerData as
    | {
      responseData?: PageEnvelope<Banner>;
      data?: { responseData?: PageEnvelope<Banner> };
    }
    | undefined;
  const rows =
    (bannerResponse?.responseData ?? bannerResponse?.data?.responseData)
      ?.rows ?? [];
  const banners = useMemo(() => rows.map(mapApiBannerToConfig), [rows]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState<ConfigItemForm>(emptyForm());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReturnType<
    typeof mapApiBannerToConfig
  > | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<AdminMediaItem | null>(
    null,
  );
  const current = banners[currentIndex] ?? null;

  const openCreate = () => {
    setEditingId(null);
    setSelectedMedia(null);
    setForm({ ...emptyForm(), sortOrder: banners.length + 1 });
    setDialogOpen(true);
  };
  const openEdit = () => {
    if (!current) return;
    setEditingId(current.id);
    setForm({
      name: current.name,
      imageId: current.imageId,
      isActive: current.isActive,
      displayTimeSeconds: current.displayTimeSeconds,
      sortOrder: current.sortOrder,
    });
    setDialogOpen(true);
  };
  const save = async () => {
    if (!form.name.trim() || !form.imageId) {
      toast.error("Vui lòng nhập tên và chọn hình ảnh");
      return;
    }
    try {
      const data = mapConfigBannerToApi({
        ...form,
        id: editingId ?? "",
        name: form.name.trim(),
      });
      if (editingId) await updateBanner({ id: editingId, data });
      else await createBanner({ data });
      setDialogOpen(false);
      await refetchBanners();
      toast.success("Đã lưu cấu hình banner");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể lưu cấu hình banner",
      );
    }
  };
  const remove = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBanner({ id: deleteTarget.id });
      setDeleteTarget(null);
      await refetchBanners();
      toast.success("Đã xóa cấu hình banner");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể xóa cấu hình banner",
      );
    }
  };

  return (
    <TabsContent value="banner" className="mt-0" aria-busy={isBannerLoading}>
      <Card className="rounded-[30px] border-[#063e8e]/10 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-2xl text-[#163b73]">
                Banner trang chủ
              </CardTitle>
              <CardDescription className="mt-2 text-sm text-slate-600">
                Quản lý hình ảnh slider trang chủ.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm banner
              </Button>
              {current ? (
                <>
                  <Button type="button" variant="outline" onClick={openEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteTarget(current)}
                    className="text-red-600"
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
          <div className="rounded-[28px] border border-[#063e8e]/10 bg-[#f8fbff] p-5">
            <div className="relative aspect-[16/6] overflow-hidden rounded-[24px] bg-[#eef4ff]">
              {current ? (
                <CurrentBannerImage item={current} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Chưa có banner được chọn
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold uppercase text-[#4b74b8]">
              Danh sách banner trang chủ
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentIndex((value) =>
                    value <= 0 ? Math.max(banners.length - 1, 0) : value - 1,
                  )
                }
                disabled={banners.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentIndex((value) =>
                    banners.length ? (value + 1) % banners.length : 0,
                  )
                }
                disabled={banners.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {banners.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Không có data banner trang chủ
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {banners.map((item, index) => (
                <ConfigItemPreview
                  key={item.id}
                  title={`Banner ${index + 1}`}
                  item={item}
                  current={index === currentIndex}
                  onSelect={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
          {current ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                Tên banner<div className="font-semibold">{current.name}</div>
              </div>
              <div>
                Thứ tự<div className="font-semibold">{current.sortOrder}</div>
              </div>
              <div>
                Thời gian
                <div className="font-semibold">
                  {current.displayTimeSeconds} giây
                </div>
              </div>
              <div>
                Trạng thái
                <div>
                  <Badge variant="outline">
                    {current.isActive ? "Đang hiển thị" : "Đang ẩn"}
                  </Badge>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <ConfigItemDialog
        open={dialogOpen}
        mode="banner"
        form={form}
        previewMedia={selectedMedia}
        saving={isCreatingBanner || isUpdatingBanner}
        title={editingId ? "Chỉnh sửa banner" : "Thêm banner mới"}
        description="Thiết lập banner hiển thị cho trang chủ."
        onOpenChange={setDialogOpen}
        onChange={(key, value) =>
          setForm((previous) => ({ ...previous, [key]: value }))
        }
        onPickImage={() => setPickerOpen(true)}
        onSubmit={save}
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
        open={!!deleteTarget}
        title="Xóa cấu hình"
        description={
          <>
            Bạn có chắc muốn xóa{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>?
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={remove}
      />
    </TabsContent>
  );
}
