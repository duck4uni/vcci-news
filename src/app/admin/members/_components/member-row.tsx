"use client";

import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Badge } from "@/components/ui/badge";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { type MemberItem } from "@/mockdata/members";

interface MemberRowProps {
  item: MemberItem;
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
          <div>{item.name}</div>
          {item.is_featured ? (
            <Badge
              variant="outline"
              className="border-[#063e8e]/25 bg-[#063e8e]/[0.04] text-[#063e8e]"
            >
              Hội viên tiêu biểu
            </Badge>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 text-center">
        {item.image ? (
          <div className="mx-auto h-12 w-16 overflow-hidden rounded-lg border border-[#063e8e]/15">
            <SafeNextImage
              src={item.image.url}
              alt={item.image.alt || item.name}
              width={64}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mx-auto flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-[#063e8e]/20 bg-[#063e8e]/5 text-xs text-gray-400">
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
        {item.phone && <div>{item.phone}</div>}
        {item.email && (
          <div className="truncate text-xs text-[#063e8e]">{item.email}</div>
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
        <span className="line-clamp-2">{item.address || "—"}</span>
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
