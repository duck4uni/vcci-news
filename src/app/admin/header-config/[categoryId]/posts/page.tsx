"use client";

import React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  EyeOff,
  FileText,
  Plus,
  Star,
} from "lucide-react";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeNextImage } from "@/components/admin/safe-next-image";
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
import {
  deleteCmsNewsItem,
  fetchCmsNewsItems,
  fetchHeaderConfigItems,
  type CmsHeaderCategoryItem,
  type CmsNewsItem,
} from "@/lib/api/cms-admin";
import { ADMIN_NEWS_TYPE_LABELS } from "@/mockdata/admin-news";
import { buildHeaderCategoryTree } from "@/mockdata/header-config";

function formatDateTime(value: string) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

function flattenTree(items: ReturnType<typeof buildHeaderCategoryTree>) {
  const rows: ReturnType<typeof buildHeaderCategoryTree> = [];

  const walk = (nodes: ReturnType<typeof buildHeaderCategoryTree>) => {
    nodes.forEach((item) => {
      rows.push(item);
      if (item.children.length > 0) {
        walk(item.children);
      }
    });
  };

  walk(items);
  return rows;
}

function HeaderCategoryPostsLoading() {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow
      key={`loading-${index}`}
      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/[0.03]"}
    >
      <TableCell colSpan={7} className="px-4 py-4">
        <div className="h-20 animate-pulse rounded-2xl bg-[#063e8e]/10" />
      </TableCell>
    </TableRow>
  ));
}

export default function HeaderCategoryPostsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = String(params.categoryId ?? "");
  const [items, setItems] = React.useState<CmsNewsItem[]>([]);
  const [headerItems, setHeaderItems] = React.useState<CmsHeaderCategoryItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<CmsNewsItem | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [{ items: newsItems }, headerConfig] = await Promise.all([
          fetchCmsNewsItems(),
          fetchHeaderConfigItems(),
        ]);

        if (cancelled) return;

        setItems(newsItems);
        setHeaderItems(headerConfig.items);
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
  }, []);

  const flatCategories = React.useMemo(() => {
    return flattenTree(buildHeaderCategoryTree(headerItems));
  }, [headerItems]);

  const category = React.useMemo(
    () => flatCategories.find((item) => item.id === categoryId) ?? null,
    [categoryId, flatCategories],
  );

  const canManagePosts = Boolean(
    category && (category.type === "page" || category.type === "news"),
  );

  const categoryPosts = React.useMemo(() => {
    return items
      .filter((item) => item.header_category_id === categoryId)
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
  }, [categoryId, items]);

  const filteredPosts = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return categoryPosts;

    return categoryPosts.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword)
      );
    });
  }, [categoryPosts, search]);

  const isSinglePostCategory = category?.type === "page";
  const createHref = `/admin/header-config/${categoryId}/posts/new`;

  React.useEffect(() => {
    if (!ready) return;
    if (!category || !canManagePosts) {
      router.replace("/admin/header-config");
    }
  }, [canManagePosts, category, ready, router]);

  const stats = React.useMemo(() => {
    return [
      {
        label: "Tổng bài viết",
        value: categoryPosts.length,
        icon: <FileText className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Đang hiển thị",
        value: categoryPosts.filter((item) => !item.is_hidden).length,
        icon: <FileText className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Tin nổi bật",
        value: categoryPosts.filter((item) => item.type === "tintuc" && item.is_featured).length,
        icon: <Star className="h-4 w-4 text-[#063e8e]" />,
      },
    ];
  }, [categoryPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCmsNewsItem(deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      toast.success("Đã xóa bài viết");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa bài viết");
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
        actionDisabled={isSinglePostCategory && categoryPosts.length >= 1}
        onSearchChange={setSearch}
        onActionClick={() => router.push(createHref)}
        filters={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.03] px-4 py-2 text-sm text-gray-700">
            <span className="font-semibold text-[#063e8e]">{categoryPosts.length}</span>{" "}
            bài viết thuộc danh mục này
          </div>
        }
      >
        <div className="scrollbar overflow-x-auto">
          <Table className="min-w-[980px] table-fixed">
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
                <HeaderCategoryPostsLoading />
              ) : filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-gray-700">
                    {categoryPosts.length === 0
                      ? "Danh mục này chưa có bài viết nào."
                      : "Không có bài viết nào phù hợp."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((item, index) => (
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
                        <AdminRowActions
                          actions={[
                            {
                              kind: "edit",
                              label: "Chỉnh sửa bài viết",
                              onClick: () => router.push(`/admin/header-config/${categoryId}/posts/${item.id}`),
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
