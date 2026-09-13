import type { AdminNewsContentSection } from "@/api/vcci-news/types/post";

export function parsePostContent(
  contentStructure?: Record<string, unknown> | null,
): AdminNewsContentSection[] {
  const sections = Array.isArray(contentStructure?.post_content)
    ? (contentStructure?.post_content as Record<string, unknown>[])
    : [];

  return sections.map((section, index) => {
    const images = Array.isArray(section.images)
      ? (section.images as Record<string, unknown>[])
      : [];

    return {
      id:
        typeof section.id === "string" ? section.id : `section-${index + 1}`,
      type: section.type === "image" ? "image" : "text",
      position:
        typeof section.position === "number" ? section.position : index + 1,
      content: typeof section.content === "string" ? section.content : "",
      image_columns:
        typeof section.image_columns === "number"
          ? section.image_columns
          : 2,
      image_rows:
        typeof section.image_rows === "number" ? section.image_rows : 2,
      images: images.map((image, imageIndex) => ({
        position:
          typeof image.position === "number" ? image.position : imageIndex + 1,
        caption: typeof image.caption === "string" ? image.caption : "",
        image: {
          id:
            typeof image.image === "object" &&
              image.image &&
              "id" in image.image
              ? String((image.image as Record<string, unknown>).id ?? "")
              : "",
          name:
            typeof image.image === "object" &&
              image.image &&
              "name" in image.image
              ? String((image.image as Record<string, unknown>).name ?? "")
              : "",
          alt:
            typeof image.image === "object" &&
              image.image &&
              "alt" in image.image
              ? String((image.image as Record<string, unknown>).alt ?? "")
              : "",
          url:
            typeof image.image === "object" &&
              image.image &&
              "url" in image.image
              ? String((image.image as Record<string, unknown>).url ?? "")
              : "",
        },
      })),
    };
  });
}

export function parseLegacyPostContent(
  content?: string | null,
): AdminNewsContentSection[] {
  const normalizedContent =
    typeof content === "string" ? content.trim() : "";

  if (!normalizedContent) {
    return [];
  }

  return [
    {
      id: "legacy-content-section",
      type: "text",
      position: 1,
      content: normalizedContent,
      image_columns: 2,
      image_rows: 2,
      images: [],
    },
  ];
}
