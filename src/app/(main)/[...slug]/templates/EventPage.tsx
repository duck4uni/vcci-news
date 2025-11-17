'use client';

import { useState } from "react";
import { useParams } from "next/navigation";

import { useGetEvents } from "@/api/endpoints/event";
import { EventApiResponse } from "@/api/types/event";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";

import { Spinner } from "@/components/ui/spinner";
import ListCategory from "@/components/base/list-category";
import CardEvents from "@/components/base/card-events";
import { Pagination } from "@/components/base/pagination";
import ListFilter from "@/components/base/list-filter";
import EventCalendar from "@/components/base/event-calendar";

export default function EventPage() {
  // get url
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];

  // states
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // query
  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: `${slug[0]}`,
  });

  const { data: events, isLoading } = useGetEvents<EventApiResponse>({
    filters: `name@=${submitSearch ? `title@=${submitSearch}` : ""}`,
    pageSize: String(pageSize),
    currentPage: String(page),
  });

  //template
  return (
    <>
      <div className="min-h-screen container mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center w-full h-64">
            <Spinner />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-5">
            <ListCategory categories={categoriesPage?.responseData?.children} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <main className="lg:col-span-2 bg-background">
                <div className="pb-5 overflow-hidden">
                  {events?.responseData.rows.map((item) => (
                    <CardEvents
                      key={item.id}
                      event={item}
                      link={`su-kien/${item.id}`}
                    />
                  ))}
                  <div className="w-full flex justify-center mt-4">
                    <Pagination
                      pageCount={Number(events?.responseData.totalPages ?? 1)}
                      page={Number(events?.responseData.currentPage ?? page)}
                      onChangePage={setPage}
                      onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
                      onGoToNextPage={() =>
                        setPage(Math.min(Number(events?.responseData.totalPages ?? 1), page + 1))
                      }
                    />
                  </div>
                </div>
              </main>
              <aside className="space-y-6">
                <ListFilter onSearch={setSubmitSearch} />
                <EventCalendar />
              </aside>
            </div>
          </div>
        )}
      </div>
    </>
  );
}