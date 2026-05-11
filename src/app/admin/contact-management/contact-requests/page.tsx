"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { ContactManagementDetailDialog } from "@/components/admin/contact-management-detail-dialog";
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
  CONTACT_PURPOSE_OPTIONS,
  type ContactRequestItem,
  persistContactRequests,
  readContactRequests,
} from "@/mockdata/contact-management";

const selectTriggerClassName =
  "w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30 lg:w-[220px]";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";
const selectItemClassName = "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

function formatDateTime(value: string) {
  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

export default function AdminContactRequestsPage() {
  const [items, setItems] = React.useState<ContactRequestItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [purposeFilter, setPurposeFilter] = React.useState("all");
  const [ready, setReady] = React.useState(false);
  const [detailTarget, setDetailTarget] = React.useState<ContactRequestItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ContactRequestItem | null>(null);

  React.useEffect(() => {
    setItems(readContactRequests());
    setReady(true);
  }, []);

  const filteredItems = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.id.toLowerCase().includes(keyword) ||
        item.contactName.toLowerCase().includes(keyword) ||
        item.contactEmail.toLowerCase().includes(keyword) ||
        item.contactPhone.toLowerCase().includes(keyword) ||
        item.organizationName.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.message.toLowerCase().includes(keyword);

      const matchesPurpose = purposeFilter === "all" || item.purpose === purposeFilter;

      return matchesKeyword && matchesPurpose;
    });
  }, [items, purposeFilter, search]);

  const handleDelete = () => {
    if (!deleteTarget) return;

    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    setItems(nextItems);
    persistContactRequests(nextItems);
    toast.success("Đã xóa đơn liên hệ");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm đơn liên hệ..."
        actionMeta={
          <div className="text-sm font-medium text-gray-700">
            Tổng bản ghi: <span className="font-semibold text-[#063e8e]">{filteredItems.length}</span>
          </div>
        }
        filters={
          <Select value={purposeFilter} onValueChange={setPurposeFilter}>
            <SelectTrigger className={selectTriggerClassName}>
              <SelectValue placeholder="Mục đích liên hệ" />
            </SelectTrigger>
            <SelectContent className={selectContentClassName}>
              <SelectItem value="all" className={selectItemClassName}>
                Tất cả mục đích
              </SelectItem>
              {CONTACT_PURPOSE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option} className={selectItemClassName}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        onSearchChange={setSearch}
      >
        <div className="scrollbar overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
                <TableHead className="w-[220px] py-4 text-center text-white">Mục đích liên hệ</TableHead>
                <TableHead className="py-4 text-center text-white">Người liên hệ</TableHead>
                <TableHead className="py-4 text-center text-white">Tên công ty / tổ chức</TableHead>
                <TableHead className="w-[220px] py-4 text-center text-white">Email</TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">Ngày gửi</TableHead>
                <TableHead className="w-[130px] py-4 text-center text-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {!ready ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={7} className="px-4 py-4">
                    <div className="h-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center text-gray-400">
                  Không có đơn liên hệ nào
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
                  <TableCell className="py-3 text-center">
                    <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                      {item.purpose}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-800">
                      <div className="space-y-1">
                        <div className="font-semibold">{item.contactName}</div>
                        <div className="text-gray-600">{item.contactPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">{item.organizationName}</div>
                        <div>{item.businessField}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div>{item.email}</div>
                        <div className="text-gray-500">{item.contactEmail}</div>
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
        </div>
      </AdminTableLayout>

      <ContactManagementDetailDialog
        open={!!detailTarget}
        title="Chi tiết đơn liên hệ"
        description="Thông tin đầy đủ của đơn liên hệ được gửi từ website VCCI News."
        badge={
          detailTarget ? (
            <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
              {detailTarget.purpose}
            </Badge>
          ) : null
        }
        sections={
          detailTarget
            ? [
                {
                  title: "Thông tin chung",
                  fields: [
                    { label: "Mục đích liên hệ", value: detailTarget.purpose },
                    { label: "Ngày gửi", value: formatDateTime(detailTarget.submittedAt) },
                  ],
                },
                {
                  title: "Người liên hệ",
                  fields: [
                    { label: "Họ tên người liên hệ", value: detailTarget.contactName },
                    { label: "Chức vụ", value: detailTarget.contactPosition },
                    { label: "Email người liên hệ", value: detailTarget.contactEmail },
                    { label: "Điện thoại người liên hệ", value: detailTarget.contactPhone },
                    { label: "Nội dung liên hệ", value: detailTarget.message, fullWidth: true },
                  ],
                },
                {
                  title: "Thông tin công ty / tổ chức",
                  fields: [
                    { label: "Tên công ty / tổ chức", value: detailTarget.organizationName },
                    { label: "Lĩnh vực hoạt động", value: detailTarget.businessField },
                    { label: "Email", value: detailTarget.email },
                    { label: "Website", value: detailTarget.website },
                  ],
                },
              ]
            : []
        }
        onOpenChange={(open) => !open && setDetailTarget(null)}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa đơn liên hệ"
        description={
          <>
            Bạn có chắc muốn xóa đơn liên hệ của{" "}
            <span className="font-semibold">{deleteTarget?.contactName}</span>? Hành động này không thể
            hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
