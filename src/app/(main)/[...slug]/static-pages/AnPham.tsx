"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/base/pagination";
import { SafeImage } from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventsCalendar from "@/app/(main)/(home)/components/events-calendar";
import SidebarAdvertisements from "@/components/shared/sidebar-advertisements";
import ListCategory from "@/components/base/list-category";
import { useGetApiV10Post } from "@/api/vcci-news/endpoints/post";
import {
  buildDynamicPostHref,
  buildDynamicCategoryMenu,
  resolveDynamicPostImage,
  mapPost,
} from "../templates/data";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "../templates/types";

type AnPhamProps = {
  category: DynamicCategoryRouteItem | null;
  allCategories: DynamicCategoryRouteItem[];
};

export default function AnPham({ category, allCategories }: AnPhamProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  const initialPage = Number(searchParams.get("page") ?? "1");
  const [searchInput, setSearchInput] = useState("");
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const pageSize = 8;
  const keyword = submitSearch.trim();

  // Auto-search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSubmitSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

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

  const filters = [
    category?.id ? `category.id==${category.id}` : null,
    keyword ? `title@=${keyword}` : null,
    "is_hidden==false",
    "is_active==true",
    "type==news",
  ]
    .map((item) => item?.trim())
    .filter(Boolean)
    .join(",");

  const { data: postsData, isLoading: postsLoading } = useGetApiV10Post({
    page,
    pageSize,
    sortField: "release_at",
    sortOrder: "desc",
    filters: filters || undefined,
  });

  const responseData = postsData?.responseData;
  const count = Number(responseData?.count ?? 0);
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(count / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = ((responseData?.rows ?? []) as unknown as Parameters<typeof mapPost>[0][])
    .map(mapPost)
    .filter((item: DynamicPostItem) => item.id && item.title);

  const categoryMenu = category ? buildDynamicCategoryMenu(category, allCategories) : [];

  return (
    <div className="min-h-screen bg-white">
      {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}
      {postsLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-4 lg:pb-6 sm:px-6 lg:px-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
              {category?.name ?? "Ấn phẩm"}
            </h1>
            <div className="mt-2 h-[3px] w-16 rounded-full bg-[#f5a400]" />
          </div>

          <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
            <main className="order-2 min-w-0 xl:order-1 xl:flex-1">
              {paginatedPosts.length ? (
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                  {paginatedPosts.map((item) => {
                    return (
                      <Link
                        key={item.id}
                        href={buildDynamicPostHref(item.slug, item.id, category?.id)}
                        className="group block"
                      >
                        <div className="overflow-hidden bg-white shadow-[0_10px_24px_rgba(17,24,39,0.08)]">
                          <div className="relative aspect-3/4 overflow-hidden bg-white">
                            <SafeImage
                              src={resolveDynamicPostImage(item.thumbnail)}
                              alt={item.title}
                              width={520}
                              height={693}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        </div>

                        <div className="px-1 pt-3 text-center">
                          <h2 className="line-clamp-2 text-[14px] leading-[1.45] text-[#1f2f57]">
                            {item.title}
                          </h2>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#edf1f5] bg-white px-6 py-12 text-center text-gray-600">
                  Chưa có tài liệu trong danh mục.
                </div>
              )}

              <div className="flex w-full justify-center pt-8">
                <Pagination
                  pageCount={totalPages}
                  page={currentPage}
                  onChangePage={setPage}
                  onGoToPreviousPage={() => setPage(Math.max(1, currentPage - 1))}
                  onGoToNextPage={() => setPage(Math.min(totalPages, currentPage + 1))}
                />
              </div>
            </main>

            <aside className="contents xl:order-2 xl:block xl:w-[320px] xl:space-y-5 xl:pt-0">
              <form
                className="order-1 rounded-[22px] border border-[#edf1f5] bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.05)] xl:order-0"
                onSubmit={(event) => {
                  event.preventDefault();
                  setPage(1);
                  setSubmitSearch(searchInput);
                }}
              >
                <h2 className="text-lg font-bold text-[#111827]">Tìm kiếm</h2>
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Tên bài viết ..."
                  className="mt-4 h-11 rounded-xl border-[#edf1f5] bg-[#f8fafc] text-sm placeholder:text-gray-700"
                />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-[#14519f] text-white hover:bg-[#0f4386]"
                  >
                    Tìm kiếm
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-[#edf1f5] bg-white text-[#4b5563]"
                    onClick={() => {
                      setSearchInput("");
                      setPage(1);
                      setSubmitSearch("");
                    }}
                  >
                    Bỏ tìm
                  </Button>
                </div>
              </form>

              <EventsCalendar compact className="xl:w-full xl:min-w-0" />

              <SidebarAdvertisements count={5} startIndex={0} />
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
