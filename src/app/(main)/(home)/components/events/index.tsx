  'use client';

import ImageNext from "@/components/shared/image-next";
import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import Link from "next/link";

function Events() {
  const { eventPosts, categoryLinks, categoryNames } = useHomePosts();
  // Reverse so newest event is first (featured card)
  const eventItems = [...eventPosts].reverse();
  const [featuredEvent, ...sideEvents] = eventItems;
  const sideSlots = Array.from({ length: 4 }, (_, index) => sideEvents[index] ?? null);
  const eventsLink =
    categoryLinks.get(categoryNames.suKien.toLowerCase()) ?? "/hoat-dong/su-kien";

  return (
    <div className="flex-1 rounded-[28px] bg-linear-to-br from-[#14488f] to-[#2d67bf] p-4 text-white shadow-[0_18px_38px_rgba(16,61,130,0.24)] md:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="client-section-title uppercase text-white">
            Sự kiện sắp diễn ra
          </h2>
          <div className="mt-2.5 h-[4px] w-[60px] rounded-full bg-[#f7b500]" />
        </div>

        <Link
          href={eventsLink}
          className="pt-1.5 text-sm font-semibold text-[#ffd34f] transition-colors hover:text-white"
        >
          Xem sự kiện
        </Link>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1.02fr)_minmax(270px,0.98fr)]">
        {featuredEvent ? (
          <Link
            href={featuredEvent.externalLink}
            className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] bg-white text-[#20408f] shadow-[0_14px_28px_rgba(10,39,95,0.18)]"
          >
            <div className="relative h-[180px] overflow-hidden md:h-[220px] xl:h-[248px]">
              <ImageNext
                src={featuredEvent.thumbnail?.url ?? "/thumbnail.png"}
                alt={featuredEvent.thumbnail?.alt || featuredEvent.title}
                width={720}
                height={520}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex rounded-full bg-[#f7b500] px-3 py-1 text-[12px] font-bold text-[#15357a]">
                {featuredEvent.categories[0]?.name || "Sự kiện"}
              </span>
            </div>

            <div className="flex flex-col p-3 pt-2.5">
              <h3 className="text-[16px] font-bold uppercase leading-[1.28] text-[#22459b] line-clamp-2 transition-colors duration-200 group-hover:text-[#f7b500] md:text-[18px]">
                {featuredEvent.title}
              </h3>
              {(() => {
                const rawText = featuredEvent.contentText || featuredEvent.summary || "";
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
                  <p className="mt-2 line-clamp-1 text-[13px] leading-normal text-[#5f6f86]">
                    {textOnly.substring(0, 150)}
                  </p>
                ) : null;
              })()}
              <p className="mt-auto pt-2 text-[13px] text-[#90a0bd]">
                {dayjs(
                  featuredEvent.startedAt || featuredEvent.publishedAt || featuredEvent.createdAt,
                ).format("DD/MM/YYYY")}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white text-[#20408f] shadow-[0_14px_28px_rgba(10,39,95,0.12)]">
            <div className="h-[180px] bg-[#d7e3f9] md:h-[220px] xl:h-[248px]" />
            <div className="space-y-2 p-3 pt-2.5">
              <div className="h-6 w-5/6 rounded bg-[#e7eefb]" />
              <div className="h-4 w-24 rounded bg-[#eef3fb]" />
            </div>
          </div>
        )}

        <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
          {sideSlots.map((item, index) =>
            item ? (
              <Link
                key={item.id}
                href={item.externalLink}
                className="group flex flex-1 cursor-pointer items-center gap-3 rounded-[18px] bg-white/10 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-sm transition-colors hover:bg-white/14"
              >
                <div className="h-[64px] w-[64px] shrink-0 overflow-hidden rounded-[12px]">
                  <ImageNext
                    src={item.thumbnail?.url ?? "/thumbnail.png"}
                    alt={item.thumbnail?.alt || item.title}
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="line-clamp-1 text-[15px] font-semibold leading-[1.35] text-white transition-colors duration-200 group-hover:text-[#f7b500]">
                    {item.title}
                  </h4>
                  {(() => {
                    const rawText = item.contentText || item.summary || "";
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
                      <p className="mt-1 line-clamp-1 text-[12px] text-white/78">
                        {textOnly.substring(0, 80)}
                      </p>
                    ) : null;
                  })()}
                  <div className="mt-1 flex items-center gap-2">
                    {item.categories[0]?.name && (
                      <span className="text-[12px] font-medium text-[#f7b500]">
                        {item.categories[0].name}
                      </span>
                    )}
                    {item.categories[0]?.name && (
                      <span className="text-[12px] text-white/50">•</span>
                    )}
                    <p className="text-[12px] text-white/78">
                      {dayjs(item.startedAt || item.publishedAt || item.createdAt).format(
                        "DD/MM/YYYY",
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={`event-placeholder-${index}`}
                className="flex flex-1 items-center gap-3 rounded-[18px] bg-white/10 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
              >
                <div className="h-[64px] w-[64px] shrink-0 rounded-[12px] bg-white/20" />
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-5/6 rounded bg-white/25" />
                  <div className="mt-2 h-3 w-20 rounded bg-white/20" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
