"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE } from "./types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersLoading: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export function Pagination({
  currentPage,
  totalPages,
  totalUsers,
  usersLoading,
  setCurrentPage,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
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
  );
}
