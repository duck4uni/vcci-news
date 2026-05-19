'use client';

import {
  BriefcaseBusiness,
  CalendarDays,
  FileBadge2,
  GraduationCap,
  Languages,
  Megaphone,
  Scale,
  Search,
  Store,
  Ticket,
} from "lucide-react";
import type { DynamicPostItem } from "../types";

const SERVICE_SUPPORT_ITEMS = [
  {
    key: "events",
    title: "Tổ chức sự kiện, hội nghị, hội thảo, giao lưu thương mại, hội chợ, triển lãm",
    icon: CalendarDays,
  },
  {
    key: "training",
    title: "Đào tạo nâng cao năng lực quản trị doanh nghiệp",
    icon: GraduationCap,
  },
  {
    key: "market",
    title: "Khảo sát thị trường nước ngoài",
    icon: Search,
  },
  {
    key: "venue",
    title: "Cho thuê văn phòng, hội trường",
    icon: Store,
  },
  {
    key: "media",
    title: "Quảng cáo, truyền thông",
    icon: Megaphone,
  },
  {
    key: "legal",
    title: "Tư vấn về pháp lý, quan hệ lao động, môi trường kinh doanh",
    icon: Scale,
  },
  {
    key: "certificate",
    title: "Cấp C/O và xác nhận các chứng từ thương mại",
    icon: FileBadge2,
  },
  {
    key: "business-info",
    title: "Cung cấp thông tin thị trường và hồ sơ doanh nghiệp",
    icon: BriefcaseBusiness,
  },
  {
    key: "visa",
    title: "Thu xếp visa nhập cảnh",
    icon: Ticket,
  },
  {
    key: "translate",
    title: "Phiên biên dịch",
    icon: Languages,
  },
] as const;

type ServicePageProps = {
  post: DynamicPostItem;
};

export default function ServicePage({ post }: ServicePageProps) {
  const introText =
    post.summary?.trim() ||
    "VCCI-HCM cung cấp đa dạng các dịch vụ hỗ trợ doanh nghiệp phát triển và hội nhập kinh tế quốc tế.";

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
      <div className="">
        <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
          Dịch vụ cung cấp
        </h1>
        <div className="mt-3 h-[3px] w-14 rounded-full bg-[#f5a400]" />
        <p className="mt-5 max-w-[520px] text-[18px] leading-9 text-[#66758d]">
          {introText}
        </p>
      </div>

      <div className="overflow-hidden rounded-4xl border border-[#d9e3f2] bg-white shadow-[0_22px_46px_rgba(28,52,120,0.12)]">
        <div className="bg-[#19519c] px-5 py-5 text-white md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[26px] font-bold leading-tight">Danh mục hỗ trợ</h2>
              <p className="mt-1 text-sm text-white/80">
                Dành cho hội viên, doanh nghiệp và đối tác thương mại
              </p>
            </div>
            <span className="inline-flex rounded-full bg-white/12 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] text-white/92">
              VCCI-HCM
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          {SERVICE_SUPPORT_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isRightColumn = index % 2 === 1;
            const isLastRow = index >= SERVICE_SUPPORT_ITEMS.length - 2;

            return (
              <div
                key={item.key}
                className={[
                  "flex min-h-28 items-start gap-4 px-5 py-5 md:px-6",
                  !isLastRow ? "border-b border-[#e7edf7]" : "",
                  isRightColumn ? "md:border-l md:border-[#e7edf7]" : "",
                ].join(" ")}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff8ea] text-[#5c6f8d]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="pt-1 text-[18px] leading-8 text-[#5f6f86]">
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
