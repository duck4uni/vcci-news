'use client';

import { useEffect, useState } from "react";
import { notFound, useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

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

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  // states
  const initialPage = Number(searchParams.get("page") ?? "1");
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const pageSize = 5;

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;
    const currentUrl = searchParamsString ? `${pathname}?${searchParamsString}` : pathname;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [page, pathname, router, searchParamsString]);

  // query
  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: `${slug[0]}`,
  });

  const { data: events, isLoading: eventsLoading } = useGetEvents<EventApiResponse>({
    filters: `name@=${submitSearch ? `title@=${submitSearch}` : ""}`,
    pageSize: String(pageSize),
    currentPage: String(page),
  });

  //template
  return (
    <>
      <div className="container mx-auto min-h-screen px-4 py-6 sm:px-6 lg:px-10">
        {eventsLoading ? (
          <div className="flex justify-center items-center w-full h-64">
            <Spinner />
          </div>
        ) : (
          <div className="flex w-full flex-col gap-5">
            <ListCategory categories={categoriesPage?.responseData?.children} />
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <main className="min-w-0 bg-background">
                <div className="overflow-hidden pb-5">
                  {events?.responseData?.rows?.map((item) => (
                    <CardEvents
                      key={item.id}
                      event={item}
                      link={`su-kien/${item.id}`}
                    />
                  ))}
                  <div className="w-full flex justify-center mt-4">
                    <Pagination
                      pageCount={Number(events?.responseData?.totalPages ?? 1)}
                      page={Number(events?.responseData?.currentPage ?? page)}
                      onChangePage={setPage}
                      onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
                      onGoToNextPage={() =>
                        setPage(Math.min(Number(events?.responseData?.totalPages ?? 1), page + 1))
                      }
                    />
                  </div>
                </div>
              </main>
              <aside className="min-w-0 space-y-6">
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
