"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NoPermissionMessage, PermissionGate } from "@/components/shared/permission-gate";
import { usePermission } from "@/hooks/usePermission";

// API imports
import {
  useGetApiV10Role,
  usePostApiV10Role,
  usePutApiV10RoleId,
  useDeleteApiV10RoleId,
} from "@/api/vcci-news/endpoints/role";

import { Role, EditForm } from "./_components/types";
import { RoleCard } from "./_components/RoleCard";
import { EditRoleDialog } from "./_components/EditRoleDialog";
import { DeleteRoleDialog } from "./_components/DeleteRoleDialog";
import { Pagination } from "./_components/Pagination";

export default function RolesPage() {
  const canReadRoles = usePermission("roles", "read");
  const queryClient = useQueryClient();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    description: "",
    permissions: [],
  });
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

  const roles =
    (((rolesData as unknown as { responseData?: { rows?: Role[] } })?.responseData?.rows) || []) as Role[];
  const totalRoles =
    ((rolesData as unknown as { responseData?: { count?: number } })?.responseData?.count) || 0;

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
            <RoleCard
              key={role.id}
              role={role}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
            />
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
        <Pagination
          currentPage={currentPage}
          totalRoles={totalRoles}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit/Create Dialog */}
      <EditRoleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedRole={selectedRole}
        editForm={editForm}
        setEditForm={setEditForm}
        onTogglePermission={handleTogglePermission}
        onSave={handleSaveRole}
        isPending={createRoleMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRoleDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        roleToDelete={roleToDelete}
        onConfirm={handleConfirmDelete}
        isPending={deleteRoleMutation.isPending}
      />
    </div>
  );
}
