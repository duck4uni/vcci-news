"use client";

import { getVideo } from "@/api/endpoints/video";
import type { Video } from "@/api/models/video";

export type ClientVideoItem = Video & {
  thumbnail: string;
  watchUrl: string;
};

export type ClientVideoListResult = {
  rows: ClientVideoItem[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const FALLBACK_VIDEO_THUMBNAIL = "/img-error.png";

export const readVideoRows = (payload: unknown): Video[] => {
  const root = payload as {
    responseData?: { rows?: unknown[] };
    data?: { responseData?: { rows?: unknown[] } };
  };
  const rows = root.responseData?.rows ?? root.data?.responseData?.rows ?? [];

  return rows as Video[];
};

export const readVideoPageData = (payload: unknown) => {
  const root = payload as {
    responseData?: { rows?: unknown[]; count?: number; page?: number; pageSize?: number };
    data?: { responseData?: { rows?: unknown[]; count?: number; page?: number; pageSize?: number } };
  };

  return root.responseData ?? root.data?.responseData ?? {};
};

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

export async function fetchClientVideos(params?: { page?: number; pageSize?: number }) {
  try {
    const response = await getVideo({
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      sortField: "created_at",
      sortOrder: "desc",
    });
    const pageData = readVideoPageData(response);
    const pageSize = pageData.pageSize ?? params?.pageSize ?? 10;
    const count = pageData.count ?? 0;

    return {
      rows: readVideoRows(response).map((item) => ({
        ...item,
        thumbnail: getVideoThumbnail(item.url),
        watchUrl: normalizeVideoUrl(item.url),
      })),
      count,
      page: pageData.page ?? params?.page ?? 1,
      pageSize,
      totalPages: Math.max(1, Math.ceil(count / pageSize)),
    } satisfies ClientVideoListResult;
  } catch (error) {
    // Khi CMS / BE gặp sự cố — rethrow để UI component tự xử lý
    // (hiển thị trạng thái "Chưa có video nào.").
    // eslint-disable-next-line no-console
    console.warn("[fetchClientVideos] CMS unavailable", error);
    throw error;
  }
}
