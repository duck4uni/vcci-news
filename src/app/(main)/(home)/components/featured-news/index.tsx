'use client';

import ImageNext from "@/components/shared/image-next";
import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import HorizontalAdBanner from "@/app/(main)/(home)/components/horizontal-ad-banner";

const FALLBACK_CATEGORY_LINK = "/hoat-dong/tin-tuc";

function FeaturedNews() {
  const { featuredPosts, categoryNames, categoryLinks } = useHomePosts();
  const featuredNewsItems = featuredPosts.slice(0, 3);
  const [primaryItem, ...secondaryItems] = featuredNewsItems;
  const secondarySlots = Array.from({ length: 2 }, (_, index) => secondaryItems[index] ?? null);
  const featuredOverviewLink =
    categoryLinks.get(categoryNames.tinVcci.toLowerCase()) ?? FALLBACK_CATEGORY_LINK;

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
            href={featuredOverviewLink}
            className="inline-flex items-center gap-2 pt-2 text-base font-semibold text-[#2b56c0] transition-colors hover:text-[#173f9f]"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {primaryItem ? (
            <Link
              href={primaryItem.externalLink}
              className="group relative block cursor-pointer overflow-hidden rounded-[20px] bg-[#0d2f5f] shadow-[0_16px_32px_rgba(28,52,120,0.2)] md:rounded-[24px] md:min-h-[320px] lg:min-h-[380px]"
            >
              <div className="relative h-full min-h-[195px] md:min-h-[320px] lg:min-h-[380px]">
                <ImageNext
                  src={primaryItem.thumbnail?.url ?? "/thumbnail.png"}
                  alt={primaryItem.thumbnail?.alt || primaryItem.title}
                  width={1200}
                  height={800}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#26356d] via-[#53669b]/34 to-transparent" />

                <div className="relative flex h-full flex-col justify-end p-3.5 md:p-5">
                  <span className="mb-2 inline-flex w-fit rounded-[10px] bg-[#ffc400] px-3 py-1 text-sm font-bold text-[#1d3f90]">
                    {primaryItem.categories[0]?.name || "Tin nổi bật"}
                  </span>

                  <h3 className="max-w-3xl line-clamp-2 text-[16px] font-bold leading-[1.32] text-white transition-colors duration-200 group-hover:text-[#f7b500] md:line-clamp-3 md:text-[22px] lg:text-[24px]">
                    {primaryItem.title}
                  </h3>

                  <p className="mt-1.5 text-[15px] font-medium text-white/78 md:mt-2 md:text-[17px]">
                    {dayjs(primaryItem.publishedAt || primaryItem.createdAt).format(
                      "DD/MM/YYYY",
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative overflow-hidden rounded-[20px] bg-[#e9eef8] shadow-[0_16px_32px_rgba(28,52,120,0.12)] md:rounded-3xl md:min-h-[320px] lg:min-h-[380px]">
              <div className="flex h-full min-h-[195px] flex-col justify-end p-3.5 md:min-h-80 md:p-5 lg:min-h-[380px]">
                <span className="mb-2 h-8 w-28 rounded-[10px] bg-white/80" />
                <div className="h-8 w-3/4 rounded bg-white/90 md:h-10" />
                <div className="mt-2 h-5 w-28 rounded bg-white/70" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 lg:min-h-[380px]">
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {secondarySlots.map((item, index) =>
                item ? (
                  <Link
                    key={item.id}
                    href={item.externalLink}
                    className="group relative block cursor-pointer overflow-hidden rounded-[20px] bg-[#27447f] shadow-[0_16px_32px_rgba(28,52,120,0.2)] min-h-[165px]"
                  >
                    <div className="relative flex h-full min-h-[165px]">
                      <ImageNext
                        src={item.thumbnail?.url ?? "/thumbnail.png"}
                        alt={item.thumbnail?.alt || item.title}
                        width={600}
                        height={420}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#5a6796] via-[#405083]/34 to-transparent" />

                      <div className="relative flex h-full flex-col justify-end p-3.5">
                        <span className="mb-2 inline-flex w-fit rounded-[10px] bg-[#ffc400] px-3 py-1 text-sm font-bold text-[#1d3f90]">
                          {item.categories[0]?.name || "Tin nổi bật"}
                        </span>

                        <h4 className="line-clamp-2 text-[16px] font-bold leading-[1.32] text-white transition-colors duration-200 group-hover:text-[#f7b500] md:text-[17px]">
                          {item.title}
                        </h4>

                        <p className="mt-1.5 text-[15px] font-medium text-white/78 md:text-base">
                          {dayjs(item.publishedAt || item.createdAt).format(
                            "DD/MM/YYYY",
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={`featured-placeholder-${index}`}
                    className="rounded-[20px] bg-[#dde5f3] shadow-[0_16px_32px_rgba(28,52,120,0.1)] min-h-[165px]"
                  >
                    <div className="flex h-full min-h-[165px] flex-col justify-end p-3.5">
                      <span className="mb-2 h-7 w-24 rounded-[10px] bg-white/80" />
                      <div className="h-6 w-5/6 rounded bg-white/90" />
                      <div className="mt-2 h-4 w-24 rounded bg-white/70" />
                    </div>
                  </div>
                ),
              )}
            </div>

            <HorizontalAdBanner />
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedNews;
