'use client';

import { CircleDollarSign, FileStack, Layers3 } from "lucide-react";
import type { LegalTradePageProps } from "./types";

const FEE_ITEMS = [
  {
    title: "Một bộ GCN, CTTM (4 bản)",
    value: "100.000đ/bộ",
    icon: FileStack,
  },
  {
    title: "Bản làm thêm tính từ bản thứ 5 trở lên",
    value: "10.000đ/bản",
    icon: Layers3,
  },
  {
    title: "Phôi Giấy chứng nhận",
    value: "20.000đ/tờ",
    icon: CircleDollarSign,
  },
] as const;

export default function FeesPage(_: LegalTradePageProps) {
  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Phí cấp GCN và xác nhận CTTM
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="rounded-3xl border border-[#e5edf8] bg-[#f8fbff] px-5 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2450b5]">Biểu phí hiện hành</p>
              <p className="mt-3 text-[16px] leading-8 text-[#5f6f86]">
                Mức phí áp dụng cho việc cấp Giấy chứng nhận và xác nhận Chứng từ thương mại được tính theo từng loại hồ sơ và số lượng bản phát hành.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {FEE_ITEMS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className={[
                      "rounded-[26px] border px-5 py-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]",
                      index === 0 ? "border-[#dbe7ff] bg-[#f8fbff]" : "border-[#edf1f6] bg-white",
                    ].join(" ")}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#2450b5]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[20px] font-bold leading-tight text-[#1f2a44]">{item.title}</h2>
                    <p className="mt-4 text-[30px] font-bold leading-none text-[#2450b5]">{item.value}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Tóm tắt chi phí</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>01 bộ tiêu chuẩn gồm 4 bản</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Có phụ phí cho bản làm thêm từ bản thứ 5</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Phôi Giấy chứng nhận được tính riêng theo từng tờ</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-linear-to-br from-[#1d56b7] to-[#21467f] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)]">
            <h2 className="text-[26px] font-bold leading-tight">Lưu ý khi chuẩn bị</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/88">
              <p>Kiểm tra trước số lượng bản cần cấp để chuẩn bị đúng chi phí thực hiện.</p>
              <p>Chuẩn bị lệ phí đầy đủ sẽ giúp quá trình tiếp nhận và xử lý hồ sơ diễn ra nhanh hơn.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
