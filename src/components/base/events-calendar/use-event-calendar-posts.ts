"use client";

import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getApiV10Post } from "@/api/vcci-news/endpoints/post";
import type { RawEventCalendarPost } from "@/api/vcci-news/types/post-raw";
import type { PagedResult } from "@/api/vcci-news/types/paged-result";
import type { GetApiV10PostParams } from "@/api/vcci-news/models/getApiV10PostParams";
import {
  buildPostLink,
  normalizeLink,
  resolveAssetUrl,
} from "@/lib/utils/post";
import { MOCK_HOME_POSTS } from "@/mockdata/home-posts";
import { useMemo } from "react";

type RawHomePost = RawEventCalendarPost;

export type EventCalendarCategory = {
  id: string;
  name: string;
  slug: string;
  url: string;
  type: string;
};

export type EventCalendarItem = {
  id: string;
  title: string;
  externalLink: string;
  summary: string;
  contentText: string;
  createdAt: string;
  publishedAt: string;
  startedAt: string;
  endedAt: string;
  registrationDeadline: string;
  location: string;
  participationFee: string;
  expiredAt: string;
  isFeatured: boolean;
  isHidden: boolean;
  isActive: boolean;
  status: string;
  type: string;
  eventDates?: string[];
  categories: EventCalendarCategory[];
  thumbnail: {
    url: string;
    alt: string;
  } | null;
};

const EVENT_CATEGORY_IDS = {
  suKien: "b85f6710-bcbc-4c0b-8b3a-09fff0e5e51a",
  daoTao: "36df7021-9a74-43d6-9084-0d5ed347b7f4",
} as const;


const mapRawPostToEventCalendarItem = (item: RawHomePost): EventCalendarItem => {
  const categories = (item.categories ?? [])
    .filter((category) => category?.id && category?.name)
    .map((category) => ({
      id: String(category.id),
      name: String(category.name),
      slug: String(category.slug ?? ""),
      url: normalizeLink(category.url, "#"),
      type: String(category.type ?? ""),
    }));

  const thumbnailPath = item.thumbnail?.path ?? item.thumbnail?.original ?? null;
  const title = String(item.title ?? "").trim();
  const externalLink = buildPostLink(
    item.slug ? `/${item.slug}` : (title ? `/${title}` : undefined),
    item.id ? String(item.id) : "",
    "#",
  );

  return {
    id: String(item.id ?? ""),
    title,
    externalLink,
    summary: String(item.summary ?? item.content ?? ""),
    contentText: String(
      item.content_structure?.post_content?.[0]?.content ??
      item.summary ??
      item.content ??
      ""
    ),
    createdAt: String(item.created_at ?? ""),
    publishedAt: String(item.published_at ?? item.release_at ?? item.created_at ?? ""),
    startedAt: String(item.started_at ?? ""),
    endedAt: String(item.ended_at ?? ""),
    registrationDeadline: String(item.registration_deadline ?? ""),
    location: String(item.location ?? ""),
    participationFee: String(item.participation_fee ?? ""),
    expiredAt: String(item.expired_at ?? ""),
    isFeatured: Boolean(item.is_featured),
    isHidden: Boolean(item.is_hidden),
    isActive: item.is_active !== false,
    status: String(item.status ?? ""),
    type: String(item.type ?? ""),
    eventDates: Array.isArray(item.event_dates)
      ? item.event_dates.filter((d): d is string => typeof d === "string")
      : [],
    categories,
    thumbnail: thumbnailPath
      ? {
        url: resolveAssetUrl(thumbnailPath),
        alt: title,
      }
      : null,
  };
};

async function fetchEventCalendarRows(params: GetApiV10PostParams) {
  const response = await getApiV10Post(params);
  const rows =
    (response as PagedResult<RawHomePost> | undefined)?.responseData?.rows ?? [];
  return rows.map<EventCalendarItem>(mapRawPostToEventCalendarItem);
}

/**
 * Params lịch sự kiện theo tháng: filter theo tháng được thực hiện hoàn toàn
 * ở BE. Toán tử `[]` = date between; đặt `registration_deadline` cuối cùng
 * (trước `[]`) để BE nhận diện đây là monthly-event query (pageSize=0 => trả
 * toàn bộ, không giới hạn). Cú pháp `field1|field2|field3[](start|end)` tạo
 * điều kiện OR: event rơi vào tháng khi registration_deadline / started_at /
 * ended_at nằm trong khoảng tháng đó.
 */
function createEventCalendarParams(currentMonth: Date): GetApiV10PostParams {
  const monthStart = dayjs(currentMonth).startOf("month").format("YYYY-MM-DD");
  const monthEnd = dayjs(currentMonth).endOf("month").format("YYYY-MM-DDTHH:mm:ss");

  return {
    page: 1,
    pageSize: 0,
    sortField: "started_at",
    sortOrder: "asc",
    priorityFeatured: false,
    filters: [
      `category.id==(${EVENT_CATEGORY_IDS.suKien}|${EVENT_CATEGORY_IDS.daoTao})`,
      "is_hidden==false",
      "is_active==true",
      "type==event",
      `registration_deadline|started_at|ended_at[](${monthStart}|${monthEnd})`,
    ].join(","),
  };
}

export function useEventCalendarPosts(currentMonth: Date) {
  const params = useMemo(
    () => createEventCalendarParams(currentMonth),
    [currentMonth],
  );

  const query = useQuery({
    queryKey: ["event-calendar-posts", params] as const,
    queryFn: async () => {
      try {
        return await fetchEventCalendarRows(params);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("[useEventCalendarPosts] CMS unavailable, falling back to mock data", error);
        return MOCK_HOME_POSTS.filter((item) => Boolean(item.registrationDeadline));
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return query;
}
