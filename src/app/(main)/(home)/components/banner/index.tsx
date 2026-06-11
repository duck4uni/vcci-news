"use client";

import ImageNext from "@/components/shared/image-next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { useRef } from "react";
import "swiper/css";

import { useGetBanner } from "@/api/endpoints/banner";
import { useQuery } from "@tanstack/react-query";
import { fetchCmsFileById, resolveCmsFileUrl } from "@/lib/api/files";
import { Skeleton } from "@/components/ui/skeleton";

type ApiEnvelope<T> = {
  responseData?: T;
  data?: {
    responseData?: T;
  };
};

const getEnvelopeData = <T,>(payload?: ApiEnvelope<T>) =>
  payload?.responseData ?? payload?.data?.responseData;

function BannerSlideItem({ fileId, alt }: { fileId: string; alt: string }) {
  const { data: file, isPending } = useQuery({
    queryKey: ["file", fileId],
    queryFn: () => fetchCmsFileById(fileId),
    enabled: !!fileId,
  });

  if (isPending) {
    return (
      <Skeleton className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]" />
    );
  }

  const url = file ? resolveCmsFileUrl(file.path) : "/img-error.png";

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

  const { data: bannerData } = useGetBanner({
    filters: "status@=ACTIVE",
    sortField: "display_order",
    sortOrder: "asc",
  });

  const pageData = getEnvelopeData<{ rows?: any[] }>(bannerData);
  const rows = pageData?.rows ?? [];

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
      {rows.map((row: any) => (
        <SwiperSlide key={row.id}>
          {row.file_id ? (
            <BannerSlideItem
              fileId={row.file_id}
              alt={row.banner_name || "Banner"}
            />
          ) : (
            <ImageNext
              src="/img-error.png"
              alt={row.banner_name || "Banner"}
              width={2560}
              height={720}
              sizes="100vw"
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
