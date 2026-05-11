"use client";

import * as React from "react";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminDeleteDialog } from "@/components/admin/admin-delete-dialog";
import { AdminTableLayout } from "@/components/admin/admin-table-layout";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  type MemberField,
  type MemberItem,
  type MemberRegion,
  persistMembers,
  readMemberFields,
  readMemberRegions,
  readMembers,
} from "@/mockdata/members";

const selectTriggerClassName =
  "w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30 lg:w-[200px]";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName = "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

function MemberTableLoading() {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow
      key={`loading-${index}`}
      className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
    >
      <TableCell colSpan={7} className="px-4 py-4">
        <div className="h-16 animate-pulse rounded-2xl bg-[#063e8e]/10" />
      </TableCell>
    </TableRow>
  ));
}

export default function AdminMembersPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<MemberItem[]>([]);
  const [fields, setFields] = React.useState<MemberField[]>([]);
  const [regions, setRegions] = React.useState<MemberRegion[]>([]);
  const [search, setSearch] = React.useState("");
  const [fieldFilter, setFieldFilter] = React.useState("all");
  const [regionFilter, setRegionFilter] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<MemberItem | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    setItems(readMembers());
    setFields(readMemberFields());
    setRegions(readMemberRegions());
    setReady(true);
  }, []);

  const filtered = React.useMemo(() => {
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

  const fieldMap = React.useMemo(
    () => Object.fromEntries(fields.map((field) => [field.id, field.name])),
    [fields],
  );

  const regionMap = React.useMemo(
    () => Object.fromEntries(regions.map((region) => [region.id, region.name])),
    [regions],
  );

  const handleDelete = () => {
    if (!deleteTarget) return;

    const nextItems = items.filter((item) => item.id !== deleteTarget.id);
    setItems(nextItems);
    persistMembers(nextItems);
    toast.success("Đã xóa hội viên");
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-8">
      <AdminTableLayout
        searchValue={search}
        searchPlaceholder="Tìm kiếm hội viên..."
        actionLabel="Thêm hội viên"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        actionMeta={
          <div className="rounded-xl border border-[#063e8e]/15 bg-[#f8fbff] px-4 py-2 text-sm font-semibold text-[#163b73]">
            Tổng số hội viên: {items.length}
          </div>
        }
        onSearchChange={setSearch}
        onActionClick={() => router.push("/admin/members/new")}
        filters={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Select value={fieldFilter} onValueChange={setFieldFilter}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Lĩnh vực" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem value="all" className={selectItemClassName}>
                  Tất cả lĩnh vực
                </SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id} className={selectItemClassName}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder="Khu vực" />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem value="all" className={selectItemClassName}>
                  Tất cả khu vực
                </SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id} className={selectItemClassName}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <div className="scrollbar overflow-x-auto">
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
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#063e8e]/3"}
                  >
                    <TableCell className="px-4 py-3 text-sm font-medium text-gray-800">
                      <div className="space-y-1">
                        <div>{item.name}</div>
                        {item.is_featured ? (
                          <Badge
                            variant="outline"
                            className="border-[#063e8e]/25 bg-[#063e8e]/[0.04] text-[#063e8e]"
                          >
                            Hội viên tiêu biểu
                          </Badge>
                        ) : null}
                      </div>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center">
                      {item.image ? (
                        <div className="mx-auto h-12 w-16 overflow-hidden rounded-lg border border-[#063e8e]/15">
                          <SafeNextImage
                            src={item.image.url}
                            alt={item.image.alt || item.name}
                            width={64}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mx-auto flex h-12 w-16 items-center justify-center rounded-lg border border-dashed border-[#063e8e]/20 bg-[#063e8e]/5 text-xs text-gray-400">
                          Chưa có
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
                      {regionMap[item.region_id] ?? "—"}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
                      {fieldMap[item.field_id] ?? "—"}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
                      {item.phone && <div>{item.phone}</div>}
                      {item.email && (
                        <div className="truncate text-xs text-[#063e8e]">{item.email}</div>
                      )}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center text-sm text-gray-600">
                      <span className="line-clamp-2">{item.address || "—"}</span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-[#063e8e]/10"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-[#063e8e]/15">
                          <DropdownMenuItem
                            className="cursor-pointer text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]"
                            onClick={() => router.push(`/admin/members/${item.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
