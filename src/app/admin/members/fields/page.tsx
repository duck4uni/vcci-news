"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteApiV10BusinessId,
  useGetApiV10Business,
  usePostApiV10Business,
  usePutApiV10BusinessId,
} from "@/api/vcci-news/endpoints/business";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { extractRows } from "@/lib/utils/admin-member";
import { FieldFormDialog } from "./_components/field-form-dialog";

export default function AdminMemberFieldsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const businessesQuery = useGetApiV10Business({
    page: 1,
    pageSize: 200,
    sortField: "created_at",
    sortOrder: "desc",
  });

  const { mutateAsync: createBusiness, isPending: isCreating } = usePostApiV10Business();
  const { mutateAsync: updateBusiness, isPending: isUpdating } = usePutApiV10BusinessId();
  const { mutateAsync: deleteBusiness, isPending: isDeleting } = useDeleteApiV10BusinessId();

  const items = useMemo(() => {
    const rows = extractRows((businessesQuery.data as any)?.responseData);
    return rows.map((row: any) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? ""),
    }));
  }, [businessesQuery.data]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [items, search]);

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (item: { id: string; name: string }) => {
    setEditTarget(item);
    setDialogOpen(true);
  };

  const handleSave = async (data: { id?: string; name: string }) => {
    try {
      if (data.id) {
        await updateBusiness({ id: data.id, data: { name: data.name } });
        toast.success("Đã cập nhật doanh nghiệp");
      } else {
        await createBusiness({ data: { name: data.name } });
        toast.success("Đã thêm doanh nghiệp mới");
      }
      queryClient.invalidateQueries();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Không lưu được doanh nghiệp");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBusiness({ id: deleteTarget.id });
      queryClient.invalidateQueries();
      toast.success("Đã xóa doanh nghiệp");
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Không xóa được doanh nghiệp");
    }
  };

  const hasLoaded = businessesQuery.isSuccess || businessesQuery.isError;
  const saving = isCreating || isUpdating;

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm doanh nghiệp..."
        actionLabel="Thêm doanh nghiệp"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionMeta={
          <div className="text-sm font-medium text-gray-700">
            Tổng doanh nghiệp: <span className="font-semibold text-[#063e8e]">{items.length}</span>
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-white">Tên doanh nghiệp</TableHead>
              <TableHead className="w-[120px] py-4 text-center text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!hasLoaded ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={3} className="px-4 py-4">
                    <div className="h-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="py-16 text-center text-gray-400">
                  Không có doanh nghiệp nào
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
                    {item.name}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <AdminRowActions
                      actions={[
                        { kind: "edit", label: "Chỉnh sửa doanh nghiệp", onClick: () => openEdit(item) },
                        { kind: "delete", label: "Xóa doanh nghiệp", onClick: () => setDeleteTarget(item) },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableLayout>

      <FieldFormDialog
        open={dialogOpen}
        initial={editTarget}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        saving={saving || isDeleting}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa doanh nghiệp"
        description={
          <>
            Bạn có chắc muốn xóa doanh nghiệp{" "}
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
