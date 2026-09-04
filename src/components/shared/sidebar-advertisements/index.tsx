'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import links from "@/links";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import { getRandomFallbackImage } from "@/lib/utils/fallback-image";

const FALLBACK_HREF = "https://vcci-hcm.org.vn";

function SidebarAdItem({ item, fallbackSrc }: { item: Advertisement; fallbackSrc: string }) {
  const initialSrc = item.file?.path ? links.resolveImageUrl(item.file.path) : fallbackSrc;
  const [src, setSrc] = useState(initialSrc);

  return (
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[22px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
      title={item.name}
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={src}
          alt={item.alt || item.name}
          fill
          className="h-full w-full object-cover"
          unoptimized
          onError={() => {
            if (src !== fallbackSrc) setSrc(fallbackSrc);
          }}
        />
      </div>
    </Link>
  );
}

function FallbackSidebarAdItem({ src }: { src: string }) {
  return (
    <Link
      href={FALLBACK_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[22px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
      title="Quảng cáo VCCI HCM"
    >
      <div className="relative aspect-[16/10]">
        <Image
          src={src}
          alt="Quảng cáo VCCI HCM"
          fill
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
    </Link>
  );
}

/** Sidebar quảng cáo vuông (stack dọc) cho các trang detail/catalog/search */
function SidebarAdvertisements({ count = 5, startIndex = 0 }: { count?: number; startIndex?: number }) {
  const ads = useAdvertisements("square");
  const visibleAds = ads.slice(startIndex, startIndex + count);

  // Random fallback images ổn định trong 1 session render
  const fallbackSrcs = useMemo(
    () => Array.from({ length: count }, () => getRandomFallbackImage()),
    [count],
  );

  // Fallback: nếu API không có data, hiển thị fallback items
  const items =
    visibleAds.length > 0
      ? visibleAds.map((item, i) => (
        <SidebarAdItem key={item.id} item={item} fallbackSrc={fallbackSrcs[i] ?? fallbackSrcs[0]} />
      ))
      : fallbackSrcs.map((src, i) => <FallbackSidebarAdItem key={`fallback-${i}`} src={src} />);

  return (
    <div className="order-3 flex flex-col gap-4 xl:order-none">
      {items}
    </div>
  );
}

export default SidebarAdvertisements;
