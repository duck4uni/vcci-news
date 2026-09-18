import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";

const FALLBACK_HREF = "https://vcci-hcm.org.vn";

export function FallbackSidebarAdItem({ src }: { src: string }) {
  return (
    <Link
      href={FALLBACK_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[16px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
      title="Quảng cáo VCCI HCM"
    >
      <div className="relative aspect-[16/10]">
        <SafeImage
          src={src}
          alt="Quảng cáo VCCI HCM"
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}
