"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Star,
  Tag,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  useDeleteApiV10PostId,
  useGetApiV10Post,
  useGetApiV10PostStats,
  usePutApiV10PostId,
} from "@/api/vcci-news/endpoints/post";
import { useGetApiV10CategoryTree } from "@/api/vcci-news/endpoints/category";
import {
  ADMIN_NEWS_TYPE_LABELS,
  ADMIN_NEWS_TYPE_OPTIONS,
  type AdminNewsItem,
} from "@/mockdata/admin-news";
import { normalizeUser } from "@/lib/utils/cms-user";
import { normalizeDateTimeInput } from "@/lib/utils/datetime";
import { parsePostContent, parseLegacyPostContent } from "@/lib/utils/post-content";
import links from "@/links";
import {
  type HeaderCategoryTreeItem,
} from "@/mockdata/header-config";
import { AdminNewsTableLoading } from "./_components/admin-news-table-loading";
import { CategoryFilterCombobox } from "./_components/category-filter-combobox";
import {
  flattenHeaderTree,
  formatDateTime,
  getDisplayCategoryNames,
  useDebouncedValue,
} from "./_components/utils";

const selectTriggerClassName =
  "w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30 lg:w-[180px]";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName =
  "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

const POST_QUERY_KEY = "/api/v1.0/post";
const POST_STATS_QUERY_KEY = "/api/v1.0/post/stats";

function mapRowToAdminNewsItem(item: any): AdminNewsItem {
  const structuredContent = parsePostContent(item.content_structure);
  const postContent = structuredContent.length > 0 ? structuredContent : parseLegacyPostContent(item.content);
  const categories = Array.isArray(item.categories) ? item.categories : [];
  const primaryCategory = categories[0] ?? null;
  const primaryCategoryType = primaryCategory?.type ?? null;
  return {
    id: item.id ?? "",
    title: item.title ?? "",
    slug: item.slug ?? "",
    summary: item.summary ?? "",
    type: item.type === "page" || primaryCategoryType === "post" || primaryCategoryType === "page" ? "baiviettrang" : "tintuc",
    header_category_id: primaryCategory?.id ?? "",
    category_ids: categories.map((c: any) => c.id),
    tagsearch_values: [],
    is_featured: Boolean(item.is_featured),
    thumbnail: item.thumbnail?.id ? {
      id: item.thumbnail.id,
      name: item.thumbnail.original ?? item.thumbnail.path ?? "thumbnail",
      alt: item.thumbnail.original ?? item.thumbnail.path ?? "thumbnail",
      url: links.resolveImageUrl(item.thumbnail.path),
    } : null,
    is_hidden: Boolean(item.is_hidden),
    created_at: item.created_at ?? "",
    updated_at: item.updated_at ?? "",
    published_at: normalizeDateTimeInput(item.published_at ?? item.release_at),
    expired_at: normalizeDateTimeInput(item.expired_at),
    started_at: normalizeDateTimeInput(item.started_at),
    ended_at: normalizeDateTimeInput(item.ended_at),
    registration_deadline: normalizeDateTimeInput(item.registration_deadline),
    location: item.location ?? "",
    participation_fee: item.participation_fee ?? "",
    event_dates: Array.isArray(item.event_dates) ? item.event_dates.filter((d: any): d is string => typeof d === "string") : [],
    post_content: postContent,
    creator: normalizeUser(item.creator),
    editor: normalizeUser(item.editor),
  };
}

export default function AdminNewsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [typeFilter, setTypeFilter] = useState(
    () => searchParams.get("type") ?? "all",
  );
  const [categoryFilter, setCategoryFilter] = useState(
    () => searchParams.get("category") ?? "all",
  );
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") ?? "all",
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminNewsItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingVisibilityId, setTogglingVisibilityId] = useState<string | null>(null);
  const [page, setPage] = useState(() => {
    const parsedPage = Number(searchParams.get("page") ?? 1);
    return Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  });
  const pageSize = 10;
  const didMountRef = useRef(false);
  const debouncedSearch = useDebouncedValue(search);

  const listQueryString = useMemo(() => {
    const params = new URLSearchParams();

    if (page > 1) {
      params.set("page", String(page));
    }

    if (debouncedSearch.trim()) {
      params.set("q", debouncedSearch.trim());
    }

    if (typeFilter !== "all") {
      params.set("type", typeFilter);
    }

    if (categoryFilter !== "all") {
      params.set("category", categoryFilter);
    }

    if (statusFilter !== "all") {
      params.set("status", statusFilter);
    }

    return params.toString();
  }, [categoryFilter, debouncedSearch, page, statusFilter, typeFilter]);

  const listPath = useMemo(
    () => (listQueryString ? `${pathname}?${listQueryString}` : pathname),
    [listQueryString, pathname],
  );

  const baseFilterParts = useMemo(() => {
    const filters: string[] = [];
    const keyword = debouncedSearch.trim();

    if (keyword) {
      filters.push(`title@=${keyword}`);
    }

    if (categoryFilter !== "all") {
      filters.push(`category.id==${categoryFilter}`);
    }

    if (typeFilter === "tintuc") {
      filters.push("type==news");
    } else if (typeFilter === "baiviettrang") {
      filters.push("type==page");
    }

    return filters;
  }, [categoryFilter, debouncedSearch, typeFilter]);

  const statusFilterParts = useMemo(() => {
    if (statusFilter === "visible") {
      return ["is_hidden==false"];
    }

    if (statusFilter === "hidden") {
      return ["is_hidden==true"];
    }

    return [];
  }, [statusFilter]);

  const apiFilters = useMemo(() => {
    return [...baseFilterParts, ...statusFilterParts].join(",");
  }, [baseFilterParts, statusFilterParts]);

  // Fetch post list via orval hook
  const postsQuery = useGetApiV10Post({
    page,
    pageSize,
    sortField: "created_at",
    sortOrder: "desc",
    priorityFeatured: false,
    filters: apiFilters?.trim() || undefined,
  });

  // Fetch category tree via orval hook
  const categoriesQuery = useGetApiV10CategoryTree();

  // Fetch stats via orval hook
  const statsQuery = useGetApiV10PostStats(
    { filters: apiFilters || undefined },
  );

  // Mutations
  const deletePostMutation = useDeleteApiV10PostId();
  const updatePostMutation = usePutApiV10PostId();

  // Derived data
  const postsResponse = (postsQuery.data ?? {}) as { responseData?: { rows?: any[]; count?: number } };
  const items: AdminNewsItem[] = useMemo(
    () => (postsResponse.responseData?.rows ?? []).map(mapRowToAdminNewsItem),
    [postsResponse.responseData?.rows],
  );
  const total = postsResponse.responseData?.count ?? 0;
  const ready = !postsQuery.isLoading && !postsQuery.isFetching;

  const headerTree = useMemo(
    () => ((categoriesQuery.data ?? {}).responseData ?? []) as unknown as HeaderCategoryTreeItem[],
    [categoriesQuery.data],
  );
  const statsData = (statsQuery.data ?? {}).responseData;

  useEffect(() => {
    const nextPath = listQueryString ? `${pathname}?${listQueryString}` : pathname;
    const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (nextPath !== currentPath) {
      router.replace(nextPath, { scroll: false });
    }
  }, [listQueryString, pathname, router, searchParams]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setPage((currentPage) => (currentPage === 1 ? currentPage : 1));
  }, [apiFilters, typeFilter]);

  const categoryOptions = useMemo(() => {
    return flattenHeaderTree(headerTree).filter(
      (item) => item.type === "news" || item.type === "page",
    );
  }, [headerTree]);

  const stats = useMemo(() => {
    return [
      {
        label: "Tổng bài viết",
        value: statsData?.total ?? total,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Đang hiển thị",
        value: statsData?.published ?? 0,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Tin nổi bật",
        value: statsData?.featured ?? 0,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
    ];
  }, [statsData, total]);

  const invalidatePostQueries = () => {
    queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEY], exact: false });
    queryClient.invalidateQueries({ queryKey: [POST_STATS_QUERY_KEY], exact: false });
  };

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);

    try {
      await deletePostMutation.mutateAsync({ id: deleteTarget.id });
      toast.success("Đã xóa bài viết");
      setDeleteTarget(null);
      invalidatePostQueries();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa bài viết",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async (item: AdminNewsItem) => {
    if (togglingVisibilityId) return;

    const nextIsHidden = !item.is_hidden;
    setTogglingVisibilityId(item.id);

    try {
      await updatePostMutation.mutateAsync({
        id: item.id,
        data: {
          is_hidden: nextIsHidden,
          is_active: !nextIsHidden,
        } as any,
      });
      toast.success(nextIsHidden ? "Đã ẩn bài viết" : "Đã hiển thị bài viết");
      invalidatePostQueries();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể thay đổi trạng thái hiển thị",
      );
    } finally {
      setTogglingVisibilityId(null);
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
        onActionClick={() =>
          router.push(`/admin/news/new?returnTo=${encodeURIComponent(listPath)}`)
        }
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

            <CategoryFilterCombobox
              value={categoryFilter}
              options={categoryOptions}
              onChange={setCategoryFilter}
            />

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
          <Table className="min-w-[1120px] table-fixed">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-[260px] py-4 text-center text-white">
                  Tiêu đề
                </TableHead>
                <TableHead className="w-[140px] py-4 text-center text-white">
                  Hình ảnh đại diện
                </TableHead>
                <TableHead className="w-[220px] py-4 text-center text-white">
                  Loại / Danh mục
                </TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">
                  Ngày xuất bản / Hết hạn
                </TableHead>
                <TableHead className="w-[150px] py-4 text-center text-white">
                  Người tạo
                </TableHead>
                <TableHead className="w-[150px] py-4 text-center text-white">
                  Cập nhật bởi
                </TableHead>
                <TableHead className="w-[130px] py-4 text-center text-white">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!ready ? (
                <AdminNewsTableLoading />
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-gray-700">
                    Không có bài viết nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => {
                  const categoryNames = getDisplayCategoryNames(item, categoryOptions);
                  const primaryCategoryName = categoryNames[0] ?? "\u2014";
                  const extraCategoryCount = Math.max(categoryNames.length - 1, 0);

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
                            <SafeImage
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
                        <div className="flex flex-col items-center gap-1">
                          <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                            {ADMIN_NEWS_TYPE_LABELS[item.type]}
                          </Badge>
                          <span className="text-sm text-gray-700">
                            {primaryCategoryName}
                            {extraCategoryCount > 0 ? ` (+${extraCategoryCount})` : ""}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-sm text-gray-700">
                        <div className="flex flex-col gap-0.5">
                          <span>{formatDateTime(item.published_at) || "—"}</span>
                          <span className="text-gray-500">{formatDateTime(item.expired_at) || "—"}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center text-sm text-gray-700">
                        {item.creator ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-[#1f3768]">
                              {item.creator.full_name}
                            </span>
                            <span className="text-gray-500">
                              {formatDateTime(item.created_at) || "—"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center text-sm text-gray-700">
                        {item.editor && item.editor.id ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-[#1f3768]">
                              {item.editor.full_name}
                            </span>
                            <span className="text-gray-500">
                              {formatDateTime(item.updated_at) || "—"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <AdminRowActions
                          actions={[
                            {
                              kind: item.is_hidden ? "hidden" : "visible",
                              label: item.is_hidden
                                ? "B\u00e0i vi\u1ebft \u0111ang \u1ea9n, b\u1ea5m \u0111\u1ec3 hi\u1ec3n th\u1ecb"
                                : "B\u00e0i vi\u1ebft \u0111ang hi\u1ec3n th\u1ecb, b\u1ea5m \u0111\u1ec3 \u1ea9n",
                              disabled: togglingVisibilityId === item.id,
                              onClick: () => void handleToggleVisibility(item),
                            },
                            {
                              kind: "edit",
                              label: "Chỉnh sửa bài viết",
                              onClick: () =>
                                router.push(
                                  `/admin/news/${item.id}?returnTo=${encodeURIComponent(listPath)}`,
                                ),
                            },
                            {
                              kind: "delete",
                              label: "Xóa bài viết",
                              onClick: () => setDeleteTarget(item),
                            },
                          ]}
                        />
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
              Hiển thị {(page - 1) * pageSize + 1} đến{" "}
              {Math.min(page * pageSize, total)} của {total} bài viết
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
