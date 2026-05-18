"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Hash, Plus, Tag } from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { Pagination } from "@/components/base/pagination";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type CmsTagItem,
  createCmsTag,
  deleteCmsTag,
  fetchCmsTagsPage,
  updateCmsTag,
} from "@/lib/api/cms-admin";

interface TagFormValues {
  id?: string;
  name: string;
  slug: string;
}

const PAGE_SIZE = 10;

const EMPTY_FORM: TagFormValues = {
  name: "",
  slug: "",
};

const fieldClassName =
  "rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

const slugifyTag = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function AdminTagsPage() {
  const [items, setItems] = React.useState<CmsTagItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [isReady, setIsReady] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState<TagFormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = React.useState<CmsTagItem | null>(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);

  const load = React.useCallback(async () => {
    setIsReady(false);

    const keyword = search.trim();
    const result = await fetchCmsTagsPage({
      page,
      pageSize: PAGE_SIZE,
      filters: keyword ? `name@=${keyword}|slug@=${keyword}` : undefined,
    });

    setItems(result.items);
    setTotal(result.total);
    setIsReady(true);
  }, [page, search]);

  React.useEffect(() => {
    void load().catch((error) => {
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách tag");
      setItems([]);
      setTotal(0);
      setIsReady(true);
    });
  }, [load]);

  React.useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openCreate = () => {
    setFormValues(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (item: CmsTagItem) => {
    setFormValues({
      id: item.id,
      name: item.name,
      slug: item.slug,
    });
    setFormOpen(true);
  };

  const handleNameChange = (value: string) => {
    setFormValues((previous) => ({
      ...previous,
      name: value,
      slug: slugifyTag(value),
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formValues.name.trim()) {
      toast.error("Tên tag là bắt buộc");
      return;
    }

    const payload = {
      name: formValues.name.trim(),
      slug: formValues.slug.trim() || slugifyTag(formValues.name),
    };

    setIsSubmitting(true);

    try {
      if (formValues.id) {
        await updateCmsTag(formValues.id, payload);
        toast.success("Cập nhật tag thành công");
      } else {
        await createCmsTag(payload);
        toast.success("Tạo tag thành công");
      }

      await load();
      setFormOpen(false);
      setFormValues(EMPTY_FORM);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể lưu tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await deleteCmsTag(deleteTarget.id);
      toast.success("Xóa tag thành công");
      setDeleteTarget(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm tag..."
        actionLabel="Thêm tag"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionDisabled={!isReady}
        actionMeta={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
            Tổng số tags: {total}
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-[320px] py-4 text-center text-white">
                Tên tag
              </TableHead>
              <TableHead className="py-4 text-center text-white">Slug</TableHead>
              <TableHead className="w-[170px] py-4 text-center text-white">
                Ngày tạo
              </TableHead>
              <TableHead className="w-[170px] py-4 text-center text-white">
                Ngày cập nhật
              </TableHead>
              <TableHead className="w-[120px] py-4 text-center text-white">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isReady ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <TableCell key={cellIndex} className="py-4">
                      <div className="h-5 rounded-full bg-[#063e8e]/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-14 text-center text-gray-700">
                  Không có tag nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#063e8e]/[0.03]">
                  <TableCell className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className="rounded-full border-[#063e8e]/20 bg-[#063e8e]/[0.04] px-3 py-1 text-[#063e8e]"
                    >
                      <Tag className="mr-1.5 h-3.5 w-3.5" />
                      {item.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-mono text-sm text-gray-700">
                    <Hash className="mr-1 inline h-3.5 w-3.5 text-[#063e8e]" />
                    {item.slug}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-gray-700">
                    {item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY") : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-center text-gray-700">
                    {item.updated_at ? dayjs(item.updated_at).format("DD/MM/YYYY") : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <AdminRowActions
                      actions={[
                        { kind: "edit", label: "Chỉnh sửa tag", onClick: () => openEdit(item) },
                        { kind: "delete", label: "Xóa tag", onClick: () => setDeleteTarget(item) },
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
              {Math.min(page * PAGE_SIZE, total)} của {total} tag
            </div>
            <Pagination
              page={page}
              pageCount={totalPages}
              onChangePage={handlePageChange}
            />
          </div>
        ) : null}
      </AdminTableLayout>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="rounded-3xl border-[#063e8e]/15 bg-white text-gray-700 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[#063e8e]">
              {formValues.id ? "Chỉnh sửa tag" : "Tạo tag"}
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              Tag ở đây dùng cho phần tag tìm kiếm của bài viết.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-1.5 block text-gray-700">
                Tên tag <span className="text-red-600">*</span>
              </Label>
              <Input
                value={formValues.name}
                onChange={(event) => handleNameChange(event.target.value)}
                placeholder="Nhập tên tag"
                className={fieldClassName}
              />
            </div>

            <div>
              <Label className="mb-1.5 block text-gray-700">Slug</Label>
              <Input
                value={formValues.slug}
                onChange={(event) =>
                  setFormValues((previous) => ({
                    ...previous,
                    slug: slugifyTag(event.target.value),
                  }))
                }
                placeholder="slug-tag"
                className={fieldClassName}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
              onClick={() => setFormOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              onClick={() => void handleSubmit()}
            >
              {isSubmitting ? "Đang lưu..." : formValues.id ? "Cập nhật tag" : "Lưu tag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa tag"
        description={
          deleteTarget ? (
            <>
              Bạn có chắc chắn muốn xóa tag <strong>{deleteTarget.name}</strong>?
            </>
          ) : (
            ""
          )
        }
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
