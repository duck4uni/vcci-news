"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import type { JoditEditorProps } from "jodit-react";

const JoditEditor = dynamic(() => import("jodit-react"), {
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
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
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
          onBlur={(nextContent) => onChange(nextContent)}
          onChange={() => undefined}
        />
      </div>
    </div>
  );
}
