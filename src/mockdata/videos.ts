"use client";

export const VIDEO_STORAGE_KEY = "vcci-news.admin-videos.data.v1";

export interface VideoItem {
  id: string;
  name: string;
  url: string;
}

export interface VideoFormValues {
  id?: string;
  name: string;
  url: string;
}

const VIDEO_SEED: VideoItem[] = [
  {
    id: "video-1",
    name: "Giới thiệu VCCI News",
    url: "https://www.youtube.com/watch?v=example001",
  },
  {
    id: "video-2",
    name: "Bản tin hoạt động hội viên",
    url: "https://www.youtube.com/watch?v=example002",
  },
];

export function createVideoId(): string {
  return `video-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getVideoSeed(): VideoItem[] {
  return VIDEO_SEED;
}

export function readVideos(): VideoItem[] {
  if (typeof window === "undefined") return getVideoSeed();

  const raw = window.localStorage.getItem(VIDEO_STORAGE_KEY);
  if (!raw) return getVideoSeed();

  try {
    const parsed = JSON.parse(raw) as VideoItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getVideoSeed();
  } catch {
    return getVideoSeed();
  }
}

export function persistVideos(items: VideoItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(items));
}

export const EMPTY_VIDEO_FORM: VideoFormValues = {
  name: "",
  url: "",
};
