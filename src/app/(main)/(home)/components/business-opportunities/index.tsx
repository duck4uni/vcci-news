'use client';

import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function BusinessOpportunities() {
  const { businessPosts, categoryLinks, categoryNames } = useHomePosts();
  const listSlots = Array.from({ length: 4 }, (_, index) => businessPosts[index] ?? null);
  const sectionLink =
    categoryLinks.get(categoryNames.coHoiKinhDoanh.toLowerCase()) ??
    "/xuc-tien-thuong-mai/co-hoi-kinh-doanh";

  return (
    <section className="flex flex-1 flex-col">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Cơ hội kinh doanh
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>

        <Link
          href={sectionLink}
          className="text-[#24469c] transition-colors hover:text-[#1b55a1]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="flex min-h-[270px] flex-1 flex-col gap-2.5">
        {listSlots.map((item, index) =>
          item ? (
            <Link
              key={item.id}
              href={item.externalLink}
              className={`group flex min-h-[58px] gap-3 rounded-[18px] px-4 py-3 transition-all duration-200 hover:bg-[#f5f7fb] hover:shadow-[0_10px_24px_rgba(36,70,156,0.08)] ${
                index === 0 ? "pt-3.5" : ""
              }`}
            >
              <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500] transition-opacity duration-200 group-hover:opacity-0" />

              <div className="hidden min-w-0 group-hover:block">
                <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.45] text-[#264798] md:text-[17px]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] text-[#9aa8c1]">
                  {dayjs(item.publishedAt || item.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>

              <div className="min-w-0 group-hover:hidden">
                <h3 className="line-clamp-2 text-[15px] leading-[1.45] text-[#264798] md:text-[16px]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] text-[#9aa8c1]">
                  {dayjs(item.publishedAt || item.createdAt).format("DD/MM/YYYY")}
                </p>
              </div>
            </Link>
          ) : (
            <div
              key={`business-placeholder-${index}`}
              className={`flex min-h-[58px] gap-3 rounded-[14px] px-0.5 py-1 ${index === 0 ? "pt-0.5" : ""}`}
            >
              <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]/40" />
              <div className="min-w-0 flex-1">
                <div className="h-5 w-5/6 rounded bg-[#eef3fb]" />
                <div className="mt-1.5 h-4 w-24 rounded bg-[#f4f7fb]" />
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export default BusinessOpportunities;
