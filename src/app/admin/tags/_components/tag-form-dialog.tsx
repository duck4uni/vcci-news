"use client";

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

import { fieldClassName, slugifyTag } from "./utils";
import type { TagFormValues } from "./types";

interface TagFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formValues: TagFormValues;
  onFormValuesChange: React.Dispatch<React.SetStateAction<TagFormValues>>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function TagFormDialog({
  open,
  onOpenChange,
  formValues,
  onFormValuesChange,
  isSubmitting,
  onSubmit,
}: TagFormDialogProps) {
  const handleNameChange = (value: string) => {
    onFormValuesChange((previous) => ({
      ...previous,
      name: value,
      slug: slugifyTag(value),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-[#063e8e]/15 bg-white text-gray-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#063e8e]">
            {formValues.id ? "Chỉnh sửa tag" : "Tạo tag"}
          </DialogTitle>
          <DialogDescription className="text-gray-700">
            Tag ở đây dùng cho phần tag tìm kiếm của bài viết.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label className="mb-1.5 block text-gray-700">
              Tên tag <span className="text-red-600">*</span>
            </Label>
            <Input
              value={formValues.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Nhập tên tag"
              className={fieldClassName}
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Slug</Label>
            <Input
              value={formValues.slug}
              onChange={(event) =>
                onFormValuesChange((previous) => ({
                  ...previous,
                  slug: slugifyTag(event.target.value),
                }))
              }
              placeholder="slug-tag"
              className={fieldClassName}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            onClick={() => void onSubmit()}
          >
            {isSubmitting ? "Đang lưu..." : formValues.id ? "Cập nhật tag" : "Lưu tag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
