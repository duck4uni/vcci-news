"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApiV10AdvertisementPublic } from "@/api/vcci-news/endpoints/advertisement";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import { getFallbackImage } from "@/lib/utils/fallback-image";
import { SidebarAdItem } from "./components/sidebar-ad-item";
import { FallbackSidebarAdItem } from "./components/fallback-sidebar-ad-item";

/** Lấy danh sách quảng cáo square từ API public (BE đã lọc ACTIVE, sort sort_order ASC). */
const fetchSquareAds = async (): Promise<Advertisement[]> => {
  try {
    const response = await getApiV10AdvertisementPublic({
      type: "square",
      limit: 20,
    });
    return (
      (response as unknown as { responseData?: Advertisement[] } | undefined)
        ?.responseData ?? []
    );
  } catch (error) {
    console.warn("[SidebarAdvertisements] CMS unavailable, using fallback", error);
    return [];
  }
};

function SidebarAdvertisements({ count = 5, startIndex = 0 }: { count?: number; startIndex?: number }) {
  const { data: ads = [] } = useQuery({
    queryKey: ["sidebar-advertisements", "square"] as const,
    queryFn: fetchSquareAds,
    staleTime: 60 * 1000,
  });

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
