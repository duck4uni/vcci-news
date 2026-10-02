"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { getApiV10Banner } from "@/api/vcci-news/endpoints/banner";
import type { RawBanner } from "@/api/vcci-news/types/banner";
import type { RawFile } from "@/api/vcci-news/types/file";
import { getApiV10FileId } from "@/api/vcci-news/endpoints/file";
import { resolveCmsFileUrl } from "@/lib/utils/file";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerItem, type BannerItemData } from "./components/banner-item";
import "swiper/css";

type BannerRow = RawBanner;

const FALLBACK_IMAGE = "/thumbnail.png";

const MOCK_BANNER_ROWS: BannerRow[] = [
  {
    id: "mock-banner-1",
    banner_name: "VCCI-HCM kết nối doanh nghiệp Việt Nam – Hoa Kỳ 2026",
    image_url: "/thumbnail.png",
    display_order: 1,
  },
  {
    id: "mock-banner-2",
    banner_name: "Hỗ trợ doanh nghiệp SME tiếp cận vốn tín dụng",
    image_url: "/thumbnail.png",
    display_order: 2,
  },
  {
    id: "mock-banner-3",
    banner_name: "AI trong quản trị hiệp hội doanh nghiệp",
    image_url: "/thumbnail.png",
    display_order: 3,
  },
];

const resolveFileSrc = async (fileId?: string | null): Promise<string | null> => {
  if (!fileId) return null;

  try {
    const response = await getApiV10FileId(fileId);
    const file = response?.responseData as RawFile | undefined;
    return file?.path ? resolveCmsFileUrl(file.path) : null;
  } catch {
    return null;
  }
};

const toBannerItems = async (rows: BannerRow[]): Promise<BannerItemData[]> =>
  Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      alt: row.banner_name || "Banner",
      src:
        row.image_url ??
        (await resolveFileSrc(row.file_id)) ??
        FALLBACK_IMAGE,
    })),
  );

const fetchBannerItems = async (): Promise<BannerItemData[]> => {
  try {
    const response = await getApiV10Banner({
      filters: "status@=ACTIVE",
      sortField: "display_order",
      sortOrder: "asc",
    });

    const rows = (response?.responseData?.rows ?? []) as BannerRow[];
    return await toBannerItems(rows.length > 0 ? rows : MOCK_BANNER_ROWS);
  } catch {
    return await toBannerItems(MOCK_BANNER_ROWS);
  }
};

export function Banner() {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data: items = [], isPending } = useQuery({
    queryKey: ["banner-items", "status-active"] as const,
    queryFn: fetchBannerItems,
    staleTime: 60 * 1000,
  });

  if (isPending) {
    return (
      <div className="flex h-[220px] w-full items-center justify-center bg-slate-100 sm:h-[320px] md:h-[430px] lg:h-[540px]">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={items.length > 1}
      slidesPerView={1}
      onSwiper={(s) => (swiperRef.current = s)}
      className="w-full overflow-hidden"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <BannerItem {...item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
