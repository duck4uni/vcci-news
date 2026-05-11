"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  ExternalLink,
  FileText,
  FolderTree,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type HeaderCategoryTreeItem,
  getHeaderCategoryTypeLabel,
} from "@/mockdata/header-config";

export type HeaderCategoryFlatRow = HeaderCategoryTreeItem & {
  depth: number;
  parentId: string | null;
};

interface HeaderCategoryTableProps {
  rows: HeaderCategoryFlatRow[];
  expanded: Record<string, boolean>;
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggle: (id: string) => void;
  onCreateRoot: () => void;
  onCreateChild: (item: HeaderCategoryTreeItem) => void;
  onEdit: (item: HeaderCategoryTreeItem) => void;
  onDelete: (item: HeaderCategoryTreeItem) => void;
}

function getDisplaySortOrder(item: HeaderCategoryFlatRow, rows: HeaderCategoryFlatRow[]) {
  if (!item.parentId) {
    return String(item.sort_order);
  }

  const parent = rows.find((entry) => entry.id === item.parentId);
  if (!parent) {
    return String(item.sort_order);
  }

  return `${parent.sort_order}-${item.sort_order}`;
}

function getTypeIcon(type: HeaderCategoryTreeItem["type"]) {
  switch (type) {
    case "news":
    case "page":
      return <FileText className="h-4 w-4 text-[#063e8e]" />;
    default:
      return <FolderTree className="h-4 w-4 text-[#063e8e]" />;
  }
}

function HeaderCategoryTableLoading() {
  return Array.from({ length: 4 }).map((_, index) => (
    <TableRow
      key={`loading-${index}`}
      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/[0.03]"}
    >
      <TableCell className="w-[34%] py-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-sm bg-[#063e8e]/15" />
          <Skeleton className="h-4 w-40 bg-[#063e8e]/15" />
        </div>
      </TableCell>
      <TableCell className="w-[180px] text-center">
        <Skeleton className="mx-auto h-7 w-28 rounded-full bg-[#063e8e]/15" />
      </TableCell>
      <TableCell className="w-[140px] text-center">
        <Skeleton className="mx-auto h-8 w-12 rounded-full bg-[#063e8e]/15" />
      </TableCell>
      <TableCell className="w-[280px] py-4">
        <Skeleton className="mx-auto h-4 w-52 bg-[#063e8e]/15" />
      </TableCell>
      <TableCell className="w-[120px] text-center">
        <Skeleton className="mx-auto h-8 w-8 rounded-md bg-[#063e8e]/15" />
      </TableCell>
    </TableRow>
  ));
}

export function HeaderCategoryTable({
  rows,
  expanded,
  isLoading,
  searchValue,
  onSearchChange,
  onToggle,
  onCreateRoot,
  onCreateChild,
  onEdit,
  onDelete,
}: HeaderCategoryTableProps) {
  return (
    <AdminTableLayout
      searchValue={searchValue}
      searchPlaceholder="Tìm kiếm danh mục..."
      actionLabel="Thêm danh mục"
      actionIcon={<Plus className="mr-2 h-4 w-4" />}
      onSearchChange={onSearchChange}
      onActionClick={onCreateRoot}
    >
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
            <TableHead className="w-[34%] py-4 pl-4 text-center text-white">
              Tên danh mục
            </TableHead>
            <TableHead className="w-[180px] py-4 text-center text-white">
              Thể loại
            </TableHead>
            <TableHead className="w-[140px] py-4 text-center text-white">
              Thứ tự
            </TableHead>
            <TableHead className="w-[280px] py-4 text-center text-white">
              Liên kết
            </TableHead>
            <TableHead className="w-[120px] py-4 text-center text-white">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <HeaderCategoryTableLoading />
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-sm text-gray-700">
                Không có danh mục nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((item, index) => {
              const hasChildren = rows.some((entry) => entry.parentId === item.id);
              const isExpanded = expanded[item.id] ?? true;
              const canCreateChild = !item.parent_id && item.type === "category";
              const canManagePosts = item.type === "page" || item.type === "news";

              return (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/[0.03]"}
                >
                  <TableCell className="w-[34%] py-4">
                    <div className="flex items-center" style={{ marginLeft: item.depth * 24 }}>
                      {hasChildren ? (
                        <button
                          type="button"
                          className="mr-2 rounded p-1 hover:bg-[#063e8e]/10"
                          onClick={() => onToggle(item.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      ) : (
                        <span className="mr-2 w-6" />
                      )}

                      <div className="mr-2">{getTypeIcon(item.type)}</div>
                      <div className="truncate font-medium text-black">{item.name}</div>
                    </div>
                  </TableCell>

                  <TableCell className="w-[180px] text-center">
                    <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                      {getHeaderCategoryTypeLabel(item.type)}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[140px] text-center font-medium text-black">
                    <span
                      className={
                        item.parent_id
                          ? "inline-flex min-w-8 items-center justify-center rounded-full border border-gray-300 px-2.5 py-1 text-sm text-gray-700"
                          : "inline-flex min-w-8 items-center justify-center rounded-full border border-[#063e8e]/20 bg-[#063e8e]/10 px-2.5 py-1 text-sm text-[#063e8e]"
                      }
                    >
                      {getDisplaySortOrder(item, rows)}
                    </span>
                  </TableCell>

                  <TableCell className="w-[280px] text-sm text-gray-700">
                    <div className="mx-auto flex max-w-[220px] items-center justify-center gap-2">
                      <span className="block max-w-[180px] truncate">
                        {item.static_link || "-"}
                      </span>
                      {item.static_link ? (
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#063e8e]" />
                      ) : null}
                    </div>
                  </TableCell>

                  <TableCell className="w-[120px] text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-gray-700 focus:text-[#063e8e]"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>

                        {canManagePosts ? (
                          <DropdownMenuItem
                            asChild
                            className="text-gray-700 focus:text-[#063e8e]"
                          >
                            <Link href={`/admin/header-config/${item.id}/posts`}>
                              <FileText className="mr-2 h-4 w-4" />
                              Quản lý bài viết
                            </Link>
                          </DropdownMenuItem>
                        ) : null}

                        {canCreateChild ? (
                          <DropdownMenuItem
                            className="text-gray-700 focus:text-[#063e8e]"
                            onClick={() => onCreateChild(item)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm danh mục con
                          </DropdownMenuItem>
                        ) : null}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-gray-700 focus:text-[#063e8e]"
                          onClick={() => onDelete(item)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </AdminTableLayout>
  );
}
