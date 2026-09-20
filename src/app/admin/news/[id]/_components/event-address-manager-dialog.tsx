"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteApiV10EventAddressId,
  useGetApiV10EventAddress,
  usePostApiV10EventAddress,
  usePutApiV10EventAddressId,
} from "@/api/vcci-news/endpoints/event-address";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PermissionGate } from "@/components/shared/permission-gate";

const EVENT_ADDRESS_QUERY_KEY = "/api/v1.0/eventAddress";

interface EventAddressItem {
  id: string;
  information: string;
}

interface EventAddressManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventAddressManagerDialog({
  open,
  onOpenChange,
}: EventAddressManagerDialogProps) {
  const queryClient = useQueryClient();
  const [newInformation, setNewInformation] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingInformation, setEditingInformation] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useGetApiV10EventAddress(
    open ? { page: 1, pageSize: 100, sortField: "information", sortOrder: "asc" } : undefined,
  );

  const addresses = useMemo(() => {
    const rows = data?.responseData?.rows ?? [];
    return rows
      .map((row) => {
        const record = (row ?? {}) as Record<string, unknown>;
        return {
          id: String(record.id ?? ""),
          information: String(record.information ?? "").trim(),
        };
      })
      .filter((item) => item.id && item.information);
  }, [data]);

  const invalidateAddresses = () => {
    queryClient.invalidateQueries({
      queryKey: [EVENT_ADDRESS_QUERY_KEY],
      exact: false,
    });
  };

  const createMutation = usePostApiV10EventAddress({
    mutation: { onSettled: invalidateAddresses },
  });
  const updateMutation = usePutApiV10EventAddressId({
    mutation: { onSettled: invalidateAddresses },
  });
  const deleteMutation = useDeleteApiV10EventAddressId({
    mutation: { onSettled: invalidateAddresses },
  });

  const handleCreate = async () => {
    const value = newInformation.trim();
    if (!value) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }

    try {
      await createMutation.mutateAsync({ data: { information: value } });
      toast.success("Tạo địa chỉ thành công");
      setNewInformation("");
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Tạo địa chỉ thất bại");
    }
  };

  const handleStartEdit = (item: EventAddressItem) => {
    setEditingId(item.id);
    setEditingInformation(item.information);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingInformation("");
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    const value = editingInformation.trim();
    if (!value) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editingId, data: { information: value } });
      toast.success("Cập nhật địa chỉ thành công");
      setEditingId(null);
      setEditingInformation("");
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Cập nhật địa chỉ thất bại");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteMutation.mutateAsync({ id: deletingId });
      toast.success("Xóa địa chỉ thành công");
      setDeletingId(null);
    } catch (error) {
      const err = error as { message?: string };
      toast.error(err?.message || "Xóa địa chỉ thất bại");
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setEditingId(null);
      setEditingInformation("");
      setDeletingId(null);
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quản lý địa điểm</DialogTitle>
          <DialogDescription>
            Danh sách địa điểm dùng cho các sự kiện trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <PermissionGate required="settings:write">
          <div className="flex gap-2">
            <Input
              value={newInformation}
              onChange={(event) => setNewInformation(event.target.value)}
              placeholder="Nhập địa chỉ mới"
              className="rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleCreate();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleCreate}
              disabled={createMutation.isPending || !newInformation.trim()}
              className="shrink-0 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Thêm
            </Button>
          </div>
        </PermissionGate>

        <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải danh sách địa chỉ...
            </div>
          ) : addresses.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">Chưa có địa chỉ nào</p>
          ) : (
            addresses.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-[#063e8e]/10 px-3 py-2"
              >
                {editingId === item.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      value={editingInformation}
                      onChange={(event) => setEditingInformation(event.target.value)}
                      className="h-8 rounded-lg border-[#063e8e]/15 bg-white text-sm text-gray-700"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleUpdate();
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleUpdate}
                      disabled={updateMutation.isPending || !editingInformation.trim()}
                    >
                      Lưu
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Hủy
                    </Button>
                  </div>
                ) : deletingId === item.id ? (
                  <>
                    <span className="text-sm text-gray-700">Xóa địa chỉ này?</span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={handleConfirmDelete}
                        disabled={deleteMutation.isPending}
                      >
                        Xóa
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingId(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-700">{item.information}</span>
                    <PermissionGate required="settings:write">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="rounded-full p-1.5 text-gray-500 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                          aria-label="Sửa địa chỉ"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(item.id)}
                          className="rounded-full p-1 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          aria-label="Xóa địa chỉ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </PermissionGate>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
