"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

type ImageLightboxProps = {
  src: string;
  alt?: string;
  caption?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export function ImageLightbox({
  src,
  alt,
  caption,
  open,
  onOpenChange,
  className,
}: ImageLightboxProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className,
          )}
          onClick={() => onOpenChange(false)}
        >
          <DialogPrimitive.Close
            className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>

          <div
            className="flex max-h-full max-w-full flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt || ""}
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            {caption ? (
              <DialogPrimitive.Description className="mt-4 max-w-3xl text-center text-sm text-white/80 sm:text-base">
                {caption}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">
                {alt || "Hình ảnh phóng to"}
              </DialogPrimitive.Description>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
