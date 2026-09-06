"use client";

import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { Role, User } from "./types";

interface RoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  roles: Role[];
  userRoles: string[];
  handleToggleRole: (roleName: string) => void;
  handleSaveRoles: () => void;
  assignRolePending: boolean;
  removeRolePending: boolean;
}

export function RoleDialog({
  open,
  onOpenChange,
  selectedUser,
  roles,
  userRoles,
  handleToggleRole,
  handleSaveRoles,
  assignRolePending,
  removeRolePending,
}: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-[#063e8e]/15 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-[#163b73]">Gán vai trò</DialogTitle>
          <DialogDescription className="text-sm">
            Gán vai trò cho người dùng: <strong>{selectedUser?.email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {roles.map((role) => {
            const isSelected = userRoles.includes(role.name);
            return (
              <label
                key={role.id}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all ${isSelected
                    ? "border-[#063e8e] bg-[#f8fbff]"
                    : "border-[#063e8e]/10 hover:border-[#063e8e]/30"
                  }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggleRole(role.name)}
                  className="border-[#063e8e]/30 data-[state=checked]:bg-[#063e8e] data-[state=checked]:border-[#063e8e]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#063e8e]" />
                    <span className="font-semibold text-[#163b73]">{role.name}</span>
                    {role.name === "system_admin" && (
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700 text-xs">
                        Hệ thống
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {role.description || "Không có mô tả"}
                  </p>
                </div>
              </label>
            );
          })}
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
            onClick={handleSaveRoles}
            disabled={userRoles.length === 0 || assignRolePending || removeRolePending}
            className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {assignRolePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu vai trò
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
