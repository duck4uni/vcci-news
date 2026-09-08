"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fieldClassName } from "./constants";
import { formatHeaderCategoryOptionLabel, type HeaderCategoryOption } from "./utils";

export function HeaderCategoryMultiPicker({
  values,
  options,
  disabled,
  onChange,
}: {
  values: string[];
  options: HeaderCategoryOption[];
  disabled?: boolean;
  onChange: (values: string[]) => void;
}) {
  const [search, setSearch] = React.useState("");
  const selectedIds = React.useMemo(() => new Set(values), [values]);
  const selectedOptions = React.useMemo(
    () => options.filter((option) => selectedIds.has(option.id)),
    [options, selectedIds],
  );
  const filteredOptions = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const availableOptions = options.filter((option) => !selectedIds.has(option.id));
    const matchedOptions = keyword
      ? availableOptions.filter((option) =>
        option.name.toLowerCase().includes(keyword),
      )
      : availableOptions;

    return [...selectedOptions, ...matchedOptions.slice(0, 20)];
  }, [options, search, selectedIds, selectedOptions]);

  const toggleValue = (id: string, checked: boolean) => {
    onChange(checked ? [...values, id] : values.filter((item) => item !== id));
  };

  return (
    <div className="space-y-2">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 flex-1">
          <Label className="mb-1.5 block text-gray-700">
            Danh mục hiển thị <span className="text-red-600">*</span>
          </Label>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm danh mục theo tên"
            disabled={disabled}
            className={fieldClassName}
          />
        </div>
        <div className="rounded-lg border border-[#063e8e]/10 bg-white px-3 py-2 text-sm text-gray-700">
          Đã chọn {values.length} danh mục
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto rounded-xl border border-[#063e8e]/10 bg-white p-2">
        {filteredOptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filteredOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 rounded-lg border border-[#063e8e]/10 bg-white px-3 py-2"
              >
                <Checkbox
                  checked={selectedIds.has(option.id)}
                  disabled={disabled}
                  onCheckedChange={(checked) => toggleValue(option.id, checked === true)}
                  className="border-[#063e8e]/30 data-[state=checked]:border-[#063e8e] data-[state=checked]:bg-[#063e8e]"
                />
                <span className="min-w-0 truncate text-sm text-gray-700">
                  {formatHeaderCategoryOptionLabel(option)}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="px-3 py-2 text-sm text-gray-700">
            {"Kh\u00f4ng t\u00ecm th\u1ea5y danh m\u1ee5c ph\u00f9 h\u1ee3p."}
          </p>
        )}
      </div>
    </div>
  );
}
