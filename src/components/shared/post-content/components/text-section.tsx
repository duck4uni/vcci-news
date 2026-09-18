import parse from "html-react-parser";
import type { DynamicPostContentSection } from "@/api/vcci-news/types/post";

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

export function TextSection({ section }: { section: DynamicPostContentSection }) {
  const content = section.content.trim();
  if (!content) return null;

  return (
    <div className="post-text-section">
      {renderStructuredHtml(content)}

      <style jsx global>{`
        .post-text-section {
          color: #1f2937;
          line-height: 1.85;
          width: 100%;
          max-width: 100%;
        }

        .post-text-section p,
        .post-text-section div {
          margin: 0 0 18px;
          max-width: 100% !important;
          box-sizing: border-box;
        }

        .post-text-section h1,
        .post-text-section h2,
        .post-text-section h3,
        .post-text-section h4,
        .post-text-section h5,
        .post-text-section h6 {
          margin: 0 0 18px;
          color: #111827;
          font-weight: 700;
          line-height: 1.45;
        }

        .post-text-section :is(p, div, span, li, a, strong, em, u, s) {
          font-family: inherit;
        }

        .post-text-section img {
          display: block;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          margin: 24px auto 10px;
          border-radius: 14px;
        }

        .post-text-section figure {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 28px 0;
          text-align: center;
        }

        .post-text-section .article-content,
        .post-text-section .article-content_toc,
        .post-text-section table,
        .post-text-section iframe {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box;
        }

        .post-text-section table {
          display: table;
          table-layout: fixed;
        }

        .post-text-section figcaption,
        .post-text-section .wp-caption-text {
          margin-top: 10px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
          text-align: center;
        }

        .post-text-section a {
          color: #14519f;
          font-weight: 600;
        }

        .post-text-section ul,
        .post-text-section ol {
          margin: 18px 0;
          padding-left: 24px;
        }

        .post-text-section li {
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
}
