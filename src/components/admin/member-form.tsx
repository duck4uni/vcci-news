"use client";

import * as React from "react";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminImagePicker } from "@/components/admin/image-picker";
import { AdminPostContentEditor } from "@/components/admin/post-content-editor";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AdminMediaItem,
  type AdminNewsContentSection,
} from "@/mockdata/admin-news";
import {
  type MemberField,
  type MemberFormValues,
  type MemberImageRef,
  type MemberItem,
  type MemberRegion,
  EMPTY_MEMBER_FORM,
  cloneMemberFormValues,
  createMemberId,
  persistMembers,
  readMemberFields,
  readMemberRegions,
  readMembers,
} from "@/mockdata/members";

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

function toImageRef(item: AdminMediaItem): MemberImageRef {
  return { id: item.id, name: item.name, alt: item.alt, url: item.url };
}

export function AdminMemberForm({ memberId }: AdminMemberFormProps) {
  const router = useRouter();
  const isNew = !memberId || memberId === "new";

  const [form, setForm] = React.useState<MemberFormValues>(EMPTY_MEMBER_FORM);
  const [fields, setFields] = React.useState<MemberField[]>([]);
  const [regions, setRegions] = React.useState<MemberRegion[]>([]);
  const [imagePickerOpen, setImagePickerOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const allFields = readMemberFields();
    const allRegions = readMemberRegions();
    setFields(allFields);
    setRegions(allRegions);

    if (!isNew) {
      const all = readMembers();
      const found = all.find((m) => m.id === memberId);
      if (found) {
        setForm(cloneMemberFormValues(found));
      }
    }

    setReady(true);
  }, [isNew, memberId]);

  const set = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleImageSelect = (item: AdminMediaItem) => {
    set("image", toImageRef(item));
    setImagePickerOpen(false);
  };

  const handleIntroductionChange = (sections: AdminNewsContentSection[]) => {
    set("introduction", sections);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên hội viên");
      return;
    }

    setSaving(true);

    try {
      const now = new Date().toISOString();
      const all = readMembers();

      if (isNew) {
        const newItem: MemberItem = {
          id: createMemberId(),
          name: form.name.trim(),
          is_featured: form.is_featured,
          image: form.image,
          region_id: form.region_id,
          field_id: form.field_id,
          address: form.address,
          phone: form.phone,
          fax: form.fax,
          email: form.email,
          website: form.website,
          introduction: form.introduction,
          created_at: now,
          updated_at: now,
        };
        persistMembers([...all, newItem]);
        toast.success("Đã thêm hội viên mới");
      } else {
        const nextAll = all.map((m) => {
          if (m.id !== memberId) return m;
          return {
            ...m,
            name: form.name.trim(),
            is_featured: form.is_featured,
            image: form.image,
            region_id: form.region_id,
            field_id: form.field_id,
            address: form.address,
            phone: form.phone,
            fax: form.fax,
            email: form.email,
            website: form.website,
            introduction: form.introduction,
            updated_at: now,
          } satisfies MemberItem;
        });
        persistMembers(nextAll);
        toast.success("Đã lưu thay đổi");
      }

      router.push("/admin/members");
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#063e8e] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/members">
          <Button type="button" variant="outline" size="icon" className="border-[#063e8e]/15">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#063e8e]">
            {isNew ? "Thêm hội viên mới" : "Chỉnh sửa hội viên"}
          </h1>
          <p className="text-sm text-gray-500">
            {isNew ? "Điền thông tin hội viên mới" : `Chỉnh sửa: ${form.name}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        {/* Main info */}
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">Thông tin cơ bản</h2>
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label className="text-gray-700">
                  Tên hội viên <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Nhập tên hội viên..."
                  className={fieldClassName}
                />
              </div>

              {/* Region & Field */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Khu vực</Label>
                  <Select value={form.region_id} onValueChange={(v) => set("region_id", v)}>
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClassName}>
                      {regions.map((r) => (
                        <SelectItem key={r.id} value={r.id} className={selectItemClassName}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-gray-700">Lĩnh vực</Label>
                  <Select value={form.field_id} onValueChange={(v) => set("field_id", v)}>
                    <SelectTrigger className={selectTriggerClassName}>
                      <SelectValue placeholder="Chọn lĩnh vực" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClassName}>
                      {fields.map((f) => (
                        <SelectItem key={f.id} value={f.id} className={selectItemClassName}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label className="text-gray-700">Địa chỉ</Label>
                <Input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Nhập địa chỉ..."
                  className={fieldClassName}
                />
              </div>

              {/* Phone & Fax */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Điện thoại</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="Nhập số điện thoại..."
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Fax</Label>
                  <Input
                    value={form.fax}
                    onChange={(e) => set("fax", e.target.value)}
                    placeholder="Nhập số fax..."
                    className={fieldClassName}
                  />
                </div>
              </div>

              {/* Email & Website */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="Nhập email..."
                    className={fieldClassName}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700">Website</Label>
                  <Input
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://..."
                    className={fieldClassName}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[#063e8e]/15 bg-[#063e8e]/[0.02] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Hội viên tiêu biểu</p>
                    <p className="mt-1 text-sm text-gray-700">
                      Đánh dấu để ưu tiên hiển thị như một hội viên tiêu biểu.
                    </p>
                  </div>
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(checked) => set("is_featured", Boolean(checked))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Introduction (CMS) */}
          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">Giới thiệu</h2>
            <AdminPostContentEditor
              sections={form.introduction}
              onChange={handleIntroductionChange}
            />
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">Thao tác</h2>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="w-full bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Đang lưu..." : "Lưu hội viên"}
              </Button>
              <Link href="/admin/members" className="w-full">
                <Button type="button" variant="outline" className="w-full border-[#063e8e]/15">
                  Hủy
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#063e8e]">Ảnh đại diện</h2>
            {form.image ? (
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-[#063e8e]/15">
                  <SafeNextImage
                    src={form.image.url}
                    alt={form.image.alt || form.image.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#063e8e]/15 text-xs"
                    onClick={() => setImagePickerOpen(true)}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Đổi ảnh
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => set("image", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-[#063e8e]/25 text-[#063e8e]/60 hover:border-[#063e8e]/50 hover:text-[#063e8e]"
                onClick={() => setImagePickerOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Chọn ảnh
              </Button>
            )}
          </div>
        </div>
      </div>

      <AdminImagePicker
        open={imagePickerOpen}
        selectedId={form.image?.id ?? null}
        onOpenChange={setImagePickerOpen}
        onSelect={handleImageSelect}
      />
    </div>
  );
}
