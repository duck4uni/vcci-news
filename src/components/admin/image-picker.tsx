"use client";

import * as React from "react";
import { ImagePlus, Search, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import { toAdminMediaItem } from "@/lib/utils/file";
import { getApiV10File, postApiV10FileUpload } from "@/api/vcci-news/endpoints/file";
import { Pagination } from "@/components/base/pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

interface AdminImagePickerProps {
  open: boolean;
  selectedId?: string | null;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: AdminMediaItem) => void;
}

function formatFileSize(size: number) {
  if (!size) return "Ảnh hệ thống";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminImagePicker({
  open,
  selectedId,
  onOpenChange,
  onSelect,
}: AdminImagePickerProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState<AdminMediaItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!open) return;

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

      setItems((pageData.rows ?? []).map(toAdminMediaItem));
      setTotal(pageData.count ?? 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải thư viện hình ảnh");
      setItems([]);
      setTotal(0);
    } finally {
      setReady(true);
    }
  }, [open, page, search]);

  React.useEffect(() => {
    void load();
  }, [load]);

  React.useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [open, search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const response = await postApiV10FileUpload({
        file,
        original: file.name,
      });
      const uploaded = response.responseData ?? null;

      if (!uploaded) {
        throw new Error("Không thể tải hình ảnh lên");
      }

      const nextItem = toAdminMediaItem(uploaded);
      toast.success("Đã tải hình ảnh lên");
      onSelect(nextItem);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải hình ảnh lên");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-hidden rounded-3xl border-[#063e8e]/15 bg-white p-0">
        <DialogHeader className="border-b border-[#063e8e]/10 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl font-semibold text-black">
                Thư viện hình ảnh
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-gray-700">
                Chọn ảnh từ API /file hoặc tải thêm ảnh mới cho bài viết.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 border-b border-[#063e8e]/10 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm hình ảnh..."
              className="border-[#063e8e]/15 bg-white pl-9 text-gray-700 placeholder:text-gray-700"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              disabled={uploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Đang tải..." : "Tải hình ảnh"}
            </Button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6">
          {!ready ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <div
                  key={`image-picker-loading-${index}`}
                  className="overflow-hidden rounded-2xl border border-[#063e8e]/10 bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-[#063e8e]/10" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 animate-pulse rounded bg-[#063e8e]/10" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-[#063e8e]/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#063e8e]/15 bg-[#063e8e]/[0.03] px-6 text-center">
              <ImagePlus className="mb-3 h-10 w-10 text-[#063e8e]" />
              <p className="text-base font-medium text-black">Chưa có hình ảnh phù hợp</p>
              <p className="mt-1 text-sm text-gray-700">
                Hãy thử từ khóa khác hoặc tải thêm hình ảnh vào thư viện.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "group overflow-hidden rounded-2xl border bg-white text-left transition-all",
                    item.id === selectedId
                      ? "border-[#063e8e] shadow-[0_0_0_2px_rgba(6,62,142,0.12)]"
                      : "border-[#063e8e]/10 hover:border-[#063e8e]/40 hover:shadow-sm",
                  )}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#063e8e]/[0.04]">
                    <SafeNextImage
                      src={item.url}
                      alt={item.alt || item.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    {item.id === selectedId ? (
                      <div className="absolute right-3 top-3 rounded-full bg-[#063e8e] px-2 py-1 text-xs font-medium text-white">
                        Đã chọn
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-1 px-4 py-3">
                    <p className="line-clamp-1 text-sm font-medium text-black">{item.name}</p>
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-700">
                      <span>{formatFileSize(item.size)}</span>
                      <span>Tải lên</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-3 border-t border-[#063e8e]/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} đến{" "}
              {Math.min(page * PAGE_SIZE, total)} của {total} ảnh
            </div>
            <Pagination page={page} pageCount={totalPages} onChangePage={setPage} />
          </div>
        ) : null}

        <div className="flex justify-end border-t border-[#063e8e]/10 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#063e8e]/15 text-gray-700 hover:bg-[#063e8e]/[0.04]"
          >
            <X className="mr-2 h-4 w-4" />
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
