"use client";

import ImageNext from "@/components/shared/image-next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { useRef } from "react";
import "swiper/css";

import { getBanner } from "@/api/endpoints/banner";
import { useQuery } from "@tanstack/react-query";
import { resolveCmsFileUrl } from "@/lib/api/files";
import { Skeleton } from "@/components/ui/skeleton";

type ApiEnvelope<T> = {
  responseData?: T;
  data?: {
    responseData?: T;
  };
};

const getEnvelopeData = <T,>(payload?: ApiEnvelope<T>) =>
  payload?.responseData ?? payload?.data?.responseData;

type BannerRow = {
  id: string;
  file_id?: string | null;
  banner_name?: string | null;
  image_url?: string | null;
  display_order?: number | null;
};

/**
 * Mock banner khi BE /api/banner lỗi hoặc không trả data.
 * Dùng ảnh `thumbnail.png` đã có sẵn trong public/.
 */
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

function BannerSlideItem({
  src,
  alt,
  fileId,
}: {
  src: string;
  alt: string;
  fileId?: string | null;
}) {
  const { data: file, isPending } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => Promise.resolve({ path: src }),
    enabled: !!fileId && !src,
  });

  if (fileId && isPending && !src) {
    return (
      <Skeleton className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]" />
    );
  }

  const url = src
    ? src
    : file
      ? resolveCmsFileUrl(file.path)
      : "/img-error.png";

  return (
    <ImageNext
      src={url}
      alt={alt}
      width={2560}
      height={720}
      sizes="100vw"
      className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
    />
  );
}

const Banner = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  const { data: bannerData, isPending, isError } = useQuery({
    queryKey: ["home-banner"],
    queryFn: () =>
      getBanner({
        filters: "status@=ACTIVE",
        sortField: "display_order",
        sortOrder: "asc",
      }),
    staleTime: 60 * 1000,
  });

  const pageData = bannerData
    ? getEnvelopeData<{ rows?: BannerRow[] }>(bannerData as unknown as ApiEnvelope<{ rows?: BannerRow[] }>)
    : undefined;
  // BE trả rows rỗng HOẶC bị lỗi → fallback mock banner để UI không trống.
  const rows: BannerRow[] =
    pageData?.rows && pageData.rows.length > 0
      ? pageData.rows
      : MOCK_BANNER_ROWS;

  if (isPending && !rows.length) {
    return (
      <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-slate-100 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] bg-slate-100 flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={rows.length > 1}
      slidesPerView={1}
      onSwiper={(s) => (swiperRef.current = s)}
      className="w-full overflow-hidden"
    >
      {rows.map((row) => {
        const src = row.image_url ?? (row.file_id ? undefined : "/thumbnail.png");
        return (
          <SwiperSlide key={row.id}>
            <BannerSlideItem
              src={src ?? ""}
              alt={row.banner_name || "Banner"}
              fileId={row.file_id ?? null}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Banner;
