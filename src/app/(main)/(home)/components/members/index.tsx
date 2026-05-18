'use client';

import ImageNext from "@/components/shared/image-next";
import { useHomePosts } from "@/app/(main)/(home)/lib/use-home-posts";
import memberImages from "@/constants/memberImages";
import Link from "next/link";

const MEMBER_CONNECTION_FALLBACK_IMAGE = "/home/20-2048x1365.webp";

function Members() {
  const { memberConnectionPosts, categoryLinks, categoryNames } = useHomePosts();
  const featuredConnection = memberConnectionPosts[0];
  const sectionLink =
    categoryLinks.get(categoryNames.ketNoiHoiVien.toLowerCase()) ?? "/hoi-vien/ket-noi-hoi-vien";
  const connectionImage =
    featuredConnection?.thumbnail?.url ?? MEMBER_CONNECTION_FALLBACK_IMAGE;
  const connectionImageAlt =
    featuredConnection?.thumbnail?.alt || featuredConnection?.title || "VCCI HCM";

  return (
    <section className="flex flex-col gap-5 pb-8 xl:flex-row xl:items-stretch">
      <aside className="flex-1 rounded-[22px] bg-[#f7b500] p-4 shadow-[0_18px_34px_rgba(247,181,0,0.18)] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="client-section-title uppercase text-[#20449a]">
              Hội viên tiêu biểu
            </h2>
            <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-white" />
          </div>

          <Link
            href={sectionLink}
            className="pt-1 text-sm font-semibold text-[#1e2f5e] transition-colors hover:text-[#20449a]"
          >
            Xem thêm
          </Link>
        </div>

        <div className="mt-4 border-t border-[#e7aa00] pt-5" />

        <div className="grid gap-4 sm:grid-cols-3">
          {memberImages.slice(0, 3).map((src, index) => (
            <div
              key={src}
              className="rounded-[24px] bg-white p-[7px] shadow-[0_10px_22px_rgba(158,114,0,0.16)]"
            >
              <div className="flex aspect-[1.06/1] items-center justify-center overflow-hidden rounded-[18px] bg-[#f4f7fb] px-4 py-5">
                <ImageNext
                  src={src}
                  alt={`Hội viên tiêu biểu ${index + 1}`}
                  width={320}
                  height={220}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
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
