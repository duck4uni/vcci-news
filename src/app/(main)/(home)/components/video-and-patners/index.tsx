'use client';

import ImageNext from "@/components/shared/image-next";
import partnerImages from "@/constants/partnerImages";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";

const videos = [
  {
    embedSrc: "https://www.youtube.com/embed/J0Iz0iGuAXY",
    title: "VCCI-HCM 2025 IN REVIEW (ENGLISH VERSION)",
    thumbnail:
      "https://img.youtube.com/vi/J0Iz0iGuAXY/hqdefault.jpg",
  },
  {
    embedSrc: "https://www.youtube.com/embed/_OnnGWv2ehM",
    title: "Hội nghị Hội viên VCCI - Gala Mừng Xuân 2026",
    thumbnail:
      "https://img.youtube.com/vi/_OnnGWv2ehM/hqdefault.jpg",
  },
];

function VideoAndPartners() {
  return (
    <section className="flex flex-col gap-6 pb-10 xl:flex-row xl:items-start">
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
          {videos.map((video) => (
            <a
              key={video.embedSrc}
              href={video.embedSrc.replace("/embed/", "/watch?v=")}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-[16px] border border-[#e5ebf4] bg-white shadow-[0_10px_22px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,59,124,0.12)]"
            >
              <div className="group relative aspect-[1.95/1] overflow-hidden">
                <ImageNext
                  src={video.thumbnail}
                  alt={video.title}
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
                  {video.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <aside className="w-full xl:w-[43%]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Đối tác
            </h2>
            <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {partnerImages.slice(0, 6).map((src, index) => (
            <div
              key={src}
              className="flex h-[96px] items-center justify-center rounded-[14px] border border-[#edf1f7] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(31,59,124,0.05)]"
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
