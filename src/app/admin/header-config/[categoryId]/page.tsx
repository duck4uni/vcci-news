"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Plus,
  Star,
} from "lucide-react";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { Pagination } from "@/components/base/pagination";
import { SafeImage } from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getApiV10Post } from "@/api/vcci-news/endpoints/post";
import { deleteApiV10PostId } from "@/api/vcci-news/endpoints/post";
import { getApiV10CategoryTree } from "@/api/vcci-news/endpoints/category";
import { ADMIN_NEWS_TYPE_LABELS, type AdminNewsItem } from "@/mockdata/admin-news";
import { normalizeUser } from "@/lib/utils/cms-user";
import { normalizeDateTimeInput } from "@/lib/utils/datetime";
import { parsePostContent, parseLegacyPostContent } from "@/lib/utils/post-content";
import links from "@/links";
import type { HeaderCategoryTreeItem } from "@/api/vcci-news/types/header-config";
import { HeaderCategoryPostsLoading } from "./_components/HeaderCategoryPostsLoading";
import {
  PAGE_SIZE,
  flattenTree,
  formatDateTime,
} from "./_components/utils";

export default function HeaderCategoryPostsPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryId = String(params.categoryId ?? "");
  const [items, setItems] = useState<AdminNewsItem[]>([]);
  const [headerTree, setHeaderTree] = useState<HeaderCategoryTreeItem[]>([]);
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [ready, setReady] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminNewsItem | null>(null);
  const didMountRef = useRef(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(() => {
    const parsedPage = Number(searchParams.get("page") ?? 1);
    return Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  });

  const listQueryString = useMemo(() => {
    const nextParams = new URLSearchParams();

    if (page > 1) {
      nextParams.set("page", String(page));
    }

    if (search.trim()) {
      nextParams.set("q", search.trim());
    }

    return nextParams.toString();
  }, [page, search]);

  const listPath = useMemo(
    () => (listQueryString ? `${pathname}?${listQueryString}` : pathname),
    [listQueryString, pathname],
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const keyword = search.trim();
        const filters = [
          `category.id==${categoryId}`,
          keyword ? `title@=${keyword}|slug@=${keyword}` : "",
        ].filter(Boolean).join(",");

        const [newsResponse, treeResponse] = await Promise.all([
          getApiV10Post({
            page,
            pageSize: PAGE_SIZE,
            sortField: "created_at",
            sortOrder: "desc",
            filters: filters.trim() || undefined,
          }),
          getApiV10CategoryTree(),
        ]);

        if (cancelled) return;

        const newsResult = (newsResponse.responseData ?? {}) as { rows?: any[]; count?: number };
        const tree = (treeResponse.responseData ?? []) as unknown as HeaderCategoryTreeItem[];
        setItems((newsResult.rows ?? []).map((item: any): AdminNewsItem => {
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
        }));
        setTotal(newsResult.count ?? 0);
        setHeaderTree(tree);
        setReady(true);
      } catch (error) {
        if (cancelled) return;
        toast.error(error instanceof Error ? error.message : "Không thể tải dữ liệu");
        setReady(true);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [categoryId, page, search]);

  const flatCategories = useMemo(() => {
    return flattenTree(headerTree);
  }, [headerTree]);

  const category = useMemo(
    () => flatCategories.find((item) => item.id === categoryId) ?? null,
    [categoryId, flatCategories],
  );

  const canManagePosts = Boolean(
    category && (category.type === "page" || category.type === "news"),
  );

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isSinglePostCategory = category?.type === "page";
  const createHref = `/admin/news/new`;

  useEffect(() => {
    if (!ready) return;
    if (!category || !canManagePosts) {
      router.replace("/admin/header-config");
    }
  }, [canManagePosts, category, ready, router]);

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
  }, [search]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const stats = useMemo(() => {
    return [
      {
        label: "Tổng bài viết",
        value: total,
        icon: <FileText className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Đang hiển thị",
        value: items.filter((item) => !item.is_hidden).length,
        icon: <FileText className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Tin nổi bật",
        value: items.filter((item) => item.type === "tintuc" && item.is_featured).length,
        icon: <Star className="h-4 w-4 text-[#063e8e]" />,
      },
    ];
  }, [items, total]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteApiV10PostId(deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      setTotal((current) => Math.max(0, current - 1));
      toast.success("Đã xóa bài viết");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa bài viết");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!ready || !category || !canManagePosts) {
    return (
      <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-8 text-center text-sm text-gray-700 shadow-sm">
        Đang tải dữ liệu danh mục...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          asChild
          className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
        >
          <Link href="/admin/header-config">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-xl font-semibold text-[#063e8e]">
            Quản lý bài viết: {category.name}
          </h1>
          <p className="text-sm text-gray-700">
            {isSinglePostCategory
              ? "Danh mục bài viết trang chỉ quản lý một bài viết duy nhất thuộc danh mục hiển thị này."
              : "Quản lý toàn bộ bài viết thuộc danh mục hiển thị tương ứng trong quản lý bài viết."}
          </p>
        </div>
      </div>

      {category.type === "news" ? <AdminStatsGrid items={stats} /> : null}

      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm bài viết thuộc danh mục..."
        actionLabel={isSinglePostCategory ? "Thêm bài viết trang" : "Thêm bài viết"}
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionDisabled={isSinglePostCategory && total >= 1}
        onSearchChange={setSearch}
        onActionClick={() =>
          router.push(`${createHref}?returnTo=${encodeURIComponent(listPath)}`)
        }
      >
        <div className="scrollbar overflow-x-auto">
          <Table className="min-w-[900px] table-fixed">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-[300px] py-4 text-center text-white">
                  Tiêu đề
                </TableHead>
                <TableHead className="w-[150px] py-4 text-center text-white">
                  Hình ảnh đại diện
                </TableHead>
                <TableHead className="w-40 py-4 text-center text-white">
                  Loại bài viết
                </TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">
                  Ngày xuất bản
                </TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">
                  Ngày hết hạn
                </TableHead>
                <TableHead className="w-[130px] py-4 text-center text-white">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!ready ? (
                <HeaderCategoryPostsLoading />
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-gray-700">
                    {total === 0
                      ? "Danh mục này chưa có bài viết nào."
                      : "Không có bài viết nào phù hợp."}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
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
                      <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                        {ADMIN_NEWS_TYPE_LABELS[item.type]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center text-sm text-gray-700">
                      {formatDateTime(item.published_at)}
                    </TableCell>

                    <TableCell className="text-center text-sm text-gray-700">
                      {formatDateTime(item.expired_at)}
                    </TableCell>

                    <TableCell className="text-center">
                      <AdminRowActions
                        actions={[
                          {
                            kind: item.is_hidden ? "hidden" : "visible",
                            label: item.is_hidden
                              ? "Bài viết đang ẩn"
                              : "Bài viết đang hiển thị",
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#063e8e]/10 px-4 py-3">
            <div className="text-sm text-gray-700">
              Hiển thị {(page - 1) * PAGE_SIZE + 1} đến{" "}
              {Math.min(page * PAGE_SIZE, total)} của {total} bài viết
            </div>
            <Pagination page={page} pageCount={totalPages} onChangePage={handlePageChange} />
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
        onConfirm={handleDelete}
      />
    </div>
  );
}
