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
import { Role } from "./types";

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToDelete: Role | null;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteRoleDialog({
  open,
  onOpenChange,
  roleToDelete,
  onConfirm,
  isPending,
}: DeleteRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-red-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-600">Xác nhận xóa vai trò</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xóa vai trò "{roleToDelete?.name}"? Hành động này không thể
            hoàn tác.
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
            onClick={onConfirm}
            disabled={isPending}
            className="rounded-xl bg-red-600 hover:bg-red-700"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Xóa vai trò
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
