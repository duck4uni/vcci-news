"use client";

import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NoPermissionMessage, PermissionGate } from "@/components/shared/permission-gate";
import { usePermission } from "@/hooks/usePermission";

// API imports
import {
  useGetApiV10User,
  usePostApiV10User,
  useDeleteApiV10UserId,
  usePatchApiV10UserIdStatus,
  usePostApiV10UserIdResetPassword,
  usePostApiV10UserIdRole,
  useDeleteApiV10UserIdRole,
  useGetApiV10UserId,
  usePutApiV10UserId,
} from "@/api/vcci-news/endpoints/user";
import type { UserUpdate } from "@/api/vcci-news/models/userUpdate";
import { useGetApiV10Role } from "@/api/vcci-news/endpoints/role";

import { UserFiltersBar } from "./_components/UserFiltersBar";
import { UserTable } from "./_components/UserTable";
import { Pagination } from "./_components/Pagination";
import { CreateUserDialog } from "./_components/CreateUserDialog";
import { EditUserDialog } from "./_components/EditUserDialog";
import { RoleDialog } from "./_components/RoleDialog";
import { DeleteUserDialog } from "./_components/DeleteUserDialog";
import {
  PAGE_SIZE,
  type CreateForm,
  type EditForm,
  type Role,
  type User,
  type UserFilters,
} from "./_components/types";

export default function UsersPage() {
  const canReadUsers = usePermission("users", "read");
  const canWriteUsers = usePermission("users", "write");
  const canDeleteUsers = usePermission("users", "delete");
  const queryClient = useQueryClient();

  // Filters
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "",
    role: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Create form
  const [createForm, setCreateForm] = useState<CreateForm>({
    email: "",
    password: "vcci@2026",
    username: "",
    first_name: "",
    last_name: "",
  });

  // Edit form
  const [editForm, setEditForm] = useState<EditForm>({
    username: "",
    first_name: "",
    last_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Build API params
  const apiParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: currentPage,
      pageSize: PAGE_SIZE,
      sortField: "created_at",
      sortOrder: "desc",
    };

    const filterConditions: string[] = [];

    if (filters.search) {
      filterConditions.push(`email:$like:${filters.search}`);
    }
    if (filters.status) {
      filterConditions.push(`status==${filters.status}`);
    }
    if (filters.role) {
      filterConditions.push(`role==${filters.role}`);
    }

    if (filterConditions.length > 0) {
      params.filters = filterConditions.join(",");
    }

    return params;
  }, [currentPage, filters]);

  // Fetch users with filters
  const { data: usersData, isLoading: usersLoading, isFetching } = useGetApiV10User(
    apiParams as Parameters<typeof useGetApiV10User>[0]
  );

  // Fetch single user for edit
  const { data: editUserData } = useGetApiV10UserId(
    selectedUser?.id || "",
    selectedUser ? {} : { query: { enabled: false } } as Parameters<typeof useGetApiV10UserId>[1]
  );

  // Fetch roles
  const { data: rolesData } = useGetApiV10Role({
    page: 1,
    pageSize: 100,
  });

  // Mutations
  const createUserMutation = usePostApiV10User();
  const updateUserMutation = usePutApiV10UserId();
  const deleteUserMutation = useDeleteApiV10UserId();
  const toggleStatusMutation = usePatchApiV10UserIdStatus();
  const resetPasswordMutation = usePostApiV10UserIdResetPassword();
  const assignRoleMutation = usePostApiV10UserIdRole();
  const removeRoleMutation = useDeleteApiV10UserIdRole();

  // Data
  const roles: Role[] = ((rolesData as unknown as { responseData?: { rows?: Role[] } })?.responseData?.rows) || [];
  const users: User[] = ((usersData as unknown as { responseData?: { rows?: User[] } })?.responseData?.rows) || [];
  const totalUsers = ((usersData as unknown as { responseData?: { count?: number } })?.responseData?.count) || 0;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  // Handlers
  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
    });
    setNewPassword("");
    setIsEditDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!createForm.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        data: {
          email: createForm.email,
          password: createForm.password,
          username: createForm.username || "",
          first_name: createForm.first_name || undefined,
          last_name: createForm.last_name || undefined,
        },
      });
      toast.success("Tạo người dùng thành công!");
      setIsCreateDialogOpen(false);
      setCreateForm({
        email: "",
        password: "vcci@2026",
        username: "",
        first_name: "",
        last_name: "",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"], exact: false });
      setCurrentPage(1);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Tạo người dùng thất bại");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const updateData: Record<string, string | undefined> = {
        username: editForm.username || undefined,
        first_name: editForm.first_name || undefined,
        last_name: editForm.last_name || undefined,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: updateData as UserUpdate,
      });
      toast.success("Cập nhật người dùng thành công!");
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Cập nhật người dùng thất bại");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserMutation.mutateAsync({ id: userToDelete.id });
      toast.success("Xóa người dùng thành công!");
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Xóa người dùng thất bại");
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await toggleStatusMutation.mutateAsync({
        id: user.id,
        data: { status: newStatus },
      });
      toast.success(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} tài khoản`);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Thay đổi trạng thái thất bại");
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      await resetPasswordMutation.mutateAsync({ id: user.id });
      toast.success(`Đã reset mật khẩu về vcci@2026 cho ${user.email}`);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Reset mật khẩu thất bại");
    }
  };

  const handleOpenRoleDialog = (user: User) => {
    setSelectedUser(user);
    setUserRoles(user.roles || []);
    setIsRoleDialogOpen(true);
  };

  const handleToggleRole = (roleName: string) => {
    setUserRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser || userRoles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một vai trò");
      return;
    }

    try {
      // Compute diff between current roles (from selectedUser) and new
      // selection (userRoles). Both arrays hold role *names*.
      const currentRoleNames = selectedUser.roles ?? [];
      const currentRoleSet = new Set(currentRoleNames);
      const newRoleSet = new Set(userRoles);

      // Roles to remove: in current but not in new
      const rolesToRemove = currentRoleNames.filter(
        (name) => !newRoleSet.has(name),
      );
      // Roles to add: in new but not in current
      const rolesToAdd = userRoles.filter(
        (name) => !currentRoleSet.has(name),
      );

      // Resolve role IDs from name
      const roleByName = new Map(roles.map((r) => [r.name, r]));

      // 1. Remove roles no longer selected
      for (const roleName of rolesToRemove) {
        const role = roleByName.get(roleName);
        if (!role) continue;
        await removeRoleMutation.mutateAsync({
          id: selectedUser.id,
          data: { role_id: role.id },
        });
      }

      // 2. Add new roles. userRoles[0] is treated as primary.
      //    Non-primary roles get is_primary=false.
      for (let i = 0; i < rolesToAdd.length; i++) {
        const role = roleByName.get(rolesToAdd[i]);
        if (!role) continue;
        await assignRoleMutation.mutateAsync({
          id: selectedUser.id,
          data: {
            role_id: role.id,
            is_primary: i === 0,
          },
        });
      }

      // 3. If no roles were added but primary changed (e.g. user reordered
      //    existing roles), still POST the first selected role with
      //    is_primary=true. Backend will update is_primary without 409.
      if (rolesToAdd.length === 0 && rolesToRemove.length === 0) {
        const primaryRole = roleByName.get(userRoles[0]);
        if (primaryRole) {
          await assignRoleMutation.mutateAsync({
            id: selectedUser.id,
            data: {
              role_id: primaryRole.id,
              is_primary: true,
            },
          });
        }
      }

      toast.success("Cập nhật vai trò thành công!");
      setIsRoleDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/v1.0/user"], exact: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Cập nhật vai trò thất bại");
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, role: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: "", status: "", role: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.search || filters.status || filters.role;

  const handleRequestDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  if (!canReadUsers) {
    return <NoPermissionMessage />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#163b73]">Quản lý Người dùng</h1>
          <p className="mt-1 text-sm text-slate-600">
            Quản lý tài khoản và vai trò người dùng
          </p>
        </div>
        <PermissionGate required="users:write">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm người dùng
          </Button>
        </PermissionGate>
      </div>

      {/* Filters */}
      <UserFiltersBar
        filters={filters}
        handleSearchChange={handleSearchChange}
        handleStatusFilterChange={handleStatusFilterChange}
        handleRoleFilterChange={handleRoleFilterChange}
        clearFilters={clearFilters}
        hasActiveFilters={!!hasActiveFilters}
        roles={roles}
        isFetching={isFetching}
        usersLoading={usersLoading}
        totalUsers={totalUsers}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        usersLoading={usersLoading}
        currentPage={currentPage}
        handleOpenEdit={handleOpenEdit}
        handleOpenRoleDialog={handleOpenRoleDialog}
        handleResetPassword={handleResetPassword}
        handleToggleStatus={handleToggleStatus}
        onRequestDelete={handleRequestDelete}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalUsers={totalUsers}
        usersLoading={usersLoading}
        setCurrentPage={setCurrentPage}
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        createForm={createForm}
        setCreateForm={setCreateForm}
        handleCreateUser={handleCreateUser}
        isPending={createUserMutation.isPending}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedUser={selectedUser}
        editForm={editForm}
        setEditForm={setEditForm}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleUpdateUser={handleUpdateUser}
        isPending={updateUserMutation.isPending}
      />

      {/* Assign Role Dialog */}
      <RoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        selectedUser={selectedUser}
        roles={roles}
        userRoles={userRoles}
        handleToggleRole={handleToggleRole}
        handleSaveRoles={handleSaveRoles}
        assignRolePending={assignRoleMutation.isPending}
        removeRolePending={removeRoleMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userToDelete={userToDelete}
        handleDeleteUser={handleDeleteUser}
        isPending={deleteUserMutation.isPending}
      />
    </div>
  );
}
