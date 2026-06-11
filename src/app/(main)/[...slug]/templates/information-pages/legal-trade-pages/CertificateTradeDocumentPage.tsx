'use client';

import {
  BadgeCheck,
  Building2,
  FileCheck2,
  Files,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import type { LegalTradePageProps } from "./types";

const DEFINITIONS = [
  {
    title: "Giấy chứng nhận của VCCI (VCCI Certificate)",
    description:
      "Là một loại chứng từ thương mại do VCCI phát hành trên phôi chính thức của VCCI, nhằm chứng nhận các khai báo của Thương nhân liên quan đến hoạt động mua bán, xuất khẩu, nhập khẩu, gia công, chế biến hàng hóa, dựa trên cơ sở các hồ sơ, tài liệu do Thương nhân đó xuất trình. Giấy chứng nhận này không phải là giấy chứng nhận xuất xứ hàng hóa (C/O) và không có giá trị thay thế C/O theo quy định của pháp luật Việt Nam và các điều ước quốc tế mà Việt Nam là thành viên.",
    icon: BadgeCheck,
  },
  {
    title: "Chứng từ thương mại (Commercial Document)",
    description:
      "Là các loại giấy tờ, tài liệu được sử dụng trong các giao dịch thương mại trong nước và quốc tế, bao gồm nhưng không giới hạn ở: Hóa đơn thương mại, Phiếu đóng gói, Vận đơn, Tờ khai hải quan hàng hóa xuất khẩu/nhập khẩu, Bảng kê chi tiết, Bảng giá, Giấy chứng nhận chất lượng, Giấy chứng nhận kiểm dịch và các tài liệu, chứng từ thương mại khác.",
    icon: Files,
  },
  {
    title: "Xác nhận chứng từ thương mại",
    description:
      "Là hành vi của VCCI, thông qua người có thẩm quyền, xác nhận bằng hình thức điện tử hoặc đóng dấu và ký tên lên một chứng từ thương mại phục vụ cho hoạt động xuất khẩu để chứng nhận rằng chứng từ đó, với số và ngày cụ thể, đã được một Thương nhân cụ thể xuất trình tại VCCI. Hành vi này không đồng nghĩa với việc VCCI bảo lãnh hay xác thực tính hợp pháp, tính chính xác về nội dung của chứng từ, hoặc thẩm quyền của bên phát hành gốc.",
    icon: FileCheck2,
  },
  {
    title: "Đơn vị cấp",
    description:
      "Đơn vị cấp Giấy chứng nhận, xác nhận Chứng từ thương mại của VCCI bao gồm Ban Pháp chế và các Chi nhánh VCCI được giao nhiệm vụ thực hiện công tác cấp Giấy chứng nhận, xác nhận Chứng từ thương mại.",
    icon: Building2,
  },
  {
    title: "Thương nhân (Trader)",
    description:
      "Là tổ chức kinh tế được thành lập hợp pháp, cá nhân hoạt động thương mại một cách độc lập, thường xuyên và có đăng ký kinh doanh tại Việt Nam.",
    icon: ShieldCheck,
  },
  {
    title: "Hệ thống COVCCI",
    description:
      "Là hệ thống dịch vụ trực tuyến của VCCI tại địa chỉ trang điện tử covcci.com.vn, được sử dụng để tiếp nhận khai báo, quản lý hồ sơ, cấp số tham chiếu và thực hiện các thủ tục liên quan đến việc cấp Giấy chứng nhận, xác nhận Chứng từ thương mại.",
    icon: Globe2,
  },
];

export default function CertificateTradeDocumentPage(_: LegalTradePageProps) {
  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Giấy chứng nhận (GCN) và Chứng từ thương mại (CTTM)
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <p className="mt-5 max-w-6xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
            Định nghĩa chung về Giấy chứng nhận của VCCI, Chứng từ thương mại và cơ chế xác nhận chứng từ phục vụ hoạt động thương mại, xuất khẩu của doanh nghiệp.
          </p>

          <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="rounded-[24px] border border-[#e5edf8] bg-[#f8fbff] px-5 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2450b5]">Định nghĩa chung</p>
              <p className="mt-3 text-[16px] leading-8 text-[#5f6f86]">
                Nội dung dưới đây làm rõ phạm vi, bản chất pháp lý và cơ chế vận hành liên quan đến việc cấp Giấy chứng nhận và xác nhận Chứng từ thương mại tại VCCI.
              </p>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              {DEFINITIONS.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className={[
                      "rounded-[26px] border px-5 py-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]",
                      index === 0 || index === 2 ? "border-[#dbe7ff] bg-[#f8fbff]" : "border-[#edf1f6] bg-white",
                    ].join(" ")}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#2450b5]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-[21px] font-bold leading-tight text-[#1f2a44]">{item.title}</h2>
                    <p className="mt-3 text-[16px] leading-8 text-[#5f6f86]">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Thành phần chính</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Giấy chứng nhận của VCCI</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Chứng từ thương mại trong giao dịch trong nước và quốc tế</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Xác nhận chứng từ thương mại và Hệ thống COVCCI</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-linear-to-br from-[#1d56b7] to-[#21467f] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)]">
            <h2 className="text-[26px] font-bold leading-tight">Ghi chú pháp lý</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/88">
              <p>
                Giấy chứng nhận của VCCI không phải là C/O và không có giá trị thay thế C/O theo quy định pháp luật hiện hành.
              </p>
              <p>
                Việc xác nhận chứng từ thương mại không đồng nghĩa với việc VCCI bảo lãnh hay xác thực toàn bộ nội dung pháp lý của chứng từ gốc.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
