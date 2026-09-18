import type { DynamicPostContentSection } from "@/api/vcci-news/types/post";
import { ImageLightbox } from "../../image-lightbox";
import { SafeImage } from "../../safe-image";
import { useState } from "react";

function getGridClassName(columns: number) {
  if (columns >= 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  if (columns === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
  return "grid-cols-1";
}

export function ImageSection({ section }: { section: DynamicPostContentSection }) {
  const images = section.images.filter((item) => item.image?.url);
  const [activeImage, setActiveImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div className={`post-image-section my-6 grid gap-4 ${getGridClassName(section.image_columns)}`}>
        {images.map((item) => {
          const image = item.image;
          if (!image?.url) return null;

          return (
            <figure
              key={`${section.id}-${image.id || image.url}-${item.position}`}
              className="group cursor-zoom-in overflow-hidden rounded-[18px] bg-white"
              onClick={() =>
                setActiveImage({
                  src: image.url,
                  alt: image.alt || image.name || "Hình ảnh bài viết",
                  caption: item.caption ?? undefined,
                })
              }
            >
              <SafeImage
                src={image.url}
                alt={image.alt || image.name || "Hình ảnh bài viết"}
                width={1200}
                height={800}
                className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {item.caption ? (
                <figcaption className="mt-2 text-center text-sm text-gray-600">
                  {item.caption}
                </figcaption>
              ) : null}
            </figure>
          );
        })}
      </div>

      <ImageLightbox
        src={activeImage?.src ?? ""}
        alt={activeImage?.alt}
        caption={activeImage?.caption}
        open={Boolean(activeImage)}
        onOpenChange={(open) => {
          if (!open) setActiveImage(null);
        }}
      />
    </>
  );
}