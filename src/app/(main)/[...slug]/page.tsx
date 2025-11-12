"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/base/pagination";
import { ListFilter } from "@/components/base/list-filter";
import EventCalendar from "@/components/base/event-calendar";
import ListCategory from "@/components/base/list-category";
import CardNews from "@/components/base/card-news";
import Image from "next/image";
import parse from "html-react-parser";
import dayjs from "dayjs";
import BASE_URL from "@/links/index";

// API hooks
import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType } from "@/api/types/news";
import { GetNewsDetailResponseType } from "./page.type";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetEvents } from "@/api/endpoints/event";
import { EventApiResponse } from "@/api/types/event";
import CardEvents from "@/components/base/card-events";
import { Calendar, CreditCard, MapPin } from "lucide-react";

export default function DynamicPage() {
  // get url
  const params = useParams();
  const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const lastPart = slugArray[slugArray.length - 1];
  const url = slugArray.join("/");

  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    lastPart as string
  );
  const id = isUUID ? lastPart : undefined;

  // states
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // query
  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: `${slugArray[0]}`,
  });

  const { data: events, isLoading: isLoadingEvents } = useGetEvents<EventApiResponse>({
    pageSize: String(pageSize),
    currentPage: String(page),
  });

  const { data: eventsDetail, isLoading: isLoadingEventsDetail } = useGetEvents<EventApiResponse>({
    filters: `id==${id}`,
  });

  const { data: news, isLoading: isLoadingNews } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
    filters: `page_config.static_link==/${url}` + (submitSearch ? `,title@=${submitSearch}` : ""),
  });

  const { data: newsDetail, isLoading: isLoadingNewsDetail } = useGetNews<GetNewsResponseType>({
    filters: `page_config.static_link==/${url}` + `,external_link@=${lastPart}`,
  });

  // event page
  const isEventPage = lastPart === "su-kien";

  if (isEventPage) {
    return (
      <div className="min-h-screen container mx-auto">
        <div className="w-full flex flex-col gap-5">
          <ListCategory categories={categoriesPage?.responseData?.children} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <main className="lg:col-span-2 bg-background">
              <div className="pb-5 overflow-hidden">
                {isLoadingEvents ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner className="size-8" />
                    <span className="ml-2 text-gray-600">Đang tải tin VCCI...</span>
                  </div>
                ) : events?.responseData.rows.length === 0 ? (
                  <p className="text-center py-4">Không có dữ liệu</p>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </main>
            <aside className="space-y-6">
              <ListFilter onSearch={setSubmitSearch} />
              <EventCalendar />
            </aside>
          </div>
        </div>
      </div>
    )
  };

  // detail event page
  if (eventsDetail?.responseData.rows.length === 1) {
    return (
      <div className="min-h-screen w-full container mx-auto p-4">
        <div className="w-full flex flex-col gap-5">
          <ListCategory categories={categoriesPage?.responseData?.children} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <main className="lg:col-span-2 bg-white border rounded-md p-6">
              {isLoadingEventsDetail ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">
                    Đang tải chi tiết sự kiện...
                  </span>
                </div>
              ) : (
                <>
                  <div className="pb-5 text-primary text-2xl leading-normal font-medium">
                    {eventsDetail?.responseData?.rows[0].name}
                  </div>
                  <hr className="py-2" />

                  {/* Top summary with image + details */}
                  <div className="flex flex-col lg:flex-row gap-6 my-6">
                    <div className="w-full lg:w-1/2 bg-gray-50 rounded-md overflow-hidden">
                      {eventsDetail?.responseData?.rows[0].image ? (
                        <div className="w-full h-52 relative ">
                          <EventImage
                            src={`${BASE_URL.imageEndpoint}${eventsDetail.responseData.rows[0].image}`}
                            alt={eventsDetail.responseData.rows[0].name || "image"}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-52 bg-gray-200" />
                      )}
                    </div>

                    <div className="w-full lg:w-1/2 bg-white border rounded-md p-6">
                      <div className="flex flex-col gap-3">
                        <div className="text-sm text-gray-500">
                          Hạn đăng kí:{" "}
                          <span className="text-gray-900 font-medium">
                            {eventsDetail.responseData.rows[0].created_at
                              ? dayjs(
                                eventsDetail.responseData.rows[0].created_at
                              ).format('DD/MM/YYYY')
                              : "-"}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-yellow-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              Bắt đầu: {eventsDetail?.responseData?.rows[0].start_time
                                ? dayjs(
                                  eventsDetail.responseData.rows[0].start_time
                                ).format('HH:mm DD/MM/YYYY')
                                : "-"}
                            </div>
                            <div className="text-sm font-medium text-gray-800">
                              Kết thúc: {eventsDetail?.responseData?.rows[0].end_time
                                ? dayjs(
                                  eventsDetail.responseData.rows[0].end_time
                                ).format('HH:mm DD/MM/YYYY')
                                : "-"}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <div className="text-sm font-medium text-gray-800">
                            Địa điểm: {eventsDetail?.responseData?.rows[0].location ??
                              eventsDetail?.responseData?.rows[0].province ??
                              "-"}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-yellow-400" />
                          <div className="text-sm font-medium text-gray-800">
                            Phí tham dự: {eventsDetail?.responseData?.rows[0].table_cost
                              ? `${eventsDetail.responseData.rows[0].table_count
                              } Bàn : ${eventsDetail.responseData.rows[0].table_cost.toLocaleString()} đ`
                              : "Vui lòng xem chi tiết trong bài"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full description */}
                  <div className="p-7.5 prose tiptap overflow-hidden">
                    {parse(eventsDetail?.responseData?.rows[0].description ?? "")}
                  </div>
                </>
              )}
            </main>

            {/* Sidebar */}
            <aside className="space-y-6">
              <EventCalendar />

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

  // detail news page
  const isDetailPage = newsDetail?.responseData?.rows?.length === 1;
  if (isDetailPage) {
    return (
      <div className='container w-full flex justify-center items-center pb-10'>
        <div className='flex flex-col gap-5 w-full'>
          <ListCategory categories={categoriesPage?.responseData?.children} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <main className="lg:col-span-2 bg-white border rounded-md p-8">
              {isLoadingNewsDetail ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">Đang tải tin VCCI...</span>
                </div>
              ) : newsDetail?.responseData?.rows.length === 0 ? (
                <p className="text-center py-4">Không có dữ liệu</p>
              ) : (
                <>
                  <div className='pb-5 text-primary text-2xl leading-normal font-medium'>
                    {newsDetail?.responseData?.rows[0].title}
                  </div>
                  <div className='flex items-center gap-2 text-sm mb-4'>
                    <span className='text-base text-blue-700'>
                      {dayjs(newsDetail?.responseData?.rows[0].created_at).format('DD/MM/YYYY')}
                    </span>
                  </div>
                  <hr className="my-5" />
                  <div className='flex-1 text-app-grey text-base overflow-hidden'>
                    <div className="prose tiptap overflow-hidden">
                      {parse(newsDetail?.responseData?.rows[0].description ?? '')}
                    </div>
                  </div>
                </>
              )}
            </main>
            <aside className="space-y-6">
              <EventCalendar />
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // news page
  return (
    <div className="min-h-screen container mx-auto">
      <div className="w-full flex flex-col gap-5">
        <ListCategory categories={categoriesPage?.responseData?.children} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 bg-background">
            <div className="pb-5 overflow-hidden">
              {isLoadingNews ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">Đang tải tin VCCI...</span>
                </div>
              ) : news?.responseData.rows.length === 0 ? (
                <p className="text-center py-4">Không có dữ liệu</p>
              ) : (
                <>
                  {news?.responseData.rows.map((item) => (
                    <CardNews
                      key={item.id}
                      news={item}
                      link={`${item.external_link}`}
                    />
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
  )
}

// Local small component to safely handle Image src fallback without mutating DOM
type EventImageProps = {
  src: string;
  alt?: string;
};

function EventImage({ src, alt }: EventImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);

  return (
    <Image
      src={imgSrc}
      alt={alt ?? "image"}
      fill
      className="object-cover"
      onError={() => {
        // swap to local fallback file when Next/Image fails to load the provided URL
        if (imgSrc !== "/img-error.png") setImgSrc("/img-error.png");
      }}
    />
  );
}
