"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ImageNext from "@/components/shared/image-next";
import { Pagination } from "@components/base/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@components/ui/spinner";
import {
  buildDynamicPostHref,
  buildVisibleNewsFilters,
  fetchDynamicPostList,
  resolveDynamicPostImage,
  stripHtml,
} from "@/app/(main)/[...slug]/templates/data";
import type { DynamicPostItem } from "@/app/(main)/[...slug]/templates/types";

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

function SearchResultItem({ item, index }: { item: DynamicPostItem; index: number }) {
  const fallbackDescription = item.content_structure?.post_content
    ?.map((section) => section.content)
    .join(" ");
  const description =
    stripHtml(item.summary) || stripHtml(item.content) || stripHtml(fallbackDescription);
  const date = formatPostDate(item.release_at || item.published_at || item.created_at);
  const categoryName = item.categories[0]?.name || "Tin tức";

  return (
    <article className="border-b border-[#eceff3] pb-8 last:border-b-0">
      <Link
        href={buildDynamicPostHref(item.external_link, item.id)}
        className="group grid gap-5 sm:grid-cols-[250px_minmax(0,1fr)]"
      >
        <div className="overflow-hidden rounded-md bg-[#edf1f5]">
          <ImageNext
            src={resolveDynamicPostImage(item.thumbnail)}
            alt={item.title}
            width={520}
            height={360}
            className="h-[170px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-[150px]"
          />
        </div>

        <div className="min-w-0 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`rounded-full px-2.5 py-1 font-semibold ${getTagClassName(index)}`}>
              {categoryName}
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
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageFromUrl = searchParams.get("page");
  const [page, setPage] = useState(pageFromUrl ? Number(pageFromUrl) : 1);
  const [searchInput, setSearchInput] = useState(query);

  const pageSize = 10;
  const postsQuery = useQuery({
    queryKey: ["search-posts", page, pageSize, query],
    queryFn: () =>
      fetchDynamicPostList({
        page,
        pageSize,
        filters: buildVisibleNewsFilters([
          query ? `title@=${query}` : null,
        ]),
      }),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    const nextPage = pageFromUrl ? Number(pageFromUrl) : 1;
    if (Number.isFinite(nextPage)) {
      setPage(nextPage);
    }
  }, [pageFromUrl]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const updateSearchUrl = (nextQuery: string, nextPage = 1) => {
    const params = new URLSearchParams();
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    params.set("page", String(nextPage));
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  const rows = postsQuery.data?.rows ?? [];
  const totalPages = Number(postsQuery.data?.totalPages ?? 1);
  const currentPage = Number(postsQuery.data?.page ?? page);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-[#111827] md:text-4xl">
            Tìm kiếm
          </h1>
          <div className="mt-2 h-[3px] w-16 rounded-full bg-[#f5a400]" />
          {query ? (
            <p className="mt-4 text-sm text-[#5f6875]">
              Kết quả tìm kiếm cho: <span className="font-semibold text-[#111827]">{query}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
          <main className="order-2 min-w-0 xl:order-1 xl:flex-1">
            {postsQuery.isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="size-8" />
                <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
              </div>
            ) : (
              <div className="space-y-9">
                {rows.length ? (
                  rows.map((item, index) => (
                    <SearchResultItem key={item.id} item={item} index={index} />
                  ))
                ) : (
                  <div className="rounded-2xl border border-[#edf1f5] bg-white px-6 py-12 text-center text-gray-600">
                    Không tìm thấy bài viết phù hợp.
                  </div>
                )}

                <div className="flex w-full justify-center pt-2">
                  <Pagination
                    pageCount={totalPages}
                    page={currentPage}
                    onChangePage={(nextPage) => {
                      setPage(nextPage);
                      updateSearchUrl(query, nextPage);
                    }}
                    onGoToPreviousPage={() => {
                      const nextPage = Math.max(1, currentPage - 1);
                      setPage(nextPage);
                      updateSearchUrl(query, nextPage);
                    }}
                    onGoToNextPage={() => {
                      const nextPage = Math.min(totalPages, currentPage + 1);
                      setPage(nextPage);
                      updateSearchUrl(query, nextPage);
                    }}
                  />
                </div>
              </div>
            )}
          </main>

          <aside className="contents xl:order-2 xl:block xl:w-[320px] xl:space-y-5 xl:pt-0">
            <form
              className="order-1 rounded-[22px] border border-[#edf1f5] bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.05)] xl:order-none"
              onSubmit={(event) => {
                event.preventDefault();
                setPage(1);
                updateSearchUrl(searchInput, 1);
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
                    updateSearchUrl("", 1);
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#14213d]/92 via-[#14213d]/28 to-transparent" />
                <div className="absolute bottom-8 left-7 right-7 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    Đối tác quảng bá
                  </div>
                  <div className="mt-3 text-2xl font-bold leading-tight">
                    Business Combo cho doanh nghiệp hội viên
                  </div>
                </div>
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner className="size-8" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
