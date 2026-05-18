"use client";

import * as React from "react";
import dayjs from "dayjs";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  fetchCmsPostCount,
  fetchHeaderConfigItems,
} from "@/lib/api/cms-admin";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ADMIN_NEWS_TYPE_LABELS,
  ADMIN_NEWS_TYPE_OPTIONS,
  type AdminNewsItem,
} from "@/mockdata/admin-news";
import {
  buildHeaderCategoryTree,
  type HeaderCategoryItem,
  type HeaderCategoryTreeItem,
} from "@/mockdata/header-config";
import { cn } from "@/lib/utils";

const selectTriggerClassName =
  "w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30 lg:w-[180px]";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName =
  "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

function flattenHeaderTree(
  items: HeaderCategoryTreeItem[],
  depth = 0,
): Array<HeaderCategoryItem & { depth: number }> {
  return items.flatMap((item) => [
    { ...item, depth },
    ...flattenHeaderTree(item.children, depth + 1),
  ]);
}

function formatHeaderCategoryOptionLabel(option: { name: string; depth: number }) {
  return `${"-- ".repeat(option.depth)}${option.name}`;
}

function CategoryFilterCombobox({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<HeaderCategoryItem & { depth: number }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-10 w-full justify-between rounded-xl border-[#063e8e]/15 bg-white px-3 font-normal text-gray-700 hover:bg-white hover:text-gray-700 focus-visible:ring-[#063e8e]/30 lg:w-[220px]",
            !selectedOption && "text-gray-700",
          )}
        >
          <span className="truncate text-left">
            {selectedOption
              ? formatHeaderCategoryOptionLabel(selectedOption)
              : "T\u1ea5t c\u1ea3 danh m\u1ee5c"}
          </span>
          <ChevronsUpDown className="ml-3 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] border-[#063e8e]/15 bg-white p-0 text-gray-700"
      >
        <Command className="bg-white text-gray-700">
          <CommandInput
            placeholder={"T\u00ecm danh m\u1ee5c hi\u1ec3n th\u1ecb"}
            className="text-gray-700 placeholder:text-gray-500"
          />
          <CommandList className="max-h-72">
            <CommandEmpty className="text-gray-700">
              {"Kh\u00f4ng t\u00ecm th\u1ea5y danh m\u1ee5c ph\u00f9 h\u1ee3p"}
            </CommandEmpty>
            <CommandItem
              value="all Tat ca danh muc"
              onSelect={() => {
                onChange("all");
                setOpen(false);
              }}
              className="gap-3 px-3 py-2 text-gray-700 data-[selected=true]:bg-[#063e8e]/10 data-[selected=true]:text-[#063e8e]"
            >
              <Check
                className={cn(
                  "h-4 w-4 text-[#063e8e]",
                  value === "all" ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="truncate">{"T\u1ea5t c\u1ea3 danh m\u1ee5c"}</span>
            </CommandItem>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={`${option.id} ${option.name} ${option.type}`}
                onSelect={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className="gap-3 px-3 py-2 text-gray-700 data-[selected=true]:bg-[#063e8e]/10 data-[selected=true]:text-[#063e8e]"
              >
                <Check
                  className={cn(
                    "h-4 w-4 text-[#063e8e]",
                    value === option.id ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="truncate">
                  {formatHeaderCategoryOptionLabel(option)}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function formatDateTime(value: string) {
  return value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "—";
}

function getDisplayCategoryNames(
  item: AdminNewsItem,
  categories: HeaderCategoryItem[],
) {
  const categoryIds = Array.from(
    new Set([
      ...item.category_ids,
      ...(item.header_category_id ? [item.header_category_id] : []),
    ]),
  );

  return categoryIds
    .map((categoryId) => categories.find((entry) => entry.id === categoryId)?.name)
    .filter((name): name is string => Boolean(name));
}

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function AdminNewsTableLoading() {
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

export default function AdminNewsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items, setItems] = React.useState<AdminNewsItem[]>([]);
  const [headerItems, setHeaderItems] = React.useState<HeaderCategoryItem[]>([]);
  const [search, setSearch] = React.useState(() => searchParams.get("q") ?? "");
  const [typeFilter, setTypeFilter] = React.useState(
    () => searchParams.get("type") ?? "all",
  );
  const [categoryFilter, setCategoryFilter] = React.useState(
    () => searchParams.get("category") ?? "all",
  );
  const [statusFilter, setStatusFilter] = React.useState(
    () => searchParams.get("status") ?? "all",
  );
  const [deleteTarget, setDeleteTarget] = React.useState<AdminNewsItem | null>(null);
  const [ready, setReady] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [page, setPage] = React.useState(() => {
    const parsedPage = Number(searchParams.get("page") ?? 1);
    return Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  });
  const [pageSize] = React.useState(20);
  const [total, setTotal] = React.useState(0);
  const [publishedTotal, setPublishedTotal] = React.useState(0);
  const [featuredTotal, setFeaturedTotal] = React.useState(0);
  const didMountRef = React.useRef(false);
  const debouncedSearch = useDebouncedValue(search);

  const listQueryString = React.useMemo(() => {
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

  const listPath = React.useMemo(
    () => (listQueryString ? `${pathname}?${listQueryString}` : pathname),
    [listQueryString, pathname],
  );

  React.useEffect(() => {
    void fetchHeaderConfigItems()
      .then((headerConfig) => {
        setHeaderItems(headerConfig.items);
      })
      .catch((error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Kh\u00f4ng th\u1ec3 t\u1ea3i danh m\u1ee5c hi\u1ec3n th\u1ecb",
        );
      });
  }, []);

  const loadStats = React.useCallback(async () => {
    const [nextPublishedTotal, nextFeaturedTotal] = await Promise.all([
      fetchCmsPostCount("status==published"),
      fetchCmsPostCount("is_featured==true"),
    ]);

    setPublishedTotal(nextPublishedTotal);
    setFeaturedTotal(nextFeaturedTotal);
  }, []);

  const apiFilters = React.useMemo(() => {
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

    if (statusFilter === "visible") {
      filters.push("is_hidden==false");
    } else if (statusFilter === "hidden") {
      filters.push("is_hidden==true");
    }

    return filters.join(",");
  }, [categoryFilter, debouncedSearch, statusFilter, typeFilter]);

  const load = React.useCallback(async () => {
    setReady(false);

    const newsData = await fetchCmsNewsItems({
      page,
      pageSize,
      sortField: "created_at",
      sortOrder: "desc",
      filters: apiFilters,
    });

    setItems(newsData.items);
    setTotal(newsData.total);
    setReady(true);
  }, [apiFilters, page, pageSize]);

  React.useEffect(() => {
    void loadStats().catch((error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Kh\u00f4ng th\u1ec3 t\u1ea3i s\u1ed1 li\u1ec7u b\u00e0i vi\u1ebft",
      );
    });
  }, [loadStats]);

  React.useEffect(() => {
    void load().catch((error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách bài viết",
      );
      setReady(true);
    });
  }, [load]);

  React.useEffect(() => {
    const nextPath = listQueryString ? `${pathname}?${listQueryString}` : pathname;
    const currentPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    if (nextPath !== currentPath) {
      router.replace(nextPath, { scroll: false });
    }
  }, [listQueryString, pathname, router, searchParams]);

  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    setPage((currentPage) => (currentPage === 1 ? currentPage : 1));
  }, [apiFilters, typeFilter]);

  const categoryOptions = React.useMemo(() => {
    return flattenHeaderTree(buildHeaderCategoryTree(headerItems)).filter(
      (item) => item.type === "news" || item.type === "page",
    );
  }, [headerItems]);

  const stats = React.useMemo(() => {
    return [
      {
        label: "Tổng bài viết",
        value: total,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Đang hiển thị",
        value: publishedTotal,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Tin nổi bật",
        value: featuredTotal,
        icon: <Tag className="h-4 w-4 text-[#063e8e]" />,
      },
    ];
  }, [featuredTotal, publishedTotal, total]);

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteCmsNewsItem(deleteTarget.id);
      toast.success("Đã xóa bài viết");
      setDeleteTarget(null);
      await Promise.all([load(), loadStats()]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa bài viết",
      );
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
                  const categoryNames = getDisplayCategoryNames(item, headerItems);
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
                        {primaryCategoryName}
                        {extraCategoryCount > 0 ? ` (+${extraCategoryCount})` : ""}
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
                                ? "B\u00e0i vi\u1ebft \u0111ang \u1ea9n"
                                : "B\u00e0i vi\u1ebft \u0111ang hi\u1ec3n th\u1ecb",
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
