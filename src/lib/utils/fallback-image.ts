/**
 * Danh sách ảnh fallback trong /public/fallback.
 * Dùng khi API không trả thumbnail hoặc ảnh lỗi.
 * Random 1 ảnh mỗi lần gọi để tránh nhàm chán.
 */
const FALLBACK_IMAGES = [
  "/fallback/file-1787627024817-122290329.jpg",
  "/fallback/file-1787628149029-832000088.jpg",
  "/fallback/file-1787887571758-590925913.jpg",
  "/fallback/qc-1.jpg",
  "/fallback/qc-3.jpg",
  "/fallback/qc-4.jpg",
  "/fallback/thumbnail.png",
] as const;

export const getRandomFallbackImage = (): string => {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};
