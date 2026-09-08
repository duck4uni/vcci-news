"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminTableLayoutProps {
  searchValue: string;
  searchPlaceholder?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionMeta?: React.ReactNode;
  actionDisabled?: boolean;
  children: React.ReactNode;
  filters?: React.ReactNode;
  onSearchChange: (value: string) => void;
  onActionClick?: () => void;
}

export function AdminTableLayout({
  searchValue,
  searchPlaceholder = "Tìm kiếm...",
  actionLabel,
  actionIcon,
  actionMeta,
  actionDisabled = false,
  children,
  filters,
  onSearchChange,
  onActionClick,
}: AdminTableLayoutProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <Input
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 sm:max-w-sm"
          />
          {filters}
        </div>

        {actionLabel || actionMeta ? (
          <div className="flex w-full flex-wrap items-center gap-3 self-start sm:w-auto sm:self-auto">
            {actionMeta}
            {actionLabel ? (
              <Button
                type="button"
                disabled={actionDisabled}
                onClick={onActionClick}
                className="w-full bg-[#063e8e] text-white hover:bg-[#063e8e]/90 sm:w-auto"
              >
                {actionIcon ?? <Plus className="mr-2 h-4 w-4" />}
                {actionLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#063e8e]/20 bg-white shadow-sm [&_table]:min-w-[760px] [&_tbody_td:not(:last-child)]:border-r [&_tbody_td:not(:last-child)]:border-[#063e8e]/20 [&_thead_th:not(:last-child)]:border-r [&_thead_th:not(:last-child)]:border-white/15">
        {children}
      </div>
    </div>
  );
}
