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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type MembershipApplicationItem,
  persistMembershipApplications,
  readMembershipApplications,
} from "@/mockdata/contact-management";

function formatDateTime(value: string) {
  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

export default function AdminMembershipApplicationsPage() {
  const [items, setItems] = React.useState<MembershipApplicationItem[]>([]);
  const [search, setSearch] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [detailTarget, setDetailTarget] = React.useState<MembershipApplicationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MembershipApplicationItem | null>(null);

  React.useEffect(() => {
    setItems(readMembershipApplications());
    setReady(true);
  }, []);

  const filteredItems = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;

    return items.filter(
      (item) =>
        item.id.toLowerCase().includes(keyword) ||
        item.organizationName.toLowerCase().includes(keyword) ||
        item.contactName.toLowerCase().includes(keyword) ||
        item.contactEmail.toLowerCase().includes(keyword) ||
        item.businessField.toLowerCase().includes(keyword) ||
        item.membershipType.toLowerCase().includes(keyword),
    );
  }, [items, search]);

  const handleDelete = () => {
    if (!deleteTarget) return;

    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    setItems(nextItems);
    persistMembershipApplications(nextItems);
    toast.success("Đã xóa đơn đăng ký hội viên");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">

      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm đơn đăng ký hội viên..."
        actionMeta={
          <div className="text-sm font-medium text-gray-700">
            Tổng bản ghi: <span className="font-semibold text-[#063e8e]">{filteredItems.length}</span>
          </div>
        }
        onSearchChange={setSearch}
      >
        <div className="scrollbar overflow-x-auto">
          <Table className="min-w-[1080px]">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-16 py-4 text-center text-white">STT</TableHead>
                <TableHead className="py-4 text-center text-white">Tên công ty / tổ chức</TableHead>
                <TableHead className="w-[210px] py-4 text-center text-white">Người liên hệ</TableHead>
                <TableHead className="w-[180px] py-4 text-center text-white">Loại hội viên</TableHead>
                <TableHead className="w-[220px] py-4 text-center text-white">Email</TableHead>
                <TableHead className="w-[170px] py-4 text-center text-white">Ngày gửi</TableHead>
                <TableHead className="w-[130px] py-4 text-center text-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {!ready ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                    <TableCell colSpan={7} className="px-4 py-4">
                      <div className="h-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-gray-400">
                    Không có đơn đăng ký hội viên nào
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
                    <TableCell className="py-3 text-sm text-gray-800">
                      <div className="space-y-1">
                        <div className="font-semibold">{item.organizationName}</div>
                        <div className="text-gray-600">{item.businessField}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">{item.contactName}</div>
                        <div>{item.contactPhone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                        {item.membershipType}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-700">{item.contactEmail}</TableCell>
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
        title="Chi tiết đơn đăng ký hội viên"
        description="Biểu mẫu mẫu phục vụ duyệt giao diện quản trị đơn đăng ký hội viên."
        badge={
          detailTarget ? (
            <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
              {detailTarget.membershipType}
            </Badge>
          ) : null
        }
        sections={
          detailTarget
            ? [
                {
                  title: "Thông tin chung",
                  fields: [
                    { label: "Loại hội viên", value: detailTarget.membershipType },
                    { label: "Ngày gửi", value: formatDateTime(detailTarget.submittedAt) },
                  ],
                },
                {
                  title: "Thông tin doanh nghiệp",
                  fields: [
                    { label: "Tên công ty / tổ chức", value: detailTarget.organizationName },
                    { label: "Lĩnh vực hoạt động", value: detailTarget.businessField },
                    { label: "Địa chỉ", value: detailTarget.address, fullWidth: true },
                    { label: "Website", value: detailTarget.website },
                  ],
                },
                {
                  title: "Thông tin người liên hệ",
                  fields: [
                    { label: "Họ tên người liên hệ", value: detailTarget.contactName },
                    { label: "Chức vụ", value: detailTarget.contactPosition },
                    { label: "Email người liên hệ", value: detailTarget.contactEmail },
                    { label: "Điện thoại người liên hệ", value: detailTarget.contactPhone },
                    { label: "Ghi chú", value: detailTarget.note, fullWidth: true },
                  ],
                },
              ]
            : []
        }
        onOpenChange={(open) => !open && setDetailTarget(null)}
      />

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa đơn đăng ký hội viên"
        description={
          <>
            Bạn có chắc muốn xóa đơn đăng ký của{" "}
            <span className="font-semibold">{deleteTarget?.organizationName}</span>? Hành động này không
            thể hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
