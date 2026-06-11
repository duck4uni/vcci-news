"use client";

import Image, { type ImageProps } from "next/image";
import * as React from "react";

interface SafeNextImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export function SafeNextImage({
  src,
  alt,
  fallbackSrc = "/img-error.png",
  ...props
}: SafeNextImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc);
  const [hasFailed, setHasFailed] = React.useState(false);

  React.useEffect(() => {
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
