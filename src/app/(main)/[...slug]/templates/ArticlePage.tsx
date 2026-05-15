'use client';

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/base/pagination";
import ListFilter from "@/components/base/list-filter";
import EventCalendar from "@/components/base/event-calendar";
import ListCategory from "@/components/base/list-category";
import {
  buildDynamicCategoryMenu,
  buildPostFilters,
  fetchDynamicPostList,
  stripHtml,
} from "./data";
import type { DynamicCategoryRouteItem } from "./types";
import CardNews from "@/components/base/card-news";

type ArticlePageProps = {
  category: DynamicCategoryRouteItem;
  allCategories: DynamicCategoryRouteItem[];
};

export default function ArticlePage({ category, allCategories }: ArticlePageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  const initialPage = Number(searchParams.get("page") ?? "1");
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const pageSize = 6;
  const keyword = submitSearch.trim();

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

  useEffect(() => {
    setPage(1);
  }, [submitSearch, category.id]);

  const postsQuery = useQuery({
    queryKey: ["dynamic-posts", category.id, page, pageSize, keyword],
    queryFn: () =>
      fetchDynamicPostList({
        page,
        pageSize,
        filters: buildPostFilters([
          `category.id==${category.id}`,
          "is_hidden==false",
          "is_active==true",
          "status==published",
          "type==news",
          keyword ? `title@=${keyword}` : null,
        ]),
      }),
    staleTime: 60 * 1000,
  });

  const categoryMenu = useMemo(
    () => buildDynamicCategoryMenu(category, allCategories),
    [category, allCategories],
  );

  const totalPages = postsQuery.data?.totalPages ?? 1;
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = postsQuery.data?.rows ?? [];

  return (
    <div className="min-h-screen container mx-auto">
      {postsQuery.isLoading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Spinner />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5">
          {categoryMenu.length > 0 ? <ListCategory categories={categoryMenu} /> : <br />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <main className="lg:col-span-2 bg-white">
              <div className="pb-5 overflow-hidden">
                {paginatedPosts.length ? (
                  paginatedPosts.map((item) => {
                    const fallbackDescription = item.content_structure?.post_content
                      ?.map((section) => section.content)
                      .join(" ");

                    return (
                      <CardNews
                        key={item.id}
                        news={{
                          id: item.id,
                          title: item.title,
                          thumbnail:
                            item.thumbnail?.path ??
                            item.thumbnail?.original ??
                            item.thumbnail?.url ??
                            "",
                          external_link: item.external_link,
                          description:
                            item.summary ||
                            stripHtml(item.content) ||
                            stripHtml(fallbackDescription),
                          release_at:
                            item.release_at ?? item.published_at ?? item.created_at ?? "",
                          is_active: item.is_active,
                          created_at: item.created_at ?? "",
                          created_by: null,
                          updated_at: item.created_at ?? "",
                          updated_by: null,
                          mode: "NOW",
                          category: category.name,
                          page_config: {
                            id: category.id,
                            name: category.name,
                            static_link: category.url,
                            static_link_en: category.url,
                            code: category.slug,
                          },
                        }}
                        link={item.external_link}
                      />
                    );
                  })
                ) : (
                  <div className="rounded-lg border bg-white px-6 py-12 text-center text-gray-600">
                    {"Ch\u01b0a c\u00f3 b\u00e0i vi\u1ebft ph\u00f9 h\u1ee3p trong danh m\u1ee5c n\u00e0y."}
                  </div>
                )}

                <div className="w-full flex justify-center mt-4">
                  <Pagination
                    pageCount={totalPages}
                    page={currentPage}
                    onChangePage={setPage}
                    onGoToPreviousPage={() => setPage(Math.max(1, currentPage - 1))}
                    onGoToNextPage={() => setPage(Math.min(totalPages, currentPage + 1))}
                  />
                </div>
              </div>
            </main>

            <aside className="space-y-6">
              <ListFilter onSearch={setSubmitSearch} onReset={() => setSubmitSearch("")} />
              <EventCalendar />
              <div className="bg-white border rounded-md overflow-hidden">
                <div className="w-full relative bg-gray-100">
                  <img src="/banner.webp" alt={"Qu\u1ea3ng c\u00e1o"} className="object-cover" />
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
