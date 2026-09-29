"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteApiV10PositionId,
  useGetApiV10Position,
  usePostApiV10Position,
  usePutApiV10PositionId,
} from "@/api/vcci-news/endpoints/position";
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
import { RegionFormDialog } from "./_components/region-form-dialog";

export default function AdminMemberRegionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const positionsQuery = useGetApiV10Position({
    page: 1,
    pageSize: 200,
    sortField: "created_at",
    sortOrder: "desc",
  });

  const { mutateAsync: createPosition, isPending: isCreating } = usePostApiV10Position();
  const { mutateAsync: updatePosition, isPending: isUpdating } = usePutApiV10PositionId();
  const { mutateAsync: deletePosition, isPending: isDeleting } = useDeleteApiV10PositionId();

  const items = useMemo(() => {
    const rows = extractRows((positionsQuery.data as any)?.responseData);
    return rows.map((row: any) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? ""),
    }));
  }, [positionsQuery.data]);

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
        await updatePosition({ id: data.id, data: { name: data.name } });
        toast.success("Đã cập nhật chức vụ");
      } else {
        await createPosition({ data: { name: data.name } });
        toast.success("Đã thêm chức vụ mới");
      }
      queryClient.invalidateQueries();
      setDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Không lưu được chức vụ");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePosition({ id: deleteTarget.id });
      queryClient.invalidateQueries();
      toast.success("Đã xóa chức vụ");
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Không xóa được chức vụ");
    }
  };

  const hasLoaded = positionsQuery.isSuccess || positionsQuery.isError;
  const saving = isCreating || isUpdating;

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm chức vụ..."
        actionLabel="Thêm chức vụ"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionMeta={
          <div className="text-sm font-medium text-gray-700">
            Tổng chức vụ: <span className="font-semibold text-[#063e8e]">{items.length}</span>
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-white">Tên chức vụ</TableHead>
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
                  Không có chức vụ nào
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
                        { kind: "edit", label: "Chỉnh sửa chức vụ", onClick: () => openEdit(item) },
                        { kind: "delete", label: "Xóa chức vụ", onClick: () => setDeleteTarget(item) },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableLayout>

      <RegionFormDialog
        open={dialogOpen}
        initial={editTarget}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        saving={saving || isDeleting}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa chức vụ"
        description={
          <>
            Bạn có chắc muốn xóa chức vụ{" "}
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
