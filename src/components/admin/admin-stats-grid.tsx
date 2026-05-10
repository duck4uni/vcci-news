"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className={className ?? "grid grid-cols-2 gap-4 lg:grid-cols-4"}>
      {items.map((item) => (
        <Card key={item.label} className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {item.label}
            </CardTitle>
            {item.icon ?? null}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
