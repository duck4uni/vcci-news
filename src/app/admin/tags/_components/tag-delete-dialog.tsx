"use client";

import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

import type { TagItem } from "./types";

interface TagDeleteDialogProps {
  target: TagItem | null;
  onTargetChange: (target: TagItem | null) => void;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export function TagDeleteDialog({
  target,
  onTargetChange,
  onConfirm,
}: TagDeleteDialogProps) {
  return (
    <AdminDeleteDialog
      open={!!target}
      title="Xóa tag"
      description={
        target ? (
          <>
            Bạn có chắc chắn muốn xóa tag <strong>{target.name}</strong>?
          </>
        ) : (
          ""
        )
      }
      onOpenChange={(open) => {
        if (!open) {
          onTargetChange(null);
        }
      }}
      onConfirm={() => void onConfirm()}
    />
  );
}
