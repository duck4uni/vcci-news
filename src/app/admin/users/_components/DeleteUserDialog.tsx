"use client";

import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "./types";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: User | null;
  handleDeleteUser: () => void;
  isPending: boolean;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  userToDelete,
  handleDeleteUser,
  isPending,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-red-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600">Xác nhận xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa người dùng "{userToDelete?.email}"? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[#063e8e]/15"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={isPending}
            className="rounded-xl bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Xóa người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
