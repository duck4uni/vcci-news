"use client";

import { getOrganizations } from "@/api/vcci-hcm/endpoints/organizations";
import type { Organization } from "@/api/vcci-hcm/models";
import memberImages from "@/constants/memberImages";
import { MOCK_FEATURED_MEMBERS_RESPONSE } from "@/mockdata/bff-fallback";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const VCCI_HCM_SITE_URL = "https://vccihcm.vn";
const FEATURED_MEMBER_MORE_URL =
  `${VCCI_HCM_SITE_URL}/giao-thuong-b2b?filters=users.status_id+%3D%3D+36ca1cc5-7b6e-4f9f-b973-69c5207deb62&sortField=created_at&sortOrder=ASC`;

const MOCK_FEATURED_MEMBER_ROWS =
  MOCK_FEATURED_MEMBERS_RESPONSE.responseData?.rows as unknown as Organization[] ?? [];

const resolveMemberImage = (avatar: string | null | undefined, index: number) => {
  if (avatar?.startsWith("http://") || avatar?.startsWith("https://")) {
    return avatar;
  }

  if (avatar?.startsWith("/")) {
    return `${VCCI_HCM_SITE_URL}${avatar}`;
  }

  return memberImages[index % memberImages.length] ?? "/img-error.png";
};

const getMemberDetailUrl = (orgLink: string | null | undefined) => {
  if (orgLink) {
    return `${VCCI_HCM_SITE_URL}/giao-thuong-b2b/doanh-nghiep/${orgLink}`;
  }
  return null;
};

/** Khối "Hội viên tiêu biểu": dữ liệu từ Organizations API, bắt buộc client vì Swiper autoplay. */
export function FeaturedMembers() {
  const { data: organizationsResponse, isLoading: featuredMembersLoading } =
    useQuery<Organization[] | undefined>({
      queryKey: [
        "featured-members",
        "status-36ca1cc5-7b6e-4f9f-b973-69c5207deb62",
      ] as const,
      queryFn: async () => {
        const response = await getOrganizations({
          filters: "users.status_id==36ca1cc5-7b6e-4f9f-b973-69c5207deb62",
          pageSize: "12",
          sortField: "created_at",
          sortOrder: "DESC",
        });
        const rows = ((response as any)?.responseData?.rows ?? []) as Organization[];
        return rows.length > 0 ? rows : MOCK_FEATURED_MEMBER_ROWS;
      },
      staleTime: 60 * 1000,
    });

  const featuredMembers = organizationsResponse ?? MOCK_FEATURED_MEMBER_ROWS;
  const displayMembers = featuredMembers.slice(0, 9);

  return (
    <aside className="flex-1 rounded-[16px] bg-[#f7b500] p-4 shadow-[0_18px_34px_rgba(247,181,0,0.18)] md:p-5">
      <div className="flex items-center justify-between gap-3 pb-10">
        <div>
          <h2 className="client-section-title uppercase text-[#20449a]">
            Hội viên tiêu biểu
          </h2>
          <div className="mt-2.5 h-1 w-10 rounded-full bg-white" />
        </div>

        <Link
          href={FEATURED_MEMBER_MORE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[#1e2f5e] transition-colors hover:text-[#20449a]"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      {featuredMembersLoading ? (
        <div className="rounded-[14px] bg-white/40 px-5 py-10 text-center text-sm text-[#1e2f5e]/70">
          Đang tải dữ liệu...
        </div>
      ) : displayMembers.length === 0 ? (
        <div className="rounded-[14px] bg-white/40 px-5 py-10 text-center text-sm text-[#1e2f5e]/70">
          Chưa có thông tin.
        </div>
      ) : (
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
          {displayMembers.map((member, index) => {
            const detailUrl = getMemberDetailUrl(member.org_link);
            return (
              <SwiperSlide
                key={member.id}
                className="!h-auto !w-full md:!w-[calc(50%-8px)] xl:!w-[calc(33.333%-10.67px)]"
              >
                <article className="rounded-[14px] bg-white p-[7px] shadow-[0_10px_22px_rgba(158,114,0,0.16)]">
                  {detailUrl ? (
                    <a
                      href={detailUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <div className="flex h-[210px] items-center justify-center overflow-hidden rounded-[14px] bg-white px-4 py-5">
                        <div className="flex h-full w-full max-w-[260px] items-center justify-center">
                          <Image
                            src={resolveMemberImage(member.avatar, index)}
                            alt={member.name ?? ""}
                            width={260}
                            height={180}
                            className="h-[180px] w-[260px] max-w-full object-contain"
                          />
                        </div>
                      </div>
                      <h3 className="mt-3 line-clamp-2 min-h-[40px] px-1 text-center text-sm font-semibold leading-5 text-[#1e2f5e] transition-colors hover:text-[#20449a]">
                        {member.name}
                      </h3>
                    </a>
                  ) : (
                    <>
                      <div className="flex h-[210px] items-center justify-center overflow-hidden rounded-[14px] bg-white px-4 py-5">
                        <div className="flex h-full w-full max-w-[260px] items-center justify-center">
                          <Image
                            src={resolveMemberImage(member.avatar, index)}
                            alt={member.name ?? ""}
                            width={260}
                            height={180}
                            className="h-[180px] w-[260px] max-w-full object-contain"
                          />
                        </div>
                      </div>
                      <h3 className="mt-3 line-clamp-2 min-h-[40px] px-1 text-center text-sm font-semibold leading-5 text-[#1e2f5e]">
                        {member.name}
                      </h3>
                    </>
                  )}
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </aside>
  );
}
