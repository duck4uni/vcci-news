'use client';

import {
  type AdminNewsItem,
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const businessItems = getAdminNewsSeed()
  .filter(
    (item) =>
      item.type === "tintuc" &&
      !item.is_hidden &&
      (item.category_ids.includes("cat-business-opportunity") ||
        item.tagsearch_values.some((tag) => tag.toLowerCase().includes("cơ hội kinh doanh"))),
  )
  .sort(
    (left, right) =>
      new Date(right.published_at || right.created_at).getTime() -
      new Date(left.published_at || left.created_at).getTime(),
  );

function formatPublishDate(item: AdminNewsItem) {
  return dayjs(item.published_at || item.created_at).format("DD/MM/YYYY");
}

function BusinessOpportunities() {
  const [featuredItem, ...listItems] = businessItems;

  if (!featuredItem) return null;

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
          href="/xuc-tien-thuong-mai/co-hoi/"
          className="text-[#24469c] transition-colors hover:text-[#1b55a1]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="space-y-3">
        <Link
          href="/xuc-tien-thuong-mai/co-hoi/"
          className="block rounded-[18px] bg-[#f5f7fb] px-4 py-3.5 transition-colors hover:bg-[#eef3fb]"
        >
          <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.45] text-[#264798] md:text-[17px]">
            {featuredItem.title}
          </h3>
          <p className="mt-2 text-[13px] text-[#9aa8c1]">{formatPublishDate(featuredItem)}</p>
        </Link>

        <div className="space-y-2.5">
          {listItems.slice(0, 3).map((item) => (
            <Link
              key={item.id}
              href="/xuc-tien-thuong-mai/co-hoi/"
              className="flex gap-3 rounded-[14px] px-0.5 py-1 transition-colors hover:bg-[#f8fafe]"
            >
              <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]" />
              <div className="min-w-0">
                <h4 className="line-clamp-2 text-[15px] leading-[1.45] text-[#264798]">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-[13px] text-[#9aa8c1]">{formatPublishDate(item)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BusinessOpportunities;
