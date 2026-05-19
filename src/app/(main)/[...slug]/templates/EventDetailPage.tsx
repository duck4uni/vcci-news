'use client';

import { useState } from "react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";

import dayjs from "dayjs";
import parse from "html-react-parser";
import { resolveUploadUrl } from "@/links";

import { useGetEvents } from "@/api/endpoints/event";
import { EventApiResponse } from "@/api/types/event";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";

import { Spinner } from "@/components/ui/spinner";
import ListCategory from "@/components/base/list-category";
import EventCalendar from "@/components/base/event-calendar";
import { CreditCard, MapPin, Clock } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const lastpath = slug[slug.length - 1];

  // query
  const { data: category } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: `${slug[0]}`,
  });

  const { data: eventsDetail, isLoading } = useGetEvents<EventApiResponse>({
    filters: `id==${lastpath}`,
  });

  // template
  if (!isLoading && (!eventsDetail?.responseData?.rows || eventsDetail.responseData.rows.length === 0)) {
    return notFound();
  }
  return (
    <div className='container flex w-full items-center justify-center px-4 pb-10 sm:px-6 lg:px-10'>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Spinner />
        </div>
      ) : (
        <div className='flex w-full flex-col gap-5'>
          <ListCategory categories={category?.responseData?.children} />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <main className="min-w-0 rounded-md border bg-white px-4 py-6 sm:px-6 md:px-10 lg:px-14 lg:py-10">
              <div className='pb-5 text-primary text-2xl leading-normal font-medium'>
                {eventsDetail?.responseData?.rows[0]?.name}
              </div>
              <hr className="py-2" />

              {/* Top summary with image + details */}
              <div className="my-6 flex flex-col gap-6 md:flex-row">
                <div className="w-full overflow-hidden rounded-md bg-gray-50 md:w-1/2">
                  {eventsDetail?.responseData?.rows[0].image ? (
                    <div className="w-full h-52 relative ">
                      <EventImage
                        src={resolveUploadUrl(eventsDetail?.responseData?.rows[0].image)}
                        alt={eventsDetail?.responseData?.rows[0]?.name || "image"}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-52 bg-gray-200" />
                  )}
                </div>

                <div className="w-full rounded-md border bg-white p-3 md:w-1/2 md:p-6">
                  <div className="flex flex-col gap-3">
                    <div className="text-sm text-gray-500 flex flex-row items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          Bắt đầu: {eventsDetail?.responseData?.rows[0].start_time
                            ? dayjs(
                              eventsDetail.responseData.rows[0].start_time
                            ).format('HH:mm DD/MM/YYYY')
                            : "-"}
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          Kết thúc: {eventsDetail?.responseData?.rows[0].end_time
                            ? dayjs(
                              eventsDetail.responseData.rows[0].end_time
                            ).format('HH:mm DD/MM/YYYY')
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div className="text-sm font-medium text-gray-800">
                        Địa điểm: {eventsDetail?.responseData?.rows[0]?.location ??
                          eventsDetail?.responseData?.rows[0]?.province ??
                          "-"}
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-yellow-400" />
                      <div className="text-sm font-medium text-gray-800">
                        Phí tham dự: {eventsDetail?.responseData?.rows[0]?.table_cost
                          ? `${eventsDetail?.responseData?.rows[0]?.table_count
                          } Bàn : ${eventsDetail?.responseData?.rows[0]?.table_cost.toLocaleString()} đ`
                          : "Vui lòng xem chi tiết trong bài"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full description */}
              <div className="prose tiptap max-w-none overflow-hidden">
                {parse(eventsDetail?.responseData?.rows[0]?.description ?? "")}
              </div>
            </main>

            {/* Sidebar */}
            <aside className="min-w-0 space-y-6">
              <EventCalendar />
              <div className="bg-white border rounded-md overflow-hidden">
                <div className="w-full h-75 relative bg-gray-100">
                  <Image
                    src="/banner.webp"
                    alt="Quảng cáo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div >
  );
}

// Local small component to safely handle Image src fallback without mutating DOM
type EventImageProps = {
  src: string;
  alt?: string;
};

function EventImage({ src, alt }: EventImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src);

  return (
    <Image
      src={imgSrc}
      alt={alt ?? "image"}
      fill
      className="object-cover"
      onError={() => {
        // swap to local fallback file when Next/Image fails to load the provided URL
        if (imgSrc !== "/img-error.png") setImgSrc("/img-error.png");
      }}
    />
  );
}
