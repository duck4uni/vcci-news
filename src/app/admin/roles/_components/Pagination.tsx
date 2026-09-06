"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalRoles: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalRoles,
  isLoading,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Hiển thị {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalRoles)} trong {totalRoles} vai trò
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalRoles / 10) || isLoading}
          className="rounded-xl border-[#063e8e]/15"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
