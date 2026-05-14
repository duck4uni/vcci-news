'use client';

import ImageNext from "@/components/shared/image-next";
import {
  type AdminNewsItem,
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import { getHeaderCategorySeed } from "@/mockdata/header-config";
import dayjs from "dayjs";
import { ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";

const FALLBACK_CATEGORY_LINK = "/hoat-dong/tin-tuc";
const headerCategoryMap = new Map(
  getHeaderCategorySeed().map((item) => [item.id, item.static_link]),
);
const FEATURED_OVERVIEW_LINK =
  headerCategoryMap.get("activity-news") ?? FALLBACK_CATEGORY_LINK;

function getFeaturedNewsItems(items: AdminNewsItem[]) {
  return items
    .filter(
      (item) =>
        item.type === "tintuc" &&
        item.is_featured &&
        !item.is_hidden &&
        Boolean(item.thumbnail?.url),
    )
    .slice(0, 3);
}

function getNewsLink(item: AdminNewsItem) {
  return headerCategoryMap.get(item.header_category_id) ?? FALLBACK_CATEGORY_LINK;
}

function getBadgeLabel(item: AdminNewsItem) {
  if (item.header_category_id === "activity-events") return "Sự kiện";

  const firstTag = item.tagsearch_values.find(Boolean);
  if (firstTag) return firstTag;

  return "Tin VCCI";
}

const featuredNewsItems = getFeaturedNewsItems(getAdminNewsSeed());

function FeaturedNews() {
  const [primaryItem, ...secondaryItems] = featuredNewsItems;

  if (!primaryItem) return null;

  return (
    <section className="py-8 md:py-10">
      <div className="w-full">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Tin nổi bật
            </h2>
            <div className="mt-3 h-[5px] w-[68px] rounded-full bg-[#f7b500]" />
          </div>

          <Link
            href={FEATURED_OVERVIEW_LINK}
            className="inline-flex items-center gap-2 pt-2 text-base font-semibold text-[#2b56c0] transition-colors hover:text-[#173f9f]"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.14fr)_minmax(0,0.96fr)]">
          <Link
            href={getNewsLink(primaryItem)}
            className="group relative block min-h-[260px] overflow-hidden rounded-[24px] bg-[#0d2f5f] shadow-[0_18px_38px_rgba(28,52,120,0.22)] md:min-h-[320px] xl:min-h-[350px]"
          >
            <div className="relative h-full min-h-[260px] md:min-h-[320px] xl:min-h-[350px]">
              <ImageNext
                src={primaryItem.thumbnail?.url ?? "/thumbnail.png"}
                alt={primaryItem.thumbnail?.alt || primaryItem.title}
                width={1200}
                height={800}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#26356d] via-[#53669b]/34 to-transparent" />

              <div className="relative flex h-full flex-col justify-end p-4 md:p-5">
                <span className="mb-2 inline-flex w-fit rounded-[10px] bg-[#ffc400] px-3 py-1 text-sm font-bold text-[#1d3f90]">
                  {getBadgeLabel(primaryItem)}
                </span>

                <h3 className="max-w-3xl text-[20px] font-bold leading-[1.28] text-white md:text-[28px] xl:text-[32px]">
                  {primaryItem.title}
                </h3>

                <p className="mt-2 text-base font-medium text-white/78 md:text-[17px]">
                  {dayjs(primaryItem.published_at || primaryItem.created_at).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </Link>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {secondaryItems.map((item) => (
                <Link
                  key={item.id}
                  href={getNewsLink(item)}
                  className="group relative block min-h-[195px] overflow-hidden rounded-[20px] bg-[#27447f] shadow-[0_16px_32px_rgba(28,52,120,0.2)] md:min-h-[205px] xl:min-h-[215px]"
                >
                  <div className="relative h-full min-h-[195px] md:min-h-[205px] xl:min-h-[215px]">
                    <ImageNext
                      src={item.thumbnail?.url ?? "/thumbnail.png"}
                      alt={item.thumbnail?.alt || item.title}
                      width={600}
                      height={420}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#5a6796] via-[#405083]/34 to-transparent" />

                    <div className="relative flex h-full flex-col justify-end p-3.5">
                      <span className="mb-2 inline-flex w-fit rounded-[10px] bg-[#ffc400] px-3 py-1 text-sm font-bold text-[#1d3f90]">
                        {getBadgeLabel(item)}
                      </span>

                      <h4 className="line-clamp-2 text-[16px] font-bold leading-[1.32] text-white md:text-[17px]">
                        {item.title}
                      </h4>

                      <p className="mt-1.5 text-[15px] font-medium text-white/78 md:text-base">
                        {dayjs(item.published_at || item.created_at).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="overflow-hidden rounded-[28px] bg-linear-to-r from-[#214b95] to-[#2b66bb] px-5 py-5 text-white shadow-[0_18px_38px_rgba(28,52,120,0.2)] md:px-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.4em] text-white/80">
                    Quảng bá & tiếp cận
                  </p>
                  <h3 className="mt-2 max-w-[520px] text-[20px] font-extrabold uppercase leading-[1.02] xl:text-[28px]">
                    Cộng đồng doanh nghiệp
                  </h3>
                </div>

                <div className="w-full max-w-60 rounded-[999px] bg-white px-4 py-3 text-[#173f88] shadow-[0_10px_24px_rgba(8,25,74,0.12)]">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Mail className="h-5 w-5 shrink-0" />
                    <span>info@vcci-hcm.org.vn</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm font-medium">
                    <Phone className="h-5 w-5 shrink-0" />
                    <span>+84-28-3932 5171</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedNews;
