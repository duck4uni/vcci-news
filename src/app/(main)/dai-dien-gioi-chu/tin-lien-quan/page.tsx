"use client";
import React, { useState } from "react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import ListFilter from "@app/dai-dien-gioi-chu/components/list-filter";
import NewsContent from "@app/dai-dien-gioi-chu/components/card-news";
import {Pagination} from '@components/base/pagination'
import Image from "next/image";
import { useGetNews } from '@api/endpoints/news'
import { GetNewsResponseType } from '@api/types/NewsPage.type'
export default function Page() {
  const [submitSearch] = useState('')
  const [page, setPage] = useState(1)

  const pageSize = 5
  const { data: allData, isLoading } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
    filters: submitSearch ? `title @=${submitSearch}` : undefined,
  })
  return ( 

    <div className="min-h-screen container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-background p-6">
                              <div className='pb-5 overflow-hidden'>
                      {allData?.responseData.rows.map((news) => (
                        <NewsContent key={news.id} news={news} />
                      ))}

                      <div className='w-full flex justify-center mt-4'>
                        <Pagination
                          current={allData?.responseData.currentPage ?? page}
                          total={allData?.responseData.totalPages ?? 1}
                          onChange={(p) => setPage(p)}
                        />
                      </div>
                    </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ListFilter />

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