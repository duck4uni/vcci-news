"use client";

import { useEffect, useMemo } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui";
import ArticlePage from "./templates/ArticlePage";
import ArticleDetailPage from "./templates/ArticleDetailPage";
import CatalogPage from "./templates/CatalogPage";
import InformationPage from "./templates/InformationPage";
import {
  fetchDynamicCategories,
  fetchDynamicPostById,
  fetchDynamicPostByExternalLink,
  fetchDynamicSinglePagePost,
  findDynamicCategoryByPath,
  findFirstChildCategory,
  findMenuCategoryForPost,
} from "./templates/data";

export default function DynamicPageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");
  const routePath = `/${path}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id")?.trim() ?? "";
  const preferredCategoryId = searchParams.get("categoryId")?.trim() ?? "";

  const categoryQuery = useQuery({
    queryKey: ["dynamic-categories"],
    queryFn: fetchDynamicCategories,
    staleTime: 5 * 60 * 1000,
  });

  const matchedCategory = useMemo(
    () => findDynamicCategoryByPath(categoryQuery.data ?? [], routePath),
    [categoryQuery.data, routePath],
  );

  const detailQuery = useQuery({
    queryKey: ["dynamic-post-detail", postId || routePath],
    queryFn: () =>
      postId
        ? fetchDynamicPostById(postId)
        : fetchDynamicPostByExternalLink(routePath),
    enabled:
      (Boolean(postId) || Boolean(routePath)) &&
      !categoryQuery.isLoading &&
      (Boolean(postId) || !matchedCategory),
    staleTime: 60 * 1000,
  });

  const resolvedCategory = useMemo(
    () =>
      (preferredCategoryId
        ? categoryQuery.data?.find((item) => item.id === preferredCategoryId) ?? null
        : null) ??
      matchedCategory ??
      findMenuCategoryForPost(detailQuery.data ?? null, categoryQuery.data ?? []),
    [preferredCategoryId, matchedCategory, detailQuery.data, categoryQuery.data],
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
    if (
      resolvedCategory.slug === "an-pham" ||
      resolvedCategory.slug === "thu-vien-tai-lieu"
    ) {
      return (
        <CatalogPage
          category={resolvedCategory}
          allCategories={categoryQuery.data ?? []}
        />
      );
    }

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
