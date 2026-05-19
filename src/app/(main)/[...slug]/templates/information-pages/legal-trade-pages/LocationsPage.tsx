'use client';

import { Building2, Clock3, MapPin, Phone } from "lucide-react";
import type { LegalTradePageProps } from "./types";

const LOCATIONS = [
  {
    title: "Điểm cấp số 1",
    address:
      "Phòng 103, Lầu 1, Tòa nhà VCCI HCM, 171 Võ Thị Sáu, Phường Xuân Hòa, Thành phố Hồ Chí Minh",
    phone: "028-3932 6498",
  },
  {
    title: "Điểm cấp số 2",
    address:
      "Lầu 3, Tòa nhà Công ty CP ICD Tân Cảng Sóng Thần, Số 7/20, Đường ĐT 743, KP. Bình Đáng, Phường Bình Hòa, Thành phố Hồ Chí Minh",
    phone: "0274-380 0048",
  },
  {
    title: "Điểm cấp số 3",
    address: "155 Nguyễn Thái Học, Phường Tam Thắng, Thành phố Hồ Chí Minh",
    phone: "025-4385 2710",
  },
] as const;

export default function LocationsPage(_: LegalTradePageProps) {
  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Điểm cấp và cấp GCN và xác nhận CTTM
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="rounded-3xl border border-[#e5edf8] bg-[#f8fbff] px-5 py-5">
              <div className="flex items-center gap-3 text-[#2450b5]">
                <Building2 className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                  1. Các điểm cấp GCN và xác nhận CTTM thuộc VCCI-HCM
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {LOCATIONS.map((item, index) => (
                <article
                  key={item.title}
                  className={[
                    "rounded-[26px] border px-5 py-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]",
                    index === 0 ? "border-[#dbe7ff] bg-[#f8fbff]" : "border-[#edf1f6] bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ff] text-lg font-bold text-[#2450b5]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-[22px] font-bold leading-tight text-[#1f2a44]">{item.title}</h2>
                      <div className="mt-4 space-y-3 text-[16px] leading-8 text-[#5f6f86]">
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                          <span>{item.address}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                          <span>{item.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-[#dbe7ff] bg-[#f8fbff] px-5 py-5">
              <div className="flex items-center gap-3 text-[#2450b5]">
                <Clock3 className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">2. Giờ tiếp nhận hồ sơ</p>
              </div>
              <div className="mt-4 space-y-2 text-[16px] leading-8 text-[#5f6f86]">
                <p>– Từ thứ Hai đến thứ Sáu</p>
                <p>Buổi sáng: 7h30 – 11h30</p>
                <p>Buổi chiều: 13h30 – 16h30</p>
                <p>Thời gian cấp: không quá 08 giờ làm việc</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Liên hệ nhanh</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              {LOCATIONS.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                  <span>
                    {item.title}: {item.phone}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-linear-to-br from-[#1d56b7] to-[#21467f] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)]">
            <h2 className="text-[26px] font-bold leading-tight">Khung giờ làm việc</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/88">
              <p>Từ thứ Hai đến thứ Sáu</p>
              <p>Buổi sáng: 7h30 – 11h30</p>
              <p>Buổi chiều: 13h30 – 16h30</p>
              <p>Thời gian cấp: không quá 08 giờ làm việc</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
