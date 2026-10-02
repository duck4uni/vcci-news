import Image from "next/image";

export type BannerItemData = {
  id: string;
  alt: string;
  src: string;
};

export function BannerItem({ src, alt }: BannerItemData) {
  return (
    <Image
      src={src}
      alt={alt}
      width={2560}
      height={720}
      sizes="100vw"
      className="h-[220px] w-full object-cover sm:h-[320px] md:h-[430px] lg:h-[540px]"
    />
  );
}
