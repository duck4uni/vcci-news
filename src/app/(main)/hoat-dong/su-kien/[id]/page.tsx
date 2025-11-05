// Core
"use client";
import Image from "next/image";
import { useState } from "react";
import { Calendar, MapPin, CreditCard } from "lucide-react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { EVENT_CATEGORIES } from "@constants/categories";
import ListFilter from "@app/dai-dien-gioi-chu/components/list-filter";
import { useGetEventsId } from "@/api/endpoints/event";
import parse from "html-react-parser";
import { useParams } from "next/navigation";
import { GetNewsDetailResponseType } from "@lib/types/news-detail-response-data";
import { GetEventsIdQueryResponseType } from "@api/types/event";
import { Spinner } from "@components/ui/spinner";
import Links  from "@links/index";
import EventCalendar from '@/components/base/event-calendar'
// ...existing code...
const Page: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetEventsId<GetEventsIdQueryResponseType>(
    id as string
  );
  return (
    <div className="min-h-screen w-full container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory categories={EVENT_CATEGORIES} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-white border rounded-md p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner className="size-8" />
                <span className="ml-2 text-gray-600">
                  Đang tải chi tiết sự kiện...
                </span>
              </div>
            ) : (
              <>
                <div className="pb-5 text-primary text-2xl leading-normal font-medium">
                  {data?.responseData?.name}
                </div>
                <hr className="py-2" />

                {/* Top summary with image + details */}
                <div className="flex flex-col lg:flex-row gap-6 my-6">
                  <div className="w-full lg:w-1/2 bg-gray-50 rounded-md overflow-hidden">
                    {data?.responseData?.image ? (
                      <div className="w-full h-52 relative ">
                        {/* Use controlled src state to avoid mutating Image DOM directly */}
                        {/* Next.js <Image> does not expose the underlying img element reliably in all builds */}
                        {/* so keep a React state for src and swap to a fallback on error. */}
                        <EventImage
                          src={`${Links.imageEndpoint}${data.responseData.image}`}
                          alt={data.responseData.name || "image"}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-52 bg-gray-200" />
                    )}
                  </div>

                  <div className="w-full lg:w-1/2 bg-white border rounded-md p-6">
                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-gray-500">
                        Hạn đăng kí:{" "}
                        <span className="text-gray-900 font-medium">
                          {data?.responseData?.created_at
                            ? new Date(
                                data.responseData.created_at
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-yellow-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            Bắt đầu: {data?.responseData?.start_time
                              ? new Date(
                                  data.responseData.start_time
                                ).toLocaleString()
                              : "-"}
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            Kết thúc: {data?.responseData?.end_time
                              ? new Date(
                                  data.responseData.end_time
                                ).toLocaleString()
                              : "-"}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div className="text-sm font-medium text-gray-800">
                          Địa điểm: {data?.responseData?.location ??
                            data?.responseData?.province ??
                            "-"}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-yellow-400" />
                        <div className="text-sm font-medium text-gray-800">
                          Phí tham dự: {data?.responseData?.table_cost
                            ? `${
                                data.responseData.table_count
                              } Bàn : ${data.responseData.table_cost.toLocaleString()} đ`
                            : "Vui lòng xem chi tiết trong bài"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full description */}
                <div className="p-7.5 prose tiptap overflow-hidden">
                  {parse(data?.responseData?.description ?? "")}
                </div>
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <EventCalendar />

            <div className="bg-white border rounded-md overflow-hidden">
              <div className="w-full h-56 relative bg-gray-100">
                <Image
                  src="/banner.webp"
                  alt="Quảng cáo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Page;
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