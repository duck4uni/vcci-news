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

function normalizeCaptionShortcodes(html: string) {
  return html.replace(/\[caption[^\]]*]([\s\S]*?)\[\/caption]/gi, (_match, innerContent: string) => {
    const normalizedInnerContent = innerContent.trim();
    const imageMatch = normalizedInnerContent.match(/(<img[\s\S]*?>)([\s\S]*)/i);

    if (!imageMatch) {
      return normalizedInnerContent;
    }

    const imageHtml = imageMatch[1]?.trim() ?? "";
    const captionText = imageMatch[2]?.trim() ?? "";

    if (!captionText) {
      return imageHtml;
    }

    return `<figure>${imageHtml}<figcaption>${captionText}</figcaption></figure>`;
  });
}

function normalizeImportedLayout(html: string) {
  if (typeof window === "undefined" || !html.trim()) return html;

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const mediaLayoutSelectors = [
    ".article-content",
    ".article-content_toc",
    "figure",
    "figcaption",
    "img",
    "table",
    "iframe",
  ];

  document.body.querySelectorAll<HTMLElement>(mediaLayoutSelectors.join(",")).forEach((element) => {
    element.style.removeProperty("width");
    element.style.removeProperty("max-width");
    element.style.removeProperty("min-width");

    if (element.tagName === "IMG") {
      element.style.removeProperty("height");
      element.style.removeProperty("max-height");
      element.style.removeProperty("min-height");
      element.style.removeProperty("aspect-ratio");
      element.style.setProperty("display", "block");
      element.style.setProperty("width", "100%");
      element.style.setProperty("max-width", "100%");
      element.style.setProperty("height", "auto");
      element.removeAttribute("width");
      element.removeAttribute("height");
    }

    if (element.tagName === "FIGURE") {
      element.style.setProperty("display", "block");
      element.style.setProperty("margin", "1.75rem 0");
      element.style.setProperty("width", "100%");
      element.style.setProperty("max-width", "100%");
      element.style.setProperty("text-align", "center");
    }

    if (element.classList.contains("article-content") || element.classList.contains("article-content_toc")) {
      element.style.setProperty("display", "block");
      element.style.setProperty("width", "100%");
      element.style.setProperty("max-width", "100%");
      element.style.setProperty("overflow", "hidden");
    }
  });

  document.body.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
    let current = image.parentElement;

    while (
      current &&
      current !== document.body &&
      !current.classList.contains("article-content") &&
      !current.classList.contains("article-content_toc")
    ) {
      current.style.removeProperty("width");
      current.style.removeProperty("max-width");
      current.style.removeProperty("min-width");
      current.style.removeProperty("height");
      current.style.removeProperty("max-height");
      current.style.removeProperty("min-height");
      current.style.removeProperty("float");
      current.style.removeProperty("left");
      current.style.removeProperty("right");

      if (current.tagName !== "FIGCAPTION") {
        current.style.setProperty("max-width", "100%");
        current.style.setProperty("box-sizing", "border-box");
      }

      if (current.tagName === "DIV" || current.tagName === "P" || current.tagName === "FIGURE") {
        current.style.setProperty("display", "block");
        current.style.setProperty("width", "100%");
      }

      current = current.parentElement;
    }
  });

  document.body
    .querySelectorAll<HTMLElement>(".article-content, .article-content_toc, figure, img, table, iframe")
    .forEach((element) => {
      element.style.removeProperty("float");
      element.style.removeProperty("left");
      element.style.removeProperty("right");
    });

  return document.body.innerHTML;
}

function renderStructuredHtml(html: string) {
  return parse(normalizeImportedLayout(normalizeCaptionShortcodes(html)));
}

export default function StructuredPostContent({ post }: StructuredPostContentProps) {
  const sections = (post.content_structure?.post_content ?? [])
    .slice()
    .sort((left, right) => left.position - right.position);

  if (!sections.length) {
    return <>{renderStructuredHtml(getDynamicPostBodyHtml(post))}</>;
  }

  const hasRenderableSection = sections.some(
    (section) => section.content.trim() || section.images.length,
  );

  if (!hasRenderableSection) {
    return <>{renderStructuredHtml(getDynamicPostBodyHtml(post))}</>;
  }

  return (
    <>
      {sections.map((section) => {
        if (section.type === "image") {
          return <StructuredImageSection key={section.id} section={section} />;
        }

        const content = section.content.trim();
        if (!content) return null;

        return <div key={section.id}>{renderStructuredHtml(content)}</div>;
      })}
    </>
  );
}
