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
import { notFound } from "next/navigation";
import { is } from "date-fns/locale";

export default function InformationPage({ isError, isLoading }: { isError: boolean, isLoading: boolean }) {
  // get url
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");

  // query
  const { data: categoryPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    static_link: `/${slug[0]}`,
  });

  const { data: information, isLoading: informationLoading } = useGetNews<GetNewsResponseType>({
    filters: `page_config.static_link==/${path}`,
  });

  //template
  if (isLoading) return (
    <div className="flex justify-center items-center w-full h-64">
      <Spinner />
    </div>
  );
  if (isError) return notFound();

  return (
    <div className='container w-full flex justify-center items-center pb-10'>
      {informationLoading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Spinner />
        </div>
      ) : (
        <div className='flex flex-col gap-5 w-full'>
          <ListCategory categories={categoryPage?.responseData?.children} />
          <main className=" bg-white border rounded-md py-10 px-5 md:px-20 lg:px-20">
            <div className='text-primary text-2xl leading-normal font-bold'>
              {information?.responseData?.rows[0]?.title}
            </div>
            {/* <div className='flex items-center gap-2 text-sm mb-4'>
            <span className='text-base text-blue-700'>
              {dayjs(information?.responseData?.rows[0].created_at).format('DD/MM/YYYY')}
            </span>
          </div> */}
            <hr className="my-5" />
            <div className='flex-1 text-app-grey text-base overflow-hidden'>
              <div className="prose tiptap overflow-hidden">
                {parse(information?.responseData?.rows[0]?.description ?? '')}
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}