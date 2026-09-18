'use client';

import dayjs from "dayjs";
import EventsCalendar from "@/app/(main)/(home)/components/events-calendar";
import SidebarAdvertisements from "@/components/shared/sidebar-advertisements";
import { findDisplayCategoryForPost } from "../data";
import { renderPostSummary } from "./components/post-summary-content";
import PostContent from "@/components/shared/post-content";
import EventInfoCard from "./components/event-info-card";
import type { DynamicCategoryRouteItem } from "../types";
import type { DynamicPostItem } from "@/api/vcci-news/types/post";

type NewsDetailPageProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem | null;
  allCategories: DynamicCategoryRouteItem[];
};

export default function NewsDetailPage({
  post,
  category,
  allCategories,
}: NewsDetailPageProps) {
  const publishedDate = dayjs(post.release_at ?? post.published_at ?? post.created_at).format("DD/MM/YYYY");
  const primaryCategory = findDisplayCategoryForPost(post, category, allCategories)?.name || category?.name || "Tin tức";

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-4 lg:pb-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-12">
          <main className="min-w-0">

            {/* badge */}
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-[#eaf0ff] px-2.5 py-1 font-semibold text-[#1f4fa3]">
                {primaryCategory}
              </span>
              <span className="text-[#9aa3ad]">{publishedDate}</span>
            </div>

            {/* header */}
            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
              {post.title}
            </h1>
            <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

            {/* summary */}
            {post.summary ? (
              <div className="mt-5 max-w-4xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
                {renderPostSummary(post.summary)}
              </div>
            ) : null}

            {/* event info */}
            <EventInfoCard post={post} />

            {/* content */}
            <div className="mt-7 rounded-3xl bg-white px-4 py-5 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 sm:py-6 lg:px-10">
              <PostContent post={post} />
            </div>
          </main>

          {/* sidebar */}
          <aside className="space-y-5 xl:pt-0">
            <EventsCalendar compact className="xl:w-full xl:min-w-0" />
            <SidebarAdvertisements count={3} startIndex={0} />
          </aside>
        </div>
      </div>
    </div>
  );
}
