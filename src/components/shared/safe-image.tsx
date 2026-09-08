"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackSrc = "/img-error.png",
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setHasFailed(false);
  }, [fallbackSrc, src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (hasFailed || currentSrc === fallbackSrc) return;
        setHasFailed(true);
        setCurrentSrc(fallbackSrc);
      }}
      unoptimized
    />
  );
}
