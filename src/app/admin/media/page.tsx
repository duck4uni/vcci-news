"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Pagination } from "@/components/base/pagination";
import { Button } from "@/components/ui/button";
import {
  type CmsFileItem,
  resolveCmsFileUrl,
} from "@/lib/utils/file";
import {
  deleteApiV10FileId,
  getApiV10File,
  postApiV10FileUpload,
} from "@/api/vcci-news/endpoints/file";
import { MediaCardSkeleton } from "./_components/media-card-skeleton";
import { MediaFormDialog } from "./_components/media-form-dialog";
import {
  type MediaFormValues,
  PAGE_SIZE,
} from "./_components/types";
import {
  formatDate,
  formatFileSize,
  getFileSize,
  resolveApiError,
} from "./_components/utils";

export default function AdminMediaPage() {
  const [items, setItems] = useState<CmsFileItem[]>([]);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CmsFileItem | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
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

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
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
