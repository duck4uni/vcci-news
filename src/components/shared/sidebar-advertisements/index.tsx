'use client';

import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { useMemo } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import links from "@/links";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import { getFallbackImage } from "@/lib/utils/fallback-image";

const FALLBACK_HREF = "https://vcci-hcm.org.vn";

function SidebarAdItem({ item, fallbackSrc }: { item: Advertisement; fallbackSrc: string }) {
  const src = item.file?.path ? links.resolveImageUrl(item.file.path) : fallbackSrc;

  return (
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[16px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
      title={item.name}
    >
      <div className="relative aspect-[16/10]">
        <SafeImage
          src={src}
          fallbackSrc={fallbackSrc}
          alt={item.alt || item.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="h-full w-full object-cover"
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
      className="block overflow-hidden rounded-[16px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
      title="Quảng cáo VCCI HCM"
    >
      <div className="relative aspect-[16/10]">
        <SafeImage
          src={src}
          alt="Quảng cáo VCCI HCM"
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}

/** Sidebar quảng cáo vuông (stack dọc) cho các trang detail/catalog/search */
function SidebarAdvertisements({ count = 5, startIndex = 0 }: { count?: number; startIndex?: number }) {
  const ads = useAdvertisements("square");
  const visibleAds = ads.slice(startIndex, startIndex + count);

  const fallbackSrcs = useMemo(
    () => Array.from({ length: count }, (_, i) => getFallbackImage(i)),
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
