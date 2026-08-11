"use client";

import Link from "next/link";
import { usePermission } from "@/hooks/usePermission";
import { NoPermissionMessage } from "@/components/shared/permission-gate";

export default function NoPermissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f9ff] via-[#edf4ff] to-[#f8fbff]">
      {/* Header */}
      <div className="border-b border-[#063e8e]/10 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#063e8e]">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-[#063e8e]">VCCI News Admin</div>
            <div className="text-xs text-slate-500">Trang quản trị website</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-4 py-16">
        <NoPermissionMessage />
      </div>

      {/* Footer */}
      <div className="border-t border-[#063e8e]/10 bg-white/50 px-6 py-4 text-center">
        <p className="text-sm text-slate-500">© 2026 VCCI HCM</p>
      </div>
    </div>
  );
}
