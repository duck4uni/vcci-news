'use client';

import dayjs from "dayjs";
import ImageNext from "@/components/shared/image-next";
import AppEditorContent from "@/components/shared/editor-content";
import ListCategory from "@/components/base/list-category";
import EventsCalendar from "@/app/(main)/(home)/components/events-calendar";
import { Calendar, MapPin, Clock, DollarSign, Users, CreditCard } from "lucide-react";
import { buildDynamicCategoryMenu, findDisplayCategoryForPost } from "./data";
import StructuredPostContent from "./StructuredPostContent";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "./types";

const formatDate = (value: string | null) =>
  value ? dayjs(value).format("DD/MM/YYYY") : "";

const formatDateTime = (value: string | null) =>
  value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "";

const isEventOrTraining = (post: DynamicPostItem) => {
  const eventCategories = ["Sự kiện", "Đào tạo", "su-kien", "dao-tao", "su_kien", "dao_tao"];
  return post.categories.some((cat) =>
    eventCategories.some(
      (key) =>
        cat.name.toLowerCase().includes(key.toLowerCase()) ||
        (cat.slug && cat.slug.toLowerCase().includes(key.toLowerCase()))
    )
  );
};

const hasEventInfo = (post: DynamicPostItem) => {
  return (
    post.started_at ||
    post.ended_at ||
    post.registration_deadline ||
    post.location
  );
};

const EventInfoCard = ({ post }: { post: DynamicPostItem }) => {
  if (!isEventOrTraining(post) || !hasEventInfo(post)) return null;

  const startedAt = post.started_at;
  const endedAt = post.ended_at;
  const registrationDeadline = post.registration_deadline;

  return (
    <div className="mt-7 rounded-2xl border border-[#e3ebf8] bg-linear-to-br from-[#f8faff] to-white p-5 shadow-[0_8px_24px_rgba(36,70,156,0.1)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#24469c]">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#24469c]">Thông tin sự kiện</h3>
          <p className="text-xs text-[#7f8eab]">Event Information</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Row 1: Hạn đăng ký | Chi phí */}
        {registrationDeadline && (
          <div className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#f5a400]">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Hạn đăng ký</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-[#1f3768]">
              {formatDateTime(registrationDeadline)}
            </p>
          </div>
        )}

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#24469c]">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Chi phí</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1f3768]">
            {post.participation_fee || "Miễn phí"}
          </p>
        </div>

        {/* Row 2: Ngày bắt đầu/kết thúc | Địa điểm */}
        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#24469c]">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Thời gian</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1f3768]">
            {startedAt
              ? endedAt
                ? `${formatDate(startedAt)} - ${formatDate(endedAt)}`
                : formatDate(startedAt)
              : endedAt
                ? formatDate(endedAt)
                : "-"}
          </p>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2 text-[#e22f5a]">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Địa điểm</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1f3768] line-clamp-2">
            {post.location || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

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
  const primaryCategory =
    findDisplayCategoryForPost(post, category, allCategories)?.name ||
    category?.name ||
    "Tin tá»©c";
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
              <div className="mt-5 max-w-4xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
                <AppEditorContent value={post.summary} />
              </div>
            ) : null}

            <EventInfoCard post={post} />

            <div className="mt-7 rounded-3xl bg-white px-4 py-5 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 sm:py-6 lg:px-10">
              <div className="article-detail-content prose tiptap max-w-none overflow-hidden">
                <StructuredPostContent post={post} />
              </div>
            </div>

            <div className="article-detail-styles">
              <style jsx global>{`
                .article-detail-content {
                  color: #1f2937;
                  line-height: 1.85;
                  width: 100%;
                  max-width: 100%;
                }

                .article-detail-content p,
                .article-detail-content div {
                  margin: 0 0 18px;
                  max-width: 100% !important;
                  box-sizing: border-box;
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

                .article-detail-content :is(p, div, span, li, a, strong, em, u, s) {
                  font-family: inherit;
                }

                .article-detail-content img {
                  display: block;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: auto !important;
                  margin: 24px auto 10px;
                  border-radius: 14px;
                }

                .article-detail-content figure {
                  display: block !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  margin: 28px 0;
                  text-align: center;
                }

                .article-detail-content .article-content,
                .article-detail-content .article-content_toc,
                .article-detail-content table,
                .article-detail-content iframe {
                  width: 100% !important;
                  max-width: 100% !important;
                  box-sizing: border-box;
                }

                .article-detail-content table {
                  display: table;
                  table-layout: fixed;
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

