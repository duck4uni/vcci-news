"use client";

import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteApiV10MemberId } from "@/api/vcci-news/endpoints/member";
import { useGetApiV10Business } from "@/api/vcci-news/endpoints/business";
import { useGetApiV10Position } from "@/api/vcci-news/endpoints/position";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  extractRows,
  mapApiRowToAdminMemberRow,
  type AdminMemberRow,
} from "@/lib/utils/admin-member";
import { MemberFilters } from "./_components/member-filters";
import { MemberRow } from "./_components/member-row";
import { MemberTableLoading } from "./_components/member-table-loading";
import { useGetApiV10Member } from "@/api/vcci-news/endpoints/member";

export default function AdminMembersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [businessFilter, setBusinessFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminMemberRow | null>(null);

  const membersQuery = useGetApiV10Member({
    page: 1,
    pageSize: 200,
    sortField: "created_at",
    sortOrder: "desc",
  });
  const businessesQuery = useGetApiV10Business({
    page: 1,
    pageSize: 200,
    sortField: "created_at",
    sortOrder: "desc",
  });
  const positionsQuery = useGetApiV10Position({
    page: 1,
    pageSize: 200,
    sortField: "created_at",
    sortOrder: "desc",
  });

  const { mutateAsync: deleteMember } = useDeleteApiV10MemberId();

  const members = useMemo(
    () => extractRows((membersQuery.data as any)?.responseData).map(mapApiRowToAdminMemberRow),
    [membersQuery.data],
  );

  const businesses = useMemo(() => {
    const rows = extractRows((businessesQuery.data as any)?.responseData);
    return rows.map((row: any) => ({ id: String(row.id ?? ""), name: row.name ?? "" }));
  }, [businessesQuery.data]);

  const positions = useMemo(() => {
    const rows = extractRows((positionsQuery.data as any)?.responseData);
    return rows.map((row: any) => ({ id: String(row.id ?? ""), name: row.name ?? "" }));
  }, [positionsQuery.data]);

  const businessMap = useMemo(
    () => Object.fromEntries(businesses.map((b) => [b.id, b.name])),
    [businesses],
  );

  const positionMap = useMemo(
    () => Object.fromEntries(positions.map((p) => [p.id, p.name])),
    [positions],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return members.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.full_name.toLowerCase().includes(keyword) ||
        (item.job_title ?? "").toLowerCase().includes(keyword);

      const matchesBusiness =
        businessFilter === "all" || (item.business_id ?? "") === businessFilter;
      const matchesPosition =
        positionFilter === "all" || (item.position_id ?? "") === positionFilter;

      return matchesKeyword && matchesBusiness && matchesPosition;
    });
  }, [members, search, businessFilter, positionFilter]);

  const stats = useMemo(
    () => [
      {
        label: "Tổng hội viên",
        value: members.length,
        icon: <Users className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Số doanh nghiệp",
        value: businesses.length,
        icon: <Users className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Số chức vụ",
        value: positions.length,
        icon: <Users className="h-4 w-4 text-[#063e8e]" />,
      },
    ],
    [members, businesses, positions],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMember({ id: deleteTarget.id });
      queryClient.invalidateQueries();
      toast.success("Đã xóa hội viên");
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error("Không xóa được hội viên");
    }
  };

  const ready = !membersQuery.isLoading;
  const hasLoaded = membersQuery.isSuccess || membersQuery.isError;

  return (
    <div className="space-y-8">
      <AdminStatsGrid items={stats} />

      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm hội viên..."
        actionLabel="Thêm hội viên"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        onSearchChange={setSearch}
        onActionClick={() => router.push("/admin/members/new")}
        filters={
          <MemberFilters
            fields={businesses}
            regions={positions}
            fieldFilter={businessFilter}
            regionFilter={positionFilter}
            onFieldFilterChange={setBusinessFilter}
            onRegionFilterChange={setPositionFilter}
          />
        }
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[900px] table-fixed">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-[220px] py-4 text-center text-white">Tên hội viên</TableHead>
                <TableHead className="w-[160px] py-4 text-center text-white">Ảnh đại diện</TableHead>
                <TableHead className="w-48 py-4 text-center text-white">Chức vụ</TableHead>
                <TableHead className="w-48 py-4 text-center text-white">Doanh nghiệp</TableHead>
                <TableHead className="w-[180px] py-4 text-center text-white">Chức danh</TableHead>
                <TableHead className="w-[140px] py-4 text-center text-white">Ngày sinh</TableHead>
                <TableHead className="w-[100px] py-4 text-center text-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hasLoaded || !ready ? (
                <MemberTableLoading />
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-16 text-center text-gray-400">
                    Không có hội viên nào
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <MemberRow
                    key={item.id}
                    item={item}
                    index={index}
                    fieldName={item.business_id ? businessMap[item.business_id] : undefined}
                    regionName={item.position_id ? positionMap[item.position_id] : undefined}
                    onEdit={() => router.push(`/admin/members/${item.id}`)}
                    onDelete={() => setDeleteTarget(item)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AdminTableLayout>

      <AdminDeleteDialog
        open={!!deleteTarget}
        title="Xóa hội viên"
        description={
          <>
            Bạn có chắc muốn xóa hội viên{" "}
            <span className="font-semibold">{deleteTarget?.full_name}</span>? Hành động này không thể
            hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
