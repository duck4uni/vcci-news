'use client';

import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import ListCategory from "@/components/base/list-category";
import { useParams } from "next/dist/client/components/navigation";
import { GetNewsResponseType } from "@/api/types/news";
import EventCalendar from "@/components/base/event-calendar";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { Spinner } from "@/components/ui";

export default function ArticleDetailPage({ data }: { data: GetNewsResponseType }) {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];

  //query
  const { data: category } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: slug[0],
  });

  const children = category?.responseData?.children ?? [];
  // template
  return (
    <div className='container w-full flex justify-center items-center pb-10'>
      <div className='flex flex-col gap-5 w-full'>
        {children.length !== 0 ? (
          <ListCategory categories={children} />
        ) : (
          <br />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <main className="lg:col-span-2 bg-white border rounded-md p-8">
            <div className='pb-5 text-primary text-2xl leading-normal font-medium'>
              {data?.responseData?.rows[0]?.title}
            </div>
            <div className='flex items-center gap-2 text-sm mb-4'>
              <span className='text-base text-blue-700'>
                {dayjs(data?.responseData?.rows[0]?.created_at).format('DD/MM/YYYY')}
              </span>
            </div>
            <hr className="my-5" />
            <div className='flex-1 text-app-grey text-base overflow-hidden'>
              <div className="prose tiptap overflow-hidden">
                {parse(data?.responseData?.rows[0]?.description ?? '')}
              </div>
            </div>
          </main>
          <aside className="space-y-6">
            <EventCalendar />
          </aside>
        </div>
      </div>
    </div>
  );
}