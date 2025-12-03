"use client";

import { notFound, useParams } from "next/navigation";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";
import { GetNewsResponseType, NewsResponseData } from "@/api/types/news";

// templates
import InformationPage from "./templates/InformationPage";
import ArticlePage from "./templates/ArticlePage";
import { Spinner } from "@/components/ui";
import { useGetNews } from "@/api/endpoints/news";
import ArticleDetailPage from "./templates/ArticleDetailPage";

export default function DynamicPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");
  const lastThree = slug.slice(-3).join('/');

  // query
  const { data: category, isLoading, isError } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    static_link: `/${path}`,
  });

  const data = useGetNews<GetNewsResponseType>(
    { filters: `external_link==/${lastThree}` }
  );

  // const children = category?.responseData?.children || [];
  // // redirect to first child if has children
  // useEffect(() => {
  //   if (!category) return;
  //   if (slug.length === 1 && children.length > 0) {
  //     const firstChild = children[0];
  //     if (firstChild?.static_link) {
  //       router.push(firstChild.static_link);
  //     }
  //   }
  // }, [slug, category, children, router]);

  //template
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center w-full h-64">
  //       <Spinner />
  //     </div>
  //   );
  // }

  // not found page
  // if (isError) {
  //   return notFound();
  // }

  // default
  return (data?.data?.responseData?.rows.length !== 0 ? <ArticleDetailPage /> : (
    category?.responseData?.is_article ?
      <ArticlePage isError={isError} isLoading={isLoading} /> :
      <InformationPage isError={isError} isLoading={isLoading} />
  ));
}
