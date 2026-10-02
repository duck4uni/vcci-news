import { Play } from "lucide-react";
import Image from "next/image";
import { getApiV10Video } from "@/api/vcci-news/endpoints/video";
import type { Video } from "@/api/vcci-news/models/video";
import PaginationNav from "@/components/base/pagination-nav";
import { getVideoThumbnail, normalizeVideoUrl } from "@/lib/utils/video";

const PAGE_SIZE = 10;

type VideoListProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function VideoListing({ searchParams }: VideoListProps) {
  const { page: pageParam } = await searchParams;
  const pageFromUrl = Number(pageParam ?? "1");
  const page =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? Math.floor(pageFromUrl) : 1;

  let videos: Video[] = [];
  let count = 0;
  let pageSize = PAGE_SIZE;
  let currentPage = page;

  try {
    const response = await getApiV10Video({
      page,
      pageSize: PAGE_SIZE,
      sortField: "created_at",
      sortOrder: "desc",
    });
    const pageData = (response as {
      responseData?: {
        count?: number;
        page?: number;
        pageSize?: number;
        rows?: Video[];
      };
    } | undefined)?.responseData;

    count = Number(pageData?.count ?? 0);
    pageSize = Number(pageData?.pageSize ?? PAGE_SIZE) || PAGE_SIZE;
    currentPage = Number(pageData?.page ?? page) || page;
    videos = pageData?.rows ?? [];
  } catch {
    videos = [];
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            Video
          </h1>
          <div className="mt-2 h-[3px] w-16 rounded-full bg-[#f5a400]" />
        </div>

        {videos.length ? (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {videos.map((video) => {
                const url = video.url ?? "";
                const thumbnail = getVideoThumbnail(url);
                const watchUrl = normalizeVideoUrl(url);

                return (
                  <a
                    key={video.id}
                    href={watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-[18px] border border-[#e5ebf4] bg-white shadow-[0_12px_30px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(31,59,124,0.14)]"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[#edf1f5]">
                      <Image
                        src={thumbnail}
                        alt={video.name ?? "Video"}
                        width={900}
                        height={506}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-[#24469c] shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
                          <Play className="ml-1 h-6 w-6 fill-current" />
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h2 className="line-clamp-2 text-[17px] font-bold leading-snug text-[#1f3f91] transition-colors group-hover:text-[#0f4386]">
                        {video.name}
                      </h2>
                    </div>
                  </a>
                );
              })}
            </div>

            {totalPages > 1 ? (
              <PaginationNav
                page={currentPage}
                pageCount={totalPages}
                basePath="/video"
              />
            ) : null}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#edf1f5] bg-white px-6 py-12 text-center text-gray-600">
            Chưa có video nào.
          </div>
        )}
      </div>
    </div>
  );
}
