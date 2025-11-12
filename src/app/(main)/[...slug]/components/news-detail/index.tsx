"use client";

import parse from "html-react-parser";
import dayjs from "dayjs";
import { GetNewsResponseType } from "@/api/types/news";

interface NewsDetailProps {
  data: GetNewsResponseType;
}

export default function NewsDetail({ data }: NewsDetailProps) {
  const news = data?.responseData?.rows?.[0];
  if (!news) return null;

  return (
    <div>
      <h1 className="text-2xl font-medium text-primary">{news.title}</h1>
      <div className="text-sm text-blue-700 mb-4">
        {dayjs(news.created_at).format("DD/MM/YYYY")}
      </div>
      <div className="prose tiptap">{parse(news.description ?? "")}</div>
    </div>
  );
}
