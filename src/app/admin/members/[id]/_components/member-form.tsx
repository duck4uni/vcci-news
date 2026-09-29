"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminImagePicker } from "@/components/admin/image-picker";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import {
  useGetApiV10MemberId,
  usePostApiV10Member,
  usePutApiV10MemberId,
} from "@/api/vcci-news/endpoints/member";
import { useGetApiV10Business } from "@/api/vcci-news/endpoints/business";
import { useGetApiV10Position } from "@/api/vcci-news/endpoints/position";
import {
  type AdminMemberFormValues,
  EMPTY_MEMBER_FORM,
  extractRows,
} from "@/lib/utils/admin-member";

interface AdminMemberFormProps {
  memberId?: string;
}

const fieldClassName =
  "border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

const selectTriggerClassName =
  "border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName =
  "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

export function AdminMemberForm({ memberId }: AdminMemberFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = !memberId || memberId === "new";

  const [form, setForm] = useState<AdminMemberFormValues>(EMPTY_MEMBER_FORM);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [hydrated, setHydrated] = useState(isNew);

  const memberQuery = useGetApiV10MemberId(isNew ? "" : memberId!, {
    query: { enabled: !isNew && !!memberId },
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

  const businesses = useMemo(
    () =>
      extractRows((businessesQuery.data as any)?.responseData).map(
        (row: any) => ({
          id: String(row?.id ?? ""),
          name: String(row?.name ?? ""),
        }),
      ),
    [businessesQuery.data],
  );

  const positions = useMemo(
    () =>
      extractRows((positionsQuery.data as any)?.responseData).map(
        (row: any) => ({
          id: String(row?.id ?? ""),
          name: String(row?.name ?? ""),
        }),
      ),
    [positionsQuery.data],
  );

  const createMember = usePostApiV10Member();
  const updateMember = usePutApiV10MemberId();

  useEffect(() => {
    if (isNew) {
      setForm(EMPTY_MEMBER_FORM);
      setHydrated(true);
      setNotFound(false);
      return;
    }
    const memberData = (memberQuery as any).data as any;
    if (!memberData) return;

    const raw = memberData?.responseData ?? memberData ?? null;
    const row = raw && typeof raw === "object" && "rows" in raw
      ? Array.isArray(raw.rows)
        ? raw.rows[0]
        : null
      : raw;

    if (!row || !row.id) {
      setNotFound(true);
      setHydrated(true);
      return;
    }

    setForm({
      id: String(row.id ?? ""),
      full_name: row.full_name ?? "",
      avatar_url: row.avatar_url ?? null,
      birth_date: row.birth_date ? String(row.birth_date).slice(0, 10) : "",
      business_id: row.business_id ? String(row.business_id) : "",
      position_id: row.position_id ? String(row.position_id) : "",
      job_title: row.job_title ?? "",
    });
    setNotFound(false);
    setHydrated(true);
  }, [isNew, memberQuery.data]);

  const set = <K extends keyof AdminMemberFormValues>(
    key: K,
    value: AdminMemberFormValues[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleImageSelect = (item: AdminMediaItem) => {
    set("avatar_url", item.url);
    setImagePickerOpen(false);
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast.error("Vui lòng nhập tên hội viên");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        avatar_url: form.avatar_url || null,
        birth_date: form.birth_date ? form.birth_date : null,
        business_id: form.business_id || null,
        position_id: form.position_id || null,
        job_title: form.job_title || null,
      };

      if (isNew) {
        await createMember.mutateAsync({ data: payload });
        toast.success("Đã thêm hội viên mới");
      } else {
        await updateMember.mutateAsync({ id: memberId!, data: payload });
        toast.success("Đã lưu thay đổi");
      }

      queryClient.invalidateQueries({ queryKey: ["getApiV10Member"] });
      router.push("/admin/members");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Không thể lưu hội viên";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated || (!isNew && memberQuery.isLoading)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#063e8e] border-t-transparent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/members">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-[#063e8e]/15"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#063e8e]">Hội viên</h1>
          </div>
        </div>
        <div className="rounded-2xl border border-[#063e8e]/15 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-700">
            Không tìm thấy hội viên này hoặc dữ liệu không tồn tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/members">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-[#063e8e]/15"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#063e8e]">
            {isNew ? "Thêm hội viên mới" : "Chỉnh sửa hội viên"}
          </h1>
          <p className="text-sm text-gray-500">
            {isNew ? "Điền thông tin hội viên mới" : `Chỉnh sửa: ${form.full_name}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Main info */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">
              Thông tin cơ bản
            </h2>
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-gray-700">
                  Tên hội viên <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  placeholder="Nhập tên hội viên..."
                  className={fieldClassName}
                />
              </div>

              {/* Business & Position */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Doanh nghiệp</Label>
                  <Select
                    value={form.business_id || undefined}
                    onValueChange={(v) => set("business_id", v)}
                  >
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Chọn doanh nghiệp" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClassName}>
                      {businesses.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-gray-700">
                          Không có dữ liệu doanh nghiệp
                        </div>
                      ) : (
                        businesses.map((b) => (
                          <SelectItem
                            key={b.id}
                            value={b.id}
                            className={selectItemClassName}
                          >
                            {b.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-700">Chức vụ</Label>
                  <Select
                    value={form.position_id || undefined}
                    onValueChange={(v) => set("position_id", v)}
                  >
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClassName}>
                      {positions.length === 0 ? (
                        <div className="px-3 py-6 text-center text-sm text-gray-700">
                          Không có dữ liệu chức vụ
                        </div>
                      ) : (
                        positions.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className={selectItemClassName}
                          >
                            {p.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job title & Birth date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Chức danh</Label>
                  <Input
                    value={form.job_title ?? ""}
                    onChange={(e) => set("job_title", e.target.value)}
                    placeholder="Nhập chức danh..."
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Ngày sinh</Label>
                  <Input
                    type="date"
                    value={form.birth_date ?? ""}
                    onChange={(e) => set("birth_date", e.target.value)}
                    className={fieldClassName}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">
              Thao tác
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu hội viên"}
              </Button>
              <Link href="/admin/members" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#063e8e]/15"
                  disabled={saving}
                >
                  Hủy
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">
              Ảnh đại diện
            </h2>
            {form.avatar_url ? (
              <div className="space-y-3">
                <div className="relative aspect-square overflow-hidden rounded-full border border-[#063e8e]/15">
                  <Image
                    src={form.avatar_url}
                    alt={form.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => set("avatar_url", null)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Xóa ảnh
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full border-[#063e8e]/15"
                onClick={() => setImagePickerOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Chọn ảnh đại diện
              </Button>
            )}
          </div>
        </div>
      </div>

      <AdminImagePicker
        open={imagePickerOpen}
        onOpenChange={setImagePickerOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
