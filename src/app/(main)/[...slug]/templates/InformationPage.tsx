'use client';

import ListCategory from "@/components/base/list-category";
import parse from "html-react-parser";
import { buildDynamicCategoryMenu } from "./data";
import StructuredPostContent from "./StructuredPostContent";
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
    <div className="min-h-screen bg-white">
      {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-10 lg:pb-6">
        <main className="w-full">
          <section className="block">
            <div className="min-w-0">
              <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
                {post.title}
              </h1>
              <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

              {post.summary ? (
                <p className="mt-5 max-w-6xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
                  {parse(post.summary)}
                </p>
              ) : null}

              <div className="mt-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
                <div className="page-detail-content prose tiptap max-w-none overflow-hidden">
                  <StructuredPostContent post={post} />
                </div>
              </div>
            </div>
          </section>

          <div className="page-detail-styles">
            <style jsx global>{`
              .page-detail-content {
                color: #1f2937;
                line-height: 1.85;
                width: 100%;
                max-width: 100%;
              }

              .page-detail-content p,
              .page-detail-content div {
                margin: 0 0 18px;
                max-width: 100% !important;
                box-sizing: border-box;
              }

              .page-detail-content h1,
              .page-detail-content h2,
              .page-detail-content h3,
              .page-detail-content h4,
              .page-detail-content h5,
              .page-detail-content h6 {
                margin: 0 0 18px;
                color: #111827;
                font-weight: 700;
                line-height: 1.45;
              }

              .page-detail-content :is(p, div, span, li, a, strong, em, u, s) {
                font-family: inherit;
              }

              .page-detail-content img {
                display: block;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                margin: 24px auto 10px;
                border-radius: 14px;
              }

              .page-detail-content figure {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 28px 0;
                text-align: center;
              }

              .page-detail-content .article-content,
              .page-detail-content .article-content_toc,
              .page-detail-content table,
              .page-detail-content iframe {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box;
              }

              .page-detail-content table {
                display: table;
                table-layout: fixed;
              }

              .page-detail-content figcaption,
              .page-detail-content .wp-caption-text {
                margin-top: 10px;
                color: #6b7280;
                font-size: 14px;
                line-height: 1.6;
                text-align: center;
              }

              .page-detail-content a {
                color: #14519f;
                font-weight: 600;
              }

              .page-detail-content ul,
              .page-detail-content ol {
                margin: 18px 0;
                padding-left: 24px;
              }

              .page-detail-content li {
                margin: 8px 0;
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
}
