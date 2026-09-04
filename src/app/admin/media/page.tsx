"use client";

import * as React from "react";
import {
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Pagination } from "@/components/base/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CmsFileItem,
  resolveCmsFileUrl,
} from "@/lib/utils/file";
import {
  deleteApiV10FileId,
  getApiV10File,
  postApiV10FileUpload,
} from "@/api/vcci-news/endpoints/file";

const PAGE_SIZE = 10;

function resolveApiError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status?: number; data?: { message?: string; error?: string } } };
    const status = axiosError.response?.status;
    const apiMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;
    if (status && apiMessage) {
      return `[Lỗi ${status}] ${apiMessage}`;
    }
    if (status) {
      return `[Lỗi ${status}] ${fallback}`;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

const inputClassName =
  "rounded-2xl border-[#063e8e]/15 bg-white text-gray-700 shadow-sm placeholder:text-gray-400 focus-visible:ring-[#063e8e]/20";

type MediaFormValues = {
  file: File | null;
  name: string;
  previewUrl: string;
};

const EMPTY_MEDIA_FORM: MediaFormValues = {
  file: null,
  name: "",
  previewUrl: "",
};

function formatFileSize(size?: number | null) {
  if (!size) return "Ảnh hệ thống";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileSize(item: CmsFileItem) {
  const importInfo = item as CmsFileItem & {
    size?: number | null;
    file_size?: number | null;
    import_info?: { size?: number; file_size?: number } | null;
  };

  return (
    importInfo.size ??
    importInfo.file_size ??
    importInfo.import_info?.size ??
    importInfo.import_info?.file_size ??
    0
  );
}

function MediaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[0_18px_45px_rgba(6,62,142,0.08)]">
      <div className="aspect-square animate-pulse bg-[#063e8e]/8" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#063e8e]/10" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[#063e8e]/10" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#063e8e]/10" />
      </div>
    </div>
  );
}

interface MediaFormDialogProps {
  open: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MediaFormValues) => Promise<void>;
}

function MediaFormDialog({
  open,
  saving,
  onOpenChange,
  onSave,
}: MediaFormDialogProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [form, setForm] = React.useState<MediaFormValues>(EMPTY_MEDIA_FORM);

  React.useEffect(() => {
    if (!open) return;
    setForm(EMPTY_MEDIA_FORM);
  }, [open]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const defaultName = file.name.replace(/\.[^.]+$/, "");

    setForm((previous) => {
      if (previous.previewUrl) {
        URL.revokeObjectURL(previous.previewUrl);
      }

      return {
        file,
        name: previous.name || defaultName,
        previewUrl,
      };
    });

    event.target.value = "";
  };

  React.useEffect(() => {
    return () => {
      if (form.previewUrl) {
        URL.revokeObjectURL(form.previewUrl);
      }
    };
  }, [form.previewUrl]);

  const handleSave = async () => {
    if (!form.file) {
      toast.error("Vui lòng chọn ảnh cần tải lên");
      return;
    }

    await onSave({
      ...form,
      name: form.name.trim() || form.file.name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[#063e8e]/15 bg-white p-0 shadow-[0_26px_70px_rgba(15,23,42,0.24)]">
        <DialogHeader className="shrink-0 border-b border-[#063e8e]/10 px-6 py-5 sm:px-7">
          <DialogTitle className="text-xl font-semibold text-[#063e8e]">
            Tải ảnh lên
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-[#063e8e]/10 bg-[linear-gradient(180deg,#f5f9ff_0%,#eef5ff_100%)] p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_top,#d9e8ff_0%,#f7faff_58%,#ffffff_100%)]">
                  {form.previewUrl ? (
                    <SafeNextImage
                      src={form.previewUrl}
                      alt={form.name}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#063e8e]/10 text-[#063e8e]">
                        <ImageIcon className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Chưa có ảnh nào được chọn
                        </p>
                        <p className="text-xs text-slate-500">
                          Chọn ảnh từ máy tính để tải lên hệ thống
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-dashed border-[#063e8e]/20 bg-white/90 p-5">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Tải ảnh từ máy tính
                  </p>
                  <p className="text-sm text-slate-500">
                    Hỗ trợ ảnh JPG, PNG, WEBP. Ảnh sẽ được lưu vào API /file/upload.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-2xl border-[#063e8e]/15 bg-white text-[#063e8e] hover:bg-[#edf4ff]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn ảnh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-7">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Tên ảnh</Label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, name: event.target.value }))
                  }
                  placeholder="Nhập tên ảnh"
                  className={inputClassName}
                />
              </div>

              <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Dung lượng</p>
                  <p className="font-semibold text-slate-700">
                    {formatFileSize(form.file?.size)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#063e8e]/10 bg-[#f8fbff] px-6 py-4 sm:px-7">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl border-[#063e8e]/15 bg-white text-slate-600 hover:bg-slate-50"
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMediaPage() {
  const [items, setItems] = React.useState<CmsFileItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<CmsFileItem | null>(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const load = React.useCallback(async () => {
    setReady(false);

    try {
      const keyword = search.trim();
      const filters = [
        "mime@=image",
        keyword ? `original@=${keyword}|path@=${keyword}` : "",
      ].filter(Boolean).join(",");

      const response = await getApiV10File({
        page,
        pageSize: PAGE_SIZE,
        sortField: "created_at",
        sortOrder: "desc",
        filters,
      });
      const pageData = response.responseData ?? {};

      setItems((pageData.rows ?? []) as CmsFileItem[]);
      setTotal(pageData.count ?? 0);
    } catch (error) {
      toast.error(resolveApiError(error, "Không thể tải danh sách ảnh"));
      setItems([]);
      setTotal(0);
    } finally {
      setReady(true);
    }
  }, [page, search]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const openCreate = () => {
    setDialogOpen(true);
  };

  const handleSave = async (data: MediaFormValues) => {
    if (!data.file) return;

    setSaving(true);

    try {
      await postApiV10FileUpload({
        file: data.file,
        original: data.name,
      });
      toast.success("Đã tải ảnh lên thành công");
      setDialogOpen(false);
      await load();
    } catch (error) {
      toast.error(resolveApiError(error, "Không thể tải ảnh lên"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteApiV10FileId(deleteTarget.id ?? "");
      toast.success("Đã xóa ảnh thành công");
      setDeleteTarget(null);
      await load();
    } catch (error) {
      toast.error(resolveApiError(error, "Không thể xóa ảnh"));
    }
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm ảnh..."
        actionLabel="Tải ảnh lên"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionMeta={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
            Tổng số ảnh: {total}
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <div className="bg-white p-4 sm:p-5">
          {!ready ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <MediaCardSkeleton key={`media-loading-${index}`} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#063e8e]/20 bg-[#fbfdff] text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#063e8e]/10 text-[#063e8e]">
                <ImageIcon className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-800">Chưa có ảnh phù hợp</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Hãy tải ảnh mới hoặc thử lại với từ khóa khác để tìm đúng hình ảnh bạn cần.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
              {items.map((item) => (
                <article
                  key={item.id ?? ""}
                  className="group overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[0_18px_45px_rgba(6,62,142,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(6,62,142,0.14)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_top,#dce9ff_0%,#f8fbff_55%,#ffffff_100%)]">
                    <SafeNextImage
                      src={resolveCmsFileUrl(item.path)}
                      alt={item.original ?? ""}
                      fill
                      className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,62,142,0)_15%,rgba(15,23,42,0.68)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                        {(item.mime ?? "").split("/")[1]?.toUpperCase() || "IMG"}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        onClick={() => setDeleteTarget(item)}
                        className="h-10 w-10 rounded-2xl bg-white text-red-600 shadow-lg hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="space-y-1">
                      <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                        {item.original}
                      </h3>
                      <p className="line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
                        {item.path}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{formatFileSize(getFileSize(item))}</span>
                    </div>

                    <div className="border-t border-[#063e8e]/8 pt-3 text-xs text-slate-500">
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-3 border-t border-[#063e8e]/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} đến{" "}
              {Math.min(page * PAGE_SIZE, total)} của {total} ảnh
            </div>
            <Pagination
              page={page}
              pageCount={totalPages}
              onChangePage={setPage}
            />
          </div>
        ) : null}
      </AdminTableLayout>

      <MediaFormDialog
        open={dialogOpen}
        saving={saving}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa ảnh"
        description={
          <>
            Bạn có chắc muốn xóa ảnh <span className="font-semibold">{deleteTarget?.original}</span>?
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
