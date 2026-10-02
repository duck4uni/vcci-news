import { getApiV10Video } from "@/api/vcci-news/endpoints/video";
import type { PagedResult } from "@/api/vcci-news/types/paged-result";
import type { Video } from "@/api/vcci-news/models/video";
import { getVideoThumbnail, normalizeVideoUrl } from "@/lib/utils/video";
import { ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PAGE_SIZE = 2;

const SECTION_PARAMS = {
  page: 1,
  pageSize: PAGE_SIZE,
  sortField: "created_at",
  sortOrder: "desc",
} as const;

type VideoItem = {
  id: string;
  name: string;
  thumbnail: string;
  watchUrl: string;
};

const toVideoItem = (video: Video): VideoItem => ({
  id: String(video.id ?? ""),
  name: String(video.name ?? ""),
  thumbnail: getVideoThumbnail(String(video.url ?? "")),
  watchUrl: normalizeVideoUrl(String(video.url ?? "")),
});


const fetchVideos = async (): Promise<VideoItem[]> => {
  try {
    const response = await getApiV10Video(SECTION_PARAMS);
    const rows =
      (response as PagedResult<Video> | undefined)?.responseData?.rows ?? [];
    if (rows.length === 0) throw new Error("Empty rows");
    return rows.map(toVideoItem);
  } catch (error) {
    console.warn("[Videos] CMS unavailable, returning empty list", error);
    return [];
  }
};

export function VideosSkeleton() {
  return (
    <div className="flex-1">
      <div className="mb-5 flex items-center justify-between gap-3">
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
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={`video-skeleton-${index}`}
            className="h-[202px] animate-pulse rounded-[16px] bg-[#edf1f7]"
          />
        ))}
      </div>
    </div>
  );
}

export async function Videos() {
  const videos = await fetchVideos();

  return (
    <div className="flex-1">
      <div className="mb-5 flex items-center justify-between gap-3">
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
        {videos.length ? (
          videos.map((video) => (
            <a
              key={video.id}
              href={video.watchUrl}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-[16px] border border-[#e5ebf4] bg-white shadow-[0_10px_22px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(31,59,124,0.12)]"
            >
              <div className="group relative aspect-[1.95/1] overflow-hidden">
                <Image
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
  );
}
