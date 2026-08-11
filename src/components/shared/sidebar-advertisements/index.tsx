'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import { resolveUploadUrl } from "@/links";
import type { Advertisement } from "@/api/models/advertisement";

const FALLBACK_SRC = "/quang-cao/qc-3.jpg";
const FALLBACK_HREF = "https://vcci-hcm.org.vn";

function SidebarAdItem({ item }: { item: Advertisement }) {
  const initialSrc = item.file?.path ? resolveUploadUrl(item.file.path) : FALLBACK_SRC;
  const [src, setSrc] = useState(initialSrc);
  const isGif = src.toLowerCase().endsWith(".gif");

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
          unoptimized={isGif}
          onError={() => {
            if (src !== FALLBACK_SRC) setSrc(FALLBACK_SRC);
          }}
        />
      </div>
    </Link>
  );
}

function FallbackSidebarAdItem() {
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
          src={FALLBACK_SRC}
          alt="Quảng cáo VCCI HCM"
          fill
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

  // Fallback: nếu API không có data, hiển thị fallback items
  const items =
    visibleAds.length > 0
      ? visibleAds.map((item) => <SidebarAdItem key={item.id} item={item} />)
      : Array.from({ length: count }).map((_, i) => <FallbackSidebarAdItem key={`fallback-${i}`} />);

  return (
    <div className="order-3 flex flex-col gap-4 xl:order-none">
      {items}
    </div>
  );
}

export default SidebarAdvertisements;
