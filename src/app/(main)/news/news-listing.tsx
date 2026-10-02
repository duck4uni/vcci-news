"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetApiV10Post } from "@/api/vcci-news/endpoints/post";
import type { DynamicPostItem } from "@/api/vcci-news/types/post";
import { Pagination } from "@/components/base/pagination";
import { EventsCalendar } from "@/components/base/events-calendar";
import SidebarAdvertisements from "@/components/shared/sidebar-advertisements";
import { Spinner } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  buildDynamicPostHref,
  resolveDynamicPostImage,
  stripHtml,
} from "../[...slug]/templates/data";

const PAGE_SIZE = 10;

const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = 2020;

const YEAR_OPTIONS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, index) => CURRENT_YEAR - index,
);

const formatPostDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function NewsListing() {
  const [year, setYear] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const filterParts = useMemo(() => {
    const parts = ["is_hidden==false", "is_active==true", "type==news"];
    if (year) {
      parts.push(`published_at>=${year}-01-01`);
      parts.push(`published_at<=${year}-12-31`);
    }
    return parts.join(",");
  }, [year]);

  const { data: postsData, isLoading: postsLoading } = useGetApiV10Post({
    page,
    pageSize: PAGE_SIZE,
    sortField: "created_at",
    sortOrder: "desc",
    priorityFeatured: false,
    filters: filterParts,
  });

  const responseData = postsData?.responseData;
  const count = Number(responseData?.count ?? 0);
  const totalPages = PAGE_SIZE > 0 ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const currentPage = Math.min(page, totalPages);
  const posts = ((responseData?.rows ?? []) as unknown as DynamicPostItem[]).filter(
    (item) => item.id && item.title,
  );

  const handleSelectYear = (value: number | null) => {
    setYear(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 lg:pb-6 sm:px-6 lg:px-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            Tin tức
          </h1>
          <div className="mt-2 h-[3px] w-16 rounded-full bg-[#f5a400]" />
        </div>

        <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
          <main className="order-2 min-w-0 xl:order-1 xl:flex-1">
            {postsLoading ? (
              <div className="flex h-64 w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-9">
                {posts.length ? (
                  posts.map((item) => {
                    const date = formatPostDate(
                      item.release_at ?? item.published_at ?? item.created_at,
                    );
                    const categoryName = item.categories?.[0]?.name ?? "";
                    const excerpt = stripHtml(item.summary) || "";

                    return (
                      <article
                        key={item.id}
                        className="border-b border-[#eceff3] pb-8 last:border-b-0"
                      >
                        <Link
                          href={buildDynamicPostHref(item.slug, item.id)}
                          className="group grid items-center gap-5 sm:grid-cols-[250px_minmax(0,1fr)]"
                        >
                          <div className="relative aspect-[25/15] overflow-hidden rounded-md bg-[#edf1f5] sm:aspect-[5/3]">
                            <Image
                              src={resolveDynamicPostImage(item.thumbnail)}
                              alt={item.title}
                              width={520}
                              height={360}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              {categoryName ? (
                                <span className="rounded-full bg-[#eaf0ff] px-2.5 py-1 font-semibold text-[#1f4fa3]">
                                  {categoryName}
                                </span>
                              ) : null}
                              {date ? (
                                <span className="text-[#9aa3ad]">{date}</span>
                              ) : null}
                            </div>

                            <h2 className="mt-3 line-clamp-2 text-[18px] font-bold leading-snug text-[#111827] transition-colors group-hover:text-[#144c9c]">
                              {item.title}
                            </h2>

                            {excerpt ? (
                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f6875]">
                                {excerpt}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-[#edf1f5] bg-white px-6 py-12 text-center text-gray-600">
                    <p>
                      {year
                        ? `Chưa có bài viết nào trong năm ${year}.`
                        : "Chưa có bài viết nào."}
                    </p>
                  </div>
                )}

                <div className="flex w-full justify-center pt-2">
                  <Pagination
                    pageCount={totalPages}
                    page={currentPage}
                    onChangePage={setPage}
                    onGoToPreviousPage={() =>
                      setPage(Math.max(1, currentPage - 1))
                    }
                    onGoToNextPage={() =>
                      setPage(Math.min(totalPages, currentPage + 1))
                    }
                  />
                </div>
              </div>
            )}
          </main>

          <aside className="contents xl:order-2 xl:block xl:w-[320px] xl:space-y-5">
            <div className="order-1 rounded-[22px] border border-[#edf1f5] bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.05)] xl:order-0">
              <h2 className="text-lg font-bold text-[#111827]">
                Lọc theo năm
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectYear(null)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${year === null
                      ? "bg-[#14519f] text-white shadow-[0_10px_20px_rgba(20,81,159,0.18)]"
                      : "bg-[#f4f7fb] text-[#5f6875] hover:bg-[#eaf0f8]"
                    }`}
                >
                  Tất cả
                </button>

                {YEAR_OPTIONS.map((option) => {
                  const active = year === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectYear(active ? null : option)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${active
                          ? "bg-[#14519f] text-white shadow-[0_10px_20px_rgba(20,81,159,0.18)]"
                          : "bg-[#f4f7fb] text-[#5f6875] hover:bg-[#eaf0f8]"
                        }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {year !== null ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 h-10 w-full rounded-xl border-[#edf1f5] bg-white text-[#4b5563]"
                  onClick={() => handleSelectYear(null)}
                >
                  Bỏ lọc năm
                </Button>
              ) : null}
            </div>

            <EventsCalendar compact className="xl:w-full xl:min-w-0" />

            <SidebarAdvertisements count={5} startIndex={0} />
          </aside>
        </div>
      </div>
    </div>
  );
}
