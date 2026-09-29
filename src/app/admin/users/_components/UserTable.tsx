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
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-left text-white">Email</TableHead>
              <TableHead className="py-4 text-left text-white">Họ tên</TableHead>
              <TableHead className="py-4 text-center text-white">Vai trò</TableHead>
              <TableHead className="w-[140px] py-4 text-center text-white">Trạng thái</TableHead>
              <TableHead className="w-[170px] py-4 text-center text-white">Ngày tạo</TableHead>
              <TableHead className="w-[170px] py-4 text-center text-white">Cập nhật</TableHead>
              <TableHead className="w-[130px] py-4 text-center text-white">Thao tác</TableHead>
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
                <TableCell colSpan={8} className="text-center py-12 text-gray-400">
                  Không tìm thấy người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
                >
                  <TableCell className="py-3 text-center text-sm text-gray-500">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-gray-800">
                    <p className="truncate max-w-[180px]" title={user.email}>
                      {user.email}
                    </p>
                    {user.username && (
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-left text-sm text-gray-800">
                    <p className="whitespace-nowrap">
                      {user.first_name || user.last_name ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "—"}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="flex flex-wrap justify-center gap-1 max-w-[140px] mx-auto">
                      {user.roles?.slice(0, 2).map((roleName) => (
                        <Badge
                          key={roleName}
                          variant="outline"
                          className="border-[#063e8e]/25 text-[#063e8e] text-xs px-2 py-0.5 whitespace-nowrap font-normal"
                        >
                          {roleName}
                        </Badge>
                      ))}
                      {(user.roles?.length || 0) > 2 && (
                        <Badge
                          variant="outline"
                          className="border-[#063e8e]/25 text-[#063e8e] text-xs px-2 py-0.5 font-normal"
                        >
                          +{user.roles!.length - 2}
                        </Badge>
                      )}
                      {(!user.roles || user.roles.length === 0) && (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={
                          user.status === "active"
                            ? "inline-flex rounded-full bg-[#edf7ee] px-3 py-1 text-xs font-semibold text-[#16803d]"
                            : user.status === "pending_verification"
                              ? "inline-flex rounded-full bg-[#fff4e5] px-3 py-1 text-xs font-semibold text-[#c7760d]"
                              : "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                        }
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
                      </span>
                      {user.user_auth?.must_change_password && (
                        <Badge
                          variant="outline"
                          className="border-gray-200 bg-gray-50 text-gray-600 text-xs px-1.5 font-normal"
                        >
                          <Key className="mr-0.5 h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center text-sm text-gray-700">
                    {user.created_at ? formatDate(user.created_at) : "—"}
                  </TableCell>
                  <TableCell className="py-3 text-center text-sm text-gray-700">
                    {user.updated_at ? formatDate(user.updated_at) : "—"}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <PermissionGate required="users:write">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-lg text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
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
