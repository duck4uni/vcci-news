'use client';

import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import ListCategory from "@/components/base/list-category";
import { useParams } from "next/dist/client/components/navigation";
import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType } from "@/api/types/news";
import EventCalendar from "@/components/base/event-calendar";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { Spinner } from "@/components/ui";
import { notFound } from "next/navigation";

export default function ArticleDetailPage() {
  // get url
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");

  //query
  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    code: slug[0],
  });
  const { data, isLoading } = useGetNews<GetNewsResponseType>({
    filters: `external_link==/${path}`,
  });

  // template
  if (!isLoading && (!data?.responseData?.rows || data.responseData.rows.length === 0)) {
    return notFound();
  }
  return (
    <div className='container w-full flex justify-center items-center pb-10'>
      {isLoading ? (
        <div className='flex justify-center items-center w-full h-64'>
          <Spinner />
        </div>
      ) : (
        <div className='flex flex-col gap-5 w-full'>
          <ListCategory categories={categoriesPage?.responseData?.children} />
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
      )}
    </div>
  );
}