"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import type { EditForm, User } from "./types";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateUser: () => void;
  isPending: boolean;
}

export function EditUserDialog({
  open,
  onOpenChange,
  selectedUser,
  editForm,
  setEditForm,
  newPassword,
  setNewPassword,
  showPassword,
  setShowPassword,
  handleUpdateUser,
  isPending,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border-[#063e8e]/15 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-[#163b73]">Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription className="text-sm">
            Cập nhật thông tin người dùng
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email</Label>
            <Input
              type="email"
              value={selectedUser?.email || ""}
              disabled
              className="h-10 rounded-xl border-[#063e8e]/15 bg-slate-50 text-slate-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Họ</Label>
              <Input
                value={editForm.first_name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, first_name: e.target.value }))}
                placeholder="Họ"
                className="h-10 rounded-xl border-[#063e8e]/15"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Tên</Label>
              <Input
                value={editForm.last_name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, last_name: e.target.value }))}
                placeholder="Tên"
                className="h-10 rounded-xl border-[#063e8e]/15"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Username</Label>
            <Input
              value={editForm.username}
              onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="username"
              className="h-10 rounded-xl border-[#063e8e]/15"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Mật khẩu mới</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Để trống nếu không đổi mật khẩu"
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
            <p className="text-xs text-slate-500">
              Để trống nếu không muốn thay đổi mật khẩu
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-xl border-[#063e8e]/15"
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdateUser}
            disabled={isPending}
            className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
