"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Users,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { NoPermissionMessage, PermissionGate } from "@/components/shared/permission-gate";
import { usePermission } from "@/hooks/usePermission";

// API imports
import {
  useGetApiV10Role,
  usePostApiV10Role,
  usePutApiV10RoleId,
  useDeleteApiV10RoleId,
} from "@/api/vcci-news/endpoints/role";

// Types
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

// All available permissions
const ALL_PERMISSIONS = [
  { resource: "settings", actions: ["read", "write"], label: "Cấu hình chung" },
  { resource: "categories", actions: ["read", "write", "delete"], label: "Danh mục" },
  { resource: "posts", actions: ["read", "write", "delete", "publish"], label: "Bài viết" },
  { resource: "tags", actions: ["read", "write", "delete"], label: "Tags" },
  { resource: "videos", actions: ["read", "write", "delete"], label: "Videos" },
  { resource: "newsletter", actions: ["read", "delete"], label: "Newsletter" },
  { resource: "files", actions: ["read", "write", "delete"], label: "Files/Media" },
  { resource: "advertisements", actions: ["read", "write", "delete"], label: "Quảng cáo" },
  { resource: "roles", actions: ["read", "write", "delete"], label: "Roles (Quản lý vai trò)" },
  { resource: "users", actions: ["read", "write", "delete"], label: "Users (Quản lý người dùng)" },
];

// System roles không cho phép xóa
const SYSTEM_ROLES = ["system_admin", "admin", "new"];

export default function RolesPage() {
  const canReadRoles = usePermission("roles", "read");
  const canWriteRoles = usePermission("roles", "write");
  const canDeleteRoles = usePermission("roles", "delete");
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
    permissions: string[];
  }>({ name: "", description: "", permissions: [] });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch roles
  const { data: rolesData, isLoading } = useGetApiV10Role({
    page: currentPage,
    pageSize: 10,
  });

  // Mutations
  const createRoleMutation = usePostApiV10Role();
  const updateRoleMutation = usePutApiV10RoleId();
  const deleteRoleMutation = useDeleteApiV10RoleId();

  const roles = (((rolesData as unknown as { responseData?: { rows?: Role[] } })?.responseData?.rows) || []) as Role[];
  const totalRoles = ((rolesData as unknown as { responseData?: { count?: number } })?.responseData?.count) || 0;

  // Handlers
  const handleCreateRole = () => {
    setSelectedRole(null);
    setEditForm({ name: "", description: "", permissions: [] });
    setIsEditDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setEditForm({
      name: role.name,
      description: role.description || "",
      permissions: role.permissions || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleTogglePermission = (permission: string) => {
    setEditForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSaveRole = async () => {
    if (!editForm.name.trim()) {
      toast.error("Vui lòng nhập tên vai trò");
      return;
    }

    if (editForm.permissions.length === 0) {
      toast.error("Vui lòng chọn ít nhất một quyền");
      return;
    }

    try {
      if (selectedRole) {
        // Update existing role (name, description, permissions)
        await updateRoleMutation.mutateAsync({
          id: selectedRole.id,
          data: {
            name: editForm.name,
            description: editForm.description || null,
            permissions: editForm.permissions,
          },
        });
        toast.success("Cập nhật vai trò thành công!");
      } else {
        // Create new role with permissions
        await createRoleMutation.mutateAsync({
          data: {
            name: editForm.name,
            description: editForm.description || undefined,
            permissions: editForm.permissions,
          },
        });
        toast.success("Tạo vai trò thành công!");
      }
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/role"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Lưu vai trò thất bại");
    }
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRoleMutation.mutateAsync({ id: roleToDelete.id });
      toast.success("Xóa vai trò thành công!");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/role"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Xóa vai trò thất bại");
    }
  };

  if (!canReadRoles) {
    return <NoPermissionMessage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#163b73]">Quản lý Vai trò</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý vai trò và phân quyền cho người dùng ({totalRoles} vai trò)
          </p>
        </div>
        <PermissionGate required="roles:write">
          <Button
            onClick={handleCreateRole}
            className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo vai trò mới
          </Button>
        </PermissionGate>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#063e8e]" />
        </div>
      )}

      {/* Roles List */}
      {!isLoading && (
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="rounded-[20px] border-[#063e8e]/10 transition-all hover:border-[#063e8e]/30 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#063e8e]/10">
                      <Shield className="h-6 w-6 text-[#063e8e]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#163b73]">{role.name}</h3>
                        {SYSTEM_ROLES.includes(role.name) && (
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-slate-700"
                          >
                            Hệ thống
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {role.description || "Không có mô tả"}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {role.user_count || 0} người dùng
                        </span>
                        <span>{role.permissions?.length || 0} quyền</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <PermissionGate required="roles:write">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                        className="h-9 rounded-xl text-[#063e8e] hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Sửa
                      </Button>
                    </PermissionGate>
                    <PermissionGate required="roles:delete">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role)}
                        disabled={SYSTEM_ROLES.includes(role.name)}
                        className="h-9 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Xóa
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                {/* Permissions Preview */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {(role.permissions || []).slice(0, 8).map((perm) => (
                    <Badge
                      key={perm}
                      variant="outline"
                      className="border-[#063e8e]/20 bg-[#f8fbff] text-xs"
                    >
                      {perm}
                    </Badge>
                  ))}
                  {(role.permissions?.length || 0) > 8 && (
                    <Badge
                      variant="outline"
                      className="border-[#063e8e]/20 bg-[#f8fbff] text-xs"
                    >
                      +{role.permissions.length - 8} khác
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {roles.length === 0 && !isLoading && (
        <div className="rounded-[20px] border border-[#063e8e]/10 bg-[#f8fbff] p-10 text-center">
          <p className="text-slate-500">Chưa có vai trò nào</p>
        </div>
      )}

      {/* Pagination */}
      {totalRoles > 10 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalRoles)} trong {totalRoles} vai trò
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium text-[#163b73]">
              Trang {currentPage} / {Math.ceil(totalRoles / 10)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= Math.ceil(totalRoles / 10) || isLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                              onCheckedChange={() => handleTogglePermission(permString)}
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
              onClick={() => setIsEditDialogOpen(false)}
              className="rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveRole}
              disabled={
                !editForm.name.trim() ||
                editForm.permissions.length === 0 ||
                createRoleMutation.isPending
              }
              className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {createRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Check className="mr-1 h-4 w-4" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-3xl border-red-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Xác nhận xóa vai trò</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa vai trò "{roleToDelete?.name}"? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteRoleMutation.isPending}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              {deleteRoleMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Xóa vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
