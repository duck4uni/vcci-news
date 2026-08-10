'use client';

import ImageNext from "@/components/shared/image-next";
import Link from "next/link";

function Advertisements({ count = 2 }: { count?: number }) {
  const mdCols = count >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <aside className={`flex w-full flex-col gap-4 md:grid ${mdCols} xl:grid xl:order-2 xl:w-[22%] xl:grid-cols-1 xl:gap-4 xl:self-center`}>
      <Link
        href="https://hardwaretools.com.vn/"
        className="block overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(31,59,124,0.14)]"
      >
        <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/10] lg:aspect-[7/4] xl:aspect-[3/2]">
          <ImageNext
            src="/home/20-2048x1365.webp"
            alt="Quảng cáo 1"
            width={2048}
            height={1365}
            className="h-full w-full object-cover object-[center_80%]"
          />
        </div>
      </Link>

      <Link
        href="https://hardwaretools.com.vn/"
        className="block overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(31,59,124,0.14)]"
      >
        <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/10] lg:aspect-[7/4] xl:aspect-[3/2]">
          <ImageNext
            src="/home/20-2048x1365.webp"
            alt="Quảng cáo 2"
            width={2048}
            height={1365}
            className="h-full w-full object-cover object-[center_80%]"
          />
        </div>
      </Link>

      {count >= 3 && (
        <Link
          href="https://hardwaretools.com.vn/"
          className="block overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(31,59,124,0.14)]"
        >
          <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/10] lg:aspect-[7/4] xl:aspect-[3/2]">
            <ImageNext
              src="/home/20-2048x1365.webp"
              alt="Quảng cáo 3"
              width={2048}
              height={1365}
              className="h-full w-full object-cover object-[center_80%]"
            />
          </div>
        </Link>
      )}
    </aside>
  );
}

export default Advertisements;
