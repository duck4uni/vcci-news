"use client";
import React, { useState, Suspense } from "react";
import ListCategory from "@/components/base/list-category";
import ListFilter from "@/components/base/list-filter";
import CardNews from "@/components/base/card-news";
import { Pagination } from "@components/base/pagination";
import Image from "next/image";
import { useGetNews } from "@api/endpoints/news";
import { GetNewsResponseType } from "@api/types/NewsPage.type";
import { Spinner } from "@components/ui/spinner";
import { useSearchParams } from 'next/navigation'

function SearchContent() {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams()
  const query = searchParams.get('q') //
  const pageSize = 5;
  const { data: allData, isLoading } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
    filters: query ? `title @=${query}` : undefined,
  });

  return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <div className="border-t border-gray-200 bg-white p-2.5">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="py-3">
              <h1 className="text-md md:text-lg font-semibold leading-6 text-gray-900">
                {" "}
                Search Results for: {query}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-background ">
            <div className="pb-5 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Spinner className="size-8" />
                  <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
                </div>
              ) : (
                <>
                  {allData?.responseData.rows.map((news) => (
                    <CardNews
                      key={news.id}
                      news={news}
                      link={`${news.category}/${news.id}`}
                    />
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
            </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6 order-first lg:order-last">
            <div className="bg-white border rounded-md overflow-hidden hidden lg:block">
              <div className="w-full h-62 relative bg-gray-100">
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

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen container mx-auto p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#063e8e] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
