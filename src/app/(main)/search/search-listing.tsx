import Link from "next/link";
import Image from "next/image";
import { getApiV10Post } from "@/api/vcci-news/endpoints/post";
import PaginationNav from "@/components/base/pagination-nav";
import SidebarAdvertisements from "@/components/shared/sidebar-advertisements";
import {
  buildDynamicPostHref,
  getDynamicPostExcerpt,
  mapPost,
  resolveDynamicPostImage,
} from "../[...slug]/templates/data";
import type { DynamicPostItem } from "@/api/vcci-news/types/post";
import SearchForm from "./search-form";

const PAGE_SIZE = 10;

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
  const description = getDynamicPostExcerpt(item);
  const date = formatPostDate(item.release_at || item.published_at || item.created_at);
  const categoryName = item.categories[0]?.name || "Tin tức";

  return (
    <article className="border-b border-[#eceff3] pb-8 last:border-b-0">
      <Link
        href={buildDynamicPostHref(item.slug, item.id)}
        className="group grid gap-5 sm:grid-cols-[250px_minmax(0,1fr)]"
      >
        <div className="overflow-hidden rounded-md bg-[#edf1f5]">
          <Image
            src={resolveDynamicPostImage(item.thumbnail)}
            alt={item.title}
            width={520}
            height={360}
            className="h-[170px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-[150px]"
          />
        </div>

        <div className="min-w-0 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-semibold ${getTagClassName(index)}`}
            >
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

type SearchListingProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function SearchListing({ searchParams }: SearchListingProps) {
  const { q, page: pageParam } = await searchParams;

  const query = (q ?? "").trim();
  const pageFromUrl = Number(pageParam ?? "1");
  const page =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? Math.floor(pageFromUrl) : 1;

  const filters = [
    query ? `title@=${query}` : null,
    "is_hidden==false",
    "is_active==true",
    "type==news",
  ]
    .map((item) => item?.trim())
    .filter(Boolean)
    .join(",");

  let rows: DynamicPostItem[] = [];
  let count = 0;
  let pageSize = PAGE_SIZE;
  let currentPage = page;

  try {
    const response = (await getApiV10Post({
      page,
      pageSize: PAGE_SIZE,
      sortField: "release_at",
      sortOrder: "desc",
      filters,
    })) as {
      responseData?: {
        count?: number;
        page?: number;
        pageSize?: number;
        rows?: unknown[];
      };
    };

    const pageData = response?.responseData;
    count = Number(pageData?.count ?? 0);
    pageSize = Number(pageData?.pageSize ?? PAGE_SIZE) || PAGE_SIZE;
    currentPage = Number(pageData?.page ?? page) || page;
    rows = ((pageData?.rows ?? []) as unknown as Parameters<typeof mapPost>[0][])
      .map(mapPost)
      .filter((item) => item.id && item.title);
  } catch {
    rows = [];
  }

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

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
              Kết quả tìm kiếm cho:{" "}
              <span className="font-semibold text-[#111827]">{query}</span>
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-10 xl:flex-row xl:gap-14">
          <main className="order-2 min-w-0 xl:order-1 xl:flex-1">
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

              <PaginationNav
                page={Math.min(currentPage, totalPages)}
                pageCount={totalPages}
                basePath="/search"
                keepParams={[{ key: "q", value: query }]}
              />
            </div>
          </main>

          <aside className="contents xl:order-2 xl:block xl:w-[320px] xl:space-y-5 xl:pt-0">
            <SearchForm defaultValue={query} />

            <SidebarAdvertisements count={5} startIndex={0} />
          </aside>
        </div>
      </div>
    </div>
  );
}
