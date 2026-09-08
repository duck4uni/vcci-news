"use client";

import {
  CheckCircle,
  Clock,
  Key,
  Loader2,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { PermissionGate } from "@/components/shared/permission-gate";
import { formatDate } from "./utils";
import { PAGE_SIZE, type User } from "./types";

interface UserTableProps {
  users: User[];
  usersLoading: boolean;
  currentPage: number;
  handleOpenEdit: (user: User) => void;
  handleOpenRoleDialog: (user: User) => void;
  handleResetPassword: (user: User) => void;
  handleToggleStatus: (user: User) => void;
  onRequestDelete: (user: User) => void;
}

export function UserTable({
  users,
  usersLoading,
  currentPage,
  handleOpenEdit,
  handleOpenRoleDialog,
  handleResetPassword,
  handleToggleStatus,
  onRequestDelete,
}: UserTableProps) {
  return (
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
                              onClick={() => onRequestDelete(user)}
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
  );
}
