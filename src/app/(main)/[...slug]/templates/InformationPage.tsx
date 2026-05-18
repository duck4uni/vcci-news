'use client';

import dayjs from "dayjs";
import parse from "html-react-parser";
import { getDynamicPostBodyHtml } from "./data";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "./types";

type InformationPageProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem;
  allCategories: DynamicCategoryRouteItem[];
};

export default function InformationPage({
  post,
  category,
}: InformationPageProps) {
  const publishedDate = dayjs(
    post.release_at ?? post.published_at ?? post.created_at,
  ).format("DD/MM/YYYY");

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <main className="w-full">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-[#eaf0ff] px-2.5 py-1 font-semibold text-[#1f4fa3]">
              {category.name}
            </span>
            <span className="text-[#9aa3ad]">{publishedDate}</span>
          </div>

          <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
            {post.title}
          </h1>
          <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

          {post.summary ? (
            <p className="mt-5 max-w-6xl text-base font-semibold leading-7 text-[#374151] md:text-lg md:leading-8">
              {post.summary}
            </p>
          ) : null}

          <div className="mt-7 rounded-[24px] bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
            <div className="page-detail-content prose tiptap max-w-none overflow-hidden">
              {parse(getDynamicPostBodyHtml(post))}
            </div>
          </div>

          <div className="page-detail-styles">
            <style jsx global>{`
              .page-detail-content {
                color: #1f2937;
                font-size: 16px;
                line-height: 1.85;
              }

              .page-detail-content p,
              .page-detail-content div {
                margin: 0 0 18px;
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

              .page-detail-content img {
                display: block;
                width: 100%;
                max-width: 100%;
                height: auto;
                margin: 24px auto 10px;
                border-radius: 14px;
              }

              .page-detail-content figure {
                margin: 28px 0;
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
