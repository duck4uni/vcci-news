'use client';

import { Download, FileBadge2, FileText } from "lucide-react";
import type { LegalTradePageProps } from "./types";

export default function FormsPage(_: LegalTradePageProps) {
  return (
    <section className="py-2">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Biểu mẫu GCN và nội dung khai báo GCN, CTTM
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">

            <div className="rounded-[26px] border border-[#edf1f6] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#2450b5]">
                  <FileText className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-[22px] font-bold leading-tight text-[#1f2a44]">
                    bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm.docx
                  </h2>
                  <p className="mt-3 text-[16px] leading-8 text-[#5f6f86]">
                    Nhấn tải xuống để xem toàn bộ biểu mẫu và nội dung khai báo.
                  </p>
                  <a
                    href="/bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm.docx"
                    download
                    className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-[#2450b5] px-5 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#173f9f]"
                  >
                    <Download className="h-4 w-4" />
                    Tải biểu mẫu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Lưu ý</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Người dùng có thể tải về để xem biểu mẫu đầy đủ trên máy của mình.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
