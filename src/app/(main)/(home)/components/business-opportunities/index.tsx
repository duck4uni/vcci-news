'use client';

import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function BusinessOpportunities() {
  const { businessPosts, categoryLinks, categoryNames } = useHomePosts();
  const businessItems = businessPosts;
  const [featuredItem, ...listItems] = businessItems;
  const listSlots = Array.from({ length: 3 }, (_, index) => listItems[index] ?? null);
  const sectionLink =
    categoryLinks.get(categoryNames.coHoiKinhDoanh.toLowerCase()) ??
    "/xuc-tien-thuong-mai/co-hoi-kinh-doanh";

  return (
    <section className="flex-1">
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

      <div className="space-y-3">
        {featuredItem ? (
          <Link
            href={featuredItem.externalLink}
            className="block rounded-[18px] bg-[#f5f7fb] px-4 py-3.5 transition-colors hover:bg-[#eef3fb]"
          >
            <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.45] text-[#264798] md:text-[17px]">
              {featuredItem.title}
            </h3>
            <p className="mt-2 text-[13px] text-[#9aa8c1]">
              {dayjs(featuredItem.publishedAt || featuredItem.createdAt).format("DD/MM/YYYY")}
            </p>
          </Link>
        ) : (
          <div className="rounded-[18px] bg-[#f5f7fb] px-4 py-3.5">
            <div className="h-6 w-5/6 rounded bg-white" />
            <div className="mt-2 h-4 w-24 rounded bg-white/80" />
          </div>
        )}

        <div className="space-y-2.5">
          {listSlots.map((item, index) =>
            item ? (
              <Link
                key={item.id}
                href={item.externalLink}
                className="flex gap-3 rounded-[14px] px-0.5 py-1 transition-colors hover:bg-[#f8fafe]"
              >
                <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]" />
                <div className="min-w-0">
                  <h4 className="line-clamp-2 text-[15px] leading-[1.45] text-[#264798]">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-[13px] text-[#9aa8c1]">
                    {dayjs(item.publishedAt || item.createdAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              </Link>
            ) : (
              <div
                key={`business-placeholder-${index}`}
                className="flex gap-3 rounded-[14px] px-0.5 py-1"
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
      </div>
    </section>
  );
}

export default BusinessOpportunities;
