"use client";

import { useState } from "react";
import { CheckCheck, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_NEW_PASSWORD, type PasswordResetRequest } from "./types";

interface ResolveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: PasswordResetRequest | null;
  onConfirm: (newPassword: string, resolveNote: string) => void;
  isResolving?: boolean;
}

export function ResolveDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isResolving,
}: ResolveDialogProps) {
  const [newPassword, setNewPassword] = useState(DEFAULT_NEW_PASSWORD);
  const [resolveNote, setResolveNote] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    onConfirm(newPassword.trim(), resolveNote.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border-[#063e8e]/15">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#163b73]">Reset mật khẩu</DialogTitle>
          <DialogDescription>
            Reset mật khẩu cho email{" "}
            <strong className="text-[#063e8e]">{request?.email}</strong>.
            User sẽ phải đổi mật khẩu khi đăng nhập lần tiếp theo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mật khẩu mới</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="h-10 rounded-xl border-[#063e8e]/15 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyPassword}
                className="h-10 rounded-xl border-[#063e8e]/15"
                title="Copy mật khẩu"
              >
                {copied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Mật khẩu mặc định: <code className="rounded bg-slate-100 px-1">{DEFAULT_NEW_PASSWORD}</code>.
              Bạn có thể đổi sang mật khẩu tùy chỉnh.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Ghi chú (tùy chọn)</Label>
            <Textarea
              value={resolveNote}
              onChange={(e) => setResolveNote(e.target.value)}
              placeholder="VD: Đã gọi điện xác nhận, đã gửi mật khẩu qua Zalo..."
              rows={3}
              className="rounded-xl border-[#063e8e]/15 resize-none"
            />
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Lưu ý: Sau khi reset, bạn cần gửi mật khẩu mới cho user qua kênh khác
            (điện thoại, Zalo, email cá nhân, etc.).
          </div>
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
            disabled={isResolving || newPassword.length < 6}
            className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {isResolving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset mật khẩu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
