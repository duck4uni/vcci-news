"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import type { JoditEditorProps } from "jodit-react";

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

function normalizeImportedHtml(value: string) {
  if (typeof window === "undefined" || !value.trim()) return value;

  const parser = new DOMParser();
  const document = parser.parseFromString(value, "text/html");

  document.body.querySelectorAll<HTMLElement>(IMPORTED_LAYOUT_SELECTORS.join(",")).forEach((element) => {
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

  return document.body.innerHTML;
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

  const config: JoditEditorProps["config"] = useMemo(
    () => ({
      readonly: readOnly,
      placeholder,
      minHeight,
      language: "vi",
      toolbarButtonSize: "middle",
      uploader: {
        insertImageAsBase64URI: true,
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
    [minHeight, placeholder, readOnly],
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
      `}</style>

      <div className="admin-rich-text-editor">
        <JoditEditor
          ref={editor}
          value={value}
          config={config}
          onBlur={(nextContent) => onChange(normalizeImportedHtml(nextContent))}
          onChange={() => undefined}
        />
      </div>
    </div>
  );
}
