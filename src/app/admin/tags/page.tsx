"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type CmsTagItem,
  createCmsTag,
  deleteCmsTag,
  fetchCmsTagsPage,
  updateCmsTag,
} from "@/lib/api/cms-admin";

import { TagDeleteDialog } from "./_components/tag-delete-dialog";
import { TagFormDialog } from "./_components/tag-form-dialog";
import { TagsTable } from "./_components/tags-table";
import { EMPTY_FORM, PAGE_SIZE, type TagFormValues } from "./_components/types";
import { slugifyTag } from "./_components/utils";

export default function AdminTagsPage() {
  const [items, setItems] = useState<CmsTagItem[]>([]);
  const [search, setSearch] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<TagFormValues>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<CmsTagItem | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
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

  useEffect(() => {
    void load().catch((error) => {
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách tag");
      setItems([]);
      setTotal(0);
      setIsReady(true);
    });
  }, [load]);

  useEffect(() => {
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
      <TagsTable
        search={search}
        onSearchChange={setSearch}
        isReady={isReady}
        onActionClick={openCreate}
        items={items}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <TagFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        formValues={formValues}
        onFormValuesChange={setFormValues}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <TagDeleteDialog
        target={deleteTarget}
        onTargetChange={setDeleteTarget}
        isSubmitting={isSubmitting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
