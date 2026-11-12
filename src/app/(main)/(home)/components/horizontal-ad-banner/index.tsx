"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetApiV10AdvertisementPublic } from "@/api/vcci-news/endpoints/advertisement";
import links from "@/links";

const FALLBACK_HREF = links.externalApiOrigin;
const FALLBACK_SRC = "/quang-cao/qc-1.jpg";

export function HorizontalAdBanner({ index = 0, count = 1 }: { index?: number; count?: number }) {
  const { data } = useGetApiV10AdvertisementPublic(
    { type: "horizontal", limit: Math.min(index + count, 100) },
    { query: { refetchOnMount: false } },
  );
  const ads = data?.responseData ?? [];
  const ad = ads.slice(index, index + count)[0] ?? null;

  const href = ad?.link || FALLBACK_HREF;
  const src = ad?.file?.path ? links.resolveImageUrl(ad.file.path) : FALLBACK_SRC;

  const title = ad?.name || "Quảng cáo VCCI HCM";
  const alt = ad?.alt || title;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden rounded-[16px] shadow-[0_16px_32px_rgba(28,52,120,0.2)]"
      style={{ aspectRatio: "1600 / 200" }}
      title={title}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </Link>
  );
}
