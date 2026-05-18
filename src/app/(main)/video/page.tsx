"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import ImageNext from "@/components/shared/image-next";
import { Pagination } from "@/components/base/pagination";
import { Spinner } from "@/components/ui/spinner";
import { fetchClientVideos } from "@/lib/api/videos";

const PAGE_SIZE = 10;

function VideoPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") ?? "1");
  const page = Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? Math.floor(pageFromUrl) : 1;

  const videosQuery = useQuery({
    queryKey: ["video-page", page, PAGE_SIZE],
    queryFn: () => fetchClientVideos({ page, pageSize: PAGE_SIZE }),
    staleTime: 60 * 1000,
  });

  const videos = videosQuery.data?.rows ?? [];
  const totalPages = videosQuery.data?.totalPages ?? 1;
  const currentPage = videosQuery.data?.page ?? page;

  const updatePage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            Video
          </h1>
          <div className="mt-2 h-[3px] w-16 rounded-full bg-[#f5a400]" />
        </div>

        {videosQuery.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`video-page-loading-${index}`}
                className="h-[280px] animate-pulse rounded-[18px] bg-[#edf1f7]"
              />
            ))}
          </div>
        ) : videosQuery.isError ? (
          <div className="rounded-2xl border border-[#edf1f5] bg-white px-6 py-12 text-center text-gray-600">
            Không thể tải danh sách video.
          </div>
        ) : videos.length ? (
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {videos.map((video) => (
                <a
                  key={video.id}
                  href={video.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-[18px] border border-[#e5ebf4] bg-white shadow-[0_12px_30px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(31,59,124,0.14)]"
                >
                  <div className="relative aspect-video overflow-hidden bg-[#edf1f5]">
                    <ImageNext
                      src={video.thumbnail}
                      alt={video.name}
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
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="flex justify-center">
                <Pagination
                  pageCount={totalPages}
                  page={currentPage}
                  onChangePage={updatePage}
                  onGoToPreviousPage={() => updatePage(Math.max(1, currentPage - 1))}
                  onGoToNextPage={() => updatePage(Math.min(totalPages, currentPage + 1))}
                />
              </div>
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

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fbfbfa]">
          <Spinner className="size-8" />
        </div>
      }
    >
      <VideoPageContent />
    </Suspense>
  );
}
