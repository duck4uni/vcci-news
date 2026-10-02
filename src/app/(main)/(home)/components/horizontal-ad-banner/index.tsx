import Image from "next/image";
import Link from "next/link";
import { getApiV10AdvertisementPublic } from "@/api/vcci-news/endpoints/advertisement";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";
import links from "@/links";

const FALLBACK_HREF = links.externalApiOrigin;
const FALLBACK_SRC = "/quang-cao/qc-1.jpg";

/** Lấy 1 quảng cáo horizontal từ API public (BE đã lọc ACTIVE, sort sort_order ASC). */
const fetchHorizontalAd = async (): Promise<Advertisement | null> => {
  try {
    const response = await getApiV10AdvertisementPublic({
      type: "horizontal",
      limit: 1,
    });
    const rows =
      (response as unknown as { responseData?: Advertisement[] } | undefined)
        ?.responseData ?? [];
    return rows[0] ?? null;
  } catch (error) {
    console.warn("[HorizontalAdBanner] CMS unavailable, using fallback", error);
    return null;
  }
};

export async function HorizontalAdBanner() {
  const ad = await fetchHorizontalAd();

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