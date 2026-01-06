import Image from "next/image";
import { useEffect, useState } from "react";

const ImageNext = ({ src, alt, width, height, className, fallback = "/img-error.png" }: any) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallback)}
      unoptimized
    />
  );
};

export default ImageNext;
