"use client";

import * as React from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { NewsDraftData } from "@/store/useNewsDraftStore";

export interface DraftRestoreDialogProps {
  open: boolean;
  draft: NewsDraftData | null;
  onRestore: () => void;
  onDiscard: () => void;
}

export function DraftRestoreDialog({
  open,
  draft,
  onRestore,
  onDiscard,
}: DraftRestoreDialogProps) {
  const savedLabel = draft?.savedAt
    ? dayjs(draft.savedAt).format("DD/MM/YYYY HH:mm")
    : "";

  const titlePreview = draft?.form?.title?.trim() || "(chưa nhập tiêu đề)";

  return (
    <Dialog open={open}>
      <DialogContent className="rounded-3xl border border-[#063e8e]/15 bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Khôi phục bản nháp?
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-gray-700">
            Phát hiện bản nháp chưa hoàn tất{" "}
            {savedLabel ? `(lưu lúc ${savedLabel})` : ""}.
            <br />
            Tiêu đề: <strong className="text-gray-900">{titlePreview}</strong>
            <br />
            Bạn có muốn khôi phục dữ liệu đã nhập không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            onClick={onDiscard}
          >
            Không, tạo mới
          </Button>
          <Button
            type="button"
            className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            onClick={onRestore}
          >
            Có, khôi phục
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
