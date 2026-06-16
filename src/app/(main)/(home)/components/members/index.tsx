'use client';

import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import ImageNext from "@/components/shared/image-next";
import memberImages from "@/constants/memberImages";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const MEMBER_CONNECTION_FALLBACK_IMAGE = "/home/20-2048x1365.webp";
const FEATURED_MEMBER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations?pageSize=12&filters=users.status_id%3D%3D36ca1cc5-7b6e-4f9f-b973-69c5207deb62&sortField=created_at&sortOrder=ASC";
const FEATURED_MEMBER_MORE_URL =
  "https://vccihcm.vn/giao-thuong-b2b?filters=users.status_id+%3D%3D+36ca1cc5-7b6e-4f9f-b973-69c5207deb62&sortField=created_at&sortOrder=ASC";
const VCCI_HCM_ORIGIN = "https://vccihcm.vn";

type FeaturedMember = {
  id: string;
  name: string;
  avatar?: string | null;
};

type FeaturedMembersResponse = {
  responseData?: {
    rows?: FeaturedMember[];
  };
};

const resolveMemberImage = (avatar: string | null | undefined, index: number) => {
  if (avatar?.startsWith("http://") || avatar?.startsWith("https://")) {
    return avatar;
  }

  if (avatar?.startsWith("/")) {
    return `${VCCI_HCM_ORIGIN}${avatar}`;
  }

  return memberImages[index % memberImages.length] ?? "/img-error.png";
};

const fallbackMembers: FeaturedMember[] = Array.from({ length: 9 }, (_, index) => ({
  id: `fallback-member-${index}`,
  name: `Hội viên tiêu biểu ${index + 1}`,
  avatar: memberImages[index % memberImages.length],
}));

function Members() {
  const { memberConnectionPosts, categoryLinks, categoryNames } = useHomePosts();
  const [featuredMembers, setFeaturedMembers] = useState<FeaturedMember[]>([]);
  const featuredConnection = memberConnectionPosts[0];
  const sectionLink =
    categoryLinks.get(categoryNames.ketNoiHoiVien.toLowerCase()) ?? "/hoi-vien/ket-noi-hoi-vien";
  const connectionImage =
    featuredConnection?.thumbnail?.url ?? MEMBER_CONNECTION_FALLBACK_IMAGE;
  const connectionImageAlt =
    featuredConnection?.thumbnail?.alt || featuredConnection?.title || "VCCI HCM";
  const displayMembers = featuredMembers.length > 0 ? featuredMembers : fallbackMembers;

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedMembers = async () => {
      try {
        const response = await fetch(FEATURED_MEMBER_API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Cannot load featured members: ${response.status}`);
        }

        const data = (await response.json()) as FeaturedMembersResponse;
        const rows = data.responseData?.rows ?? [];

        if (isMounted) {
          setFeaturedMembers(rows.slice(0, 12));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeaturedMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="flex flex-col gap-5 pb-8 xl:flex-row xl:items-stretch">
      <aside className="flex-1 rounded-[22px] bg-[#f7b500] p-4 shadow-[0_18px_34px_rgba(247,181,0,0.18)] md:p-5">
        <div className="flex items-start justify-between gap-3">
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
            className="pt-1 text-sm font-semibold text-[#1e2f5e] transition-colors hover:text-[#20449a]"
          >
            Xem thêm
          </Link>
        </div>

        <div className="mt-4 border-t border-[#e7aa00] pt-5" />

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
          {displayMembers.map((member, index) => (
            <SwiperSlide
              key={member.id}
              className="!h-auto !w-full md:!w-[calc(50%-8px)] xl:!w-[calc(33.333%-10.67px)]"
            >
              <article className="rounded-[20px] bg-white p-[7px] shadow-[0_10px_22px_rgba(158,114,0,0.16)]">
                <div className="flex h-[210px] items-center justify-center overflow-hidden rounded-[14px] bg-white px-4 py-5">
                  <div className="flex h-full w-full max-w-[260px] items-center justify-center">
                    <ImageNext
                      src={resolveMemberImage(member.avatar, index)}
                      alt={member.name}
                      width={260}
                      height={180}
                      className="h-[180px] w-[260px] max-w-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="mt-3 line-clamp-2 min-h-[40px] px-1 text-center text-sm font-semibold leading-5 text-[#1e2f5e]">
                  {member.name}
                </h3>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </aside>

      <aside className="w-full xl:w-[31%] xl:min-w-[320px]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="client-section-title uppercase text-[#24469c]">
              Kết nối hội viên
            </h2>
            <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
          </div>
        </div>

        <Link
          href={sectionLink}
          className="block overflow-hidden rounded-[20px] shadow-[0_16px_32px_rgba(31,59,124,0.12)]"
        >
          <div className="aspect-[1.25/1] overflow-hidden rounded-[20px]">
            <ImageNext
              src={connectionImage}
              alt={connectionImageAlt}
              width={520}
              height={420}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      </aside>
    </section>
  );
}

export default Members;
