"use client";

import { useEffect } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";

// templates
import InformationPage from "./templates/InformationPage";
import ArticlePage from "./templates/ArticlePage";
import ArticleDetailPage from "./templates/ArticleDetailPage";
import EventPage from "./templates/EventPage";
import EventDetailPage from "./templates/EventDetailPage";
import { Spinner } from "@/components/ui";
import { GetNewsResponseType } from "@/api/types/news";
import { useGetNews } from "@/api/endpoints/news";

export default function DynamicPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");
  const router = useRouter();

  // query
  const { data: news } = useGetNews<GetNewsResponseType>(
    { filters: `external_link==/${path}` }
  );
  const { data: category, isLoading, isError } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    static_link: `/${path}`,
  });

  // redirect to first child if has children
  const children = category?.responseData?.children || [];
  useEffect(() => {
    if (!category) return;
    if (slug.length === 1 && children.length > 0) {
      const firstChild = children[0];
      if (firstChild?.static_link) {
        router.push(firstChild.static_link);
      }
    }
  }, [slug, category, children, router]);

  //template
  if (slug[0] === "hoat-dong" && slug[1] === "su-kien") {
    if (slug.length === 2) return <EventPage />;
    if (slug.length === 3) return <EventDetailPage />;
  }

  if (news?.responseData?.count == 0 && isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <Spinner />
      </div>
    );
  }

  if (news && news?.responseData.rows.length !== 0) {
    return <ArticleDetailPage data={news} />;
  }

  else if (category?.responseData.is_article == true) {
    return <ArticlePage />;
  }

  else if (category?.responseData.is_article == false) {
    return <InformationPage />;
  }

  else if (isError) {
    return notFound();
  }
}