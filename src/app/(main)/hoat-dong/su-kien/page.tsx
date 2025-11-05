"use client";
import React, { useState } from "react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { EVENT_CATEGORIES } from "@constants/categories";
import EventFilter from "@app/dai-dien-gioi-chu/components/event-filter";
import NewsContent from "@app/dai-dien-gioi-chu/components/card-news";
import { Pagination } from "@components/base/pagination";
import Image from "next/image";
import { useGetEvents } from '@api/endpoints/event'
import { EventApiResponse } from '@api/types/event'
import { useGetNews } from "@api/endpoints/news";
import { GetNewsResponseType } from "@api/types/NewsPage.type";
import { PATHS } from "@constants/paths";
import { Spinner } from "@components/ui/spinner";
export default function Page() {
  const [page, setPage] = useState(1);
  const [filtersString, setFiltersString] = useState<string | undefined>('')

  const pageSize = 5;
  const { data: allData, isLoading } = useGetEvents<EventApiResponse>({
    pageSize: String(pageSize),
    currentPage: String(page),
    sortField: 'start_time',
    sortOrder: 'ASC',
    filters: filtersString ?? undefined,
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
            <EventFilter
              onFilter={(payload) => {
                const parts: string[] = []
                // query
                if (payload.query) parts.push(`title @=${payload.query}`)

                const nowIso = new Date().toISOString()
                // upcoming / past
                if (payload.upcoming && !payload.past) {
                  parts.push(`start_time>${nowIso}`)
                } else if (payload.past && !payload.upcoming) {
                  parts.push(`start_time<=${nowIso}`)
                }
                if (payload.fromDate) {
                  const fromIso = new Date(payload.fromDate).toISOString()
                  parts.push(`created_at>=${fromIso}`)
                }
                if (payload.toDate) {
                  const toIso = new Date(payload.toDate).toISOString()
                  parts.push(`created_at<=${toIso}`)
                }

                const filters = parts.length > 0 ? parts.join(',') : undefined
                setFiltersString(filters)
                setPage(1)
              }}
              onReset={() => {
                setFiltersString(undefined)
                setPage(1)
              }}
            />

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
