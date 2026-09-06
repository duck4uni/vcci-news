"use client";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

export function HeaderCategoryPostsLoading() {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow
      key={`loading-${index}`}
      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/[0.03]"}
    >
      <TableCell colSpan={6} className="px-4 py-4">
        <div className="h-20 animate-pulse rounded-2xl bg-[#063e8e]/10" />
      </TableCell>
    </TableRow>
  ));
}
