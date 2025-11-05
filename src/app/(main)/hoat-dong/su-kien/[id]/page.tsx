// Core
"use client";
import Image from "next/image";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { EVENT_CATEGORIES } from "@constants/categories";
import ListFilter from "@app/dai-dien-gioi-chu/components/list-filter";
import {useGetEventsId} from '@/api/endpoints/event';
import parse from "html-react-parser";
import { useParams } from 'next/navigation'
import { GetNewsDetailResponseType } from '@lib/types/news-detail-response-data';
import {GetEventsIdQueryResponseType} from '@api/types/event';
import { Spinner } from "@components/ui/spinner";
// ...existing code...
const Page: React.FC = () => {
    const { id } = useParams()
    const { data, isLoading } = useGetEventsId<GetEventsIdQueryResponseType>(id as string)
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
                <span className="ml-2 text-gray-600">Đang tải chi tiết sự kiện...</span>
              </div>
            ) : (
              <>
                <div className='pb-5 text-primary text-2xl leading-normal font-medium'>
                  {data?.responseData?.name}
                </div>
                <hr className="py-2"/>
                <div className="p-7.5 prose tiptap overflow-hidden">{parse(data?.responseData?.description ?? '')}</div>
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <ListFilter />

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
