"use client";

import { ImagePlus, Save } from "lucide-react";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import { fieldClassName, type ConfigItemForm, type ConfigItemMode } from "./types";

export function ConfigItemDialog({
  open,
  mode,
  form,
  previewMedia,
  saving,
  title,
  description,
  onOpenChange,
  onChange,
  onPickImage,
  onSubmit,
}: {
  open: boolean;
  mode: ConfigItemMode;
  form: ConfigItemForm;
  previewMedia: AdminMediaItem | null;
  saving: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onChange: <K extends keyof ConfigItemForm>(
    key: K,
    value: ConfigItemForm[K],
  ) => void;
  onPickImage: () => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] max-w-xl flex-col overflow-hidden rounded-3xl border-[#063e8e]/15 bg-white p-0">
        <DialogHeader>
          <div className="border-b border-[#063e8e]/10 px-6 py-5">
            <DialogTitle className="text-xl text-[#063e8e]">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-600">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-700">Tên hiển thị</Label>
              <Input
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder={
                  mode === "logo" ? "Nhập tên logo..." : "Nhập tên banner..."
                }
                className={fieldClassName}
              />
            </div>

            {mode === "banner" ? (
              <div className="space-y-2">
                <Label className="text-gray-700">
                  Thời gian hiển thị (giây)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={form.displayTimeSeconds}
                  onChange={(event) =>
                    onChange(
                      "displayTimeSeconds",
                      Number(event.target.value || 1),
                    )
                  }
                  className={fieldClassName}
                />
              </div>
            ) : null}

            {mode === "banner" ? (
              <div className="space-y-2">
                <Label className="text-gray-700">Thứ tự hiển thị</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.sortOrder}
                  onChange={(event) =>
                    onChange("sortOrder", Number(event.target.value || 1))
                  }
                  className={fieldClassName}
                />
              </div>
            ) : null}

            <div className="space-y-3">
              <Label className="text-gray-700">Hình ảnh</Label>
              <div className="overflow-hidden rounded-3xl border border-dashed border-[#063e8e]/20 bg-[#eef4ff]/60">
                <div className="relative aspect-[16/9]">
                  {previewMedia ? (
                    <SafeNextImage
                      src={previewMedia.url}
                      alt={previewMedia.alt || previewMedia.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Chưa chọn hình ảnh
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onPickImage}
                className="rounded-xl border-[#063e8e]/15 text-gray-700 hover:bg-[#edf4ff]"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                Chọn từ thư viện
              </Button>
            </div>

            {mode === "banner" ? (
              <div className="flex items-center justify-between rounded-2xl border border-[#063e8e]/10 bg-[#f7faff] px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-[#163b73]">
                    Trạng thái hiển thị
                  </div>
                  <div className="text-xs text-gray-500">
                    {form.isActive ? "Đang bật hiển thị" : "Đang tắt hiển thị"}
                  </div>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(value) => onChange("isActive", value)}
                />
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="border-t border-[#063e8e]/10 px-6 py-4">
          <div className="flex w-full justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[#063e8e]/15 text-gray-700"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="rounded-xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Đang lưu..." : "Lưu cấu hình"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
