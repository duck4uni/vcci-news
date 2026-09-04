'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import links from "@/links";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import { getRandomFallbackImage } from "@/lib/utils/fallback-image";

const FALLBACK_HREF = links.externalApiOrigin;

function AdItem({ item, fallbackSrc }: { item: Advertisement; fallbackSrc: string }) {
  const initialSrc = item.file?.path ? links.resolveImageUrl(item.file.path) : fallbackSrc;
  const [src, setSrc] = useState(initialSrc);

  return (
    <Link
      href={item.link || FALLBACK_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(31,59,124,0.14)]"
      title={item.name}
    >
      <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/10] lg:aspect-[7/4] xl:aspect-[3/2]">
        <Image
          src={src}
          alt={item.alt || item.name}
          width={2048}
          height={1365}
          className="h-full w-full object-cover object-[center_80%]"
          unoptimized
          onError={() => {
            if (src !== fallbackSrc) setSrc(fallbackSrc);
          }}
        />
      </div>
    </Link>
  );
}

function FallbackAdItem({ src }: { src: string }) {
  return (
    <Link
      href={FALLBACK_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[28px] shadow-[0_12px_28px_rgba(31,59,124,0.14)]"
      title="Quảng cáo VCCI HCM"
    >
      <div className="aspect-[16/10] overflow-hidden sm:aspect-[16/10] lg:aspect-[7/4] xl:aspect-[3/2]">
        <Image
          src={src}
          alt="Quảng cáo VCCI HCM"
          width={2048}
          height={1365}
          className="h-full w-full object-cover object-[center_80%]"
        />
      </div>
    </Link>
  );
}

function Advertisements({ count = 2, startIndex = 0 }: { count?: number; startIndex?: number }) {
  const ads = useAdvertisements("square");
  const visibleAds = ads.slice(startIndex, startIndex + count);

  // Random fallback images ổn định trong 1 session render
  const fallbackSrcs = useMemo(
    () => Array.from({ length: count }, () => getRandomFallbackImage()),
    [count],
  );

  // Luôn render đủ `count` khung hình: vị trí nào API không có data thì dùng random fallback.
  const items = Array.from({ length: count }, (_, i) => {
    const ad = visibleAds[i];
    if (ad) return <AdItem key={ad.id} item={ad} fallbackSrc={fallbackSrcs[i]} />;
    return <FallbackAdItem key={`fallback-${startIndex + i}`} src={fallbackSrcs[i]} />;
  });

  const mdCols = count >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <aside className={`flex w-full flex-col gap-4 md:grid ${mdCols} xl:grid xl:order-2 xl:w-[22%] xl:grid-cols-1 xl:gap-4 xl:self-center`}>
      {items}
    </aside>
  );
}

export default Advertisements;
