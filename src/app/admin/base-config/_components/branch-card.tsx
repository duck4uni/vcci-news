"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BaseConfigBranchItem } from "@/mockdata/base-config";

export function BranchCard({
  branch,
  current,
  onSelect,
  onDelete,
}: {
  branch: BaseConfigBranchItem;
  current: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`rounded-3xl border p-4 transition-all ${current
        ? "border-[#063e8e]/30 bg-[#eef5ff] shadow-[0_10px_24px_rgba(6,62,142,0.1)]"
        : "border-[#063e8e]/10 bg-white"
        }`}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="text-sm font-semibold text-[#163b73]">
          {branch.branchName || "Chi nhánh mới"}
        </div>
        <div className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
          {branch.address || "Chưa cập nhật địa chỉ"}
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {branch.hotline || "Chưa có hotline"}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
