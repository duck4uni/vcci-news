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
  actionDisabled?: boolean;
  children: React.ReactNode;
  onSearchChange: (value: string) => void;
  onActionClick?: () => void;
}

export function AdminTableLayout({
  searchValue,
  searchPlaceholder = "Tìm kiếm...",
  actionLabel,
  actionIcon,
  actionDisabled = false,
  children,
  onSearchChange,
  onActionClick,
}: AdminTableLayoutProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={(event) => onSearchChange(event.target.value)}
          className="max-w-sm border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700"
        />

        {actionLabel ? (
          <Button
            type="button"
            disabled={actionDisabled}
            onClick={onActionClick}
            className="bg-[#063e8e] text-white hover:bg-[#063e8e]/90"
          >
            {actionIcon ?? <Plus className="mr-2 h-4 w-4" />}
            {actionLabel}
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#063e8e]/15 bg-white shadow-sm">
        {children}
      </div>
    </div>
  );
}
