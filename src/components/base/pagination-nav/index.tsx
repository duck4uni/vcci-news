"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/base/pagination";

type PaginationNavProps = {
  page: number;
  pageCount: number;
  /** Đường dẫn base, ví dụ `/video`. */
  basePath: string;
  /** Danh sách query params cần giữ lại khi chuyển trang. */
  keepParams?: { key: string; value?: string | null }[];
};

/**
 * Client island cho phân trang dùng URL query, dùng được từ Server Component.
 */
export default function PaginationNav({
  page,
  pageCount,
  basePath,
  keepParams = [],
}: PaginationNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) return null;

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams();

    for (const param of keepParams) {
      const value = param.value?.trim();
      if (value) params.set(param.key, value);
    }

    if (nextPage > 1) params.set("page", String(nextPage));

    const queryString = params.toString();
    router.push(
      queryString ? `${pathname || basePath}?${queryString}` : pathname || basePath,
      { scroll: false },
    );
  };

  return (
    <div className="flex w-full justify-center pt-2">
      <Pagination
        pageCount={pageCount}
        page={page}
        onChangePage={goToPage}
        onGoToPreviousPage={() => goToPage(Math.max(1, page - 1))}
        onGoToNextPage={() => goToPage(Math.min(pageCount, page + 1))}
      />
    </div>
  );
}