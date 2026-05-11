"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Eye, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { ContactManagementDetailDialog } from "@/components/admin/contact-management-detail-dialog";
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
  type NewsletterSubscriptionItem,
  persistNewsletterSubscriptions,
  readNewsletterSubscriptions,
} from "@/mockdata/contact-management";

function formatDateTime(value: string) {
  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

export default function AdminNewsletterEmailsPage() {
  const [items, setItems] = React.useState<NewsletterSubscriptionItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [detailTarget, setDetailTarget] = React.useState<NewsletterSubscriptionItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<NewsletterSubscriptionItem | null>(null);

  React.useEffect(() => {
    setItems(readNewsletterSubscriptions());
    setReady(true);
  }, []);

  const filteredItems = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter(
      (item) =>
        item.email.toLowerCase().includes(keyword) ||
        item.id.toLowerCase().includes(keyword) ||
        formatDateTime(item.submittedAt).toLowerCase().includes(keyword),
    );
  }, [items, search]);

  const handleDelete = () => {
    if (!deleteTarget) return;

    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    setItems(nextItems);
    persistNewsletterSubscriptions(nextItems);
    toast.success("Đã xóa email đăng ký nhận thông tin");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm email đăng ký..."
        actionMeta={
          <div className="text-sm font-medium text-gray-700">
            Tổng bản ghi: <span className="font-semibold text-[#063e8e]">{filteredItems.length}</span>
          </div>
        }
        onSearchChange={setSearch}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
              <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
              <TableHead className="py-4 text-center text-white">Email</TableHead>
              <TableHead className="w-[190px] py-4 text-center text-white">Ngày gửi</TableHead>
              <TableHead className="w-[130px] py-4 text-center text-white">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!ready ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={4} className="px-4 py-4">
                    <div className="h-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center text-gray-400">
                  Không có email đăng ký nào
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
                >
                  <TableCell className="py-3 text-center text-sm text-gray-500">
                    {index + 1}
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
                    {formatDateTime(item.submittedAt)}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
                        onClick={() => setDetailTarget(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </AdminTableLayout>

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
                    { label: "Ngày gửi", value: formatDateTime(detailTarget.submittedAt) },
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
