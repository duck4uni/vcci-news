"use client";
import React, { useState } from "react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { EVENT_CATEGORIES } from "@constants/categories";
import EventFilter from "@app/dai-dien-gioi-chu/components/event-filter";
import NewsContent from "@app/dai-dien-gioi-chu/components/card-news";
// ...existing code...
import { Pagination } from "@components/base/pagination";
import Image from "next/image";
import { useGetEvents } from '@api/endpoints/event'
import { EventApiResponse } from '@api/types/event'
import { useGetNews } from "@api/endpoints/news";
import { GetNewsResponseType } from "@api/types/NewsPage.type";
import { PATHS } from "@constants/paths";
import { Spinner } from "@components/ui/spinner";
export default function Page() {
  const [submitSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;
  const { data: allData, isLoading } = useGetEvents<EventApiResponse>({
    pageSize: String(pageSize),
    currentPage: String(page),
    sortField: 'start_time',
    sortOrder: 'ASC',
    filters: submitSearch ? `title @=${submitSearch},start_time>${new Date()}` : `start_time>${new Date()}`,
  });
  return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory categories={EVENT_CATEGORIES} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-background ">
            <div className="pb-5 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">Đang tải sự kiện...</span>
                </div>
              ) : (
                <>
                  {allData?.responseData.rows.map((event) => (
                    <NewsContent key={event.id} event={event} link={`${PATHS.event}/su-kien/${event.id}`} />
                  ))}

                  <div className="w-full flex justify-center mt-4">
                    <Pagination
                      pageCount={Number(allData?.responseData.totalPages ?? 1)}
                      page={Number(allData?.responseData.currentPage ?? page)}
                      onChangePage={(p) => setPage(p)}
                      onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
                      onGoToNextPage={() => setPage(Math.min(Number(allData?.responseData.totalPages ?? 1), page + 1))}
                    />
                  </div>
                </>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <EventFilter />

            <div className="bg-white border rounded-md overflow-hidden">
              <div className="w-full h-56 relative bg-gray-100">
                <Image
                  src="/banner.webp"
                  alt="Quảng cáo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
