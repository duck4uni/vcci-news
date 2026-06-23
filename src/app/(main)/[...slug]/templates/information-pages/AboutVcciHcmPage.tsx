'use client';

import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { Play, ShieldCheck, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useCustomClient } from "@/api/mutator/custom-client";
import ImageNext from "@/components/shared/image-next";
import { fetchClientVideos } from "@/lib/api/videos";
import { buildDynamicPostHref, buildVisibleNewsFilters } from "../data";
import StructuredPostContent from "../StructuredPostContent";
import type { DynamicPostItem } from "../types";

const ABOUT_HIGHLIGHTS = [
  {
    key: "vision",
    title: "Tầm nhìn",
    description:
      "Trở thành tổ chức hàng đầu đại diện cho cộng đồng doanh nghiệp tại phía Nam, kiến tạo môi trường kinh doanh thuận lợi và bền vững.",
    icon: Target,
    featured: false,
  },
  {
    key: "mission",
    title: "Sứ mệnh",
    description:
      "Nâng cao năng lực cạnh tranh của cộng đồng doanh nghiệp thông qua các hoạt động đối thoại, xúc tiến và xây dựng năng lực, tạo cầu nối vững chắc.",
    icon: Zap,
    featured: true,
  },
  {
    key: "values",
    title: "Giá trị cốt lõi",
    bullets: ["Uy tín - Minh bạch", "Chuyên nghiệp", "Đổi mới sáng tạo", "Tinh thần cộng đồng"],
    icon: ShieldCheck,
    featured: false,
  },
] as const;

const ACTIVITY_AREAS = [
  "TP. Hồ Chí Minh",
  // "Bình Dương",
  // "Bình Phước",
  "Đồng Nai",
  "Lâm Đồng",
  "Tây Ninh",
] as const;

const TIN_VCCI_CATEGORY_ID = "b89b2ba6-a699-47cb-87e4-0643aea549a9";

type TinVcciApiRow = {
  id?: string | null;
  title?: string | null;
  external_link?: string | null;
  published_at?: string | null;
  release_at?: string | null;
  created_at?: string | null;
  thumbnail?: {
    path?: string | null;
    original?: string | null;
    url?: string | null;
  } | null;
};

type TinVcciApiEnvelope = {
  responseData?: {
    rows?: TinVcciApiRow[];
  };
};

type AboutVcciHcmPageProps = {
  post: DynamicPostItem;
};

export default function AboutVcciHcmPage({
  post,
}: AboutVcciHcmPageProps) {
  const videosQuery = useQuery({
    queryKey: ["about-vcci-hcm-video"],
    queryFn: () => fetchClientVideos({ page: 1, pageSize: 1 }),
    staleTime: 60 * 1000,
  });
  const tinVcciQuery = useQuery({
    queryKey: ["about-vcci-hcm-tin-vcci"],
    queryFn: async () => {
      const query = new URLSearchParams({
        page: "1",
        pageSize: "3",
        sortField: "release_at",
        sortOrder: "desc",
        filters: buildVisibleNewsFilters([`category.id==${TIN_VCCI_CATEGORY_ID}`]),
      });

      const response = await useCustomClient<TinVcciApiEnvelope>(`/post?${query.toString()}`);

      return (response.responseData?.rows ?? []).map((item) => ({
        id: String(item.id ?? ""),
        title: String(item.title ?? "").trim(),
        externalLink: buildDynamicPostHref(item.external_link?.trim() || "#", item.id ? String(item.id) : ""),
        publishedAt: String(item.published_at ?? item.release_at ?? item.created_at ?? ""),
        thumbnailUrl:
          item.thumbnail?.url?.trim() ||
          item.thumbnail?.path?.trim() ||
          item.thumbnail?.original?.trim() ||
          "/thumbnail.png",
        thumbnailAlt: String(item.title ?? "").trim() || "Tin VCCI",
      }));
    },
    staleTime: 60 * 1000,
  });

  const introVideo = videosQuery.data?.rows[0] ?? null;
  const tinVcciItems = tinVcciQuery.data ?? [];

  return (
    <>
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0">
          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            Giới thiệu <span className="text-[#2f57ff]">chung</span>
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          {post.summary ? (
            <p className="mt-5 max-w-6xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
              {post.summary}
            </p>
          ) : null}

          <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="about-vcci-page-content page-detail-content prose tiptap max-w-none overflow-hidden">
              <StructuredPostContent post={post} />
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#edf1f6] bg-[#fbfcff] px-6 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.05)] lg:sticky lg:top-24">
          <h2 className="text-[30px] font-bold leading-tight text-[#1f2a44]">
            Khu vực hoạt động
          </h2>
          <div className="mt-6 space-y-4">
            {ACTIVITY_AREAS.map((item) => (
              <div key={item} className="flex items-center gap-3 text-[18px] text-[#58667d]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#2f6ce5]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <style jsx global>{`
        .about-vcci-page-content figure {
          width: 100% !important;
          max-width: 100% !important;
          margin: 28px 0 !important;
          text-align: center;
        }

        .about-vcci-page-content img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin-left: auto !important;
          margin-right: auto !important;
          object-fit: contain;
        }
      `}</style>

      <section className="mt-10 space-y-10 md:mt-12 md:space-y-12">
        <div>
          <div className="text-center">
            <h2 className="text-[30px] font-bold leading-tight text-[#1f2a44] md:text-[38px]">
              Tầm nhìn, <span className="text-[#2f57ff]">Sứ mệnh</span> &{" "}
              <span className="text-[#f0a400]">Giá trị</span>
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#f5a400]" />
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {ABOUT_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.key}
                  className={[
                    "rounded-3xl border px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)]",
                    item.featured
                      ? "border-[#1f56b8] bg-linear-to-br from-[#1d56b7] to-[#21467f] text-white"
                      : "border-[#edf1f6] bg-white text-[#24415f]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-2xl",
                      item.featured ? "bg-white/10 text-[#ffbf2b]" : "bg-[#eff4ff] text-[#7ea1eb]",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3
                    className={[
                      "mt-5 text-[24px] font-bold",
                      item.featured ? "text-white" : "text-[#1d2e4f]",
                    ].join(" ")}
                  >
                    {item.title}
                  </h3>

                  {"description" in item ? (
                    <p
                      className={[
                        "mt-3 text-[15px] leading-7",
                        item.featured ? "text-white/82" : "text-[#5f6f86]",
                      ].join(" ")}
                    >
                      {item.description}
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-2.5 text-[15px] text-[#5f6f86]">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a400]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center">
          <div className="space-y-5">
            <div>
              <h2 className="text-[28px] font-bold leading-tight text-[#1f2a44] md:text-[34px]">
                Video về <span className="text-[#2f57ff]">VCCI-HCM</span>
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-[#f5a400]" />
            </div>

            <p className="max-w-xl text-[15px] leading-7 text-[#66758d]">
              Khám phá hoạt động của Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh TP. Hồ Chí Minh qua video giới thiệu chính thức.
            </p>

            <div className="grid max-w-md grid-cols-3 gap-3">
              {[
                { value: "20+", label: "Năm hoạt động" },
                { value: "5000+", label: "Hội viên" },
                { value: "6", label: "Tỉnh thành" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[18px] border border-[#edf1f6] bg-white px-4 py-3 text-center shadow-[0_12px_28px_rgba(17,24,39,0.04)]"
                >
                  <div className="text-[28px] font-bold leading-none text-[#2450b5]">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-[13px] text-[#6b7a91]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] bg-[#dde6f5] shadow-[0_20px_44px_rgba(29,65,138,0.18)]">
            {introVideo ? (
              <a
                href={introVideo.watchUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-video"
              >
                <ImageNext
                  src={introVideo.thumbnail}
                  alt={introVideo.name}
                  width={1200}
                  height={675}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#183b78]/78 via-[#365f9d]/38 to-[#183b78]/24" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-18 w-18 items-center justify-center rounded-full bg-white/90 text-[#24469c] shadow-[0_18px_38px_rgba(0,0,0,0.18)]">
                    <Play className="ml-1 h-8 w-8 fill-current" />
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 rounded-full bg-[#1b2e4f]/72 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {introVideo.name}
                </div>
              </a>
            ) : (
              <div className="flex aspect-video items-center justify-center bg-[#eef3fb] px-6 text-center text-[#6b7a91]">
                Đang cập nhật video giới thiệu VCCI-HCM.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-bold leading-tight text-[#2450b5] md:text-[32px]">
                TIN VCCI
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-[#f5a400]" />
            </div>

            <Link
              href="/thong-tin-truyen-thong/tin-vcci"
              className="text-sm font-semibold text-[#2450b5] transition-colors hover:text-[#173f9f]"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid pb-6 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tinVcciItems.map((item) => (
              <Link
                key={item.id}
                href={item.externalLink}
                className="group overflow-hidden rounded-[22px] bg-white shadow-[0_18px_38px_rgba(28,52,120,0.16)] transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[1.28] overflow-hidden">
                  <ImageNext
                    src={item.thumbnailUrl}
                    alt={item.thumbnailAlt}
                    width={720}
                    height={520}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1d2f56]/90 via-[#1d2f56]/28 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="inline-flex rounded-[10px] bg-[#f5c21b] px-2.5 py-1 text-xs font-bold text-[#1d3f90]">
                      Tin VCCI
                    </span>
                    <h3 className="mt-3 line-clamp-2 text-[17px] font-bold leading-6 text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/78">
                      {dayjs(item.publishedAt).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
