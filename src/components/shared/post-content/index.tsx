"use client";

import type { DynamicPostItem } from "@/api/vcci-news/types/post";
import { ImageSection } from "./components/image-section";
import { TextSection } from "./components/text-section";

type PostContentProps = {
  post: DynamicPostItem;
};

export default function PostContent({ post }: PostContentProps) {
  const sections = (post.content_structure?.post_content ?? [])
    .slice()
    .sort((left, right) => left.position - right.position);

  return (
    <div className="overflow-hidden">
      {sections.map((section) => {
        if (section.type === "image") {
          return <ImageSection key={section.id} section={section} />;
        }

        return <TextSection key={section.id} section={section} />;
      })}
    </div>
  );
}
