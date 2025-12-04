"use client";

import Image from "next/image";
import { useState } from "react";

const ImageNext = ({
  src,
  alt,
  width,
  height,
  className,
  onErrorFallback
}: {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  onErrorFallback?: string
}) => {
  const fallbackSrc = onErrorFallback || "/img-error.png";
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt || ""}
      width={width}
      height={height}
      className={className}
      unoptimized
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default ImageNext;