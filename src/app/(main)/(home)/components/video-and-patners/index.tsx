"use client";

import { useQuery } from "@tanstack/react-query";
import ImageNext from "@/components/shared/image-next";
import partnerImages from "@/constants/partnerImages";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { fetchClientVideos } from "@/lib/api/videos";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type Partner = {
  id: string;
  name: string;
  avatar?: string | null;
  website?: string | null;
};

type PartnerResponse = {
  responseData?: {
    rows?: Partner[];
  };
};

const PARTNER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations" +
  "?filters=type%3D%3DSPONSOR&pageSize=12" +
  "&sortField=sort_order&sortOrder=ASC";
const VCCI_HCM_ORIGIN = "https://vccihcm.vn";

const resolvePartnerImage = (avatar: string | null | undefined, index: number) => {
  if (avatar?.startsWith("http://") || avatar?.startsWith("https://")) {
    return avatar;
  }

  if (avatar?.startsWith("/")) {
    return `${VCCI_HCM_ORIGIN}${avatar}`;
  }

  return partnerImages[index % partnerImages.length] ?? "/img-error.png";
};

const renderPartnerContent = (partners: Partner[]) => {
  if (partners.length > 0) {
    return (
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4200, disableOnInteraction: false }}
        observer
        observeParents
        updateOnWindowResize
        slidesPerView="auto"
        spaceBetween={16}
        className="w-full"
      >
        {partners.map((partner, index) => (
          <SwiperSlide
            key={partner.id}
            className="!h-auto !w-full sm:!w-[calc(50%-8px)] xl:!w-[calc(33.333%-10.67px)]"
          >
            {partner.website ? (
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="flex h-[96px] items-center justify-center rounded-[14px] border border-[#edf1f7] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(31,59,124,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(31,59,124,0.1)] xl:h-[151px]">
                  <ImageNext
                    src={resolvePartnerImage(partner.avatar, index)}
                    alt={partner.name}
                    width={140}
                    height={72}
                    className="max-h-full w-full object-contain"
                  />
                </div>
              </a>
            ) : (
              <div className="flex h-[96px] items-center justify-center rounded-[14px] border border-[#edf1f7] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(31,59,124,0.05)] xl:h-[151px]">
                <ImageNext
                  src={resolvePartnerImage(partner.avatar, index)}
                  alt={partner.name}
                  width={140}
                  height={72}
                  className="max-h-full w-full object-contain"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <div className="rounded-[14px] border border-[#edf1f7] bg-white px-5 py-10 text-center text-sm text-gray-500">
      Chưa có thông tin.
    </div>
  );
};

function VideoAndPartners() {
  const videosQuery = useQuery({
    queryKey: ["home-videos"],
    queryFn: () => fetchClientVideos({ page: 1, pageSize: 2 }),
    staleTime: 60 * 1000,
  });

  const partnersQuery = useQuery({
    queryKey: ["home-partners"],
    queryFn: async () => {
      const response = await fetch(PARTNER_API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Cannot load partners: ${response.status}`);
      }

      return (await response.json()) as PartnerResponse;
    },
    staleTime: 60 * 1000,
  });

  const videos = videosQuery.data?.rows ?? [];
  const partners = partnersQuery.data?.responseData?.rows?.slice(0, 12) ?? [];
  const hasPartnerError = partnersQuery.isError;
  const displayPartners =
    hasPartnerError || partners.length === 0 ? [] : partners;

  return (
    <section className="flex flex-col gap-6 pb-10 xl:flex-row xl:items-stretch">
      <div className="flex-1">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Video
            </h2>
            <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
          </div>

          <Link
            href="/video"
            className="pt-1 text-[#24469c] transition-colors hover:text-[#1b55a1]"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {videosQuery.isLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={`video-loading-${index}`}
                className="h-[202px] animate-pulse rounded-[16px] bg-[#edf1f7]"
              />
            ))
          ) : videos.length ? (
            videos.map((video) => (
              <a
                key={video.id}
                href={video.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-[16px] border border-[#e5ebf4] bg-white shadow-[0_10px_22px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,59,124,0.12)]"
              >
                <div className="group relative aspect-[1.95/1] overflow-hidden">
                  <ImageNext
                    src={video.thumbnail}
                    alt={video.name}
                    width={640}
                    height={440}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/18" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[#2a4ea3] shadow-[0_10px_26px_rgba(0,0,0,0.18)]">
                      <Play className="ml-1 h-5 w-5 fill-current" />
                    </span>
                  </div>
                </div>

                <div className="px-4 py-2.5">
                  <p className="line-clamp-2 text-[14px] font-semibold leading-[1.32] text-[#264798] md:text-[15px]">
                    {video.name}
                  </p>
                </div>
              </a>
            ))
          ) : (
            <div className="rounded-[16px] border border-[#e5ebf4] bg-white px-5 py-10 text-center text-sm text-gray-500 md:col-span-2">
              Chưa có video nào.
            </div>
          )}
        </div>
      </div>

      <aside className="flex w-full flex-col xl:w-[43%]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Đối tác
            </h2>
            <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
          </div>
        </div>

        {renderPartnerContent(displayPartners)}
      </aside>
    </section>
  );
}

export default VideoAndPartners;
