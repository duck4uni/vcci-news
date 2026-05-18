'use client';

import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import ImageNext from "@/components/shared/image-next";
import Link from "next/link";

function QuickLinks() {
  const { quickLinkPosts } = useHomePosts();
  const linkSlots = Array.from({ length: 4 }, (_, index) => quickLinkPosts[index] ?? null);

  return (
    <aside className="w-full xl:grid xl:w-[32%] xl:grid-rows-[0.74fr_0.88fr] xl:gap-4">
      <div className="rounded-[22px] border border-[#dbe4f2] bg-white p-4 shadow-[0_8px_24px_rgba(31,59,124,0.08)] xl:h-full">
        <h2 className="client-section-title uppercase text-[#24469c]">
          Liên kết nhanh
        </h2>
        <div className="mt-3 h-[5px] w-[68px] rounded-full bg-[#f7b500]" />

        <div className="mt-4 space-y-3">
          {linkSlots.map((item, index) =>
            item ? (
              <Link
                key={item.id}
                href={item.externalLink}
                className="flex items-start gap-3 text-[15px] leading-[1.32] text-[#556684] transition-colors hover:text-[#21408f]"
              >
                <span className="mt-1 text-[#e2a500]">›</span>
                <span className="line-clamp-1">{item.title}</span>
              </Link>
            ) : (
              <div
                key={`quick-link-placeholder-${index}`}
                className="flex items-start gap-3"
              >
                <span className="mt-1 h-4 w-2 shrink-0 rounded bg-[#f5d774]" />
                <span className="h-5 w-5/6 rounded bg-[#eef3fb]" />
              </div>
            ),
          )}
        </div>
      </div>

      <Link
        href="https://hardwaretools.com.vn/"
        className="mt-4 block overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(31,59,124,0.14)] xl:mt-0 xl:h-full"
      >
        <div className="aspect-[1.55/1] overflow-hidden xl:h-full xl:aspect-auto">
          <ImageNext
            src="/home/20-2048x1365.webp"
            alt="Liên kết nhanh"
            width={2048}
            height={1365}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>
    </aside>
  );
}

export default QuickLinks;
