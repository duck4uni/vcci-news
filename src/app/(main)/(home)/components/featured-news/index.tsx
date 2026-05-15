'use client';

import ImageNext from "@/components/shared/image-next";
import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import dayjs from "dayjs";
import { ChevronRight, Mail, Phone } from "lucide-react";
import Link from "next/link";

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

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.14fr)_minmax(0,0.96fr)]">
          {primaryItem ? (
            <Link
              href={primaryItem.externalLink}
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
                    {primaryItem.categories[0]?.name || "Tin nổi bật"}
                  </span>

                  <h3 className="max-w-3xl text-[20px] font-bold leading-[1.28] text-white md:text-[28px] xl:text-[32px]">
                    {primaryItem.title}
                  </h3>

                  <p className="mt-2 text-base font-medium text-white/78 md:text-[17px]">
                    {dayjs(primaryItem.publishedAt || primaryItem.createdAt).format(
                      "DD/MM/YYYY",
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative min-h-[260px] overflow-hidden rounded-[24px] bg-[#e9eef8] shadow-[0_18px_38px_rgba(28,52,120,0.12)] md:min-h-[320px] xl:min-h-[350px]">
              <div className="flex h-full min-h-[260px] flex-col justify-end p-4 md:min-h-[320px] md:p-5 xl:min-h-[350px]">
                <span className="mb-2 h-8 w-28 rounded-[10px] bg-white/80" />
                <div className="h-8 w-3/4 rounded bg-white/90 md:h-10" />
                <div className="mt-2 h-5 w-28 rounded bg-white/70" />
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              {secondarySlots.map((item, index) =>
                item ? (
                  <Link
                    key={item.id}
                    href={item.externalLink}
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
                          {item.categories[0]?.name || "Tin nổi bật"}
                        </span>

                        <h4 className="line-clamp-2 text-[16px] font-bold leading-[1.32] text-white md:text-[17px]">
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
                    className="min-h-[195px] rounded-[20px] bg-[#dde5f3] shadow-[0_16px_32px_rgba(28,52,120,0.1)] md:min-h-[205px] xl:min-h-[215px]"
                  >
                    <div className="flex h-full min-h-[195px] flex-col justify-end p-3.5 md:min-h-[205px] xl:min-h-[215px]">
                      <span className="mb-2 h-7 w-24 rounded-[10px] bg-white/80" />
                      <div className="h-6 w-5/6 rounded bg-white/90" />
                      <div className="mt-2 h-4 w-24 rounded bg-white/70" />
                    </div>
                  </div>
                ),
              )}
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
