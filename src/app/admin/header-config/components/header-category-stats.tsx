"use client";

import * as React from "react";
import { FolderTree } from "lucide-react";
import { AdminStatsGrid } from "@/components/admin/admin-stats-grid";

interface HeaderCategoryStatsProps {
  total: number;
  root: number;
  nested: number;
  grouped: number;
}

export function HeaderCategoryStats({
  total,
  root,
  nested,
  grouped,
}: HeaderCategoryStatsProps) {
  return (
    <AdminStatsGrid
      items={[
        { label: "Tá»•ng danh má»¥c", value: total, icon: <FolderTree className="h-4 w-4 text-[#063e8e]" /> },
        { label: "Danh má»¥c cha", value: root, icon: <FolderTree className="h-4 w-4 text-[#063e8e]" /> },
        { label: "Danh má»¥c con", value: nested, icon: <FolderTree className="h-4 w-4 text-[#063e8e]" /> },
        { label: "CÃ³ danh má»¥c con", value: grouped, icon: <FolderTree className="h-4 w-4 text-[#063e8e]" /> },
      ]}
    />
  );
}
