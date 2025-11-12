"use client";

import parse from "html-react-parser";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui";
import { useGetNewsId } from "@/api/endpoints/news";
import { GetNewsDetailResponseType } from "./../../page.type";

interface EventDetailProps {
  id?: string;
}

export default function EventDetail({ id }: EventDetailProps) {
  if (!id) return null;

  const { data: eventDetail, isLoading } = useGetNewsId<GetNewsDetailResponseType>(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner />
      </div>
    );
  }

  const event = eventDetail?.responseData;
  if (!event) return null;

  return (
    <div>
      <h1 className="text-2xl font-medium text-primary">{event.title}</h1>
      <div className="text-sm text-blue-700 mb-4">
        {dayjs(event.created_at).format("DD/MM/YYYY")}
      </div>
      <div className="prose tiptap">{parse(event.description ?? "")}</div>
    </div>
  );
}
