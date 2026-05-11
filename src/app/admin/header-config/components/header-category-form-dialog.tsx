"use client";

import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  type HeaderCategoryTreeItem,
  type HeaderCategoryType,
  toSlug,
} from "@/mockdata/header-config";

export type HeaderCategoryFormMode = "create" | "edit";

export interface HeaderCategoryFormValues {
  id?: string;
  name: string;
  slug: string;
  sort_order: string;
  parent_id: string;
  type: HeaderCategoryType;
  description: string;
  tagsearch: string;
}

interface HeaderCategoryFormDialogProps {
  mode: HeaderCategoryFormMode;
  open: boolean;
  values: HeaderCategoryFormValues;
  parentOptions: HeaderCategoryTreeItem[];
  canChangeParent: boolean;
  onOpenChange: (open: boolean) => void;
  onValuesChange: React.Dispatch<React.SetStateAction<HeaderCategoryFormValues>>;
  onSubmit: () => void;
}

const TYPE_OPTIONS: Array<{ value: HeaderCategoryType; label: string }> = [
  { value: "category", label: "Danh mục" },
  { value: "page", label: "Bài viết trang" },
  { value: "news", label: "Tin tức" },
];

const fieldClassName =
  "border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30";

const selectTriggerClassName =
  "border-[#063e8e]/15 bg-white text-gray-700 data-[placeholder]:text-gray-700 focus:ring-[#063e8e]/30";

const selectContentClassName = "border-[#063e8e]/15 bg-white text-gray-700";

const selectItemClassName =
  "text-gray-700 focus:bg-[#063e8e]/10 focus:text-[#063e8e]";

export function HeaderCategoryFormDialog({
  mode,
  open,
  values,
  parentOptions,
  canChangeParent,
  onOpenChange,
  onValuesChange,
  onSubmit,
}: HeaderCategoryFormDialogProps) {
  const title = mode === "create" ? "Tạo danh mục" : "Chỉnh sửa danh mục";
  const availableTypeOptions = values.parent_id
    ? TYPE_OPTIONS.filter((option) => option.value !== "category")
    : TYPE_OPTIONS;

  const setField = <K extends keyof HeaderCategoryFormValues>(
    key: K,
    value: HeaderCategoryFormValues[K],
  ) => {
    onValuesChange((previous) => ({ ...previous, [key]: value }));
  };

  const handleNameChange = (value: string) => {
    onValuesChange((previous) => ({
      ...previous,
      name: value,
      slug: toSlug(value),
    }));
  };

  const searchTags = values.tagsearch
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-[#063e8e]/15 bg-white text-gray-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-[#063e8e]">{title}</DialogTitle>
          <DialogDescription className="text-gray-700">
            Thiết lập cấu trúc danh mục hiển thị trên header của website.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
          <div>
            <Label className="mb-1.5 block text-gray-700">Tên danh mục <span className="text-red-600">*</span></Label>
            <Input
              value={values.name}
              onChange={(event) => handleNameChange(event.target.value)}
              placeholder="Nhập tên danh mục"
              className={fieldClassName}
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Thể loại <span className="text-red-600">*</span></Label>
            <Select
              value={values.type}
              onValueChange={(value) =>
                setField("type", value as HeaderCategoryFormValues["type"])
              }
            >
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                {availableTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className={selectItemClassName}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Danh mục cha</Label>
            <Select
              disabled={!canChangeParent}
              value={values.parent_id || "__root__"}
              onValueChange={(value) =>
                setField("parent_id", value === "__root__" ? "" : value)
              }
            >
              <SelectTrigger className={selectTriggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectContentClassName}>
                <SelectItem value="__root__" className={selectItemClassName}>
                  Không có danh mục cha
                </SelectItem>
                {parentOptions
                  .filter((item) => item.id !== values.id)
                  .map((item) => (
                    <SelectItem
                      key={item.id}
                      value={item.id}
                      className={selectItemClassName}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {!canChangeParent ? (
              <p className="mt-1 text-xs text-gray-700">
                Danh mục đang có danh mục con nên không thể chuyển thành danh mục con.
              </p>
            ) : null}
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Thứ tự <span className="text-red-600">*</span></Label>
            <Input
              type="number"
              min="0"
              value={values.sort_order}
              onChange={(event) => setField("sort_order", event.target.value)}
              placeholder="1"
              className={fieldClassName}
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-gray-700">Slug <span className="text-red-600">*</span></Label>
            <Input
              value={values.slug}
              onChange={(event) => setField("slug", event.target.value)}
              placeholder="gioi-thieu"
              className={fieldClassName}
            />
          </div>

          <div className="md:col-span-2">
            <Label className="mb-1.5 block text-gray-700">Mô tả</Label>
            <Textarea
              rows={3}
              value={values.description}
              onChange={(event) => setField("description", event.target.value)}
              placeholder="Mô tả ngắn về danh mục"
              className={fieldClassName}
            />
          </div>

          {mode === "edit" && values.type === "news" ? (
            <div className="md:col-span-2">
              <Label className="mb-1.5 block text-gray-700">Tag tìm kiếm</Label>
              <Textarea
                rows={3}
                value={values.tagsearch}
                onChange={(event) => setField("tagsearch", event.target.value)}
                placeholder="Nhập tag tìm kiếm, ngăn cách bằng dấu phẩy"
                className={fieldClassName}
              />
              {searchTags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {searchTags.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center rounded-full border border-[#063e8e]/15 bg-[#063e8e]/[0.04] px-3 py-1 text-sm text-gray-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
            onClick={onSubmit}
          >
            {mode === "create" ? "Lưu danh mục" : "Cập nhật danh mục"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
