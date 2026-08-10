'use client';

import {
  BadgeCheck,
  Bell,
  Globe2,
  Mail,
  MapPin,
  MessageCircleMore,
  Phone,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";

const MEMBER_BENEFITS = [
  {
    key: "voice",
    title: "Tiếng nói",
    icon: MessageCircleMore,
    iconClassName: "bg-[#f59e0b]",
    bullets: [
      "Được hỗ trợ giải quyết các vướng mắc, kiến nghị của doanh nghiệp với các cơ quan quản lý trong quá trình kinh doanh và thực thi pháp luật.",
      "Được tham dự miễn phí các hội nghị, hội thảo, đối thoại với các cơ quan ban ngành về pháp luật và chính sách hàng năm.",
      "Được tham dự hội nghị đối thoại thường niên về chính sách thuế, hải quan và thủ tục hành chính.",
    ],
  },
  {
    key: "recognition",
    title: "Độ nhận diện",
    icon: BadgeCheck,
    iconClassName: "bg-[#1f2937]",
    bullets: [
      "Hồ sơ doanh nghiệp được đăng tải miễn phí trên Danh bạ Hội viên CONNECTIONS.",
      "Thông tin doanh nghiệp được giới thiệu miễn phí trên website và các kênh truyền thông của VCCI-HCM.",
      "Cơ hội trở thành nhà tài trợ cho các sự kiện của VCCI-HCM.",
      "Được ưu đãi đặc biệt khi sử dụng các dịch vụ truyền thông, quảng bá thương hiệu của VCCI-HCM.",
    ],
  },
  {
    key: "network",
    title: "Mạng lưới liên kết",
    icon: Globe2,
    iconClassName: "bg-[#10b981]",
    bullets: [
      "Được tham dự miễn phí các sự kiện xúc tiến thương mại và đầu tư hằng năm.",
      "Được ưu đãi khi tham gia các đoàn khảo sát thị trường nước ngoài do VCCI-HCM tổ chức.",
      "Tương tác trong mạng lưới hội viên VCCI-HCM, tiếp cận các đối tác tin cậy và khách hàng tiềm năng.",
    ],
  },
  {
    key: "growth",
    title: "Phát triển",
    icon: TrendingUp,
    iconClassName: "bg-[#3b82f6]",
    bullets: [
      "Được tham gia các khóa đào tạo của VCCI-HCM với chi phí ưu đãi.",
      "Được tiếp cận các dự án hỗ trợ doanh nghiệp phát triển được tài trợ bởi các tổ chức trong nước và quốc tế.",
      "Được tư vấn bởi các chuyên gia về pháp luật, quan hệ lao động, thị trường,... với chi phí ưu đãi.",
    ],
  },
  {
    key: "trust",
    title: "Độ tin cậy",
    icon: ShieldCheck,
    iconClassName: "bg-[#9333ea]",
    bullets: [
      "Tăng uy tín và độ tin cậy cho doanh nghiệp khi trở thành hội viên VCCI-HCM.",
      "Tạo thuận lợi cho doanh nghiệp trong các hoạt động hợp tác kinh doanh - đầu tư.",
    ],
  },
  {
    key: "information",
    title: "Thông tin",
    icon: Bell,
    iconClassName: "bg-[#ef4444]",
    bullets: [
      "Được nhận miễn phí Bản tin điện tử phát hành hằng tháng và Tạp chí VCCI-HCM phát hành hằng quý.",
      "Được nhận miễn phí Danh bạ Hội viên VCCI-HCM.",
      "Được nhận các sản phẩm thông tin phục vụ cho doanh nghiệp và các nhà đầu tư.",
    ],
  },
] as const;

export default function MemberBenefitsPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
          Lợi ích của hội viên VCCI
        </h1>
        <div className="mt-3 h-[3px] w-14 rounded-full bg-[#f5a400]" />

        <div className="mt-7 space-y-7">
          {MEMBER_BENEFITS.map((section) => {
            const Icon = section.icon;

            return (
              <article key={section.key} className="flex items-start gap-4">
                <div
                  className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_12px_30px_rgba(17,24,39,0.12)] ${section.iconClassName}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-[30px] font-bold leading-tight text-[#1f2a44]">
                    {section.title}
                  </h2>
                  <ul className="mt-3 space-y-2.5">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-[16px] leading-8 text-[#5f6f86]"
                      >
                        <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#f5a400]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="rounded-[28px] bg-[#1c56a1] px-6 py-6 text-white shadow-[0_22px_46px_rgba(28,52,120,0.18)] lg:sticky lg:top-24">
        <h2 className="text-[28px] font-bold leading-tight">Liên hệ</h2>
        <div className="mt-6 space-y-5 text-[15px] leading-7 text-white/90">
          <div>
            <div className="flex items-center gap-2 text-[#f5c21b]">
              <Phone className="h-4 w-4" />
              <span className="font-semibold">Phòng Hội viên và Đào tạo</span>
            </div>
            <p className="mt-1">C. Thanh Thủy</p>
            <p>ĐT: 0903 909 796</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[#f5c21b]">
              <Mail className="h-4 w-4" />
              <span className="font-semibold">Email</span>
            </div>
            <p className="mt-1 wrap-break-word">luuthanhthuy72@yahoo.com</p>
            <p className="wrap-break-word">hoivien@vcci-hcm.org.vn</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[#f5c21b]">
              <WalletCards className="h-4 w-4" />
              <span className="font-semibold">Điện thoại</span>
            </div>
            <p className="mt-1">028. 3932 0817 - Fax: 028. 3932 5472</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-[#f5c21b]">
              <MapPin className="h-4 w-4" />
              <span className="font-semibold">Địa chỉ</span>
            </div>
            <p className="mt-1">
              P. 306, Lầu 3, Tòa nhà VCCI, 171 Võ Thị Sáu,
              <br />
              Phường Xuân Hoà, TP. HCM
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
