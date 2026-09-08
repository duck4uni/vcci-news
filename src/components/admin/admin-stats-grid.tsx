"use client";

import * as React from "react";

interface AdminStatsGridItem {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

interface AdminStatsGridProps {
  items: AdminStatsGridItem[];
  className?: string;
}

export function AdminStatsGrid({ items, className }: AdminStatsGridProps) {
  const gridClassName =
    className ??
    (items.length === 3
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4");

  return (
    <div className={gridClassName}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-[#063e8e]/15 bg-white px-5 py-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <div className="break-words text-2xl font-semibold leading-none text-black sm:text-3xl">{item.value}</div>
            </div>
            {item.icon ? (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#063e8e]/10">
                {item.icon}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
