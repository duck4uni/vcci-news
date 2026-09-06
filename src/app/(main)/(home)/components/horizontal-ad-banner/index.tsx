'use client';

import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import links from "@/links";

const FALLBACK_HREF = links.externalApiOrigin;
const FALLBACK_SRC = "/quang-cao/qc-1.jpg";

function HorizontalAdBanner() {
  const ads = useAdvertisements("horizontal");
  const ad = ads[0];

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
      <SafeImage
        src={src}
        fallbackSrc={FALLBACK_SRC}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </Link>
  );
}

export default HorizontalAdBanner;
