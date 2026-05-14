"use client";

import * as React from "react";
import { Plus, Save, Video, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createVideoId,
  EMPTY_VIDEO_FORM,
  type VideoFormValues,
  type VideoItem,
  persistVideos,
  readVideos,
} from "@/mockdata/videos";

const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

interface VideoFormDialogProps {
  open: boolean;
  initial: VideoItem | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: VideoFormValues) => void;
}

function VideoFormDialog({ open, initial, onOpenChange, onSave }: VideoFormDialogProps) {
  const [form, setForm] = React.useState<VideoFormValues>(EMPTY_VIDEO_FORM);

  React.useEffect(() => {
    if (!open) return;

    setForm(
      initial
        ? {
            id: initial.id,
            name: initial.name,
            url: initial.url,
          }
        : EMPTY_VIDEO_FORM,
    );
  }, [initial, open]);

  const handleField = <K extends keyof VideoFormValues>(key: K, value: VideoFormValues[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên video");
      return;
    }

    if (!form.url.trim()) {
      toast.error("Vui lòng nhập link URL");
      return;
    }

    onSave({
      id: form.id,
      name: form.name.trim(),
      url: form.url.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border-[#063e8e]/15 bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#063e8e]">
            {initial ? "Chỉnh sửa video" : "Thêm video mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-gray-700">
              Tên video <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(event) => handleField("name", event.target.value)}
              placeholder="Nhập tên video..."
              className={fieldClassName}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700">
              Link URL <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.url}
              onChange={(event) => handleField("url", event.target.value)}
              placeholder="https://..."
              className={fieldClassName}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#063e8e]/15 text-gray-700"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminVideosPage() {
  const [items, setItems] = React.useState<VideoItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<VideoItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<VideoItem | null>(null);

  React.useEffect(() => {
    setItems(readVideos());
    setReady(true);
  }, []);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) || item.url.toLowerCase().includes(keyword),
    );
  }, [items, search]);

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (item: VideoItem) => {
    setEditTarget(item);
    setDialogOpen(true);
  };

  const handleSave = (data: VideoFormValues) => {
    let next: VideoItem[];

    if (data.id) {
      next = items.map((item) => (item.id === data.id ? { ...item, ...data, id: data.id } : item));
      toast.success("Đã cập nhật video");
    } else {
      next = [
        ...items,
        {
          id: createVideoId(),
          name: data.name,
          url: data.url,
        },
      ];
      toast.success("Đã thêm video mới");
    }

    setItems(next);
    persistVideos(next);
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const next = items.filter((item) => item.id !== deleteTarget.id);
    setItems(next);
    persistVideos(next);
    toast.success("Đã xóa video");
    setDeleteTarget(null);
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
            Tổng số video: {items.length}
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
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center text-gray-400">
                  Không có video nào
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
                >
                  <TableCell className="py-3 text-center text-sm text-gray-500">
                    {index + 1}
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
      </AdminTableLayout>

      <VideoFormDialog
        open={dialogOpen}
        initial={editTarget}
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
