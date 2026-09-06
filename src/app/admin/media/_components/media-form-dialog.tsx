"use client";

import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Save,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SafeNextImage } from "@/components/admin/safe-next-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type MediaFormValues,
  EMPTY_MEDIA_FORM,
  inputClassName,
} from "./types";
import { formatFileSize } from "./utils";

interface MediaFormDialogProps {
  open: boolean;
  saving: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: MediaFormValues) => Promise<void>;
}

export function MediaFormDialog({
  open,
  saving,
  onOpenChange,
  onSave,
}: MediaFormDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<MediaFormValues>(EMPTY_MEDIA_FORM);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_MEDIA_FORM);
  }, [open]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const defaultName = file.name.replace(/\.[^.]+$/, "");

    setForm((previous) => {
      if (previous.previewUrl) {
        URL.revokeObjectURL(previous.previewUrl);
      }

      return {
        file,
        name: previous.name || defaultName,
        previewUrl,
      };
    });

    event.target.value = "";
  };

  useEffect(() => {
    return () => {
      if (form.previewUrl) {
        URL.revokeObjectURL(form.previewUrl);
      }
    };
  }, [form.previewUrl]);

  const handleSave = async () => {
    if (!form.file) {
      toast.error("Vui lòng chọn ảnh cần tải lên");
      return;
    }

    await onSave({
      ...form,
      name: form.name.trim() || form.file.name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] w-[calc(100vw-32px)] max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[#063e8e]/15 bg-white p-0 shadow-[0_26px_70px_rgba(15,23,42,0.24)]">
        <DialogHeader className="shrink-0 border-b border-[#063e8e]/10 px-6 py-5 sm:px-7">
          <DialogTitle className="text-xl font-semibold text-[#063e8e]">
            Tải ảnh lên
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-[#063e8e]/10 bg-[linear-gradient(180deg,#f5f9ff_0%,#eef5ff_100%)] p-6 lg:border-b-0 lg:border-r lg:p-7">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                <div className="relative aspect-[16/10] bg-[radial-gradient(circle_at_top,#d9e8ff_0%,#f7faff_58%,#ffffff_100%)]">
                  {form.previewUrl ? (
                    <SafeNextImage
                      src={form.previewUrl}
                      alt={form.name}
                      fill
                      className="object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#063e8e]/10 text-[#063e8e]">
                        <ImageIcon className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">
                          Chưa có ảnh nào được chọn
                        </p>
                        <p className="text-xs text-slate-500">
                          Chọn ảnh từ máy tính để tải lên hệ thống
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-dashed border-[#063e8e]/20 bg-white/90 p-5">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    Tải ảnh từ máy tính
                  </p>
                  <p className="text-sm text-slate-500">
                    Hỗ trợ ảnh JPG, PNG, WEBP. Ảnh sẽ được lưu vào API /file/upload.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-2xl border-[#063e8e]/15 bg-white text-[#063e8e] hover:bg-[#edf4ff]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn ảnh
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 lg:p-7">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Tên ảnh</Label>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, name: event.target.value }))
                  }
                  placeholder="Nhập tên ảnh"
                  className={inputClassName}
                />
              </div>

              <div className="rounded-[24px] border border-[#063e8e]/10 bg-white p-4 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Dung lượng</p>
                  <p className="font-semibold text-slate-700">
                    {formatFileSize(form.file?.size)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#063e8e]/10 bg-[#f8fbff] px-6 py-4 sm:px-7">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl border-[#063e8e]/15 bg-white text-slate-600 hover:bg-slate-50"
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="rounded-2xl bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Đang tải..." : "Tải ảnh lên"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
