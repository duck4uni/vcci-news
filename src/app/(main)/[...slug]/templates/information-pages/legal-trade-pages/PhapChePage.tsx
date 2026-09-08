'use client';

import { BriefcaseBusiness, FileText, GraduationCap, Mail, Phone, Scale } from "lucide-react";
import type { LegalTradePageProps } from "./types";

const PHAP_CHE_SERVICES = [
  {
    title: "Góp ý và hỗ trợ pháp lý",
    description:
      "Tập hợp ý kiến góp ý xây dựng pháp luật, tiếp nhận các khó khăn, vướng mắc trong hoạt động kinh doanh của doanh nghiệp.",
    icon: Scale,
  },
  {
    title: "Tư vấn chuyên sâu",
    description:
      "Tư vấn, kết nối và cung cấp dịch vụ pháp lý kinh doanh chuyên sâu (Luật sư/ Trọng tài viên).",
    icon: FileText,
  },
  {
    title: "Dịch vụ thương mại",
    description:
      "Dịch vụ xuất khẩu, nhập khẩu; Chứng nhận lãnh sự; Phân loại HS; C/O; Lộ trình thuế quan trong các FTA; …",
    icon: BriefcaseBusiness,
  },
  {
    title: "Đào tạo chuyên sâu",
    description:
      "Tổ chức tập huấn đào tạo chuyên sâu trong các lĩnh vực Thuế; Hải quan; Tài chính kế toán; Phân loại mã số hàng hóa (Mã HS); Xuất xứ hàng hóa; Những vấn đề pháp lý của hợp đồng mua bán hàng hóa trong nước và quốc tế; …",
    icon: GraduationCap,
  },
];

export default function PhapChePage(_: LegalTradePageProps) {
  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Pháp chế
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#e5edf8] bg-[#f8fbff] px-5 py-5">
                <div className="flex items-center gap-3 text-[#2450b5]">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">Điện thoại</span>
                </div>
                <p className="mt-3 text-[28px] font-bold text-[#1f2a44]">028-3932 6498</p>
              </div>

              <div className="rounded-[24px] border border-[#e5edf8] bg-[#f8fbff] px-5 py-5">
                <div className="flex items-center gap-3 text-[#2450b5]">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">Email</span>
                </div>
                <p className="mt-3 break-words text-[22px] font-bold text-[#1f2a44]">co@vcci-hcm.org.vn</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              {PHAP_CHE_SERVICES.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[26px] border border-[#edf1f6] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#2450b5]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[22px] font-bold leading-tight text-[#1f2a44]">{item.title}</h2>
                    <p className="mt-3 text-[16px] leading-8 text-[#5f6f86]">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Phạm vi hỗ trợ</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Góp ý xây dựng pháp luật và tiếp nhận vướng mắc doanh nghiệp</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Tư vấn và kết nối chuyên gia pháp lý kinh doanh</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Đào tạo chuyên sâu về thuế, hải quan, xuất xứ và hợp đồng</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-linear-to-br from-[#1d56b7] to-[#21467f] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)]">
            <h2 className="text-[26px] font-bold leading-tight">Liên hệ Pháp chế</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/88">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#f5c21b]" />
                <span>028-3932 6498</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#f5c21b]" />
                <span>co@vcci-hcm.org.vn</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
