'use client';

import dayjs from "dayjs";
import ImageNext from "@/components/shared/image-next";
import ListCategory from "@/components/base/list-category";
import EventsCalendar from "@/app/(main)/(home)/components/events-calendar";
import { buildDynamicCategoryMenu } from "./data";
import StructuredPostContent from "./StructuredPostContent";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "./types";

type ArticleDetailPageProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem | null;
  allCategories: DynamicCategoryRouteItem[];
};

export default function ArticleDetailPage({
  post,
  category,
  allCategories,
}: ArticleDetailPageProps) {
  const publishedDate = dayjs(
    post.release_at ?? post.published_at ?? post.created_at,
  ).format("DD/MM/YYYY");
  const primaryCategory = post.categories[0]?.name || category?.name || "Tin tá»©c";
  const categoryMenu = category ? buildDynamicCategoryMenu(category, allCategories) : [];

  return (
    <div className="min-h-screen bg-white">
      {/* {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null} */}
      <div className="container mx-auto px-4 py-4 lg:pb-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
          <main className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-[#eaf0ff] px-2.5 py-1 font-semibold text-[#1f4fa3]">
                {primaryCategory}
              </span>
              <span className="text-[#9aa3ad]">{publishedDate}</span>
            </div>

            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
              {post.title}
            </h1>
            <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

            {post.summary ? (
              <p className="mt-5 max-w-4xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
                {post.summary}
              </p>
            ) : null}

            <div className="mt-7 rounded-3xl bg-white px-4 py-5 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 sm:py-6 lg:px-10">
              <div className="article-detail-content prose tiptap max-w-none overflow-hidden">
                <StructuredPostContent post={post} />
              </div>
            </div>

            <div className="article-detail-styles">
              <style jsx global>{`
                .article-detail-content {
                  color: #1f2937;
                  font-size: 16px;
                  line-height: 1.85;
                }

                .article-detail-content p,
                .article-detail-content div {
                  margin: 0 0 18px;
                }

                .article-detail-content h1,
                .article-detail-content h2,
                .article-detail-content h3,
                .article-detail-content h4,
                .article-detail-content h5,
                .article-detail-content h6 {
                  margin: 0 0 18px;
                  color: #111827;
                  font-weight: 700;
                  line-height: 1.45;
                }

                .article-detail-content img {
                  display: block;
                  width: 100%;
                  max-width: 100%;
                  height: auto;
                  margin: 24px auto 10px;
                  border-radius: 14px;
                }

                .article-detail-content figure {
                  margin: 28px 0;
                }

                .article-detail-content figcaption,
                .article-detail-content .wp-caption-text {
                  margin-top: 10px;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                  text-align: center;
                }

                .article-detail-content a {
                  color: #14519f;
                  font-weight: 600;
                }

                .article-detail-content ul,
                .article-detail-content ol {
                  margin: 18px 0;
                  padding-left: 24px;
                }

                .article-detail-content li {
                  margin: 8px 0;
                }
              `}</style>
            </div>
          </main>

          <aside className="space-y-5 xl:pt-0">
            <EventsCalendar compact className="xl:w-full xl:min-w-0" />
            <div className="overflow-hidden rounded-[22px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]">
              <div className="relative min-h-[390px] bg-[#1f334f]">
                <ImageNext
                  src="/banner.webp"
                  alt="Đối tác quảng bá"
                  width={640}
                  height={760}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-liner-to-t from-[#14213d]/92 via-[#14213d]/28 to-transparent" />
                <div className="absolute bottom-8 left-7 right-7 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    Đối tác quảng bá
                  </div>
                  <div className="mt-3 text-2xl font-bold leading-tight">
                    Business Combo cho hội viên doanh nghiệp
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

