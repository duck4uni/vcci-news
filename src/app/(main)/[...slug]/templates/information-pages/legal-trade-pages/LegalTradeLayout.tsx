'use client';

import {
  Building2,
  CircleDollarSign,
  ClipboardList,
  FileBadge2,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  Scale,
  ScrollText,
} from "lucide-react";
import type { LegalTradeTemplate } from "./types";

type LegalTradeLayoutProps = {
  template: LegalTradeTemplate;
};

const ICONS = [Scale, FileCheck2, ScrollText, CircleDollarSign, Building2, ClipboardList];

export default function LegalTradeLayout({ template }: LegalTradeLayoutProps) {
  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            {template.pageTitle}
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          {template.intro ? (
            <p className="mt-5 max-w-6xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
              {template.intro}
            </p>
          ) : null}

          <div className="mt-7 space-y-5">
            {template.sections.map((section, index) => {
              const Icon = ICONS[index % ICONS.length];

              return (
                <article
                  key={section.title}
                  className="rounded-3xl border border-[#edf1f6] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#2450b5]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-[24px] font-bold leading-tight text-[#1f2a44]">{section.title}</h2>

                      {section.description ? (
                        <p className="mt-4 text-[16px] leading-8 text-[#5f6f86]">{section.description}</p>
                      ) : null}

                      {section.bullets?.length ? (
                        <ul className="mt-4 space-y-3 text-[16px] leading-8 text-[#5f6f86]">
                          {section.bullets.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#f5a400]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {section.numbered?.length ? (
                        <ol className="mt-4 space-y-4 text-[16px] leading-8 text-[#5f6f86]">
                          {section.numbered.map((item, itemIndex) => (
                            <li key={item} className="flex items-start gap-4">
                              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2450b5] text-sm font-bold text-white">
                                {itemIndex + 1}
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          {template.sideCard ? (
            <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
              <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">{template.sideCard.title}</h2>
              <div className="mt-5 space-y-4">
                {template.sideCard.items.map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[16px] leading-7 text-[#5f6f86]">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-[28px] bg-linear-to-br from-[#1d56b7] to-[#21467f] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)]">
            <h2 className="text-[26px] font-bold leading-tight">Liên hệ hỗ trợ</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/88">
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#f5c21b]" />
                <span>028-3932 6498</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#f5c21b]" />
                <span>co@vcci-hcm.org.vn</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#f5c21b]" />
                <span>Phòng 103, Lầu 1, Tòa nhà VCCI HCM, 171 Võ Thị Sáu, P. Xuân Hòa, TP. HCM</span>
              </div>
              <div className="flex items-start gap-3">
                <FileBadge2 className="mt-1 h-4 w-4 shrink-0 text-[#f5c21b]" />
                <span>Hệ thống trực tuyến: covcci.com.vn</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
