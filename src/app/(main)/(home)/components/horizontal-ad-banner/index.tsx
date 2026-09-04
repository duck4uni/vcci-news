'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAdvertisements } from "@/app/(main)/(home)/lib/use-advertisements";
import links from "@/links";

const FALLBACK_HREF = links.externalApiOrigin;
const FALLBACK_SRC = "/quang-cao/qc-1.jpg";

function HorizontalAdBanner() {
  const ads = useAdvertisements("horizontal");
  const ad = ads[0];

  const href = ad?.link || FALLBACK_HREF;
  const initialSrc = ad?.file?.path ? links.resolveImageUrl(ad.file.path) : FALLBACK_SRC;
  const [src, setSrc] = useState(initialSrc);
  const [errored, setErrored] = useState(false);

  // Reset state khi ad thay đổi
  if (ad?.file?.path && !errored && src !== initialSrc) {
    setSrc(initialSrc);
  }

  const isGif = src.toLowerCase().endsWith(".gif");
  const title = ad?.name || "Quảng cáo VCCI HCM";
  const alt = ad?.alt || title;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative block overflow-hidden rounded-[10px] shadow-[0_16px_32px_rgba(28,52,120,0.2)] lg:rounded-[20px]"
      style={{ aspectRatio: "1600 / 200" }}
      title={title}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        unoptimized={isGif}
        onError={() => {
          if (src !== FALLBACK_SRC) {
            setSrc(FALLBACK_SRC);
            setErrored(true);
          }
        }}
      />
    </Link>
  );
}

export default HorizontalAdBanner;
