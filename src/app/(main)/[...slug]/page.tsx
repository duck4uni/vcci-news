"use client";

import { useEffect, useMemo } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui";
import ArticlePage from "./templates/ArticlePage";
import ArticleDetailPage from "./templates/ArticleDetailPage";
import InformationPage from "./templates/InformationPage";
import {
  fetchDynamicCategories,
  fetchDynamicPostByExternalLink,
  fetchDynamicSinglePagePost,
  findDynamicCategoryByPath,
  findFirstChildCategory,
  findMenuCategoryForPost,
} from "./templates/data";

export default function DynamicPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");
  const routePath = `/${path}`;
  const router = useRouter();

  const categoryQuery = useQuery({
    queryKey: ["dynamic-categories"],
    queryFn: fetchDynamicCategories,
    staleTime: 5 * 60 * 1000,
  });

  const detailQuery = useQuery({
    queryKey: ["dynamic-post-detail", routePath],
    queryFn: () => fetchDynamicPostByExternalLink(routePath),
    enabled: Boolean(routePath),
    staleTime: 60 * 1000,
  });

  const matchedCategory = useMemo(
    () => findDynamicCategoryByPath(categoryQuery.data ?? [], routePath),
    [categoryQuery.data, routePath],
  );

  const resolvedCategory = useMemo(
    () => matchedCategory ?? findMenuCategoryForPost(detailQuery.data ?? null, categoryQuery.data ?? []),
    [matchedCategory, detailQuery.data, categoryQuery.data],
  );

  const singlePageQuery = useQuery({
    queryKey: ["dynamic-single-page-post", resolvedCategory?.id],
    queryFn: () => fetchDynamicSinglePagePost(resolvedCategory!.id),
    enabled: resolvedCategory?.type === "page",
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!matchedCategory || matchedCategory.type !== "category") return;

    const firstChild = findFirstChildCategory(matchedCategory, categoryQuery.data ?? []);
    if (slug.length === 1 && firstChild?.url) {
      router.replace(firstChild.url);
    }
  }, [matchedCategory, categoryQuery.data, router, slug.length]);

  const isLoading =
    categoryQuery.isLoading ||
    detailQuery.isLoading ||
    (resolvedCategory?.type === "page" && singlePageQuery.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (detailQuery.data) {
    return (
      <ArticleDetailPage
        post={detailQuery.data}
        category={resolvedCategory}
        allCategories={categoryQuery.data ?? []}
      />
    );
  }

  if (resolvedCategory?.type === "page") {
    if (!singlePageQuery.data) return notFound();

    return (
      <InformationPage
        post={singlePageQuery.data}
        category={resolvedCategory}
        allCategories={categoryQuery.data ?? []}
      />
    );
  }

  if (resolvedCategory?.type === "news") {
    return (
      <ArticlePage
        category={resolvedCategory}
        allCategories={categoryQuery.data ?? []}
      />
    );
  }

  if (resolvedCategory?.type === "category") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return notFound();
}
