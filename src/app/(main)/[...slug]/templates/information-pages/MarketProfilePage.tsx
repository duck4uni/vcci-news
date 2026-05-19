'use client';

import { useMemo, useState } from "react";
import { ArrowDownToLine, Globe2, MapPinned, Newspaper, TrendingUp } from "lucide-react";
import ImageNext from "@/components/shared/image-next";
import type { DynamicPostItem } from "../types";

type MarketProfilePageProps = {
  post: DynamicPostItem;
};

type RegionMarketItem = {
  name: string;
  href: string;
  tone: string;
};

type RegionConfig = {
  key: string;
  label: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  markets: RegionMarketItem[];
  featuredDocument?: {
    title: string;
    href: string;
    description: string;
  };
};

const REGION_CONFIGS: RegionConfig[] = [
  {
    key: "dong-nam-a",
    label: "Đông Nam Á",
    title: "Đông Nam Á",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Dong-Nam-A-scaled.jpg",
    imageAlt: "Bản đồ thị trường Đông Nam Á",
    description:
      "Khu vực trọng điểm dành cho doanh nghiệp theo dõi cơ hội thương mại, xuất nhập khẩu, chuỗi cung ứng và kết nối đối tác trong ASEAN.",
    markets: [
      {
        name: "Việt Nam",
        href: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/VN-factsheet.pdf",
        tone: "bg-[#da251d]",
      },
      { name: "Lào", href: "#", tone: "bg-[#002868]" },
      { name: "Myanmar", href: "#", tone: "bg-[#34b233]" },
      { name: "Thái Lan", href: "#", tone: "bg-[#2d2a4a]" },
      { name: "Campuchia", href: "#", tone: "bg-[#032ea1]" },
      { name: "Malaysia", href: "#", tone: "bg-[#c00]" },
      {
        name: "Singapore",
        href: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/SINGAPORE-2020.pdf",
        tone: "bg-[#df0000]",
      },
      { name: "Philippines", href: "#", tone: "bg-[#0038a8]" },
      { name: "Indonesia", href: "#", tone: "bg-[#e70011]" },
      { name: "Brunei", href: "#", tone: "bg-[#f7e017]" },
    ],
    featuredDocument: {
      title: "Factsheet Việt Nam",
      href: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/VN-factsheet.pdf",
      description: "Mở tài liệu tham khảo",
    },
  },
  {
    key: "dong-bac-a",
    label: "Đông Bắc Á",
    title: "Đông Bắc Á",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Dong-Bac-A-scaled.jpg",
    imageAlt: "Khu vực Đông Bắc Á",
    description:
      "Nhóm thị trường phù hợp để doanh nghiệp tiếp cận chuỗi giá trị công nghiệp, công nghệ, logistics và thương mại khu vực Đông Bắc Á.",
    markets: [
      { name: "Nhật Bản", href: "#", tone: "bg-[#d93f3f]" },
      { name: "Hàn Quốc", href: "#", tone: "bg-[#244f9e]" },
      { name: "Trung Quốc", href: "#", tone: "bg-[#de2910]" },
      { name: "Đài Loan", href: "#", tone: "bg-[#012169]" },
      { name: "Mông Cổ", href: "#", tone: "bg-[#c4272f]" },
    ],
  },
  {
    key: "nam-a",
    label: "Nam Á",
    title: "Nam Á",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/d60bf053ad586e063749-scaled.jpg",
    imageAlt: "Khu vực Nam Á",
    description:
      "Không gian thị trường giàu tiềm năng với dân số lớn, tốc độ đô thị hóa nhanh và nhu cầu hợp tác thương mại đa ngành.",
    markets: [
      { name: "Ấn Độ", href: "#", tone: "bg-[#ff9933]" },
      { name: "Bangladesh", href: "#", tone: "bg-[#006a4e]" },
      { name: "Pakistan", href: "#", tone: "bg-[#01411c]" },
      { name: "Sri Lanka", href: "#", tone: "bg-[#8d153a]" },
      { name: "Nepal", href: "#", tone: "bg-[#003893]" },
    ],
  },
  {
    key: "tay-a",
    label: "Tây Á",
    title: "Tây Á",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/33a2e0fdbdf67ea827e7-scaled.jpg",
    imageAlt: "Khu vực Tây Á",
    description:
      "Thị trường phù hợp với định hướng mở rộng đối tác năng lượng, xây dựng, thương mại dịch vụ và kết nối trung chuyển.",
    markets: [
      { name: "UAE", href: "#", tone: "bg-[#00732f]" },
      { name: "Ả Rập Xê Út", href: "#", tone: "bg-[#006c35]" },
      { name: "Qatar", href: "#", tone: "bg-[#8a1538]" },
      { name: "Kuwait", href: "#", tone: "bg-[#007a3d]" },
      { name: "Oman", href: "#", tone: "bg-[#db161b]" },
    ],
  },
  {
    key: "bac-my",
    label: "Bắc Mỹ",
    title: "Bắc Mỹ",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Bac-My-1-scaled.jpg",
    imageAlt: "Khu vực Bắc Mỹ",
    description:
      "Thị trường quy mô lớn, yêu cầu cao về tiêu chuẩn, truy xuất nguồn gốc và chiến lược tiếp cận bài bản.",
    markets: [
      { name: "Hoa Kỳ", href: "#", tone: "bg-[#3c3b6e]" },
      { name: "Canada", href: "#", tone: "bg-[#d52b1e]" },
      { name: "Mexico", href: "#", tone: "bg-[#006847]" },
    ],
  },
  {
    key: "nam-my",
    label: "Nam Mỹ",
    title: "Nam Mỹ",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Nam-My-1-scaled.jpg",
    imageAlt: "Khu vực Nam Mỹ",
    description:
      "Nhóm thị trường phù hợp để theo dõi nhu cầu hàng tiêu dùng, nông sản, logistics biển và liên kết chuỗi cung ứng mới.",
    markets: [
      { name: "Brazil", href: "#", tone: "bg-[#009b3a]" },
      { name: "Argentina", href: "#", tone: "bg-[#74acdf]" },
      { name: "Chile", href: "#", tone: "bg-[#0039a6]" },
      { name: "Peru", href: "#", tone: "bg-[#d91023]" },
    ],
  },
  {
    key: "chau-au",
    label: "Châu Âu",
    title: "Châu Âu",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Chau-Au-scaled.jpg",
    imageAlt: "Khu vực Châu Âu",
    description:
      "Khu vực trọng tâm cho doanh nghiệp quan tâm đến EVFTA, tiêu chuẩn xanh, phát triển bền vững và thị trường giá trị cao.",
    markets: [
      { name: "Đức", href: "#", tone: "bg-[#000000]" },
      { name: "Pháp", href: "#", tone: "bg-[#0055a4]" },
      { name: "Hà Lan", href: "#", tone: "bg-[#ae1c28]" },
      { name: "Ý", href: "#", tone: "bg-[#009246]" },
      { name: "Tây Ban Nha", href: "#", tone: "bg-[#aa151b]" },
    ],
  },
  {
    key: "chau-uc",
    label: "Châu Úc",
    title: "Châu Úc",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Chau-Uc-scaled.jpg",
    imageAlt: "Khu vực Châu Úc",
    description:
      "Phù hợp với chiến lược tìm hiểu nhu cầu nhập khẩu ổn định, tiêu chuẩn chất lượng cao và hợp tác thương mại dài hạn.",
    markets: [
      { name: "Úc", href: "#", tone: "bg-[#012169]" },
      { name: "New Zealand", href: "#", tone: "bg-[#00247d]" },
      { name: "Papua New Guinea", href: "#", tone: "bg-[#ce1126]" },
    ],
  },
  {
    key: "chau-phi",
    label: "Châu Phi",
    title: "Châu Phi",
    image: "https://vcci-hcm.org.vn/wp-content/uploads/2022/06/Chau-Phi-1-scaled.jpg",
    imageAlt: "Khu vực Châu Phi",
    description:
      "Khu vực giàu dư địa tiếp cận thị trường mới cho hàng tiêu dùng, nông sản, vật liệu và hợp tác thương mại song phương.",
    markets: [
      { name: "Nam Phi", href: "#", tone: "bg-[#007749]" },
      { name: "Ai Cập", href: "#", tone: "bg-[#ce1126]" },
      { name: "Nigeria", href: "#", tone: "bg-[#008751]" },
      { name: "Kenya", href: "#", tone: "bg-[#000000]" },
    ],
  },
];

const OVERVIEW_ITEMS = [
  {
    title: "Bản tin thị trường",
    description:
      "Tổng hợp nhanh các đầu mối thông tin phục vụ doanh nghiệp theo dõi diễn biến thương mại và nhu cầu thị trường.",
    icon: Newspaper,
  },
  {
    title: "Cơ hội xuất nhập khẩu",
    description:
      "Ưu tiên các nhóm thị trường giàu tiềm năng để doanh nghiệp tra cứu nhanh theo khu vực và theo từng nước.",
    icon: TrendingUp,
  },
  {
    title: "Kết nối khu vực",
    description:
      "Gợi ý nhóm thị trường theo khu vực để doanh nghiệp thuận tiện định hướng khảo sát và mở rộng đối tác.",
    icon: Globe2,
  },
] as const;

export default function MarketProfilePage({ post }: MarketProfilePageProps) {
  const [activeRegionKey, setActiveRegionKey] = useState("dong-nam-a");

  const activeRegion = useMemo(
    () =>
      REGION_CONFIGS.find((item) => item.key === activeRegionKey) ?? REGION_CONFIGS[0],
    [activeRegionKey],
  );

  return (
    <section className="space-y-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
        <div className="min-w-0">

          <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            {activeRegion.title}
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          <p className="mt-5 max-w-4xl text-base leading-8 text-[#5b6880] md:text-[17px]">
            {post.summary?.trim() || activeRegion.description}
          </p>

          <div className="mt-7 overflow-hidden rounded-[30px] border border-[#dce7f7] bg-white shadow-[0_18px_42px_rgba(17,24,39,0.06)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
              <div className="relative min-h-[320px] bg-[#f3f7ff] p-4 sm:p-6">
                <div className="absolute inset-x-4 top-4 z-10 flex flex-wrap gap-2 sm:inset-x-6 sm:top-6">
                  {activeRegion.markets.map((item) => (
                    <a
                      key={`${activeRegion.key}-${item.name}`}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/92 px-3 py-2 text-xs font-semibold text-[#1e3768] shadow-[0_10px_24px_rgba(36,80,181,0.12)] transition-colors hover:bg-[#f8fbff]"
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                      <span>{item.name}</span>
                    </a>
                  ))}
                </div>

                <ImageNext
                  src={activeRegion.image}
                  alt={activeRegion.imageAlt}
                  width={1200}
                  height={900}
                  className="h-full min-h-[320px] w-full rounded-[24px] object-cover transition-all duration-300"
                />
              </div>

              <div className="flex flex-col justify-between bg-linear-to-br from-[#0f418f] to-[#1a2f65] p-6 text-white">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">
                    Tài liệu tham khảo
                  </p>
                  <h2 className="mt-3 text-[28px] font-bold leading-tight">
                    Tra cứu nhanh theo từng thị trường
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/82">
                    Dữ liệu mẫu được dựng từ nguồn website bạn gửi, cho phép chuyển nhanh giữa các khu vực để thay đổi phần hình ảnh và nhóm thị trường đang hiển thị.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {activeRegion.featuredDocument ? (
                    <a
                      href={activeRegion.featuredDocument.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-[22px] bg-white/10 px-4 py-3 transition-colors hover:bg-white/16"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {activeRegion.featuredDocument.title}
                        </p>
                        <p className="mt-1 text-xs text-white/70">
                          {activeRegion.featuredDocument.description}
                        </p>
                      </div>
                      <ArrowDownToLine className="h-5 w-5 shrink-0 text-[#ffca4f]" />
                    </a>
                  ) : (
                    <div className="rounded-[22px] bg-white/10 px-4 py-3">
                      <p className="text-sm font-semibold text-white">Nguồn tài liệu</p>
                      <p className="mt-1 text-xs leading-6 text-white/74">
                        Khu vực này hiện đã có khối chuyển hình ảnh và danh sách thị trường; tài liệu chi tiết sẽ được bổ sung khi có nguồn riêng tương ứng.
                      </p>
                    </div>
                  )}

                  <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-3">
                    <p className="text-sm font-semibold text-white">Gợi ý sử dụng</p>
                    <p className="mt-1 text-xs leading-6 text-white/74">
                      Khi API của trang có nội dung thật, phần UI mẫu này sẽ tự nhường chỗ cho dữ liệu bài viết từ hệ thống.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#e6eefb] bg-[#fbfcff] p-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)] xl:sticky xl:top-24">
          <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44]">Khu vực</h2>
          <div className="mt-5 space-y-2">
            {REGION_CONFIGS.map((item) => {
              const isActive = item.key === activeRegion.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveRegionKey(item.key)}
                  className={[
                    "flex w-full items-center rounded-[18px] px-4 py-3 text-left text-[15px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#2450b5] text-white shadow-[0_14px_28px_rgba(36,80,181,0.22)]"
                      : "bg-[#f4f7fc] text-[#55657d] hover:bg-[#eaf1ff] hover:text-[#2450b5]",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {OVERVIEW_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-[26px] border border-[#e5edf8] bg-white px-5 py-6 shadow-[0_16px_36px_rgba(17,24,39,0.05)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#2450b5]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-[20px] font-bold leading-7 text-[#1e2f50]">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#617089]">{item.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
