"use client";

import type { Dispatch, SetStateAction } from "react";
import { Check, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_PERMISSIONS, EditForm, Role, SYSTEM_ROLES } from "./types";

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRole: Role | null;
  editForm: EditForm;
  setEditForm: Dispatch<SetStateAction<EditForm>>;
  onTogglePermission: (permission: string) => void;
  onSave: () => void;
  isPending: boolean;
}

export function EditRoleDialog({
  open,
  onOpenChange,
  selectedRole,
  editForm,
  setEditForm,
  onTogglePermission,
  onSave,
  isPending,
}: EditRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden rounded-3xl border-[#063e8e]/15">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#163b73]">
            {selectedRole ? "Sửa vai trò" : "Tạo vai trò mới"}
          </DialogTitle>
          <DialogDescription>
            {selectedRole
              ? "Cập nhật thông tin và quyền hạn của vai trò"
              : "Tạo vai trò mới và phân quyền hạn"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto px-1 py-2 max-h-[60vh]">
          <div className="space-y-2">
            <Label className="text-gray-700">Tên vai trò *</Label>
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập tên vai trò..."
              className="rounded-xl border-[#063e8e]/15"
              disabled={!!selectedRole && SYSTEM_ROLES.includes(selectedRole.name)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Mô tả</Label>
            <Textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Nhập mô tả vai trò..."
              className="rounded-xl border-[#063e8e]/15"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Quyền hạn *</Label>
            <div className="max-h-[300px] space-y-4 overflow-y-auto rounded-2xl border border-[#063e8e]/10 bg-[#f8fbff] p-4">
              {ALL_PERMISSIONS.map((group) => (
                <div key={group.resource} className="space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#163b73]">
                    <span>{group.label}</span>
                    <span className="text-xs text-slate-500">({group.resource})</span>
                  </div>
                  <div className="flex flex-wrap gap-3 pl-2">
                    {group.actions.map((action) => {
                      const permString = `${group.resource}:${action}`;
                      const isChecked = editForm.permissions.includes(permString);
                      return (
                        <label
                          key={action}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => onTogglePermission(permString)}
                            className="border-[#063e8e]/30 data-[state=checked]:bg-[#063e8e] data-[state=checked]:border-[#063e8e]"
                          />
                          <span className="text-sm text-slate-700">
                            {action}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Đã chọn: {editForm.permissions.length} quyền
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[#063e8e]/15"
          >
            Hủy
          </Button>
          <Button
            onClick={onSave}
            disabled={
              !editForm.name.trim() ||
              editForm.permissions.length === 0 ||
              isPending
            }
            className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Check className="mr-1 h-4 w-4" />
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
