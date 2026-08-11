"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import { useMemo, useRef } from "react";
import type { JoditEditorProps } from "jodit-react";
import useAuthStore from "@/store/useAuthStore";
import links from "@/links";

const JoditEditor = dynamic(() => import("jodit-react").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-[#063e8e]/15 bg-white text-sm text-gray-500">
      Đang tải trình soạn thảo...
    </div>
  ),
});

interface AdminRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  readOnly?: boolean;
}

const FONT_FAMILY_OPTIONS = {
  "Arial, Helvetica, sans-serif": "Arial",
  "Tahoma, Geneva, sans-serif": "Tahoma",
  "Verdana, Geneva, sans-serif": "Verdana",
  "'Times New Roman', Times, serif": "Times New Roman",
  "Georgia, serif": "Georgia",
  "'Courier New', Courier, monospace": "Courier New",
  "'Trebuchet MS', Helvetica, sans-serif": "Trebuchet MS",
} as const;

const FONT_SIZE_OPTIONS = {
  "12px": "12",
  "14px": "14",
  "16px": "16",
  "18px": "18",
  "20px": "20",
  "24px": "24",
  "28px": "28",
  "32px": "32",
  "36px": "36",
  "42px": "42",
} as const;

const IMPORTED_LAYOUT_SELECTORS = [
  ".article-content",
  ".article-content_toc",
  "figure",
  "figcaption",
  "img",
  "table",
  "iframe",
];

function cleanPastedHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) return value;

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");

  // Strip ALL attributes except allowed ones
  const allowedAttrs = new Set(["href", "src", "alt", "target", "rel"]);
  doc.querySelectorAll("*").forEach((el) => {
    const attrs = Array.from(el.attributes);
    attrs.forEach((attr) => {
      if (!allowedAttrs.has(attr.name)) {
        el.removeAttribute(attr.name);
      }
    });
  });

  // Normalize tags to standard semantic HTML
  const tagReplacements: [string[], string | null][] = [
    [["B"], "strong"],
    [["I"], "em"],
    [["U"], "u"],
    [["S", "STRIKE", "DEL"], "s"],
    [["SPAN"], null], // unwrap span
    [["FONT"], null], // unwrap font
    [["CENTER"], null], // unwrap center
    [["BIG"], null],
    [["SMALL"], null],
    [["H1", "H2", "H3", "H4", "H5", "H6"], null], // unwrap headings to p
  ];

  tagReplacements.forEach(([tags, newTag]) => {
    doc.querySelectorAll(tags.join(",")).forEach((el) => {
      if (newTag === null) {
        while (el.firstChild) {
          el.parentNode?.insertBefore(el.firstChild, el);
        }
        el.remove();
      } else {
        const newEl = doc.createElement(newTag);
        while (el.firstChild) newEl.appendChild(el.firstChild);
        el.replaceWith(newEl);
      }
    });
  });

  // Handle images
  doc.querySelectorAll("img").forEach((el) => {
    el.setAttribute("style", "display:block;width:100%;max-width:100%;height:auto;");
    el.removeAttribute("width");
    el.removeAttribute("height");
    el.removeAttribute("style");
    el.setAttribute("style", "display:block;width:100%;max-width:100%;height:auto;");
  });

  // Handle tables
  doc.querySelectorAll("table").forEach((el) => {
    el.setAttribute("style", "width:100%;max-width:100%;border-collapse:collapse;");
    el.querySelectorAll("td, th").forEach((cell) => {
      cell.setAttribute("style", "border:1px solid #ddd;padding:8px;");
    });
  });

  // Handle figure tags
  doc.querySelectorAll("figure").forEach((el) => {
    el.setAttribute("style", "display:block;margin:1.5rem 0;");
  });

  // Unwrap divs that contain block elements
  const body = doc.body;
  const blockTags = new Set(["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL", "LI", "TABLE", "BLOCKQUOTE", "PRE", "IMG", "HR"]);

  function unwrapDivs() {
    let changed = true;
    while (changed) {
      changed = false;
      Array.from(body.querySelectorAll("div")).forEach((div) => {
        const children = Array.from(div.childNodes);
        if (children.length > 0) {
          const allBlock = children.every((child) =>
            child.nodeType === 1 ? blockTags.has((child as Element).tagName) : child.textContent?.trim() === ""
          );
          if (allBlock || div.style.cssText === "") {
            while (div.firstChild) {
              div.parentNode?.insertBefore(div.firstChild, div);
            }
            div.remove();
            changed = true;
          }
        } else {
          div.remove();
          changed = true;
        }
      });
    }
  }

  unwrapDivs();

  // Clean up empty tags
  const emptyTags = ["span", "div", "p", "strong", "em", "u", "s", "b", "i"];
  let hasEmpty = true;
  while (hasEmpty) {
    hasEmpty = false;
    emptyTags.forEach((tag) => {
      doc.querySelectorAll(`${tag}:empty`).forEach((el) => {
        if (!el.querySelector("img")) {
          el.remove();
          hasEmpty = true;
        }
      });
    });
  }

  return doc.body.innerHTML;
}

function normalizeImportedHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) return value;

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");

  doc.body.querySelectorAll<HTMLElement>(IMPORTED_LAYOUT_SELECTORS.join(",")).forEach((element) => {
    element.style.removeProperty("width");
    element.style.removeProperty("max-width");
    element.style.removeProperty("min-width");
    element.style.removeProperty("float");
    element.style.removeProperty("left");
    element.style.removeProperty("right");

    if (element.tagName === "IMG") {
      element.style.setProperty("display", "block");
      element.style.setProperty("width", "100%");
      element.style.setProperty("max-width", "100%");
      element.style.setProperty("height", "auto");
      element.removeAttribute("width");
      element.removeAttribute("height");
    }

    if (element.tagName === "FIGURE") {
      element.style.setProperty("display", "block");
      element.style.setProperty("margin", "1.5rem 0");
      element.style.setProperty("width", "100%");
      element.style.setProperty("max-width", "100%");
    }

    if (element.classList.contains("article-content") || element.classList.contains("article-content_toc")) {
      element.style.setProperty("width", "100%");
      element.style.setProperty("max-width", "100%");
      element.style.setProperty("overflow", "hidden");
    }
  });

  return doc.body.innerHTML;
}

export function AdminRichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className = "",
  minHeight = 260,
  readOnly = false,
}: AdminRichTextEditorProps) {
  const editor = useRef(null);
  const accessToken = useAuthStore((state) => state.appAccessToken);
  const [isFormatting, setIsFormatting] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);
  const formatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValueRef = useRef(value);

  // Sync local value when prop changes
  React.useEffect(() => {
    if (!isFormatting) {
      setLocalValue(value);
      lastValueRef.current = value;
    }
  }, [value, isFormatting]);

  const handleFormat = React.useCallback((html: string) => {
    setIsFormatting(true);
    // Don't update localValue - keep showing previous content during formatting

    // Clean after delay to show "đang format" message
    if (formatTimeoutRef.current) {
      clearTimeout(formatTimeoutRef.current);
    }

    formatTimeoutRef.current = setTimeout(() => {
      const cleaned = cleanPastedHtml(html);
      setLocalValue(cleaned);
      onChange(cleaned);
      lastValueRef.current = cleaned;
      setIsFormatting(false);
    }, 3500); // 3.5s delay to show formatting message
  }, [onChange]);

  const handleEditorChange = React.useCallback((html: string) => {
    // Detect if this looks like pasted content (has style attributes)
    const hasInlineStyles = html.includes('style="') || html.includes("style='");
    const hasFontTag = html.includes("<font");
    const hasClassAttr = html.includes('class="') || html.includes("class='");
    const contentLengthChanged = Math.abs(html.length - lastValueRef.current.length) > 50;

    if ((hasInlineStyles || hasFontTag || hasClassAttr) && contentLengthChanged) {
      // This looks like pasted content, run clean
      handleFormat(html);
    } else {
      // Normal typing, update directly
      setLocalValue(html);
      lastValueRef.current = html;
      onChange(html);
    }
  }, [handleFormat, onChange]);

  const config: JoditEditorProps["config"] = useMemo(
    () => ({
      readonly: readOnly,
      placeholder,
      minHeight,
      language: "vi",
      toolbarButtonSize: "middle",
      uploader: {
        url: `${links.apiEndpoint}/files`,
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        format: "json",
        buildData: (data: FormData) => {
          const next = new FormData();
          data.forEach((value, key) => {
            if (key === "files[]" && value instanceof File) {
              next.append("file", value);
            } else {
              next.append(key, value);
            }
          });
          return next;
        },
        isSuccess: (resp: unknown) => {
          if (typeof resp !== "object" || resp === null) return false;
          const r = resp as Record<string, unknown>;
          return (
            r.status === "success" ||
            r.status === "200" ||
            (!r.violation && !!r.responseData)
          );
        },
        process: (resp: unknown) => {
          if (typeof resp !== "object" || resp === null) {
            return { files: [], error: "Invalid response" };
          }
          const r = resp as Record<string, unknown>;
          const responseData = r.responseData as Record<string, unknown> | undefined;
          const url =
            (typeof responseData?.url === "string" && responseData.url) ||
            (typeof responseData?.fileUrl === "string" && responseData.fileUrl) ||
            (typeof responseData?.path === "string" && responseData.path) ||
            (typeof responseData?.link === "string" && responseData.link) ||
            (typeof responseData?.src === "string" && responseData.src) ||
            "";
          return {
            files: url ? [url] : [],
            baseurl: "",
            error: url ? undefined : (r.message as string) || "Upload failed",
            msg: (r.message as string) || "",
          };
        },
      },
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "table",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "|",
        "symbol",
        "fullsize",
      ],
      buttonsXS: [
        "bold",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "image",
        "link",
        "table",
        "|",
        "align",
        "|",
        "undo",
        "redo",
        "|",
        "dots",
      ],
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_as_html",
      enter: "p",
      showPlaceholder: false,
      toolbarAdaptive: false,
      toolbarInlineForSelection: true,
      showXPathInStatusbar: false,
      controls: {
        font: {
          list: FONT_FAMILY_OPTIONS,
        },
        fontsize: {
          list: FONT_SIZE_OPTIONS,
        },
      },
    }),
    [minHeight, placeholder, readOnly, accessToken],
  );

  return (
    <div className={className}>
      <style jsx global>{`
        .admin-rich-text-editor .jodit-container {
          border-radius: 1rem;
          border: 1px solid rgba(6, 62, 142, 0.15);
          overflow: hidden;
          background: #ffffff;
        }

        .admin-rich-text-editor .jodit-toolbar__box {
          border-bottom: 1px solid rgba(6, 62, 142, 0.12);
          background: rgba(6, 62, 142, 0.04);
          padding: 10px;
        }

        .admin-rich-text-editor .jodit-toolbar-editor-collection {
          border-radius: 0.9rem;
          border: 1px solid rgba(6, 62, 142, 0.15);
          box-shadow: 0 18px 34px rgba(17, 24, 39, 0.12);
          overflow: hidden;
        }

        .admin-rich-text-editor .jodit-toolbar-editor-collection .jodit-toolbar__box {
          padding: 8px;
        }

        .admin-rich-text-editor .jodit-workplace {
          min-height: ${minHeight}px;
        }

        .admin-rich-text-editor .jodit-wysiwyg {
          min-height: ${minHeight}px;
          padding: 16px 18px;
          color: #111827;
          font-size: 14px;
          line-height: 1.8;
        }

        .admin-rich-text-editor .jodit-wysiwyg p {
          margin-bottom: 1em;
        }

        .admin-rich-text-editor .jodit-wysiwyg img {
          display: block;
          width: 100% !important;
          max-width: 100% !important;
          height: auto;
          border-radius: 0.75rem;
        }

        .admin-rich-text-editor .jodit-wysiwyg .article-content,
        .admin-rich-text-editor .jodit-wysiwyg .article-content_toc,
        .admin-rich-text-editor .jodit-wysiwyg figure,
        .admin-rich-text-editor .jodit-wysiwyg table,
        .admin-rich-text-editor .jodit-wysiwyg iframe {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box;
        }

        .admin-rich-text-editor .jodit-wysiwyg figure {
          display: block !important;
          margin: 1.5rem 0 !important;
        }

        .admin-rich-text-editor .jodit-placeholder {
          color: #374151 !important;
        }

        .admin-rich-text-editor .editor-wrapper {
          position: relative;
          border-radius: 1rem;
        }

        .admin-rich-text-editor .editor-wrapper.is-formatting::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.95);
          z-index: 10;
          border-radius: 1rem;
        }

        .admin-rich-text-editor .format-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.98);
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
        }

        .admin-rich-text-editor .format-overlay-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .admin-rich-text-editor .format-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(6, 62, 142, 0.2);
          border-top-color: #063e8e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .admin-rich-text-editor .format-text {
          font-size: 14px;
          font-weight: 500;
          color: #063e8e;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="admin-rich-text-editor">
        <div className="editor-wrapper">
          <JoditEditor
            ref={editor}
            value={localValue}
            config={config}
            onBlur={(nextContent) => {
              const cleaned = cleanPastedHtml(nextContent);
              setLocalValue(cleaned);
              onChange(cleaned);
              lastValueRef.current = cleaned;
            }}
            onChange={handleEditorChange}
          />
          {isFormatting && (
            <div className="format-overlay">
              <div className="format-overlay-content">
                <div className="format-spinner" />
                <div className="format-text">Đang format nội dung...</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
