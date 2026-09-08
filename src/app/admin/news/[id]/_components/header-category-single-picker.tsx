"use client";

import { Label } from "@/components/ui/label";
import { HeaderCategoryCombobox } from "./header-category-combobox";
import type { HeaderCategoryOption } from "./utils";

export function HeaderCategorySinglePicker({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string;
  options: HeaderCategoryOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="mb-1.5 block text-gray-700">
        Danh mục hiển thị <span className="text-red-600">*</span>
      </Label>
      <HeaderCategoryCombobox
        value={value}
        onChange={onChange}
        disabled={disabled}
        options={options}
      />
    </div>
  );
}
