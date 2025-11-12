"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/base/pagination";
import { ListFilter } from "@/components/base/list-filter";
import EventCalendar from "@/components/base/event-calendar";
import ListCategory from "@/components/base/list-category";
import CardNews from "@/components/base/card-news";

// API hooks
import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType } from "@/api/types/news";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";

// Component con
import NewsDetail from "./components/news-detail";
import EventDetail from "./components/event-detail";

export default function DynamicPage() {
  const params = useParams();
  const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const lastPart = slugArray[slugArray.length - 1];
  const url = slugArray.join("/");

  // states
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // queries
  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: slugArray[0],
  });

  const { data: newsDetail, isLoading: isLoadingDetail } = useGetNews<GetNewsResponseType>({
    filters: `page_config.static_link==/${url},external_link@=${lastPart}`,
  });

  const { data: news, isLoading } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
    filters: `page_config.static_link==/${url}${submitSearch ? `,title@=${submitSearch}` : ""}`,
  });

  if (isLoadingDetail) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  // check UUID
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    lastPart as string
  );
  const id = isUUID ? lastPart : undefined;

  // detail page condition
  const isDetailPage = newsDetail?.responseData?.rows?.length === 1;

  if (isDetailPage || id) {
    return (
      <div className="container w-full flex justify-center items-center pb-10">
        <div className="flex flex-col gap-5 w-full">
          <ListCategory categories={categoriesPage?.responseData?.children} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <main className="lg:col-span-2 bg-white border rounded-md p-8">
              {isDetailPage ? <NewsDetail data={newsDetail} /> : <EventDetail id={id} />}
            </main>
            <aside className="space-y-6">
              <EventCalendar />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // list news page
  return (
    <div className="min-h-screen container mx-auto">
      <div className="w-full flex flex-col gap-5">
        <ListCategory categories={categoriesPage?.responseData?.children} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 bg-background">
            <div className="pb-5 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">Đang tải tin VCCI...</span>
                </div>
              ) : news?.responseData.rows.length === 0 ? (
                <p className="text-center py-4">Không có dữ liệu</p>
              ) : (
                <>
                  {news?.responseData.rows.map((item) => (
                    <CardNews key={item.id} news={item} link={`${item.external_link}`} />
                  ))}
                  <div className="w-full flex justify-center mt-4">
                    <Pagination
                      pageCount={Number(news?.responseData.totalPages ?? 1)}
                      page={Number(news?.responseData.currentPage ?? page)}
                      onChangePage={setPage}
                      onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
                      onGoToNextPage={() =>
                        setPage(Math.min(Number(news?.responseData.totalPages ?? 1), page + 1))
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </main>
          <aside className="space-y-6">
            <ListFilter onSearch={setSubmitSearch} />
            <EventCalendar />
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="w-full relative bg-gray-100">
                <img src="/banner.webp" alt="Quảng cáo" className="object-cover" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
