'use client';

import { useMemo } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import { getFallbackImage } from "@/lib/utils/fallback-image";
import { SidebarAdItem } from "./components/sidebar-ad-item";
import { FallbackSidebarAdItem } from "./components/fallback-sidebar-ad-item";

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
