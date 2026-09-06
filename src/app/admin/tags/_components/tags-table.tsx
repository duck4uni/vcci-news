"use client";

import dayjs from "dayjs";
import { Hash, Plus, Tag } from "lucide-react";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { Pagination } from "@/components/base/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PAGE_SIZE, type CmsTagItem } from "./types";

interface TagsTableProps {
  search: string;
  onSearchChange: (value: string) => void;
  isReady: boolean;
  onActionClick: () => void;
  items: CmsTagItem[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (item: CmsTagItem) => void;
  onDelete: (item: CmsTagItem) => void;
}

export function TagsTable({
  search,
  onSearchChange,
  isReady,
  onActionClick,
  items,
  total,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: TagsTableProps) {
  return (
    <AdminTableLayout
      searchValue={search}
      searchPlaceholder="Tìm kiếm tag..."
      actionLabel="Thêm tag"
      actionIcon={<Plus className="mr-2 h-4 w-4" />}
      actionDisabled={!isReady}
      actionMeta={
        <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
          Tổng số tags: {total}
        </div>
      }
      onSearchChange={onSearchChange}
      onActionClick={onActionClick}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-[#063e8e] hover:bg-[#063e8e]">
            <TableHead className="w-[320px] py-4 text-center text-white">
              Tên tag
            </TableHead>
            <TableHead className="py-4 text-center text-white">Slug</TableHead>
            <TableHead className="w-[170px] py-4 text-center text-white">
              Ngày tạo
            </TableHead>
            <TableHead className="w-[170px] py-4 text-center text-white">
              Ngày cập nhật
            </TableHead>
            <TableHead className="w-[120px] py-4 text-center text-white">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isReady ? (
            Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {Array.from({ length: 5 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex} className="py-4">
                    <div className="h-5 rounded-full bg-[#063e8e]/10" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-14 text-center text-gray-700">
                Không có tag nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-[#063e8e]/[0.03]">
                <TableCell className="px-4 py-4">
                  <Badge
                    variant="outline"
                    className="rounded-full border-[#063e8e]/20 bg-[#063e8e]/[0.04] px-3 py-1 text-[#063e8e]"
                  >
                    <Tag className="mr-1.5 h-3.5 w-3.5" />
                    {item.name}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-4 font-mono text-sm text-gray-700">
                  <Hash className="mr-1 inline h-3.5 w-3.5 text-[#063e8e]" />
                  {item.slug}
                </TableCell>
                <TableCell className="px-4 py-4 text-center text-gray-700">
                  {item.created_at ? dayjs(item.created_at).format("DD/MM/YYYY") : "-"}
                </TableCell>
                <TableCell className="px-4 py-4 text-center text-gray-700">
                  {item.updated_at ? dayjs(item.updated_at).format("DD/MM/YYYY") : "-"}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <AdminRowActions
                    actions={[
                      { kind: "edit", label: "Chỉnh sửa tag", onClick: () => onEdit(item) },
                      { kind: "delete", label: "Xóa tag", onClick: () => onDelete(item) },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 ? (
        <div className="flex flex-col gap-3 border-t border-[#063e8e]/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị {(page - 1) * PAGE_SIZE + 1} đến{" "}
            {Math.min(page * PAGE_SIZE, total)} của {total} tag
          </div>
          <Pagination
            page={page}
            pageCount={totalPages}
            onChangePage={onPageChange}
          />
        </div>
      ) : null}
    </AdminTableLayout>
  );
}
