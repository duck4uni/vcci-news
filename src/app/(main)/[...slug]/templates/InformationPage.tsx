'use client';

import parse from "html-react-parser";
import ListCategory from "@/components/base/list-category";
import {
  buildDynamicCategoryMenu,
  getDynamicPostBodyHtml,
} from "./data";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "./types";

type InformationPageProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem;
  allCategories: DynamicCategoryRouteItem[];
};

export default function InformationPage({
  post,
  category,
  allCategories,
}: InformationPageProps) {
  const categoryMenu = buildDynamicCategoryMenu(category, allCategories);

  return (
    <div className="container w-full flex justify-center items-center pb-10">
      <div className="flex flex-col gap-5 w-full">
        {categoryMenu.length > 0 ? <ListCategory categories={categoryMenu} /> : <br />}
        <main className="bg-white border rounded-md py-10 px-5 md:px-20 lg:px-20">
          <div className="text-primary text-2xl leading-normal font-bold">
            {post.title}
          </div>
          <hr className="my-5" />
          <div className="flex-1 text-app-grey text-base overflow-hidden">
            <div className="prose tiptap max-w-none overflow-hidden">
              {parse(getDynamicPostBodyHtml(post))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
