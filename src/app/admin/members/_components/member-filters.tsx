"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type MemberField, type MemberRegion } from "@/mockdata/members";
import {
  selectContentClassName,
  selectItemClassName,
  selectTriggerClassName,
} from "./constants";

interface MemberFiltersProps {
  fields: MemberField[];
  regions: MemberRegion[];
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
          <SelectValue placeholder="Lĩnh vực" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          <SelectItem value="all" className={selectItemClassName}>
            Tất cả lĩnh vực
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
          <SelectValue placeholder="Khu vực" />
        </SelectTrigger>
        <SelectContent className={selectContentClassName}>
          <SelectItem value="all" className={selectItemClassName}>
            Tất cả khu vực
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
