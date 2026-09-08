"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateForm } from "./types";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createForm: CreateForm;
  setCreateForm: React.Dispatch<React.SetStateAction<CreateForm>>;
  handleCreateUser: () => void;
  isPending: boolean;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  createForm,
  setCreateForm,
  handleCreateUser,
  isPending,
}: CreateUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border-[#063e8e]/15 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-[#163b73]">Thêm người dùng mới</DialogTitle>
          <DialogDescription className="text-sm">
            Tạo tài khoản mới. Mật khẩu mặc định: <strong>vcci@2026</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Email *</Label>
            <Input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
              className="h-10 rounded-xl border-[#063e8e]/15"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Họ</Label>
              <Input
                value={createForm.first_name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, first_name: e.target.value }))}
                placeholder="Họ"
                className="h-10 rounded-xl border-[#063e8e]/15"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Tên</Label>
              <Input
                value={createForm.last_name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, last_name: e.target.value }))}
                placeholder="Tên"
                className="h-10 rounded-xl border-[#063e8e]/15"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Username</Label>
            <Input
              value={createForm.username}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="username"
              className="h-10 rounded-xl border-[#063e8e]/15"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Mật khẩu</Label>
            <Input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="vcci@2026"
              className="h-10 rounded-xl border-[#063e8e]/15"
            />
            <p className="text-xs text-slate-500">
              Mật khẩu mặc định: vcci@2026
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
            onClick={handleCreateUser}
            disabled={!createForm.email || isPending}
            className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Tạo người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
