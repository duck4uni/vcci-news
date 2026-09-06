"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PasswordResetRequest } from "./types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PasswordResetRequest | null;
  onConfirm: (rejectNote: string) => void;
  isRejecting?: boolean;
}

export function RejectDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isRejecting,
}: RejectDialogProps) {
  const [rejectNote, setRejectNote] = useState("");

  const handleConfirm = () => {
    onConfirm(rejectNote.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-[#063e8e]/15">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#163b73]">Từ chối yêu cầu</DialogTitle>
          <DialogDescription>
            Từ chối yêu cầu reset mật khẩu cho email{" "}
            <strong className="text-[#063e8e]">{request?.email}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Lý do từ chối (tùy chọn)</Label>
          <Textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="VD: Email không tồn tại trong hệ thống, không thể xác minh danh tính..."
            rows={3}
            className="rounded-xl border-[#063e8e]/15 resize-none"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border-[#063e8e]/15"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isRejecting}
            className="h-10 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {isRejecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
