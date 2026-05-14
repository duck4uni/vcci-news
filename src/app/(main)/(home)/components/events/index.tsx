'use client';

import ImageNext from "@/components/shared/image-next";
import {
  type AdminNewsItem,
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import dayjs from "dayjs";
import Link from "next/link";

const eventItems = getAdminNewsSeed()
  .filter(
    (item) =>
      item.type === "tintuc" &&
      item.header_category_id === "activity-events" &&
      !item.is_hidden &&
      item.started_at,
  )
  .sort(
    (left, right) =>
      new Date(left.started_at).getTime() - new Date(right.started_at).getTime(),
  );

function formatEventDate(item: AdminNewsItem) {
  return dayjs(item.started_at || item.published_at || item.created_at).format("DD/MM/YYYY");
}

function Events() {
  const [featuredEvent, ...sideEvents] = eventItems;

  if (!featuredEvent) return null;

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
          href="/hoat-dong/su-kien"
          className="pt-1.5 text-sm font-semibold text-[#ffd34f] transition-colors hover:text-white"
        >
          Xem sự kiện
        </Link>
      </div>

      <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.02fr)_minmax(270px,0.98fr)]">
        <Link
          href="/hoat-dong/su-kien"
          className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white text-[#20408f] shadow-[0_14px_28px_rgba(10,39,95,0.18)]"
        >
          <div className="h-[220px] overflow-hidden md:h-[235px] xl:h-[248px]">
            <ImageNext
              src={featuredEvent.thumbnail?.url ?? "/thumbnail.png"}
              alt={featuredEvent.thumbnail?.alt || featuredEvent.title}
              width={720}
              height={520}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-3 pt-2.5">
            <h3 className="line-clamp-2 text-[16px] font-extrabold uppercase leading-[1.28] text-[#22459b] md:text-[18px]">
              {featuredEvent.title}
            </h3>
            <p className="mt-1.5 text-[13px] text-[#90a0bd]">{formatEventDate(featuredEvent)}</p>
          </div>
        </Link>

        <div className="flex h-full flex-col gap-3">
          {sideEvents.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              href="/hoat-dong/su-kien"
              className="flex flex-1 items-center gap-3 rounded-[18px] bg-white/10 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-sm transition-colors hover:bg-white/14"
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
                <h4 className="line-clamp-2 text-[15px] font-semibold leading-[1.35] text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-[12px] text-white/78">{formatEventDate(item)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Events;
