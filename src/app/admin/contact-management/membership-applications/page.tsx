"use client";

import * as React from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminRowActions } from "@/components/admin/admin-row-actions";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { ContactManagementDetailDialog } from "@/components/admin/contact-management-detail-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { useGetApiV10Contact, useDeleteApiV10ContactId } from "@/api/vcci-news/endpoints/contact";
import { extractRows } from "@/lib/utils/admin-contact";
import { useMemo, useState } from "react";

interface AdminMembershipApplicationRow {
  id: string;
  organizationName: string;
  businessField: string;
  address: string;
  website: string;
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  membershipType: string;
  note: string;
  submittedAt: string;
}

function mapApiRowToMembershipApplication(item: any): AdminMembershipApplicationRow {
  return {
    id: String(item?.id ?? ""),
    organizationName: item?.fullname ?? "",
    businessField: "",
    address: "",
    website: "",
    contactName: item?.fullname ?? "",
    contactPosition: "",
    contactEmail: item?.email ?? "",
    contactPhone: item?.phone ?? "",
    membershipType: item?.title ?? "",
    note: item?.content ?? "",
    submittedAt: item?.created_at ?? "",
  };
}

function formatDateTime(value: string) {
  if (!value) return "—";
  return dayjs(value).format("DD/MM/YYYY HH:mm");
}

export default function AdminMembershipApplicationsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [detailTarget, setDetailTarget] = useState<AdminMembershipApplicationRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMembershipApplicationRow | null>(null);

  const contactsQuery = useGetApiV10Contact({
    page: 1,
    pageSize: 200,
    sortField: "created_at",
    sortOrder: "desc",
  });
  const deleteContact = useDeleteApiV10ContactId();

  const items = useMemo(
    () =>
      extractRows((contactsQuery.data as any)?.responseData).map(
        mapApiRowToMembershipApplication,
      ),
    [contactsQuery.data],
  );

  const filteredItems = useMemo(() => {
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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteContact.mutateAsync({ id: deleteTarget.id });
      toast.success("Đã xóa đơn đăng ký hội viên");
      queryClient.invalidateQueries({ queryKey: ["getApiV10Contact"] });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể xóa đơn đăng ký hội viên";
      toast.error(message);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm đơn đăng ký hội viên..."
        actionMeta={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
            Tổng số đơn đăng ký: {items.length}
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
              {contactsQuery.isLoading ? (
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
                        <div className="font-semibold">{item.organizationName || "—"}</div>
                        <div className="text-gray-600">{item.businessField || "—"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-700">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">{item.contactName || "—"}</div>
                        <div>{item.contactPhone || "—"}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
                        {item.membershipType || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-sm text-gray-700">{item.contactEmail || "—"}</TableCell>
                    <TableCell className="py-3 text-center text-sm text-gray-700">
                      {formatDateTime(item.submittedAt)}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      <AdminRowActions
                        actions={[
                          { kind: "view", label: "Xem chi tiết đơn", onClick: () => setDetailTarget(item) },
                          {
                            kind: "delete",
                            label: "Xóa đơn đăng ký hội viên",
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

      <ContactManagementDetailDialog
        open={!!detailTarget}
        title="Chi tiết đơn đăng ký hội viên"
        description="Thông tin đầy đủ của đơn đăng ký hội viên được gửi từ website VCCI News."
        badge={
          detailTarget ? (
            <Badge variant="outline" className="border-[#063e8e]/25 text-[#063e8e]">
              {detailTarget.membershipType || "—"}
            </Badge>
          ) : null
        }
        sections={
          detailTarget
            ? [
              {
                title: "Thông tin chung",
                fields: [
                  { label: "Loại hội viên", value: detailTarget.membershipType || "—" },
                  { label: "Ngày gửi", value: formatDateTime(detailTarget.submittedAt) },
                ],
              },
              {
                title: "Thông tin doanh nghiệp",
                fields: [
                  { label: "Tên công ty / tổ chức", value: detailTarget.organizationName || "—" },
                  { label: "Lĩnh vực hoạt động", value: detailTarget.businessField || "—" },
                  { label: "Địa chỉ", value: detailTarget.address || "—", fullWidth: true },
                  { label: "Website", value: detailTarget.website || "—" },
                ],
              },
              {
                title: "Thông tin người liên hệ",
                fields: [
                  { label: "Họ tên người liên hệ", value: detailTarget.contactName || "—" },
                  { label: "Chức vụ", value: detailTarget.contactPosition || "—" },
                  { label: "Email người liên hệ", value: detailTarget.contactEmail || "—" },
                  { label: "Điện thoại người liên hệ", value: detailTarget.contactPhone || "—" },
                  { label: "Ghi chú", value: detailTarget.note || "—", fullWidth: true },
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
