"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  type MemberField,
  type MemberItem,
  type MemberRegion,
  persistMembers,
  readMemberFields,
  readMemberRegions,
  readMembers,
} from "@/mockdata/members";
import { MemberFilters } from "./_components/member-filters";
import { MemberRow } from "./_components/member-row";
import { MemberTableLoading } from "./_components/member-table-loading";

export default function AdminMembersPage() {
  const router = useRouter();
  const [items, setItems] = useState<MemberItem[]>([]);
  const [fields, setFields] = useState<MemberField[]>([]);
  const [regions, setRegions] = useState<MemberRegion[]>([]);
  const [search, setSearch] = useState("");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<MemberItem | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readMembers());
    setFields(readMemberFields());
    setRegions(readMemberRegions());
    setReady(true);
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        item.email.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword);

      const matchesField = fieldFilter === "all" || item.field_id === fieldFilter;
      const matchesRegion = regionFilter === "all" || item.region_id === regionFilter;

      return matchesKeyword && matchesField && matchesRegion;
    });
  }, [items, search, fieldFilter, regionFilter]);

  const stats = useMemo(
    () => [
      {
        label: "Tổng hội viên",
        value: items.length,
        icon: <Users className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Số lĩnh vực",
        value: fields.length,
        icon: <Users className="h-4 w-4 text-[#063e8e]" />,
      },
      {
        label: "Số khu vực",
        value: regions.length,
        icon: <Users className="h-4 w-4 text-[#063e8e]" />,
      },
    ],
    [items, fields, regions],
  );

  const fieldMap = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.id, f.name])),
    [fields],
  );

  const regionMap = useMemo(
    () => Object.fromEntries(regions.map((r) => [r.id, r.name])),
    [regions],
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    const next = items.filter((m) => m.id !== deleteTarget.id);
    setItems(next);
    persistMembers(next);
    toast.success("Đã xóa hội viên");
    setDeleteTarget(null);
  };

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
            fields={fields}
            regions={regions}
            fieldFilter={fieldFilter}
            regionFilter={regionFilter}
            onFieldFilterChange={setFieldFilter}
            onRegionFilterChange={setRegionFilter}
          />
        }
      >
        <div className="overflow-x-auto">
          <Table className="min-w-[900px] table-fixed">
            <TableHeader>
              <TableRow className="border-0 bg-[#063e8e] hover:bg-[#063e8e]">
                <TableHead className="w-[200px] py-4 text-center text-white">Tên hội viên</TableHead>
                <TableHead className="w-[120px] py-4 text-center text-white">Ảnh</TableHead>
                <TableHead className="w-40 py-4 text-center text-white">Khu vực</TableHead>
                <TableHead className="w-40 py-4 text-center text-white">Lĩnh vực</TableHead>
                <TableHead className="w-[200px] py-4 text-center text-white">Liên hệ</TableHead>
                <TableHead className="w-[180px] py-4 text-center text-white">Địa chỉ</TableHead>
                <TableHead className="w-[100px] py-4 text-center text-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!ready ? (
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
                    fieldName={fieldMap[item.field_id]}
                    regionName={regionMap[item.region_id]}
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
            <span className="font-semibold">{deleteTarget?.name}</span>? Hành động này không thể
            hoàn tác.
          </>
        }
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
