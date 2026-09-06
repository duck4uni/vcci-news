"use client";

import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";

import type { CmsTagItem } from "./types";

interface TagDeleteDialogProps {
  target: CmsTagItem | null;
  onTargetChange: (target: CmsTagItem | null) => void;
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
