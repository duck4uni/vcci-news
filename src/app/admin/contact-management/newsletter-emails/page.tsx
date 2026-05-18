"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { ContactManagementDetailDialog } from "@/components/admin/contact-management-detail-dialog";
import { Pagination } from "@/components/base/pagination";
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
import type { NewsletterSubscription } from "@/api/models/newsletterSubscription";
import {
  deleteNewsletterSubscription,
  fetchNewsletterSubscriptions,
  markNewsletterSubscriptionSeen,
} from "@/lib/api/newsletter-subscriptions";

type SeenFilter = "all" | "seen" | "unseen";

const PAGE_SIZE = 10;
const selectTriggerClassName =
  "h-10 w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 sm:w-[180px]";
const selectContentClassName = "rounded-xl border-[#063e8e]/15 bg-white text-gray-700";
const selectItemClassName = "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

function formatDateTime(value: string) {
  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

function buildNewsletterFilters(search: string, seenFilter: SeenFilter) {
  const filters: string[] = [];
  const keyword = search.trim();

  if (keyword) {
    filters.push(`email@=${keyword}`);
  }

  if (seenFilter === "seen") {
    filters.push("is_seen==true");
  }

  if (seenFilter === "unseen") {
    filters.push("is_seen==false");
  }

  return filters.join(",");
}

export default function AdminNewsletterEmailsPage() {
  const [items, setItems] = React.useState<NewsletterSubscription[]>([]);
  const [search, setSearch] = React.useState("");
  const [seenFilter, setSeenFilter] = React.useState<SeenFilter>("all");
  const [page, setPage] = React.useState(1);
  const [totalItems, setTotalItems] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [detailTarget, setDetailTarget] = React.useState<NewsletterSubscription | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<NewsletterSubscription | null>(null);

  const loadItems = React.useCallback(async () => {
    setReady(false);

    try {
      const data = await fetchNewsletterSubscriptions({
        page,
        pageSize: PAGE_SIZE,
        filters: buildNewsletterFilters(search, seenFilter),
      });

      setItems(data.rows);
      setTotalItems(data.count);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tải danh sách email đăng ký");
      setItems([]);
      setTotalItems(0);
    } finally {
      setReady(true);
    }
  }, [page, search, seenFilter]);

  React.useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSeenFilterChange = (value: SeenFilter) => {
    setSeenFilter(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteNewsletterSubscription(deleteTarget.id);
      toast.success("Đã xóa email đăng ký nhận thông tin");
      setDeleteTarget(null);
      await loadItems();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể xóa email đăng ký");
    }
  };

  const handleViewDetail = async (item: NewsletterSubscription) => {
    setDetailTarget(item);

    if (item.is_seen) return;

    try {
      await markNewsletterSubscriptionSeen(item.id);
      const seenAt = new Date().toISOString();
      const nextItem = { ...item, is_seen: true, seen_at: item.seen_at ?? seenAt };

      setItems((currentItems) =>
        currentItems.map((currentItem) => (currentItem.id === item.id ? nextItem : currentItem)),
      );
      setDetailTarget(nextItem);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể cập nhật trạng thái đã xem");
    }
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm email đăng ký..."
        filters={
          <Select value={seenFilter} onValueChange={(value) => handleSeenFilterChange(value as SeenFilter)}>
            <SelectTrigger className={selectTriggerClassName}>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className={selectContentClassName}>
              <SelectItem value="all" className={selectItemClassName}>
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value="unseen" className={selectItemClassName}>
                Chưa xem
              </SelectItem>
              <SelectItem value="seen" className={selectItemClassName}>
                Đã xem
              </SelectItem>
            </SelectContent>
          </Select>
        }
        actionMeta={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
            Tổng số email: {totalItems}
          </div>
        }
        onSearchChange={handleSearchChange}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-center text-white">Email</TableHead>
              <TableHead className="w-[190px] py-4 text-center text-white">Ngày gửi</TableHead>
              <TableHead className="w-[130px] py-4 text-center text-white">Trạng thái</TableHead>
              <TableHead className="w-[130px] py-4 text-center text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ready ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={5} className="px-4 py-4">
                    <div className="h-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center text-gray-400">
                  Không có email đăng ký nào
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
                >
                  <TableCell className="py-3 text-center text-sm text-gray-500">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell className="py-3 text-sm font-medium text-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#063e8e]/10 text-[#063e8e]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span>{item.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-center text-sm text-gray-700">
                    {formatDateTime(item.created_at)}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <span
                      className={
                        item.is_seen
                          ? "inline-flex rounded-full bg-[#edf7ee] px-3 py-1 text-xs font-semibold text-[#16803d]"
                          : "inline-flex rounded-full bg-[#fff4e5] px-3 py-1 text-xs font-semibold text-[#c7760d]"
                      }
                    >
                      {item.is_seen ? "Đã xem" : "Chưa xem"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <AdminRowActions
                      actions={[
                        { kind: "view", label: "Xem chi tiết email", onClick: () => void handleViewDetail(item) },
                        { kind: "delete", label: "Xóa email đăng ký", onClick: () => setDeleteTarget(item) },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableLayout>

      {totalPages > 1 ? (
        <div className="flex justify-center">
          <Pagination
            pageCount={totalPages}
            page={page}
            onChangePage={setPage}
            onGoToPreviousPage={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            onGoToNextPage={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
          />
        </div>
      ) : null}

      <ContactManagementDetailDialog
        open={!!detailTarget}
        title="Chi tiết email đăng ký nhận thông tin"
        description="Thông tin chi tiết của bản ghi email đăng ký nhận tin từ biểu mẫu website."
        badge={null}
        sections={
          detailTarget
            ? [
                {
                  title: "Thông tin đăng ký",
                  fields: [
                    { label: "Email", value: detailTarget.email },
                    { label: "Ngày gửi", value: formatDateTime(detailTarget.created_at) },
                    { label: "Trạng thái", value: detailTarget.is_seen ? "Đã xem" : "Chưa xem" },
                    {
                      label: "Ngày xem",
                      value: detailTarget.seen_at ? formatDateTime(detailTarget.seen_at) : "Chưa xem",
                    },
                  ],
                },
              ]
            : []
        }
        onOpenChange={(open) => !open && setDetailTarget(null)}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa email đăng ký"
        description={
          <>
            Bạn có chắc muốn xóa email <span className="font-semibold">{deleteTarget?.email}</span>?
            Hành động này không thể hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
