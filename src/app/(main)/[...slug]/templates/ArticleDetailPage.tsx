'use client';

import dayjs from "dayjs";
import parse from "html-react-parser";
import EventCalendar from "@/components/base/event-calendar";
import ListCategory from "@/components/base/list-category";
import {
  buildDynamicCategoryMenu,
  getDynamicPostBodyHtml,
} from "./data";
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
  const categoryMenu = category
    ? buildDynamicCategoryMenu(category, allCategories)
    : [];

  return (
    <div className="container w-full flex justify-center items-center pb-10">
      <div className="flex flex-col gap-5 w-full">
        {categoryMenu.length > 0 ? <ListCategory categories={categoryMenu} /> : <br />}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <main className="lg:col-span-2 bg-white border rounded-md p-8">
            <div className="pb-5 text-primary text-2xl leading-normal font-medium">
              {post.title}
            </div>
            <div className="flex items-center gap-2 text-sm mb-4">
              <span className="text-base text-blue-700">
                {dayjs(post.release_at ?? post.published_at ?? post.created_at).format("DD/MM/YYYY")}
              </span>
            </div>
            <hr className="my-5" />
            <div className="flex-1 text-app-grey text-base overflow-hidden">
              <div className="prose tiptap max-w-none overflow-hidden">
                {parse(getDynamicPostBodyHtml(post))}
              </div>
            </div>
          </main>
          <aside className="space-y-6">
            <EventCalendar />
          </aside>
        </div>
      </div>
    </div>
  );
}
