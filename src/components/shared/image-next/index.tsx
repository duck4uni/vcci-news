import Image from "next/image";
import { useState } from "react";

const ImageNext = ({ src, alt, width, height, className, onError }: any) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(onError || "/img-error.png")}
    />
  );
};

export default ImageNext;
