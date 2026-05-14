"use client";

import * as React from "react";
import dayjs from "dayjs";
import {
  Edit,
  EyeOff,
  MoreHorizontal,
  Plus,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteCmsNewsItem,
  fetchCmsNewsItems,
  fetchHeaderConfigItems,
} from "@/lib/api/cms-admin";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ADMIN_NEWS_TYPE_LABELS,
  ADMIN_NEWS_TYPE_OPTIONS,
  type AdminNewsItem,
} from "@/mockdata/admin-news";
import { type HeaderCategoryItem } from "@/mockdata/header-config";

const selectTriggerClassName =
  "w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30 lg:w-[180px]";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName =
  "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

function formatDateTime(value: string) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function AdminNewsTableLoading() {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow
      key={`loading-${index}`}
      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/[0.03]"}
    >
      <TableCell colSpan={8} className="px-4 py-4">
        <div className="h-20 animate-pulse rounded-2xl bg-[#063e8e]/10" />
      </TableCell>
    </TableRow>
  ));
}

export default function AdminNewsPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<AdminNewsItem[]>([]);
  const [headerItems, setHeaderItems] = React.useState<HeaderCategoryItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<AdminNewsItem | null>(null);
  const [ready, setReady] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);

  const load = React.useCallback(async () => {
    const [newsData, headerConfig] = await Promise.all([
      fetchCmsNewsItems({ page, pageSize, sortField: "created_at", sortOrder: "desc" }),
      fetchHeaderConfigItems(),
    ]);

    setItems(newsData.items);
    setTotal(newsData.total);
    setHeaderItems(headerConfig.items);
    setReady(true);
  }, [page, pageSize]);

  React.useEffect(() => {
    void load().catch((error) => {
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách bài viết");
      setReady(true);
    });
  }, [load]);

  const categoryOptions = React.useMemo(() => {
    return headerItems.filter((item) => item.type === "news" || item.type === "page");
  }, [headerItems]);

  const filteredItems = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const categoryName =
          headerItems.find((category) => category.id === item.header_category_id)?.name ?? "";

        const matchesKeyword =
          !keyword ||
          item.title.toLowerCase().includes(keyword) ||
          item.slug.toLowerCase().includes(keyword) ||
          stripHtml(item.summary).toLowerCase().includes(keyword) ||
          categoryName.toLowerCase().includes(keyword);

        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesCategory =
          categoryFilter === "all" || item.header_category_id === categoryFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "visible" && !item.is_hidden) ||
          (statusFilter === "hidden" && item.is_hidden);

        return matchesKeyword && matchesType && matchesCategory && matchesStatus;
      })
      .sort((left, right) => {
        const leftFeatured = left.type === "tintuc" && left.is_featured ? 1 : 0;
        const rightFeatured = right.type === "tintuc" && right.is_featured ? 1 : 0;

        if (leftFeatured !== rightFeatured) {
          return rightFeatured - leftFeatured;
        }

        const leftTime = new Date(left.published_at || left.created_at).getTime();
        const rightTime = new Date(right.published_at || right.created_at).getTime();

        return rightTime - leftTime;
      });
  }, [categoryFilter, headerItems, items, search, statusFilter, typeFilter]);

  const stats = React.useMemo(() => {
    return [
      {
        label: "Tổng bài viết",
        value: total,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Đang hiển thị",
        value: items.filter((item) => !item.is_hidden).length,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Tin nổi bật",
        value: items.filter((item) => item.type === "tintuc" && item.is_featured).length,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
    ];
  }, [total, items]);

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteCmsNewsItem(deleteTarget.id);
      toast.success("Đã xóa bài viết");
      setDeleteTarget(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa bài viết");
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="space-y-8">
      <AdminStatsGrid items={stats} />

      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm bài viết..."
        actionLabel="Thêm bài viết"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        onSearchChange={setSearch}
        onActionClick={() => router.push("/admin/news/new")}
        filters={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Loại bài viết" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem value="all" className={selectItemClassName}>
                  Tất cả loại bài viết
                </SelectItem>
                {ADMIN_NEWS_TYPE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={selectItemClassName}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Danh mục hiển thị" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem value="all" className={selectItemClassName}>
                  Tất cả danh mục
                </SelectItem>
                {categoryOptions.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className={selectItemClassName}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem value="all" className={selectItemClassName}>
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem value="visible" className={selectItemClassName}>
                  Đang hiển thị
                </SelectItem>
                <SelectItem value="hidden" className={selectItemClassName}>
                  Đang ẩn
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      >
        <div className="scrollbar overflow-x-auto">
          <Table className="min-w-[1250px] table-fixed">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-[260px] py-4 text-center text-white">
                  Tiêu đề
                </TableHead>
                <TableHead className="w-[140px] py-4 text-center text-white">
                  Hình ảnh đại diện
                </TableHead>
                <TableHead className="w-40 py-4 text-center text-white">
                  Loại bài viết
                </TableHead>
                <TableHead className="w-[190px] py-4 text-center text-white">
                  Danh mục hiển thị
                </TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">
                  Ngày xuất bản
                </TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">
                  Ngày hết hạn
                </TableHead>
                <TableHead className="w-[120px] py-4 text-center text-white">
                  Hiển thị
                </TableHead>
                <TableHead className="w-[100px] py-4 text-center text-white">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!ready ? (
                <AdminNewsTableLoading />
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-gray-700">
                    Không có bài viết nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item, index) => {
                  const category = headerItems.find((entry) => entry.id === item.header_category_id);

                  return (
                    <TableRow
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/[0.03]"}
                    >
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <p className="line-clamp-2 text-sm font-semibold text-black">
                            {item.title}
                          </p>
                          {item.type === "tintuc" && item.is_featured ? (
                            <span className="inline-flex items-center rounded-full border border-[#063e8e]/20 bg-[#063e8e]/10 px-2.5 py-1 text-xs font-medium text-[#063e8e]">
                              <Star className="mr-1.5 h-3.5 w-3.5 fill-current" />
                              Tin nổi bật
                            </span>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="relative mx-auto h-16 w-24 overflow-hidden rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.03]">
                          {item.thumbnail ? (
                            <SafeNextImage
                              src={item.thumbnail.url}
                              alt={item.thumbnail.alt || item.thumbnail.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-700">
                              Không có ảnh
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                          {ADMIN_NEWS_TYPE_LABELS[item.type]}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center text-sm text-gray-700">
                        {category?.name || "—"}
                      </TableCell>

                      <TableCell className="text-center text-sm text-gray-700">
                        {formatDateTime(item.published_at)}
                      </TableCell>

                      <TableCell className="text-center text-sm text-gray-700">
                        {formatDateTime(item.expired_at)}
                      </TableCell>

                      <TableCell className="text-center">
                        {item.is_hidden ? (
                          <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-sm text-gray-700">
                            <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                            Ẩn
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-[#063e8e]/20 bg-[#063e8e]/10 px-2.5 py-1 text-sm text-[#063e8e]">
                            Hiển thị
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
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
                              asChild
                              className="text-gray-700 focus:text-[#063e8e]"
                            >
                              <Link href={`/admin/news/${item.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-gray-700 focus:text-[#063e8e]"
                              onClick={() => setDeleteTarget(item)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#063e8e]/10 px-4 py-3">
            <div className="text-sm text-gray-700">
              Hiển thị {(page - 1) * pageSize + 1} đến {Math.min(page * pageSize, total)} của {total} bài viết
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#063e8e]/15 bg-white text-[#063e8e] hover:bg-[#063e8e]/10"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="icon"
                      className={
                        page === pageNum
                          ? "h-8 w-8 bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
                          : "h-8 w-8 border-[#063e8e]/15 bg-white text-[#063e8e] hover:bg-[#063e8e]/10"
                      }
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-[#063e8e]/15 bg-white text-[#063e8e] hover:bg-[#063e8e]/10"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </AdminTableLayout>

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa bài viết"
        description={
          deleteTarget ? (
            <>
              Bài viết <strong>{deleteTarget.title}</strong> sẽ bị xóa khỏi dữ liệu quản trị.
            </>
          ) : null
        }
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
