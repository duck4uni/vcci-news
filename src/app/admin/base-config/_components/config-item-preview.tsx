"use client";

import type { BaseConfigBannerItem } from "@/mockdata/base-config";
import type { AdminMediaItem } from "@/mockdata/admin-news";
import { SafeNextImage } from "@/components/admin/safe-next-image";

export function ConfigItemPreview({
  title,
  item,
  media,
  current,
  onSelect,
}: {
  title: string;
  item: BaseConfigBannerItem;
  media: AdminMediaItem | null;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`overflow-hidden rounded-3xl border text-left transition-all ${current
        ? "border-[#063e8e]/35 bg-[#edf4ff] shadow-[0_10px_24px_rgba(6,62,142,0.12)]"
        : "border-[#063e8e]/10 bg-white hover:border-[#063e8e]/25 hover:shadow-sm"
        }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eef4ff]">
        {media ? (
          <SafeNextImage
            src={media.url}
            alt={media.alt || media.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Chưa chọn hình ảnh
          </div>
        )}
      </div>
      <div className="space-y-2 px-4 py-3">
        <div className="line-clamp-1 text-sm font-semibold text-[#163b73]">
          {title}
        </div>
        <div className="line-clamp-2 text-sm text-gray-600">{item.name}</div>
      </div>
    </button>
  );
}
