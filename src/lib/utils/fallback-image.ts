const FALLBACK_IMAGES = [
  "/fallback/file-1787627024817-122290329.jpg",
  "/fallback/file-1787628149029-832000088.jpg",
  "/fallback/file-1787887571758-590925913.jpg",
  "/fallback/qc-1.jpg",
  "/fallback/qc-3.jpg",
  "/fallback/qc-4.jpg",
  "/fallback/thumbnail.png",
] as const;

export const getFallbackImage = (index = 0): string => {
  return FALLBACK_IMAGES[Math.abs(index) % FALLBACK_IMAGES.length];
};
