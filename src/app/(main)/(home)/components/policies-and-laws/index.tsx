'use client';

import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function PolicyAndLaws() {
  const { policyPosts, categoryLinks, categoryNames } = useHomePosts();
  const policyItems = policyPosts;
  const [featuredItem, ...listItems] = policyItems;
  const listSlots = [featuredItem, ...listItems.slice(0, 2)];
  const sectionLink =
    categoryLinks.get(categoryNames.chinhSachPhapLuat.toLowerCase()) ??
    "/thong-tin-truyen-thong/thong-tin-chinh-sach-va-phap-luat";

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
          href={sectionLink}
          className="text-[#24469c] transition-colors hover:text-[#1b55a1]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {listSlots.map((item, index) =>
          item ? (
            <Link
              key={item.id}
              href={item.externalLink}
              className={`flex gap-3 rounded-[14px] px-0.5 py-1 transition-colors hover:bg-[#f8fafe] ${
                index === 0 ? "pt-0.5" : ""
              }`}
            >
              <span className="mt-1 h-[40px] w-[2px] shrink-0 rounded-full bg-[#f7b500]" />
              <div className="min-w-0">
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
              key={`policy-placeholder-${index}`}
              className={`flex gap-3 rounded-[14px] px-0.5 py-1 ${index === 0 ? "pt-0.5" : ""}`}
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

export default PolicyAndLaws;
