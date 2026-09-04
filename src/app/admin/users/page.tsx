"use client";

import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  UserCog,
  Shield,
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Key,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  putApiV10UserId,
} from "@/api/vcci-news/endpoints/user";
import type { UserUpdate } from "@/api/vcci-news/models/userUpdate";
import { useGetApiV10Role } from "@/api/vcci-news/endpoints/role";

// Types
interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  status: string;
  type?: string;
  gender?: string | null;
  hometown?: string | null;
  bio?: string | null;
  roles?: string[];
  user_auth?: {
    must_change_password?: boolean;
  };
  last_login_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Role {
  id: string;
  name: string;
  description?: string;
  user_count?: number;
}

interface UserFilters {
  search: string;
  status: string;
  role: string;
}

const PAGE_SIZE = 10;

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateStr?: string | null) {
  if (!dateStr) return "Chưa đăng nhập";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return `${Math.floor(diffDays / 30)} tháng trước`;
}

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
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "vcci@2026",
    username: "",
    first_name: "",
    last_name: "",
  });

  // Edit form
  const [editForm, setEditForm] = useState({
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
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#063e8e]/10 bg-white p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Tìm kiếm email..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="rounded-xl border-[#063e8e]/15 pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-44 rounded-xl border-[#063e8e]/15">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="pending_verification">Chờ duyệt</SelectItem>
            <SelectItem value="inactive">Không hoạt động</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.role} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-[180px] rounded-xl border-[#063e8e]/15">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.name}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 rounded-xl text-slate-600 hover:text-slate-700"
          >
            <X className="mr-1 h-4 w-4" />
            Xóa lọc
          </Button>
        )}

        <div className="ml-auto text-sm text-slate-500">
          {isFetching && !usersLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải...
            </span>
          ) : (
            `${totalUsers} người dùng`
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-[#063e8e]/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">STT</TableHead>
                <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">Email</TableHead>
                <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">Họ tên</TableHead>
                <TableHead className="py-3 text-white text-sm font-semibold whitespace-nowrap">Vai trò</TableHead>
                <TableHead className="py-3 text-center text-white text-sm font-semibold whitespace-nowrap">Trạng thái</TableHead>
                <TableHead className="py-3 text-center text-white text-sm font-semibold whitespace-nowrap">Ngày tạo</TableHead>
                <TableHead className="py-3 text-center text-white text-sm font-semibold whitespace-nowrap">Cập nhật</TableHead>
                <TableHead className="w-24 py-3 text-center text-white text-sm font-semibold whitespace-nowrap">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#063e8e]" />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-slate-500">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-[#063e8e]/5 hover:bg-[#063e8e]/2"
                  >
                    <TableCell className="text-center text-slate-600 whitespace-nowrap">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-700 truncate max-w-[180px]" title={user.email}>
                        {user.email}
                      </p>
                      {user.username && (
                        <p className="text-xs text-slate-400">@{user.username}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-[#163b73] whitespace-nowrap">
                        {user.first_name || user.last_name ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "-"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {user.roles?.slice(0, 2).map((roleName) => (
                          <Badge
                            key={roleName}
                            variant="secondary"
                            className="border border-[#063e8e]/20 bg-[#f8fbff] text-sm px-2 py-0.5 whitespace-nowrap"
                          >
                            {roleName}
                          </Badge>
                        ))}
                        {(user.roles?.length || 0) > 2 && (
                          <Badge
                            variant="secondary"
                            className="border border-[#063e8e]/20 bg-[#f8fbff] text-sm px-2 py-0.5"
                          >
                            +{user.roles!.length - 2}
                          </Badge>
                        )}
                        {(!user.roles || user.roles.length === 0) && (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`text-sm whitespace-nowrap ${user.status === "active"
                              ? "border-green-200 bg-green-50 text-green-700"
                              : user.status === "pending_verification"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                        >
                          {user.status === "active" ? (
                            <CheckCircle className="mr-1 h-4 w-4" />
                          ) : user.status === "pending_verification" ? (
                            <Clock className="mr-1 h-4 w-4" />
                          ) : (
                            <XCircle className="mr-1 h-4 w-4" />
                          )}
                          {user.status === "active" ? "Hoạt động" :
                            user.status === "pending_verification" ? "Chờ duyệt" :
                              user.status === "inactive" ? "Khóa" : user.status}
                        </Badge>
                        {user.user_auth?.must_change_password && (
                          <Badge
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-slate-600 text-sm px-1.5"
                          >
                            <Key className="mr-0.5 h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="text-sm text-slate-500 whitespace-nowrap">
                        {user.created_at ? formatDate(user.created_at) : "-"}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="text-sm text-slate-500 whitespace-nowrap">
                        {user.updated_at ? formatDate(user.updated_at) : "-"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <PermissionGate required="users:write">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-lg"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenRoleDialog(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Gán vai trò
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Reset mật khẩu
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user)}
                              className={user.status === "active" ? "text-red-600" : "text-green-600"}
                            >
                              {user.status === "active" ? (
                                <>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Vô hiệu hóa
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Kích hoạt
                                </>
                              )}
                            </DropdownMenuItem>
                            <PermissionGate required="users:delete">
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDelete(user);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </PermissionGate>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </PermissionGate>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {(currentPage - 1) * PAGE_SIZE + 1} - {Math.min(currentPage * PAGE_SIZE, totalUsers)} trong {totalUsers} người dùng
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || usersLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 p-0 ${currentPage === pageNum
                        ? "bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
                        : "rounded-xl border-[#063e8e]/15"
                      }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage >= totalPages || usersLoading}
              className="rounded-xl border-[#063e8e]/15"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
              onClick={() => setIsCreateDialogOpen(false)}
              className="h-10 rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!createForm.email || createUserMutation.isPending}
              className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Tạo người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
              onClick={() => setIsEditDialogOpen(false)}
              className="h-10 rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateUser}
              disabled={updateUserMutation.isPending}
              className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
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
              onClick={() => setIsRoleDialogOpen(false)}
              className="h-10 rounded-xl border-[#063e8e]/15"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveRoles}
              disabled={userRoles.length === 0 || assignRoleMutation.isPending || removeRoleMutation.isPending}
              className="h-10 rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              {assignRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu vai trò
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="rounded-3xl border-red-200">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600">Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa người dùng "{userToDelete?.email}"? Hành động này không thể hoàn tác.
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
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Xóa người dùng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
