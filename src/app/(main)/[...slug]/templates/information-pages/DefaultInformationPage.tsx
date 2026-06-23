'use client';

import StructuredPostContent from "../StructuredPostContent";
import type { DynamicPostItem } from "../types";
import parse from "html-react-parser";
type DefaultInformationPageProps = {
  post: DynamicPostItem;
};

export default function DefaultInformationPage({
  post,
}: DefaultInformationPageProps) {
  return (
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
  );
}
