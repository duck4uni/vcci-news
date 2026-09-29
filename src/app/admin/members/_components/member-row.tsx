"use client";

import { AdminRowActions } from "@/components/admin/admin-row-actions";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import type { AdminMemberRow } from "@/lib/utils/admin-member";

interface MemberRowProps {
  item: AdminMemberRow;
  index: number;
  fieldName: string | undefined;
  regionName: string | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

export function MemberRow({
  item,
  index,
  fieldName,
  regionName,
  onEdit,
  onDelete,
}: MemberRowProps) {
  return (
    <TableRow
      key={item.id}
      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
    >
      <TableCell className="px-4 py-3 text-sm font-medium text-gray-800">
        <div className="space-y-1">
          <div>{item.full_name}</div>
          {item.job_title ? (
            <Badge
              variant="outline"
              className="border-[#063e8e]/25 bg-[#063e8e]/[0.04] text-[#063e8e]"
            >
              {item.job_title}
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-center">
        {item.avatar_url ? (
          <div className="mx-auto h-12 w-12 overflow-hidden rounded-full border border-[#063e8e]/15">
            <Image
              src={item.avatar_url}
              alt={item.full_name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[#063e8e]/20 bg-[#063e8e]/5 text-xs text-gray-400">
            Chưa có
          </div>
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
        {regionName ?? "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
        {fieldName ?? "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
        <span className="line-clamp-2">{item.job_title || "—"}</span>
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
        {item.birth_date || "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-center">
        <AdminRowActions
          actions={[
            {
              kind: "edit",
              label: "Chỉnh sửa hội viên",
              onClick: onEdit,
            },
            {
              kind: "delete",
              label: "Xóa hội viên",
              onClick: onDelete,
            },
          ]}
        />
      </TableCell>
    </TableRow>
  );
}
