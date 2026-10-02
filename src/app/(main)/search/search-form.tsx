"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFormProps = {
  defaultValue?: string;
};

/**
 * Client island cho form tìm kiếm, đẩy `q` + `page` lên URL
 * để server component đọc searchParams và fetch dữ liệu.
 */
export default function SearchForm({ defaultValue = "" }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const goToSearch = (nextQuery: string) => {
    const params = new URLSearchParams();
    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    params.set("page", "1");

    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      className="order-1 rounded-[22px] border border-[#edf1f5] bg-white p-5 shadow-[0_14px_34px_rgba(17,24,39,0.05)] xl:order-none"
      onSubmit={(event) => {
        event.preventDefault();
        goToSearch(value);
      }}
    >
      <h2 className="text-lg font-bold text-[#111827]">Tìm kiếm</h2>
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
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
            setValue("");
            goToSearch("");
          }}
        >
          Bỏ tìm
        </Button>
      </div>
    </form>
  );
}
