'use client';

import {
  type AdminNewsItem,
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const policyItems = getAdminNewsSeed()
  .filter(
    (item) =>
      item.type === "tintuc" &&
      !item.is_hidden &&
      (item.category_ids.includes("cat-policy-law") ||
        item.category_ids.includes("cat-policy") ||
        item.tagsearch_values.some((tag) => {
          const normalized = tag.toLowerCase();
          return normalized.includes("chính sách") || normalized.includes("pháp luật");
        })),
  )
  .sort(
    (left, right) =>
      new Date(right.published_at || right.created_at).getTime() -
      new Date(left.published_at || left.created_at).getTime(),
  );

function formatPublishDate(item: AdminNewsItem) {
  return dayjs(item.published_at || item.created_at).format("DD/MM/YYYY");
}

function PolicyAndLaws() {
  const [featuredItem, ...listItems] = policyItems;

  if (!featuredItem) return null;

  return (
    <section className="flex-1">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Chính sách & pháp luật
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>

        <Link
          href="/thong-tin-truyen-thong/phap-luat"
          className="text-[#24469c] transition-colors hover:text-[#1b55a1]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {[featuredItem, ...listItems.slice(0, 2)].map((item, index) => (
          <Link
            key={item.id}
            href="/thong-tin-truyen-thong/phap-luat"
            className={`flex gap-3 rounded-[14px] px-0.5 py-1 transition-colors hover:bg-[#f8fafe] ${
              index === 0 ? "pt-0.5" : ""
            }`}
          >
            <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]" />
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[15px] leading-[1.45] text-[#264798] md:text-[16px]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[13px] text-[#9aa8c1]">{formatPublishDate(item)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default PolicyAndLaws;
