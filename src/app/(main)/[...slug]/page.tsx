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

// API hooks
import { useGetNews, useGetNewsId } from "@/api/endpoints/news";
import { GetNewsResponseType } from "@/api/types/news";
import { GetNewsDetailResponseType } from "./page.type";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";

export default function DynamicPage() {
  const params = useParams();
  const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const lastPart = slugArray[slugArray.length - 1];

  //check id post
  const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    lastPart as string
  );

  const { data: categoriesPage } =
    useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
      static_link: `/${slugArray[0]}`,
    });

  if (isUUID) {
    const id = lastPart;
    const { data, isLoading } = useGetNewsId<GetNewsDetailResponseType>(
      id as string
    );

    return (
      <div className='container w-full flex justify-center items-center pb-10'>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className='flex flex-col gap-5 w-full'>
            <ListCategory categories={categoriesPage?.responseData?.children} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Main content */}
              <main className="lg:col-span-2 bg-white border rounded-md p-8">
                <div className='pb-5 text-primary text-2xl leading-normal font-medium'>
                  {data?.responseData?.title}
                </div>
                <div className='flex items-center gap-2 text-sm mb-4'>
                  <span className='text-base text-blue-700'>
                    {dayjs(data?.responseData?.created_at).format('DD/MM/YYYY')}
                  </span>
                </div>
                <hr className="my-5" />
                <div className='flex-1 text-app-grey text-base overflow-hidden'>
                  <div className="prose tiptap overflow-hidden">
                    {parse(data?.responseData?.description ?? '')}
                  </div>
                </div>
              </main>

              {/* Sidebar */}
              <aside className="space-y-6">
                <EventCalendar />
              </aside>
            </div>
          </div>
        )}
      </div>
    );
  }

  // nếu là trang danh sách tin tức
  const url = slugArray.join("/");
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: news, isLoading } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
    filters: `page_config.static_link==/${url}` + (submitSearch ? `,title@=${submitSearch}` : ""),
  });

  return (
    <div className="min-h-screen container mx-auto">
      <div className="w-full flex flex-col gap-5">
        <ListCategory categories={categoriesPage?.responseData?.children} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
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
                    <CardNews
                      key={item.id}
                      news={item}
                      link={`/${url}/${item.id}`}
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

          {/* Sidebar */}
          <aside className="space-y-6">
            <ListFilter onSearch={setSubmitSearch} />
            <EventCalendar />
            <div className="bg-white border rounded-md overflow-hidden">
              <div className="w-full h-56 relative bg-gray-100">
                <Image src="/banner.webp" alt="Quảng cáo" fill className="object-cover" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
