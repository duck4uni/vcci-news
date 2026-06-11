"use client";

import * as React from "react";
import { FolderTree } from "lucide-react";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";

interface HeaderCategoryStatsProps {
  total: number;
  root: number;
  nested: number;
}

export function HeaderCategoryStats({
  total,
  root,
  nested,
}: HeaderCategoryStatsProps) {
  return (
    <AdminStatsGrid
      items={[
        {
          label: "Tổng danh mục",
          value: total,
          icon: <FolderTree className="h-4 w-4 text-[#063e8e]" />,
        },
        {
          label: "Danh mục cha",
          value: root,
          icon: <FolderTree className="h-4 w-4 text-[#063e8e]" />,
        },
        {
          label: "Danh mục con",
          value: nested,
          icon: <FolderTree className="h-4 w-4 text-[#063e8e]" />,
        },
      ]}
    />
  );
}
