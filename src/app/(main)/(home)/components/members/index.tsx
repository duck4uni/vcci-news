'use client';

import ImageNext from "@/components/shared/image-next";
import memberImages from "@/constants/memberImages";
import {
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import Link from "next/link";

const memberConnectionItems = getAdminNewsSeed()
  .filter(
    (item) =>
      item.type === "tintuc" &&
      !item.is_hidden &&
      (item.category_ids.includes("cat-member-connection") ||
        item.tagsearch_values.some((tag) => tag.toLowerCase().includes("kết nối hội viên"))),
  )
  .sort(
    (left, right) =>
      new Date(right.published_at || right.created_at).getTime() -
      new Date(left.published_at || left.created_at).getTime(),
  );

function Members() {
  const featuredConnection = memberConnectionItems[0];

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
            href="/danh-ba-hoi-vien"
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

        {featuredConnection ? (
          <Link
            href="/danh-ba-hoi-vien"
            className="block overflow-hidden rounded-[20px] shadow-[0_16px_32px_rgba(31,59,124,0.12)]"
          >
            <div className="aspect-[1.25/1] overflow-hidden rounded-[20px]">
              <ImageNext
                src={featuredConnection.thumbnail?.url ?? "/thumbnail.png"}
                alt={featuredConnection.thumbnail?.alt || featuredConnection.title}
                width={520}
                height={420}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        ) : null}
      </aside>
    </section>
  );
}

export default Members;
