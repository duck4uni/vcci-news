"use client";

import * as React from "react";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { HeaderCategoryTreeItem } from "@/mockdata/header-config";

interface HeaderCategoryDeleteDialogProps {
  target: HeaderCategoryTreeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function HeaderCategoryDeleteDialog({
  target,
  open,
  onOpenChange,
  onConfirm,
}: HeaderCategoryDeleteDialogProps) {
  return (
    <AdminDeleteDialog
      open={open}
      title="Xóa danh mục"
      description={
        target
          ? `Bạn có chắc chắn muốn xóa "${target.name}"? Tất cả danh mục con trực thuộc cũng sẽ bị xóa.`
          : ""
      }
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  );
}
