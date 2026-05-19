"use client";

import parse from "html-react-parser";
import ImageNext from "@/components/shared/image-next";
import { getDynamicPostBodyHtml } from "./data";
import type { DynamicPostContentSection, DynamicPostItem } from "./types";

type StructuredPostContentProps = {
  post: DynamicPostItem;
};

function getGridClassName(columns: number) {
  if (columns >= 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  if (columns === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1";
}

function StructuredImageSection({ section }: { section: DynamicPostContentSection }) {
  const images = section.images.filter((item) => item.image?.url);

  if (!images.length) return null;

  return (
    <div className={`not-prose my-6 grid gap-4 ${getGridClassName(section.image_columns)}`}>
      {images.map((item) => {
        const image = item.image;
        if (!image?.url) return null;

        return (
          <figure
            key={`${section.id}-${image.id || image.url}-${item.position}`}
            className="overflow-hidden rounded-[18px] bg-white"
          >
            <ImageNext
              src={image.url}
              alt={image.alt || image.name || "Hình ảnh bài viết"}
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
            />
          </figure>
        );
      })}
    </div>
  );
}

export default function StructuredPostContent({ post }: StructuredPostContentProps) {
  const sections = (post.content_structure?.post_content ?? [])
    .slice()
    .sort((left, right) => left.position - right.position);

  if (!sections.length) {
    return <>{parse(getDynamicPostBodyHtml(post))}</>;
  }

  const hasRenderableSection = sections.some(
    (section) => section.content.trim() || section.images.length,
  );

  if (!hasRenderableSection) {
    return <>{parse(getDynamicPostBodyHtml(post))}</>;
  }

  return (
    <>
      {sections.map((section) => {
        if (section.type === "image") {
          return <StructuredImageSection key={section.id} section={section} />;
        }

        const content = section.content.trim();
        if (!content) return null;

        return <div key={section.id}>{parse(content)}</div>;
      })}
    </>
  );
}
