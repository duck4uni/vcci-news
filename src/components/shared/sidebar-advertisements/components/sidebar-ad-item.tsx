import { SafeImage } from "@/components/shared/safe-image";
import Link from "next/link";
import links from "@/links";
import type { Advertisement } from "@/api/vcci-news/models/advertisement";

export function SidebarAdItem({ item, fallbackSrc }: { item: Advertisement; fallbackSrc: string }) {
  const src = item.file?.path ? links.resolveImageUrl(item.file.path) : fallbackSrc;

  return (
    <Link
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-[16px] shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
      title={item.name}
    >
      <div className="relative aspect-[16/10]">
        <SafeImage
          src={src}
          fallbackSrc={fallbackSrc}
          alt={item.alt || item.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="h-full w-full object-cover"
        />
      </div>
    </Link>
  );
}
