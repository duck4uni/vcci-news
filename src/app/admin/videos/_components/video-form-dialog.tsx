"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Video as CmsVideoItem } from "@/api/vcci-news/models/video";
import {
  EMPTY_VIDEO_FORM,
  fieldClassName,
  type VideoFormDialogProps,
  type VideoFormValues,
} from "./types";

export function VideoFormDialog({
  open,
  initial,
  saving,
  onOpenChange,
  onSave,
}: VideoFormDialogProps) {
  const [form, setForm] = useState<VideoFormValues>(EMPTY_VIDEO_FORM);

  useEffect(() => {
    if (!open) return;

    setForm(
      initial
        ? {
          id: initial.id,
          name: initial.name,
          url: initial.url,
        }
        : EMPTY_VIDEO_FORM,
    );
  }, [initial, open]);

  const handleField = <K extends keyof VideoFormValues>(
    key: K,
    value: VideoFormValues[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên video");
      return;
    }

    if (!form.url.trim()) {
      toast.error("Vui lòng nhập link URL");
      return;
    }

    await onSave({
      id: form.id,
      name: form.name.trim(),
      url: form.url.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-3xl border-[#063e8e]/15 bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#063e8e]">
            {initial ? "Chỉnh sửa video" : "Thêm video mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-gray-700">
              Tên video <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.name}
              onChange={(event) => handleField("name", event.target.value)}
              placeholder="Nhập tên video..."
              className={fieldClassName}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-gray-700">
              Link URL <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.url}
              onChange={(event) => handleField("url", event.target.value)}
              placeholder="https://..."
              className={fieldClassName}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#063e8e]/15 text-gray-700"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button
              type="button"
              className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
