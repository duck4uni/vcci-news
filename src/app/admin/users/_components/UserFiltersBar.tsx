"use client";

import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role, UserFilters } from "./types";

interface UserFiltersBarProps {
  filters: UserFilters;
  handleSearchChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleRoleFilterChange: (value: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  roles: Role[];
  isFetching: boolean;
  usersLoading: boolean;
  totalUsers: number;
}

export function UserFiltersBar({
  filters,
  handleSearchChange,
  handleStatusFilterChange,
  handleRoleFilterChange,
  clearFilters,
  hasActiveFilters,
  roles,
  isFetching,
  usersLoading,
  totalUsers,
}: UserFiltersBarProps) {
  return (
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
  );
}
