'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui";
import { Pagination } from "@/components/base/pagination";
import ImageNext from "@/components/shared/image-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ListCategory from "@/components/base/list-category";
import {
  buildDynamicPostHref,
  buildDynamicCategoryMenu,
  buildVisibleNewsFilters,
  fetchDynamicPostList,
  findDisplayCategoryForPost,
  resolveDynamicPostImage,
  stripHtml,
} from "./data";
import type { DynamicCategoryRouteItem } from "./types";

type ArticlePageProps = {
  category: DynamicCategoryRouteItem;
  allCategories: DynamicCategoryRouteItem[];
};

const formatPostDate = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getTagClassName = (index: number) => {
  const classes = [
    "bg-[#eaf0ff] text-[#1f4fa3]",
    "bg-[#e9f7ee] text-[#138040]",
    "bg-[#fff0e3] text-[#d47a16]",
    "bg-[#ffe9f0] text-[#d22f62]",
  ];

  return classes[index % classes.length];
};

export default function ArticlePage({ category, allCategories }: ArticlePageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsString = searchParams.toString();

  const initialPage = Number(searchParams.get("page") ?? "1");
  const [searchInput, setSearchInput] = useState("");
  const [submitSearch, setSubmitSearch] = useState("");
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;
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

  const postsQuery = useQuery({
    queryKey: ["dynamic-posts", category.id, page, pageSize, keyword],
    queryFn: () =>
      fetchDynamicPostList({
        page,
        pageSize,
        filters: buildVisibleNewsFilters([
          `category.id==${category.id}`,
          keyword ? `title@=${keyword}` : null,
        ]),
      }),
    staleTime: 60 * 1000,
  });

  const totalPages = postsQuery.data?.totalPages ?? 1;
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = postsQuery.data?.rows ?? [];
  const categoryIndexMap = useMemo(() => {
    const entries = allCategories.map((item, index) => [item.id, index] as const);

    return new Map(entries);
  }, [allCategories]);
  const categoryMenu = useMemo(
    () => buildDynamicCategoryMenu(category, allCategories),
    [category, allCategories],
  );

  return (
    <div className="min-h-screen bg-white">
      {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}
      {postsQuery.isLoading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Spinner />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-4 lg:pb-6 sm:px-6 lg:px-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
              {category.name}
            </h1>
            <div className="mt-2 h-[3px] w-16 rounded-full bg-[#f5a400]" />
          </div>

          <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
            <main className="order-2 min-w-0 xl:order-1 xl:flex-1">
              <div className="space-y-9">
                {paginatedPosts.length ? (
                  paginatedPosts.map((item, index) => {
                    const fallbackDescription = item.content_structure?.post_content
                      ?.map((section) => section.content)
                      .join(" ");
                    const description =
                      stripHtml(item.summary) ||
                      stripHtml(item.content) ||
                      stripHtml(fallbackDescription);
                    const primaryCategory = findDisplayCategoryForPost(
                      item,
                      category,
                      allCategories,
                    );
                    const tagIndex = categoryIndexMap.get(primaryCategory?.id ?? "") ?? index;
                    const date = formatPostDate(
                      item.release_at ?? item.published_at ?? item.created_at,
                    );

                    return (
                      <article
                        key={item.id}
                        className="border-b border-[#eceff3] pb-8 last:border-b-0"
                      >
                        <Link
                          href={buildDynamicPostHref(item.external_link, item.id, category.id)}
                          className="group grid gap-5 sm:grid-cols-[250px_minmax(0,1fr)]"
                        >
                          <div className="relative overflow-hidden rounded-md bg-[#edf1f5] aspect-[25/15] sm:aspect-[5/3]">
                            <ImageNext
                              src={resolveDynamicPostImage(item.thumbnail)}
                              alt={item.title}
                              width={520}
                              height={360}
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          </div>

                          <div className="min-w-0 pt-1">
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <span
                                className={`rounded-full px-2.5 py-1 font-semibold ${getTagClassName(tagIndex)}`}
                              >
                                {primaryCategory?.name || category.name}
                              </span>
                              {date ? <span className="text-[#9aa3ad]">{date}</span> : null}
                            </div>

                            <h2 className="mt-3 line-clamp-2 text-[18px] font-bold leading-snug text-[#111827] transition-colors group-hover:text-[#144c9c]">
                              {item.title}
                            </h2>

                            {description ? (
                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f6875]">
                                {description}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-[#edf1f5] bg-white px-6 py-12 text-center text-gray-600">
                    {"Ch\u01b0a c\u00f3 b\u00e0i vi\u1ebft ph\u00f9 h\u1ee3p trong danh m\u1ee5c n\u00e0y."}
                  </div>
                )}

                <div className="flex w-full justify-center pt-2">
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

            <aside className="contents xl:order-2 xl:block xl:w-[320px] xl:space-y-5 xl:pt-0">
              <form
                className="order-1 rounded-[22px] border border-[#edf1f5] bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.05)] xl:order-none"
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

              <div className="order-3 overflow-hidden rounded-[22px] shadow-[0_18px_42px_rgba(17,24,39,0.12)] xl:order-none">
                <div className="relative min-h-[390px] bg-[#1f334f]">
                  <ImageNext
                    src="/banner.webp"
                    alt="Đối tác quảng bá"
                    width={640}
                    height={760}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-liner-to-t from-[#14213d]/92 via-[#14213d]/28 to-transparent" />
                  <div className="absolute bottom-8 left-7 right-7 text-white">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                      Đối tác quảng bá
                    </div>
                    <div className="mt-3 text-2xl font-bold leading-tight">
                      Business Combo cho hội viên doanh nghiệp
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
