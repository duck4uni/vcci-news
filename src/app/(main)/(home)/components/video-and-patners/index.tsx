"use client";

import { useQuery } from "@tanstack/react-query";
import ImageNext from "@/components/shared/image-next";
import partnerImages from "@/constants/partnerImages";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";
import { fetchClientVideos } from "@/lib/api/videos";

function VideoAndPartners() {
  const videosQuery = useQuery({
    queryKey: ["home-videos"],
    queryFn: () => fetchClientVideos({ page: 1, pageSize: 2 }),
    staleTime: 60 * 1000,
  });

  const videos = videosQuery.data?.rows ?? [];

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
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:h-[318px] xl:grid-rows-2">
          {partnerImages.slice(0, 6).map((src, index) => (
            <div
              key={src}
              className="flex h-[96px] items-center justify-center rounded-[14px] border border-[#edf1f7] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(31,59,124,0.05)] xl:h-auto"
            >
              <ImageNext
                src={src}
                alt={`Đối tác ${index + 1}`}
                width={140}
                height={72}
                className="max-h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}

export default VideoAndPartners;
