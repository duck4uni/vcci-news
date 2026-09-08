"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Video } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { Pagination } from "@/components/base/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteApiV10VideoId,
  getApiV10Video,
  patchApiV10VideoId,
  postApiV10Video,
} from "@/api/vcci-news/endpoints/video";
import type { Video as CmsVideoItem } from "@/api/vcci-news/models/video";
import { PAGE_SIZE, type VideoFormValues } from "./_components/types";
import { VideoFormDialog } from "./_components/video-form-dialog";

export default function AdminVideosPage() {
  const [items, setItems] = useState<CmsVideoItem[]>([]);
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CmsVideoItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CmsVideoItem | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadVideos = useCallback(async () => {
    setReady(false);

    try {
      const keyword = search.trim();
      const response = await getApiV10Video({
        page,
        pageSize: PAGE_SIZE,
        sortField: "created_at",
        sortOrder: "desc",
        filters: keyword ? `name@=${keyword}|url@=${keyword}` : undefined,
      });
      const pageData = response.responseData ?? {};

      setItems((pageData.rows ?? []) as unknown as CmsVideoItem[]);
      setTotal(pageData.count ?? 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách video");
      setItems([]);
      setTotal(0);
    } finally {
      setReady(true);
    }
  }, [page, search]);

  useEffect(() => {
    void loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (item: CmsVideoItem) => {
    setEditTarget(item);
    setDialogOpen(true);
  };

  const handleSave = async (data: VideoFormValues) => {
    setSaving(true);

    try {
      if (data.id) {
        await patchApiV10VideoId(data.id, { name: data.name, url: data.url });
        toast.success("Đã cập nhật video");
      } else {
        await postApiV10Video({ name: data.name, url: data.url });
        toast.success("Đã thêm video mới");
      }

      setDialogOpen(false);
      await loadVideos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteApiV10VideoId(deleteTarget.id);
      toast.success("Đã xóa video");
      setDeleteTarget(null);
      await loadVideos();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa video");
    }
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm video..."
        actionLabel="Thêm video"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionMeta={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
            Tổng số video: {total}
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-center text-white">Tên video</TableHead>
              <TableHead className="w-[420px] py-4 text-center text-white">Link URL</TableHead>
              <TableHead className="w-[120px] py-4 text-center text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ready ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={4} className="px-4 py-4">
                    <div className="h-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center text-gray-400">
                  Không có video nào
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
                >
                  <TableCell className="py-3 text-center text-sm text-gray-500">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-medium text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#063e8e]/10 text-[#063e8e]">
                        <Video className="h-4 w-4" />
                      </div>
                      <span className="line-clamp-1">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-700">
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-center text-[#063e8e] hover:underline"
                    >
                      {item.url}
                    </Link>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <AdminRowActions
                      actions={[
                        { kind: "edit", label: "Chỉnh sửa video", onClick: () => openEdit(item) },
                        { kind: "delete", label: "Xóa video", onClick: () => setDeleteTarget(item) },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 ? (
          <div className="flex flex-col gap-3 border-t border-[#063e8e]/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} đến{" "}
              {Math.min(page * PAGE_SIZE, total)} của {total} video
            </div>
            <Pagination
              page={page}
              pageCount={totalPages}
              onChangePage={setPage}
            />
          </div>
        ) : null}
      </AdminTableLayout>

      <VideoFormDialog
        open={dialogOpen}
        initial={editTarget}
        saving={saving}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa video"
        description={
          <>
            Bạn có chắc muốn xóa video{" "}
            <span className="font-semibold">{deleteTarget?.name}</span>? Hành động này không thể
            hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
