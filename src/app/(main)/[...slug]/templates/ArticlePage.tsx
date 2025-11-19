'use client';

import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import ListCategory from "@/components/base/list-category";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType } from "@/api/types/news";
import CardNews from "@/components/base/card-news";
import { Pagination } from "@/components/base/pagination";
import ListFilter from "@/components/base/list-filter";
import EventCalendar from "@/components/base/event-calendar";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui";

export default function ArticlePage() {
  // get url
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // states
  const initialPage = Number(searchParams.get("page") ?? "1");
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const pageSize = 5;

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [page]);

  // query
  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: slug[0],
  });

  const { data, isLoading } = useGetNews<GetNewsResponseType>({
    filters: `page_config.static_link==/${path}` + (submitSearch ? `,title@=${submitSearch}` : ""),
    pageSize: String(pageSize),
    currentPage: String(page),
  });

  return (
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
                {data?.responseData?.rows.map((item) => (
                  <CardNews
                    key={item.id}
                    news={item}
                    link={`${item.external_link}`}
                  />
                ))}
                <div className="w-full flex justify-center mt-4">
                  <Pagination
                    pageCount={Number(data?.responseData?.totalPages ?? 1)}
                    page={Number(data?.responseData?.currentPage ?? page)}
                    onChangePage={setPage}
                    onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
                    onGoToNextPage={() =>
                      setPage(Math.min(Number(data?.responseData?.totalPages ?? 1), page + 1))
                    }
                  />
                </div>
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
      )}
    </div>
  );
}