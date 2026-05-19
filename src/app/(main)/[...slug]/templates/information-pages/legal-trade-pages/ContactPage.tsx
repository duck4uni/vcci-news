'use client';

import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { LegalTradePageProps } from "./types";

export default function ContactPage(_: LegalTradePageProps) {
  return (
    <section className="py-2">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Thông tin liên hệ
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <div className="mt-7 space-y-5">
            <article className="rounded-3xl border border-[#edf1f6] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8">
              <h2 className="text-[24px] font-bold leading-tight text-[#1f2a44]">
                Phòng Pháp chế và xác nhận Chứng từ thương mại
              </h2>
              <div className="mt-5 space-y-4 text-[16px] leading-8 text-[#5f6f86]">
                <p>Liên đoàn Thương mại và Công nghiệp Việt Nam – Chi nhánh khu vực Thành phố Hồ Chí Minh (VCCI-HCM)</p>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                  <span>Phòng 103, Lầu 1, Tòa nhà VCCI HCM, 171 Võ Thị Sáu, P. Xuân Hòa, TP. HCM</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                  <span>028-3932 6498</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                  <span>co@vcci-hcm.org.vn</span>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-[#edf1f6] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8">
              <h2 className="text-[24px] font-bold leading-tight text-[#1f2a44]">
                Xử lý vướng mắc, phản ánh, góp ý trong quá trình làm thủ tục cấp GCN và xác nhận CTTM
              </h2>
              <div className="mt-5 space-y-5 text-[16px] leading-8 text-[#5f6f86]">
                <div>
                  <p className="font-semibold text-[#1f2a44]">Điểm cấp số 1</p>
                  <p>Điện thoại: 028-3932 6498</p>
                  <p>Email: co@vcci-hcm.org.vn</p>
                </div>

                <div>
                  <p className="font-semibold text-[#1f2a44]">Điểm cấp số 2</p>
                  <p>Phó Trưởng phòng: Nguyễn Văn Đức</p>
                  <p>Mobile: 090 949 7155</p>
                  <p>Email: nvduc1980@gmail.com</p>
                </div>

                <div>
                  <p className="font-semibold text-[#1f2a44]">Điểm cấp số 3</p>
                  <p>Trưởng phòng (Cơ sở 2): Bà Ma Thị Hương</p>
                  <p>Mobile: 039 512 2922</p>
                  <p>Email: huongmtvccivt@gmail.com</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-[#edf1f6] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8">
              <h2 className="text-[24px] font-bold leading-tight text-[#1f2a44]">
                Hướng dẫn hồ sơ và tiếp nhận phản ánh
              </h2>
              <div className="mt-5 space-y-5 text-[16px] leading-8 text-[#5f6f86]">
                <div>
                  <p className="font-semibold text-[#1f2a44]">Hướng dẫn khai hồ sơ thương nhân, chữ ký số và IT</p>
                  <p>Điểm cấp số 1, điện thoại: 028-3932 6498</p>
                  <p>Điểm cấp số 2, điện thoại: 0274-380 0048</p>
                  <p>Điểm cấp số 3, điện thoại: 025-4385 2710</p>
                </div>

                <div>
                  <p className="font-semibold text-[#1f2a44]">Tiếp thu, giải quyết phản ánh, khiếu nại, góp ý</p>
                  <p>Trưởng phòng (Trụ sở chính): Ông Vũ Xuân Hưng</p>
                  <p>Điện thoại: 028-3932 6929 hoặc Mobile: 0909 170 171 (Đường dây nóng)</p>
                  <p>Email: vuxuanhung@vcci-hcm.org.vn</p>
                </div>
              </div>
            </article>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Đầu mối hỗ trợ</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                <span>co@vcci-hcm.org.vn</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                <span>Đường dây nóng: 0909 170 171</span>
              </div>
              <div className="flex items-start gap-3">
                <UserRound className="mt-1 h-4 w-4 shrink-0 text-[#2450b5]" />
                <span>Ông Vũ Xuân Hưng</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
