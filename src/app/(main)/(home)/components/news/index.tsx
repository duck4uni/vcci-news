'use client';

import ImageNext from "@/components/shared/image-next";
import stripImagesAndHtml from "@/helpers/stripImageAndHtml";
import {
  type AdminNewsItem,
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "tin-vcci", label: "Tin VCCI" },
  { id: "tin-kinh-te", label: "Tin Kinh Tế" },
  { id: "chuyen-de", label: "Chuyên Đề" },
];

const allNewsItems = getAdminNewsSeed().filter(
  (item) => item.type === "tintuc" && !item.is_hidden,
);

function getTabLabel(item: AdminNewsItem) {
  const tags = item.tagsearch_values.map((tag) => tag.toLowerCase());

  if (tags.some((tag) => tag.includes("kinh tế") || tag.includes("vĩ mô"))) {
    return "Tin Kinh Tế";
  }

  if (tags.some((tag) => tag.includes("chuyên đề") || tag.includes("cẩm nang"))) {
    return "Chuyên Đề";
  }

  return "Tin VCCI";
}

function matchesTab(item: AdminNewsItem, tab: string) {
  if (tab === "all") return true;

  const tags = item.tagsearch_values.map((value) => value.toLowerCase());

  if (tab === "tin-vcci") {
    return tags.some((tag) => tag.includes("tin vcci") || tag.includes("hợp tác"));
  }

  if (tab === "tin-kinh-te") {
    return tags.some((tag) => tag.includes("kinh tế") || tag.includes("vĩ mô"));
  }

  if (tab === "chuyen-de") {
    return tags.some((tag) => tag.includes("chuyên đề") || tag.includes("cẩm nang"));
  }

  return true;
}

function News() {
  const [tab, setTab] = useState("all");

  const filteredItems = useMemo(
    () => allNewsItems.filter((item) => matchesTab(item, tab)),
    [tab],
  );

  const featuredArticle = filteredItems[0] ?? allNewsItems[0];
  const listArticles = filteredItems.slice(1, 5);

  if (!featuredArticle) return null;

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[28px] font-extrabold uppercase tracking-tight text-[#24469c] md:text-[34px]">
            Tin tức
          </h2>
          <div className="mt-3 h-[5px] w-[68px] rounded-full bg-[#f7b500]" />
        </div>

        <div className="flex flex-wrap gap-3 xl:justify-end">
          {tabs.map((item) => {
            const active = item.id === tab;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all ${
                  active
                    ? "bg-[#1f5ba9] text-white shadow-[0_10px_20px_rgba(31,91,169,0.18)]"
                    : "bg-[#f4f7fb] text-[#7f8eab] hover:bg-[#eaf0f8]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
        <div>
          <Link
            href="/hoat-dong/tin-tuc"
            className="block h-full overflow-hidden rounded-[22px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]"
          >
            <div className="aspect-[1.75/1] overflow-hidden">
              <ImageNext
                src={featuredArticle.thumbnail?.url ?? "/thumbnail.png"}
                alt={featuredArticle.thumbnail?.alt || featuredArticle.title}
                width={720}
                height={580}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-1.5 p-3">
              <span className="inline-flex text-[14px] font-bold text-[#e2a500]">
                {getTabLabel(featuredArticle)}
              </span>

              <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.28] text-[#20408f] md:text-[17px]">
                {featuredArticle.title}
              </h3>

              <p className="line-clamp-2 text-[13px] leading-[1.45] text-[#6c7b96]">
                {stripImagesAndHtml(featuredArticle.summary)}
              </p>

              <p className="text-[14px] text-[#8a9bb6]">
                {dayjs(featuredArticle.published_at || featuredArticle.created_at).format("DD/MM/YYYY")}
              </p>
            </div>
          </Link>
        </div>

        <div className="xl:flex xl:h-full xl:flex-col">
          <div className="space-y-3 xl:flex xl:flex-1 xl:flex-col">
            {listArticles.map((news) => (
              <Link
                key={news.id}
                href="/hoat-dong/tin-tuc"
                className="block rounded-[18px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,59,124,0.12)] xl:flex-1"
              >
                <h4 className="line-clamp-2 text-[15px] font-bold leading-[1.28] text-[#21408f]">
                  {news.title}
                </h4>
                <p className="mt-1 text-[13px] text-[#8a9bb6]">
                  {dayjs(news.published_at || news.created_at).format("DD/MM/YYYY")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
