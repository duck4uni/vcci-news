"use client";

import * as React from "react";
import { Plus, Save, X } from "lucide-react";
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
  type MemberRegion,
  createMemberRegionId,
  persistMemberRegions,
  readMemberRegions,
} from "@/mockdata/members";

const fieldClassName =
  "border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

interface RegionFormDialogProps {
  open: boolean;
  initial: MemberRegion | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { id?: string; name: string }) => void;
}

function RegionFormDialog({ open, initial, onOpenChange, onSave }: RegionFormDialogProps) {
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (open) setName(initial?.name ?? "");
  }, [open, initial]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên khu vực");
      return;
    }
    onSave({ id: initial?.id, name: trimmed });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[#063e8e]/15 bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#063e8e]">
            {initial ? "Chỉnh sửa khu vực" : "Thêm khu vực mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-gray-700">
              Tên khu vực <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nhập tên khu vực..."
              className={fieldClassName}
              onKeyDown={(event) => event.key === "Enter" && handleSave()}
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

export default function AdminMemberRegionsPage() {
  const [items, setItems] = React.useState<MemberRegion[]>([]);
  const [search, setSearch] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<MemberRegion | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MemberRegion | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setItems(readMemberRegions());
    setReady(true);
  }, []);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [items, search]);

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  const openEdit = (item: MemberRegion) => {
    setEditTarget(item);
    setDialogOpen(true);
  };

  const handleSave = (data: { id?: string; name: string }) => {
    let next: MemberRegion[];

    if (data.id) {
      next = items.map((item) => (item.id === data.id ? { ...item, name: data.name } : item));
      toast.success("Đã cập nhật khu vực");
    } else {
      next = [...items, { id: createMemberRegionId(), name: data.name }];
      toast.success("Đã thêm khu vực mới");
    }

    setItems(next);
    persistMemberRegions(next);
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const next = items.filter((item) => item.id !== deleteTarget.id);
    setItems(next);
    persistMemberRegions(next);
    toast.success("Đã xóa khu vực");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm khu vực..."
        actionLabel="Thêm khu vực"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionMeta={
          <div className="text-sm font-medium text-gray-700">
            Tổng khu vực: <span className="font-semibold text-[#063e8e]">{items.length}</span>
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={openCreate}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-white">Tên khu vực</TableHead>
              <TableHead className="w-[120px] py-4 text-center text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ready ? (
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
                  Không có khu vực nào
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
                        { kind: "edit", label: "Chỉnh sửa khu vực", onClick: () => openEdit(item) },
                        { kind: "delete", label: "Xóa khu vực", onClick: () => setDeleteTarget(item) },
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
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa khu vực"
        description={
          <>
            Bạn có chắc muốn xóa khu vực{" "}
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
