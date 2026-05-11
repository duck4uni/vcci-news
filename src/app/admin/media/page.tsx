"use client";

import * as React from "react";
import {
  Edit,
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type AdminMediaItem,
  createAdminMediaId,
  persistAdminMediaItems,
  readAdminMediaItems,
} from "@/mockdata/admin-news";

const inputClassName =
  "rounded-2xl border-[#063e8e]/15 bg-white text-gray-700 shadow-sm placeholder:text-gray-400 focus-visible:ring-[#063e8e]/20";

type MediaFormValues = {
  id?: string;
  name: string;
  alt: string;
  url: string;
  mime: string;
  size: number;
  source: "seed" | "upload";
};

const EMPTY_MEDIA_FORM: MediaFormValues = {
  name: "",
  alt: "",
  url: "",
  mime: "image/*",
  size: 0,
  source: "upload",
};

function formatFileSize(size: number) {
  if (!size) return "Ảnh hệ thống";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  initial: AdminMediaItem | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MediaFormValues) => void;
}

function MediaFormDialog({
  open,
  initial,
  onOpenChange,
  onSave,
}: MediaFormDialogProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [form, setForm] = React.useState<MediaFormValues>(EMPTY_MEDIA_FORM);

  React.useEffect(() => {
    if (!open) return;

    setForm(
      initial
        ? {
            id: initial.id,
            name: initial.name,
            alt: initial.alt,
            url: initial.url,
            mime: initial.mime,
            size: initial.size,
            source: initial.source,
          }
        : EMPTY_MEDIA_FORM,
    );
  }, [initial, open]);

  const handleField = <K extends keyof MediaFormValues>(
    key: K,
    value: MediaFormValues[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const defaultName = file.name.replace(/\.[^.]+$/, "");
      setForm((previous) => ({
        ...previous,
        name: previous.name || defaultName,
        alt: previous.alt || defaultName,
        url: typeof reader.result === "string" ? reader.result : previous.url,
        mime: file.type || "image/*",
        size: file.size,
        source: "upload",
      }));
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên ảnh");
      return;
    }

    if (!form.url.trim()) {
      toast.error("Vui lòng chọn ảnh hoặc nhập liên kết ảnh");
      return;
    }

    onSave({
      ...form,
      name: form.name.trim(),
      alt: form.alt.trim() || form.name.trim(),
      url: form.url.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[#063e8e]/15 bg-white p-0 shadow-[0_26px_70px_rgba(15,23,42,0.24)]">
        <DialogHeader className="shrink-0 border-b border-[#063e8e]/10 px-6 py-5 sm:px-7">
          <DialogTitle className="text-xl font-semibold text-[#063e8e]">
            {initial ? "Chỉnh sửa ảnh" : "Tải ảnh lên"}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-[#063e8e]/10 bg-[linear-gradient(180deg,#f5f9ff_0%,#eef5ff_100%)] p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_top,#d9e8ff_0%,#f7faff_58%,#ffffff_100%)]">
                  {form.url ? (
                    <SafeNextImage
                      src={form.url}
                      alt={form.alt || form.name}
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
                          Kéo thả hoặc tải ảnh từ máy tính của bạn
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
                    Hỗ trợ ảnh JPG, PNG, WEBP. Dung lượng sẽ được lưu theo file bạn chọn.
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
                <Label className="text-sm font-medium text-slate-700">Tiêu đề ảnh</Label>
                <Input
                  value={form.name}
                  onChange={(event) => handleField("name", event.target.value)}
                  placeholder="Nhập tiêu đề ảnh"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Mô tả alt</Label>
                <Input
                  value={form.alt}
                  onChange={(event) => handleField("alt", event.target.value)}
                  placeholder="Nhập mô tả alt"
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Liên kết ảnh</Label>
                <Input
                  value={form.url}
                  onChange={(event) => handleField("url", event.target.value)}
                  placeholder="https://... hoặc data:image/..."
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Ghi chú hiển thị</Label>
                <Textarea
                  value={form.alt}
                  onChange={(event) => handleField("alt", event.target.value)}
                  placeholder="Nhập nội dung mô tả ngắn cho ảnh"
                  rows={4}
                  className={`${inputClassName} min-h-[120px] resize-none`}
                />
              </div>

              <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Dung lượng</p>
                  <p className="font-semibold text-slate-700">{formatFileSize(form.size)}</p>
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
          >
            <X className="mr-2 h-4 w-4" />
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {initial ? "Lưu thay đổi" : "Tải ảnh lên"}
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMediaPage() {
  const [items, setItems] = React.useState<AdminMediaItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<AdminMediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<AdminMediaItem | null>(null);

  React.useEffect(() => {
    setItems(readAdminMediaItems());
    setReady(true);
  }, []);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter((item) => {
      return [item.name, item.alt, item.url].some((value) =>
        value.toLowerCase().includes(keyword),
      );
    });
  }, [items, search]);

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (item: AdminMediaItem) => {
    setEditTarget(item);
    setDialogOpen(true);
  };

  const handleSave = (data: MediaFormValues) => {
    const now = new Date().toISOString();
    let nextItems: AdminMediaItem[];

    if (data.id) {
      nextItems = items.map((item) =>
        item.id === data.id
          ? {
              ...item,
              name: data.name,
              alt: data.alt,
              url: data.url,
              mime: data.mime,
              size: data.size,
              source: data.source,
              updated_at: now,
            }
          : item,
      );
      toast.success("Đã cập nhật ảnh");
    } else {
      nextItems = [
        {
          id: createAdminMediaId(),
          name: data.name,
          alt: data.alt,
          url: data.url,
          mime: data.mime,
          size: data.size,
          source: data.source,
          created_at: now,
          updated_at: now,
        },
        ...items,
      ];
      toast.success("Đã thêm ảnh mới");
    }

    persistAdminMediaItems(nextItems);
    setItems(readAdminMediaItems());
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    setItems(nextItems);
    persistAdminMediaItems(nextItems);
    toast.success("Đã xóa ảnh");
    setDeleteTarget(null);
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
            Tổng số ảnh: {items.length}
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <div className="bg-white p-4 sm:p-5">
          {!ready ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <MediaCardSkeleton key={`media-loading-${index}`} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
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
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[0_18px_45px_rgba(6,62,142,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(6,62,142,0.14)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_top,#dce9ff_0%,#f8fbff_55%,#ffffff_100%)]">
                    <SafeNextImage
                      src={item.url}
                      alt={item.alt || item.name}
                      fill
                      className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,62,142,0)_15%,rgba(15,23,42,0.68)_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                      <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                        {item.mime.split("/")[1]?.toUpperCase() || "IMG"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          onClick={() => openEdit(item)}
                          className="h-10 w-10 rounded-2xl bg-white text-[#063e8e] shadow-lg hover:bg-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
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
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="space-y-1">
                      <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">
                        {item.alt || "Chưa có mô tả alt cho ảnh này."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{formatFileSize(item.size)}</span>
                    </div>

                    <div className="border-t border-[#063e8e]/8 pt-3 text-xs text-slate-500">
                      {formatDate(item.updated_at)}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </AdminTableLayout>

      <MediaFormDialog
        open={dialogOpen}
        initial={editTarget}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa ảnh"
        description={
          <>
            Bạn có chắc muốn xóa ảnh <span className="font-semibold">{deleteTarget?.name}</span>?
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
