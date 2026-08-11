'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import { resolveUploadUrl } from "@/links";
import type { Advertisement } from "@/api/models/advertisement";

const FALLBACK_SRC = "/quang-cao/qc-3.jpg";
const FALLBACK_HREF = "https://vccihcm.vn";

function AdItem({ item }: { item: Advertisement }) {
  const initialSrc = item.file?.path ? resolveUploadUrl(item.file.path) : FALLBACK_SRC;
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
            if (src !== FALLBACK_SRC) setSrc(FALLBACK_SRC);
          }}
        />
      </div>
    </Link>
  );
}

function FallbackAdItem() {
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
          src={FALLBACK_SRC}
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

  // Luôn render đủ `count` khung hình: vị trí nào API không có data thì dùng fallback qc-3.jpg.
  const items = Array.from({ length: count }, (_, i) => {
    const ad = visibleAds[i];
    if (ad) return <AdItem key={ad.id} item={ad} />;
    return <FallbackAdItem key={`fallback-${startIndex + i}`} />;
  });

  const mdCols = count >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <aside className={`flex w-full flex-col gap-4 md:grid ${mdCols} xl:grid xl:order-2 xl:w-[22%] xl:grid-cols-1 xl:gap-4 xl:self-center`}>
      {items}
    </aside>
  );
}

export default Advertisements;
