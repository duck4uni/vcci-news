'use client';

import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import ListCategory from "@/components/base/list-category";
import { useParams } from "next/dist/client/components/navigation";
import { Spinner } from "@/components/ui/spinner";
import { GetNewsResponseType } from "@/api/types/news";
import { useGetNews } from "@/api/endpoints/news";
import dayjs from "dayjs";
import parse from "html-react-parser";

export default function InformationPage() {
  // get url
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");

  // query
  const { data: category } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    static_link: `/${slug[0]}`,
  });

  const { data, isLoading } = useGetNews<GetNewsResponseType>({
    filters: `page_config.static_link==/${path}`,
  });

  //template
  return (
    <div className='container w-full flex justify-center items-center pb-10'>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Spinner />
        </div>
      ) : (
        <div className='flex flex-col gap-5 w-full'>
          <ListCategory categories={category?.responseData?.children} />
          <main className=" bg-white border rounded-md py-10 px-30">
            <div className='text-primary text-2xl leading-normal font-bold'>
              {data?.responseData?.rows[0].title}
            </div>
            {/* <div className='flex items-center gap-2 text-sm mb-4'>
            <span className='text-base text-blue-700'>
              {dayjs(data?.responseData?.rows[0].created_at).format('DD/MM/YYYY')}
            </span>
          </div> */}
            <hr className="my-5" />
            <div className='flex-1 text-app-grey text-base overflow-hidden'>
              <div className="prose tiptap overflow-hidden">
                {parse(data?.responseData?.rows[0].description ?? '')}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}