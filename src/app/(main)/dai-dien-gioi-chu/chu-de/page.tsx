"use client";
import React, { useState } from "react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { OWNER_REPRESENTATIVES_CATEGORIES } from "@constants/categories";
import ListFilter from "@app/dai-dien-gioi-chu/components/list-filter";
import NewsContent from "@app/dai-dien-gioi-chu/components/card-news";
import { Pagination } from "@components/base/pagination";
import Image from "next/image";
import { useGetNews } from "@api/endpoints/news";
import { GetNewsResponseType } from "@api/types/NewsPage.type";
import { PATHS } from "@constants/paths";
import { Spinner } from "@components/ui/spinner";
export default function Page() {
  const [submitSearch,setsubmitSearch] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;
  const { data: allData,isLoading } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
    filters: submitSearch ? `title @=${submitSearch},category@=Chủ đề` : 'category@=Chủ đề',
  });
  return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
  <ListCategory categories={OWNER_REPRESENTATIVES_CATEGORIES} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-background ">
            <div className="pb-5 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
                </div>
              ) : (
                <>
                  {(!allData || (allData.responseData.rows || []).length === 0) ? (
                    <div className="py-12 text-center text-gray-600">Không có dữ liệu</div>
                  ) : (
                    <>
                      {allData.responseData.rows.map((news) => (
                        <NewsContent key={news.id} news={news} link={`${PATHS.ownerRepresentatives}/chu-de/${news.id}`}/>
                      ))}

                      <div className="w-full flex justify-center mt-4">
                        <Pagination
                          pageCount={Number(allData?.responseData.totalPages ?? 1)}
                          page={Number(allData?.responseData.currentPage ?? page)}
                          onChangePage={(p) => setPage(p)}
                          onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
                          onGoToNextPage={() =>
                            setPage(
                              Math.min(
                                Number(allData?.responseData.totalPages ?? 1),
                                page + 1
                              )
                            )
                          }
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ListFilter onSearch={setsubmitSearch}/>

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
