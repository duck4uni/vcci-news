'use client';

import { Clock3, FileCheck2, FileUp, Landmark, ReceiptText, RotateCcw } from "lucide-react";
import type { LegalTradePageProps } from "./types";

const REQUIREMENTS = [
  "Đăng ký tài khoản Thương nhân và khai báo các trường thông tin của Thương nhân trên Hệ thống COVCCI.",
  "Liên hệ với Đơn vị cấp Giấy chứng nhận, xác nhận Chứng từ thương mại của VCCI kích hoạt tài khoản cho Thương nhân.",
];

const STEPS = [
  {
    title: "Bước 1. Khai báo trực tuyến",
    description:
      "Thương nhân truy cập Hệ thống COVCCI, thực hiện khai báo các thông tin theo hướng dẫn, đính kèm hồ sơ dưới dạng điện tử đã được Thương nhân xác nhận bằng chữ ký số do cơ quan có thẩm quyền cấp và nhận số tham chiếu cho bộ hồ sơ.",
    icon: FileUp,
  },
  {
    title: "Bước 2. Thanh toán giá dịch vụ và hồ sơ giấy",
    description:
      "Thương nhân thanh toán giá dịch vụ và bộ hồ sơ giấy đầy đủ theo quy định tại bộ phận tiếp nhận của đơn vị VCCI có thẩm quyền.",
    icon: ReceiptText,
  },
  {
    title: "Bước 3. Phân công và thẩm định",
    description:
      "Bộ phận tiếp nhận hồ sơ kiểm tra tính đầy đủ, hợp lệ ban đầu và phân công cho cán bộ nghiệp vụ xử lý.",
    icon: FileCheck2,
  },
  {
    title: "Bước 4. Phê duyệt và cấp",
    description:
      "Nếu hồ sơ hợp lệ và đầy đủ, cán bộ nghiệp vụ trình hồ sơ lên người có thẩm quyền ký duyệt. Sau khi được ký duyệt, chứng từ sẽ được đóng dấu, tách, lưu trữ (hoặc vào hộp) và trả kết quả cho Thương nhân.",
    icon: Landmark,
  },
  {
    title: "Bước 5. Trả hồ sơ hoặc yêu cầu bổ sung",
    description:
      "Nếu hồ sơ có sai sót, không hợp lệ hoặc vi phạm các quy định, cán bộ nghiệp vụ thông báo rõ lý do cho Thương nhân (thông qua hệ thống hoặc trực tiếp) để yêu cầu sửa đổi, bổ sung hoặc từ chối cấp.",
    icon: RotateCcw,
  },
];

export default function ProcedurePage(_: LegalTradePageProps) {
  return (
    <section className="">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Quy trình tiếp nhận hồ sơ cấp GCN và xác nhận CTTM
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="rounded-[24px] border border-[#e5edf8] bg-[#f8fbff] px-5 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2450b5]">
                1. Yêu cầu đối với Thương nhân
              </p>
              <div className="mt-4 space-y-3 text-[16px] leading-8 text-[#5f6f86]">
                {REQUIREMENTS.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#f5a400]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#eff4ff] text-[#2450b5] flex items-center justify-center">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2450b5]">
                    2. Quy trình thực hiện
                  </p>
                  <h2 className="mt-1 text-[24px] font-bold leading-tight text-[#1f2a44]">
                    Các bước xử lý thống nhất
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <article
                      key={step.title}
                      className="rounded-[24px] border border-[#edf1f6] bg-white px-5 py-5 shadow-[0_14px_34px_rgba(17,24,39,0.06)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#2450b5]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-[#2450b5] px-2 text-sm font-bold text-white">
                              {index + 1}
                            </span>
                            <h3 className="text-[20px] font-bold leading-tight text-[#1f2a44]">{step.title}</h3>
                          </div>
                          <p className="mt-3 text-[16px] leading-8 text-[#5f6f86]">{step.description}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-[#dbe7ff] bg-[#f8fbff] px-5 py-5">
              <div className="flex items-center gap-3 text-[#2450b5]">
                <Clock3 className="h-5 w-5" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em]">3. Thời gian xử lý</p>
              </div>
              <p className="mt-4 text-[16px] leading-8 text-[#5f6f86]">
                Trường hợp hồ sơ chưa hợp lệ, VCCI sẽ thông báo qua Hệ thống COVCCI các nội dung cần sửa đổi, bổ sung cho Thương nhân trong thời hạn 03 ngày làm việc kể từ ngày tiếp nhận hồ sơ. Thời gian xử lý cho một bộ hồ sơ hợp lệ là không quá 08 giờ làm việc kể từ thời điểm VCCI nhận đủ hồ sơ hợp lệ. Đối với trường hợp cần thẩm tra, xác minh hay trao đổi nội bộ và từ cơ quan chức năng trong và ngoài nước khác, thời gian giải quyết có thể kéo dài hơn so với quy định chung.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)]">
            <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Mốc thời gian</h2>
            <div className="mt-5 space-y-4 text-[16px] leading-7 text-[#5f6f86]">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Thông báo bổ sung: trong 03 ngày làm việc</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>Xử lý hồ sơ hợp lệ: không quá 08 giờ làm việc</span>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-linear-to-br from-[#1d56b7] to-[#21467f] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)]">
            <h2 className="text-[26px] font-bold leading-tight">Kênh xử lý</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-7 text-white/88">
              <p>Hệ thống COVCCI dùng để khai báo, tiếp nhận và theo dõi hồ sơ trực tuyến.</p>
              <p>Thương nhân cần chuẩn bị đầy đủ hồ sơ điện tử, chữ ký số và hồ sơ giấy theo quy định.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
