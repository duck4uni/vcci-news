"use client";

import { useEffect, useMemo } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui";
import NewsPage from "./templates/NewsPage";
import NewsDetailPage from "./templates/NewsDetailPage";
import InformationPage from "./templates/InformationPage";
import AnPham from "./static-pages/AnPham";
import ThuVienTaiLieu from "./static-pages/ThuVienTaiLieu";
import AboutVcciHcm from "./static-pages/AboutVcciHcm";
import Service from "./static-pages/Service";
import MemberRegistration from "./static-pages/MemberRegistration";
import MarketProfile from "./static-pages/MarketProfile";
import MemberBenefits from "./static-pages/MemberBenefits";
import PhapChe from "./static-pages/PhapChe";
import CertificateTradeDocument from "./static-pages/CertificateTradeDocument";
import Procedure from "./static-pages/Procedure";
import Forms from "./static-pages/Forms";
import Fees from "./static-pages/Fees";
import Locations from "./static-pages/Locations";
import Contact from "./static-pages/Contact";
import MemberDirectory from "./static-pages/MemberDirectory";
import Search from "./static-pages/Search";
import SiteMap from "./static-pages/SiteMap";
import Video from "./static-pages/Video";
import { useGetApiV10Post } from "@/api/vcci-news/endpoints/post";
import { useGetApiV10Category } from "@/api/vcci-news/endpoints/category";
import type { DynamicPostItem, DynamicCategoryRouteItem } from "./templates/types";

const normalizePath = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
};

const getSlugFromPath = (value?: string | null) => {
  const normalizedPath = normalizePath(value);
  const segments = normalizedPath.split("/").filter(Boolean);
  const lastSegment = segments.at(-1);
  if (!lastSegment) return "";
  try {
    return decodeURIComponent(lastSegment).trim();
  } catch {
    return lastSegment.trim();
  }
};

export default function DynamicPageClient() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug : [params.slug];
  const path = slug.join("/");
  const routePath = `/${path}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id")?.trim() ?? "";
  const preferredCategoryId = searchParams.get("categoryId")?.trim() ?? "";

  // Detect ending slug for static pages (multi-depth support: /abc, /x/abc, /x/y/abc)
  const endingSlug = slug.length > 0 ? String(slug[slug.length - 1] ?? "") : "";
  const isStaticPage = [
    "an-pham", "thu-vien-tai-lieu", "ve-vcci-hcm", "dich-vu-cung-cap",
    "dang-ky-hoi-vien", "ho-so-thi-truong", "loi-ich-hoi-vien-vcci",
    "phap-che", "giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm",
    "quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm",
    "bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm", "phi-cap-gcn-va-xac-nhan-cttm",
    "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm", "thong-tin-lien-he",
    "danh-ba-hoi-vien", "search", "site-map", "video",
  ].includes(endingSlug);

  const { data: categoryData, isLoading: categoryLoading } = useGetApiV10Category({
    page: 1,
    pageSize: 200,
    sortField: "sort_order",
    sortOrder: "asc",
  });

  const allCategories = useMemo(
    () =>
      ((categoryData?.responseData?.rows ?? []) as unknown as DynamicCategoryRouteItem[])
        .filter((item) => item.id && item.name && item.type)
        .sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER)),
    [categoryData],
  );

  const matchedCategory = useMemo(
    () => allCategories.find((item) => normalizePath(item.url) === normalizePath(routePath)) ?? null,
    [allCategories, routePath],
  );

  const needsCategory = ["an-pham", "thu-vien-tai-lieu", "ve-vcci-hcm", "dich-vu-cung-cap", "dang-ky-hoi-vien", "ho-so-thi-truong"].includes(endingSlug);

  // Fetch post detail by id or slug (for news articles)
  const postSlug = getSlugFromPath(routePath);
  const detailFilters = postId
    ? `id==${postId},is_hidden==false,is_active==true,type==news`
    : postSlug
      ? `slug==${postSlug},is_hidden==false,is_active==true,type==news`
      : undefined;

  const { data: detailData, isLoading: detailLoading } = useGetApiV10Post(
    {
      page: 1,
      pageSize: 1,
      sortField: "release_at",
      sortOrder: "desc",
      filters: detailFilters,
    },
    {
      query: {
        enabled: !isStaticPage && !needsCategory && Boolean(detailFilters) && !categoryLoading && (Boolean(postId) || !matchedCategory),
      },
    },
  );

  const detailPost = (detailData?.responseData?.rows?.[0] ?? null) as unknown as DynamicPostItem | null;

  const resolvedCategory = useMemo(
    () =>
      (preferredCategoryId
        ? allCategories.find((item) => item.id === preferredCategoryId)
        : undefined) ??
      matchedCategory ??
      (detailPost
        ? allCategories.find((cat) => detailPost.categories?.some((c) => c.id === cat.id))
        : null),
    [preferredCategoryId, matchedCategory, detailPost, allCategories],
  );

  // Fetch single page post (for type === "page")
  const singlePageFilters = matchedCategory?.id
    ? `category.id==${matchedCategory.id},is_hidden==false,is_active==true,type==page`
    : undefined;

  const { data: singlePageData } = useGetApiV10Post(
    {
      page: 1,
      pageSize: 1,
      sortField: "release_at",
      sortOrder: "desc",
      filters: singlePageFilters,
    },
    {
      query: {
        enabled: Boolean(matchedCategory?.id) && matchedCategory?.type === "page",
      },
    },
  );

  const singlePagePost = (singlePageData?.responseData?.rows?.[0] ?? null) as unknown as DynamicPostItem | null;

  // Redirect: if URL is /hoi-vien (1 segment) and type === "category" → redirect to first child
  useEffect(() => {
    if (!matchedCategory || matchedCategory.type !== "category") return;

    const firstChild = allCategories
      .filter((item) => item.parent_id === matchedCategory.id)
      .sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER))[0];

    if (slug.length === 1 && firstChild?.url) {
      router.replace(firstChild.url);
    }
  }, [matchedCategory, allCategories, router, slug.length]);


  // all page components
  const isLoading =
    categoryLoading ||
    detailLoading ||
    (resolvedCategory?.type === "page" && !singlePagePost) ||
    resolvedCategory?.type === "category";

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  switch (endingSlug) {
    case "an-pham":
      return (
        <AnPham
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "thu-vien-tai-lieu":
      return (
        <ThuVienTaiLieu
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "ve-vcci-hcm":
      return (
        <AboutVcciHcm
          post={singlePagePost}
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "dich-vu-cung-cap":
      return (
        <Service
          post={singlePagePost}
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "dang-ky-hoi-vien":
      return (
        <MemberRegistration
          post={singlePagePost}
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "ho-so-thi-truong":
      return (
        <MarketProfile
          post={singlePagePost}
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "loi-ich-hoi-vien-vcci":
      return (
        <MemberBenefits
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "phap-che":
      return (
        <PhapChe
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm":
      return (
        <CertificateTradeDocument
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm":
      return (
        <Procedure
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm":
      return (
        <Forms
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "phi-cap-gcn-va-xac-nhan-cttm":
      return (
        <Fees
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm":
      return (
        <Locations
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "thong-tin-lien-he":
      return (
        <Contact
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "danh-ba-hoi-vien":
      return (
        <MemberDirectory
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "search":
      return (
        <Search
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "site-map":
      return (
        <SiteMap
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
    case "video":
      return (
        <Video
          category={matchedCategory}
          allCategories={allCategories}
        />
      );
  }

  if (detailPost) {
    return (
      <NewsDetailPage
        post={detailPost}
        category={resolvedCategory ?? null}
        allCategories={allCategories}
      />
    );
  }

  if (resolvedCategory?.type === "page") {
    if (!singlePagePost) return notFound();

    return (
      <InformationPage
        post={singlePagePost}
        category={resolvedCategory}
        allCategories={allCategories}
      />
    );
  }

  if (resolvedCategory?.type === "news") {
    return (
      <NewsPage
        category={resolvedCategory}
        allCategories={allCategories}
      />
    );
  }

  return notFound();
}
