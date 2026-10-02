"use client";

import { getOrganizations } from "@/api/vcci-hcm/endpoints/organizations";
import type { Organization } from "@/api/vcci-hcm/models";
import partnerImages from "@/constants/partnerImages";
import { MOCK_PARTNERS_RESPONSE } from "@/mockdata/bff-fallback";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const VCCI_HCM_SITE_URL = "https://vccihcm.vn";

const resolvePartnerImage = (avatar: string | null | undefined, index: number) => {
  if (avatar?.startsWith("http://") || avatar?.startsWith("https://")) {
    return avatar;
  }

  if (avatar?.startsWith("/")) {
    return `${VCCI_HCM_SITE_URL}${avatar}`;
  }

  return partnerImages[index % partnerImages.length] ?? "/img-error.png";
};

const MOCK_PARTNER_ROWS =
  MOCK_PARTNERS_RESPONSE.responseData.rows as unknown as Organization[];

export function Partners() {
  const { data: partnersResponse } = useQuery<Organization[] | undefined>({
    queryKey: ["home-partners", "type-sponsor"] as const,
    queryFn: async () => {
      const response = await getOrganizations({
        filters: "type==SPONSOR",
        pageSize: "12",
        sortField: "sort_order",
        sortOrder: "ASC",
      });
      const rows = ((response as any)?.responseData?.rows ?? []) as Organization[];
      return rows.length > 0 ? rows : MOCK_PARTNER_ROWS;
    },
    staleTime: 60 * 1000,
  });

  const partners = (partnersResponse ?? MOCK_PARTNER_ROWS).slice(0, 12);

  return (
    <aside className="flex w-full flex-col xl:w-[43%]">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Đối tác
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>
      </div>

      {partners.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          observer
          observeParents
          updateOnWindowResize
          slidesPerView="auto"
          spaceBetween={16}
          className="w-full"
        >
          {partners.map((partner, index) => (
            <SwiperSlide
              key={partner.id}
              className="!h-auto !w-full sm:!w-[calc(50%-8px)] xl:!w-[calc(33.333%-10.67px)]"
            >
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <div className="flex h-[96px] items-center justify-center rounded-[16px] border border-[#edf1f7] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(31,59,124,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(31,59,124,0.1)] xl:h-[151px]">
                    <Image
                      src={resolvePartnerImage(partner.avatar, index)}
                      alt={partner.name ?? ""}
                      width={140}
                      height={72}
                      className="max-h-full w-full object-contain"
                    />
                  </div>
                </a>
              ) : (
                <div className="flex h-[96px] items-center justify-center rounded-[16px] border border-[#edf1f7] bg-white px-5 py-4 shadow-[0_8px_20px_rgba(31,59,124,0.05)] xl:h-[151px]">
                  <Image
                    src={resolvePartnerImage(partner.avatar, index)}
                    alt={partner.name ?? ""}
                    width={140}
                    height={72}
                    className="max-h-full w-full object-contain"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="rounded-2xl border border-[#edf1f7] bg-white px-5 py-10 text-center text-sm text-gray-500">
          Chưa có thông tin.
        </div>
      )}
    </aside>
  );
}