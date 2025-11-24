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

export default function DynamicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");

  // query
  const { data: category } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>({
    static_link: `/${path}`,
  });

  const children = category?.responseData?.children || [];
  // redirect to first child if has children
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
  if (slug.length === 1 && children.length > 0) {
    return null;
  }

  if (slug[0] === "hoat-dong" && slug[1] === "su-kien") {
    if (slug.length === 2) return <EventPage />;
    if (slug.length === 3) return <EventDetailPage />;
  }

  if (slug.length === 2) {
    return category?.responseData?.is_article ? <ArticlePage /> : <InformationPage />;
  }

  if (slug.length === 3) {
    return <ArticleDetailPage />;
  }
}
