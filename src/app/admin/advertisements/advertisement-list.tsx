"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  ImagePlus,
  ExternalLink,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionGate } from "@/components/shared/permission-gate";
import { usePermission } from "@/hooks/usePermission";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import links from "@/links";
import { useQueryClient } from "@tanstack/react-query";

// API imports
import {
  useGetApiV10Advertisement,
  usePostApiV10Advertisement,
  usePutApiV10AdvertisementId,
  useDeleteApiV10AdvertisementId,
} from "@/api/vcci-news/endpoints/advertisement";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import type { AdvertisementCreate } from "@/api/vcci-news/models/advertisementCreate";
import type { AdvertisementUpdate } from "@/api/vcci-news/models/advertisementUpdate";

const PAGE_SIZE = 10;

type AdType = "square" | "horizontal";

interface FormValues {
  name: string;
  file_id: string;
  filePreviewUrl?: string;
  alt: string;
  link: string;
  status: "ACTIVE" | "INACTIVE";
  sort_order: number;
}

interface AdvertisementListProps {
  type: AdType;
  title: string;
  description: string;
  previewAspect?: string; // CSS aspect-ratio
  note?: string; // Lưu ý hiển thị trên website
}

export function AdvertisementList({
  type,
  title,
  description,
  previewAspect = "16 / 10",
  note,
}: AdvertisementListProps) {
  const canRead = usePermission("advertisements", "read");
  const canWrite = usePermission("advertisements", "write");
  const canDelete = usePermission("advertisements", "delete");
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<"all" | "ACTIVE" | "INACTIVE">("all");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [form, setForm] = useState<FormValues>({
    name: "",
    file_id: "",
    filePreviewUrl: "",
    alt: "",
    link: "",
    status: "ACTIVE",
    sort_order: 1,
  });
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<Advertisement | null>(null);

  const filters = React.useMemo(() => {
    const parts: string[] = [`type==${type}`];
    if (filterStatus !== "all") parts.push(`status==${filterStatus}`);
    return parts.join(",");
  }, [type, filterStatus]);

  const { data: adsData, isLoading } = useGetApiV10Advertisement({
    page: currentPage,
    pageSize: PAGE_SIZE,
    sortField: "sort_order",
    sortOrder: "asc",
    filters,
  });

  const createMutation = usePostApiV10Advertisement();
  const updateMutation = usePutApiV10AdvertisementId();
  const deleteMutation = useDeleteApiV10AdvertisementId();

  const ads =
    ((adsData as unknown as { responseData?: { rows?: Advertisement[] } })?.responseData?.rows) || [];
  const total =
    ((adsData as unknown as { responseData?: { count?: number } })?.responseData?.count) || 0;

  const handleCreate = () => {
    setSelectedAd(null);
    setForm({
      name: "",
      file_id: "",
      filePreviewUrl: "",
      alt: "",
      link: "",
      status: "ACTIVE",
      sort_order: 1,
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = (ad: Advertisement) => {
    setSelectedAd(ad);
    setForm({
      name: ad.name,
      file_id: ad.file_id,
      filePreviewUrl: ad.file?.path ? links.resolveImageUrl(ad.file.path) : "",
      alt: ad.alt || "",
      link: ad.link,
      status: ad.status as "ACTIVE" | "INACTIVE",
      sort_order: ad.sort_order,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (ad: Advertisement) => {
    setAdToDelete(ad);
    setIsDeleteDialogOpen(true);
  };

  const handleSelectImage = (item: AdminMediaItem) => {
    setForm((prev) => ({
      ...prev,
      file_id: item.id,
      filePreviewUrl: item.url,
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên quảng cáo");
      return;
    }
    if (!form.file_id) {
      toast.error("Vui lòng chọn ảnh quảng cáo");
      return;
    }
    if (!form.link.trim()) {
      toast.error("Vui lòng nhập đường link");
      return;
    }

    try {
      if (selectedAd) {
        const updateData: AdvertisementUpdate = {
          name: form.name.trim(),
          file_id: form.file_id,
          alt: form.alt.trim() || null,
          link: form.link.trim(),
          type,
          status: form.status,
          sort_order: form.sort_order,
        };
        await updateMutation.mutateAsync({ id: selectedAd.id, data: updateData });
        toast.success("Cập nhật quảng cáo thành công!");
      } else {
        const createData: AdvertisementCreate = {
          name: form.name.trim(),
          file_id: form.file_id,
          alt: form.alt.trim() || null,
          link: form.link.trim(),
          type,
          status: form.status,
          sort_order: form.sort_order,
        };
        await createMutation.mutateAsync({ data: createData });
        toast.success("Tạo quảng cáo thành công!");
      }
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["/api/v1.0/advertisement"],
        exact: false,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Lưu quảng cáo thất bại");
    }
  };

  const handleConfirmDelete = async () => {
    if (!adToDelete) return;
    try {
      await deleteMutation.mutateAsync({ id: adToDelete.id });
      toast.success("Xóa quảng cáo thành công!");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["/api/v1.0/advertisement"],
        exact: false,
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Xóa quảng cáo thất bại");
    }
  };

  if (!canRead) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] p-10 text-center">
        <p className="text-slate-500">Bạn không có quyền xem quảng cáo</p>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#163b73]">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            {description} ({total} quảng cáo)
          </p>
        </div>
        <PermissionGate required="advertisements:write">
          <Button
            onClick={handleCreate}
            className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        </PermissionGate>
      </div>

      {/* Note */}
      {note && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Lưu ý hiển thị:</span> {note}
          </p>
        </div>
      )}

      {/* Filter status */}
      <div className="flex items-center gap-2">
        <Label className="text-sm text-slate-600">Trạng thái:</Label>
        <Select
          value={filterStatus}
          onValueChange={(v) => {
            setFilterStatus(v as typeof filterStatus);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] rounded-xl border-[#063e8e]/15">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="ACTIVE">Hiển thị</SelectItem>
            <SelectItem value="INACTIVE">Ẩn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#063e8e]" />
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <div className="rounded-2xl border border-[#063e8e]/10 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                  <TableHead className="w-10 py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    STT
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Ảnh
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Tên quảng cáo
                  </TableHead>
                  <TableHead className="py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    Thứ tự
                  </TableHead>
                  <TableHead className="py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    Trạng thái
                  </TableHead>
                  <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">
                    Link
                  </TableHead>
                  <TableHead className="w-24 py-3 text-center text-white text-sm font-semibold whitespace-nowrap">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      Không tìm thấy quảng cáo nào
                    </TableCell>
                  </TableRow>
                ) : (
                  ads.map((ad, index) => {
                    const imageUrl = ad.file?.path ? links.resolveImageUrl(ad.file.path) : "";
                    const isGif = imageUrl.toLowerCase().endsWith(".gif");
                    return (
                      <TableRow
                        key={ad.id}
                        className="border-b border-[#063e8e]/5 hover:bg-[#063e8e]/2"
                      >
                        <TableCell className="text-center text-slate-600 whitespace-nowrap">
                          {(currentPage - 1) * PAGE_SIZE + index + 1}
                        </TableCell>
                        <TableCell>
                          <div
                            className="relative overflow-hidden rounded-lg border border-[#063e8e]/10 bg-[#f8fbff]"
                            style={{ aspectRatio: previewAspect, width: type === "horizontal" ? 112 : 72 }}
                          >
                            {imageUrl ? (
                              <SafeNextImage
                                src={imageUrl}
                                alt={ad.alt || ad.name}
                                fill
                                className="object-cover"
                                unoptimized={isGif}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImagePlus className="h-5 w-5 text-slate-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium text-[#163b73] truncate max-w-[200px]">
                            {ad.name}
                          </p>
                          {ad.alt && (
                            <p className="text-sm text-slate-400 truncate max-w-[200px]">
                              {ad.alt}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-sm font-medium text-slate-700">
                            {ad.sort_order}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`text-sm whitespace-nowrap ${ad.status === "ACTIVE"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-red-200 bg-red-50 text-red-700"
                              }`}
                          >
                            {ad.status === "ACTIVE" ? (
                              <CheckCircle className="mr-1 h-4 w-4" />
                            ) : (
                              <XCircle className="mr-1 h-4 w-4" />
                            )}
                            {ad.status === "ACTIVE" ? "Hiển thị" : "Ẩn"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a
                            href={ad.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#063e8e] hover:underline flex items-center gap-1 truncate max-w-[180px]"
                          >
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <span className="truncate">{ad.link}</span>
                          </a>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <PermissionGate required="advertisements:write">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(ad)}
                                className="h-9 rounded-lg text-[#063e8e] hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                            <PermissionGate required="advertisements:delete">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(ad)}
                                className="h-9 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(currentPage * PAGE_SIZE, total)} trong {total} quảng cáo
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium text-[#163b73]">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border-[#063e8e]/15">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#163b73]">
              {selectedAd ? `Sửa ${title.toLowerCase()}` : `Tạo ${title.toLowerCase()} mới`}
            </DialogTitle>
            <DialogDescription>
              {selectedAd ? "Cập nhật thông tin quảng cáo" : description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 overflow-y-auto px-1 py-2 max-h-[60vh]">
            {/* Image picker */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ảnh quảng cáo *</Label>
              <div className="flex items-center gap-4">
                <div
                  className="relative shrink-0 overflow-hidden rounded-xl border border-[#063e8e]/15 bg-[#f8fbff]"
                  style={{ aspectRatio: previewAspect, width: type === "horizontal" ? 200 : 120 }}
                >
                  {form.filePreviewUrl ? (
                    <SafeNextImage
                      src={form.filePreviewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized={form.filePreviewUrl.toLowerCase().endsWith(".gif")}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <ImagePlus className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsImagePickerOpen(true)}
                  className="rounded-xl border-[#063e8e]/15"
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {form.file_id ? "Đổi ảnh" : "Chọn ảnh"}
                </Button>
                {form.file_id && (
                  <span className="text-xs text-green-600">✓ Đã chọn ảnh</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tên quảng cáo *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Quảng cáo sidebar 1"
                className="rounded-xl border-[#063e8e]/15"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Alt text</Label>
              <Input
                value={form.alt}
                onChange={(e) => setForm((prev) => ({ ...prev, alt: e.target.value }))}
                placeholder="Mô tả ảnh (cho SEO)"
                className="rounded-xl border-[#063e8e]/15"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Đường link *</Label>
              <Input
                value={form.link}
                onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com"
                className="rounded-xl border-[#063e8e]/15"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Trạng thái *</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((prev) => ({ ...prev, status: v as "ACTIVE" | "INACTIVE" }))
                  }
                >
                  <SelectTrigger className="rounded-xl border-[#063e8e]/15">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Hiển thị</SelectItem>
                    <SelectItem value="INACTIVE">Ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Thứ tự</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      sort_order: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="rounded-xl border-[#063e8e]/15"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !form.name || !form.file_id || !form.link ||
                createMutation.isPending || updateMutation.isPending
              }
              className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedAd ? "Cập nhật" : "Tạo quảng cáo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Picker */}
      <AdminImagePicker
        open={isImagePickerOpen}
        selectedId={form.file_id || null}
        onOpenChange={setIsImagePickerOpen}
        onSelect={handleSelectImage}
      />

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-3xl border-[#063e8e]/15">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#163b73]">
              Xác nhận xóa quảng cáo
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa quảng cáo{" "}
              <strong>{adToDelete?.name}</strong>? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
