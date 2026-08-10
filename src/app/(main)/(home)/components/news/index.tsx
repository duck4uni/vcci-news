'use client';

import ImageNext from "@/components/shared/image-next";
import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import Link from "next/link";
import { useMemo, useState } from "react";

const tabs = [
  { id: "all", label: "Tất cả" },
  { id: "tin-vcci", label: "Tin VCCI" },
  { id: "tin-kinh-te", label: "Tin Kinh tế" },
  { id: "chuyen-de", label: "Chuyên đề" },
];

function News() {
  const [tab, setTab] = useState("all");
  const { newsTabs, categoryLinks, categoryNames } = useHomePosts();

  const filteredItems = useMemo(() => {
    if (tab === "all") return newsTabs.all;
    if (tab === "tin-kinh-te") return newsTabs.tinKinhTe;
    if (tab === "chuyen-de") return newsTabs.chuyenDe;
    return newsTabs.tinVcci;
  }, [newsTabs, tab]);

  const featuredArticle = filteredItems[0] ?? newsTabs.all[0];
  const listArticles = filteredItems.slice(1, 5);
  const listSlots = Array.from({ length: 4 }, (_, index) => listArticles[index] ?? null);
  const overviewLink =
    (tab === "all"
      ? categoryLinks.get(categoryNames.tinVcci.toLowerCase())
      : tab === "tin-kinh-te"
      ? categoryLinks.get(categoryNames.tinKinhTe.toLowerCase())
      : tab === "chuyen-de"
        ? categoryLinks.get(categoryNames.chuyenDe.toLowerCase())
        : categoryLinks.get(categoryNames.tinVcci.toLowerCase())) ?? "/hoat-dong/tin-tuc";

  return (
    <div className="flex-1">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
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
          {featuredArticle ? (
            <Link
              href={featuredArticle.externalLink}
              className="block h-full overflow-hidden rounded-[22px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]"
            >
              <div className="aspect-[1.4/1] overflow-hidden">
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
                  {featuredArticle.categories[0]?.name || "Tin tức"}
                </span>

                <h3 className="line-clamp-2 text-[16px] font-bold leading-[1.28] text-[#20408f] md:text-[17px]">
                  {featuredArticle.title}
                </h3>

                <p className="line-clamp-3 text-[13px] leading-[1.45] text-[#6c7b96]">
                  {(() => {
                    const rawText = featuredArticle.contentText || featuredArticle.summary || "";
                    const textOnly = rawText
                      .replace(/\[caption[^\]]*\].*?\[\/caption\]/gi, "")
                      .replace(/<figure[^>]*>.*?<\/figure>/gi, "")
                      .replace(/<img[^>]*>/gi, "")
                      .replace(/<[^>]+>/g, " ")
                      .replace(/&nbsp;/g, " ")
                      .replace(/&amp;/g, "&")
                      .replace(/&lt;/g, "<")
                      .replace(/&gt;/g, ">")
                      .replace(/&quot;/g, '"')
                      .replace(/"/g, '"')
                      .replace(/"/g, '"')
                      .replace(/'/g, "'")
                      .replace(/–/g, "–")
                      .replace(/\s+/g, " ")
                      .trim();
                    return textOnly || "-";
                  })()}
                </p>

                <p className="text-[14px] text-[#8a9bb6]">
                  {dayjs(featuredArticle.publishedAt || featuredArticle.createdAt).format(
                    "DD/MM/YYYY",
                  )}
                </p>
              </div>
            </Link>
          ) : (
            <div className="h-full overflow-hidden rounded-[22px] border border-[#dbe4f2] bg-white shadow-[0_8px_24px_rgba(31,59,124,0.08)]">
              <div className="aspect-[1.75/1] bg-[#eef3fb]" />
              <div className="space-y-2 p-3">
                <div className="h-5 w-24 rounded bg-[#eef3fb]" />
                <div className="h-6 w-5/6 rounded bg-[#eef3fb]" />
                <div className="h-4 w-full rounded bg-[#f4f7fb]" />
                <div className="h-4 w-3/4 rounded bg-[#f4f7fb]" />
                <div className="h-4 w-24 rounded bg-[#eef3fb]" />
              </div>
            </div>
          )}
        </div>

        <div className="xl:flex xl:h-full xl:flex-col">
          <div className="space-y-3 xl:flex xl:flex-1 xl:flex-col">
            {listSlots.map((news, index) =>
              news ? (
                <Link
                  key={news.id}
                  href={news.externalLink}
                  className="block rounded-[18px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(31,59,124,0.12)] xl:flex-1"
                >
                  <h4 className="line-clamp-1 text-[15px] font-bold leading-[1.28] text-[#21408f]">
                    {news.title}
                  </h4>
                  {(() => {
                    const rawText = news.contentText || news.summary || "";
                    const textOnly = rawText
                      .replace(/\[caption[^\]]*\].*?\[\/caption\]/gi, "")
                      .replace(/<figure[^>]*>.*?<\/figure>/gi, "")
                      .replace(/<img[^>]*>/gi, "")
                      .replace(/<[^>]+>/g, " ")
                      .replace(/&nbsp;/g, " ")
                      .replace(/&amp;/g, "&")
                      .replace(/&lt;/g, "<")
                      .replace(/&gt;/g, ">")
                      .replace(/&quot;/g, '"')
                      .replace(/"/g, '"')
                      .replace(/"/g, '"')
                      .replace(/'/g, "'")
                      .replace(/–/g, "–")
                      .replace(/\s+/g, " ")
                      .trim();
                    return textOnly.length > 10 ? (
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-normal text-[#6c7b96]">
                        {textOnly}
                      </p>
                    ) : null;
                  })()}
                  <p className="mt-1 text-[13px] text-[#8a9bb6]">
                    {dayjs(news.publishedAt || news.createdAt).format("DD/MM/YYYY")}
                  </p>
                </Link>
              ) : (
                <div
                  key={`news-placeholder-${index}`}
                  className="rounded-[18px] border border-[#dbe4f2] bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(31,59,124,0.06)] xl:flex-1"
                >
                  <div className="h-5 w-5/6 rounded bg-[#eef3fb]" />
                  <div className="mt-2 h-4 w-24 rounded bg-[#f4f7fb]" />
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Link
          href={overviewLink}
          className="text-sm font-semibold text-[#24469c] transition-colors hover:text-[#1b55a1]"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
}

export default News;
