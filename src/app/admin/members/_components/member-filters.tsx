"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  selectContentClassName,
  selectItemClassName,
  selectTriggerClassName,
} from "./constants";

interface MemberFiltersProps {
  fields: { id: string; name: string }[];
  regions: { id: string; name: string }[];
  fieldFilter: string;
  regionFilter: string;
  onFieldFilterChange: (value: string) => void;
  onRegionFilterChange: (value: string) => void;
}

export function MemberFilters({
  fields,
  regions,
  fieldFilter,
  regionFilter,
  onFieldFilterChange,
  onRegionFilterChange,
}: MemberFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <Select value={fieldFilter} onValueChange={onFieldFilterChange}>
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Doanh nghiệp" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          <SelectItem value="all" className={selectItemClassName}>
            Tất cả doanh nghiệp
          </SelectItem>
          {fields.map((f) => (
            <SelectItem key={f.id} value={f.id} className={selectItemClassName}>
              {f.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={regionFilter} onValueChange={onRegionFilterChange}>
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder="Chức vụ" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          <SelectItem value="all" className={selectItemClassName}>
            Tất cả chức vụ
          </SelectItem>
          {regions.map((r) => (
            <SelectItem key={r.id} value={r.id} className={selectItemClassName}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
