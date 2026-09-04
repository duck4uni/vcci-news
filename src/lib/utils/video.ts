const FALLBACK_VIDEO_THUMBNAIL = "/img-error.png";

export const getYoutubeVideoId = (url: string) => {
  const value = url.trim();
  if (!value) return "";

  try {
    const parsedUrl = new URL(value);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? "";
    }

    if (host.includes("youtube.com")) {
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/").filter(Boolean)[1] ?? "";
      }

      return parsedUrl.searchParams.get("v") ?? "";
    }
  } catch {
    return "";
  }

  return "";
};

export const getVideoThumbnail = (url: string) => {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : FALLBACK_VIDEO_THUMBNAIL;
};

export const normalizeVideoUrl = (url: string) => {
  const value = url.trim();
  const videoId = getYoutubeVideoId(value);

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return value;
};
