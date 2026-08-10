'use client';

import ListCategory from "@/components/base/list-category";
import { buildDynamicCategoryMenu } from "./data";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "./types";
import {
  ABOUT_VCCI_HCM_SLUG,
  AboutVcciHcmPage,
  DefaultInformationPage,
  LEGAL_TRADE_PAGE_SLUGS,
  LegalTradePages,
  MARKET_PROFILE_PAGE_SLUG,
  MarketProfilePage,
  MEMBER_REGISTRATION_PAGE_SLUG,
  MEMBER_BENEFITS_PAGE_SLUG,
  MemberRegistrationPage,
  MemberBenefitsPage,
  SERVICE_PAGE_SLUG,
  ServicePage,
} from "./information-pages";

type InformationPageProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem;
  allCategories: DynamicCategoryRouteItem[];
};

const LEGAL_TRADE_CATEGORY_ID = "69b4c7e7-28ea-41f2-97f4-988fe702a8a3";
const LEGAL_TRADE_CHILD_SLUGS = new Set([
  "xuat-xu-hang-hoa-co",
  "thu-tuc-cap-co",
  "bieu-mau-co-va-cach-khai",
  "phi-va-le-phi-cap-co",
  "diem-cap-va-thoi-gian-cap-co",
  "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm",
  "thong-tin-lien-he-co",
]);

function resolveInformationVariant(post: DynamicPostItem, category: DynamicCategoryRouteItem) {
  if (
    category.slug === ABOUT_VCCI_HCM_SLUG ||
    post.slug === ABOUT_VCCI_HCM_SLUG ||
    post.categories.some((item) => item.url === "/gioi-thieu/ve-vcci-hcm")
  ) {
    return "about-vcci-hcm" as const;
  }

  if (
    category.slug === SERVICE_PAGE_SLUG ||
    post.slug === SERVICE_PAGE_SLUG ||
    post.categories.some((item) => item.url === "/gioi-thieu/dich-vu-cung-cap")
  ) {
    return "service" as const;
  }

  if (
    category.slug === MEMBER_BENEFITS_PAGE_SLUG ||
    post.slug === MEMBER_BENEFITS_PAGE_SLUG ||
    post.categories.some((item) => item.url === "/hoi-vien/loi-ich-hoi-vien-vcci")
  ) {
    return "member-benefits" as const;
  }

  if (
    category.slug === MEMBER_REGISTRATION_PAGE_SLUG ||
    post.slug === MEMBER_REGISTRATION_PAGE_SLUG ||
    post.categories.some((item) => item.url === "/hoi-vien/dang-ky-hoi-vien")
  ) {
    return "member-registration" as const;
  }

  if (
    category.slug === MARKET_PROFILE_PAGE_SLUG ||
    post.slug === MARKET_PROFILE_PAGE_SLUG ||
    post.categories.some((item) => item.url === "/xuc-tien-thuong-mai/ho-so-thi-truong")
  ) {
    return "market-profile" as const;
  }

  if (
    LEGAL_TRADE_PAGE_SLUGS.has(category.slug) ||
    category.parent_id === LEGAL_TRADE_CATEGORY_ID ||
    LEGAL_TRADE_CHILD_SLUGS.has(category.slug) ||
    LEGAL_TRADE_PAGE_SLUGS.has(post.slug) ||
    LEGAL_TRADE_CHILD_SLUGS.has(post.slug) ||
    post.categories.some((item) => item.id === LEGAL_TRADE_CATEGORY_ID) ||
    post.categories.some(
      (item) =>
        item.url === "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai" ||
        item.url === "/phap-che-va-cttm" ||
        item.url.startsWith("/xuat-xu-hang-hoa/"),
    )
  ) {
    return "legal-trade" as const;
  }

  return "default" as const;
}

function hasRenderablePostData(post: DynamicPostItem) {
  if (post.content.trim()) return true;

  const sections = post.content_structure?.post_content ?? [];
  return sections.some((section) => section.content.trim() || section.images.length > 0);
}

export default function InformationPage({
  post,
  category,
  allCategories,
}: InformationPageProps) {
  const categoryMenu = buildDynamicCategoryMenu(category, allCategories);
  const variant = resolveInformationVariant(post, category);
  const useSpecialUi =
    variant === "about-vcci-hcm" ||
    (variant !== "default" && !hasRenderablePostData(post));

  return (
    <div className="min-h-screen bg-white">
      {categoryMenu.length ? <ListCategory categories={categoryMenu} /> : null}
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-10 lg:pb-6">
        <main className="w-full">
          {useSpecialUi ? (
            variant === "about-vcci-hcm" ? (
              <AboutVcciHcmPage post={post} />
            ) : variant === "service" ? (
              <ServicePage post={post} />
            ) : variant === "member-benefits" ? (
              <MemberBenefitsPage />
            ) : variant === "member-registration" ? (
              <MemberRegistrationPage post={post} />
            ) : variant === "market-profile" ? (
              <MarketProfilePage post={post} />
            ) : variant === "legal-trade" ? (
              <LegalTradePages post={post} category={category} />
            ) : (
              <DefaultInformationPage post={post} />
            )
          ) : (
            <DefaultInformationPage post={post} />
          )}

          <div className="page-detail-styles">
            <style jsx global>{`
              .page-detail-content {
                color: #1f2937;
                line-height: 1.85;
                width: 100%;
                max-width: 100%;
              }

              .page-detail-content p,
              .page-detail-content div {
                margin: 0 0 18px;
                max-width: 100% !important;
                box-sizing: border-box;
              }

              .page-detail-content h1,
              .page-detail-content h2,
              .page-detail-content h3,
              .page-detail-content h4,
              .page-detail-content h5,
              .page-detail-content h6 {
                margin: 0 0 18px;
                color: #111827;
                font-weight: 700;
                line-height: 1.45;
              }

              .page-detail-content :is(p, div, span, li, a, strong, em, u, s) {
                font-family: inherit;
              }

              .page-detail-content img {
                display: block;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                margin: 24px auto 10px;
                border-radius: 14px;
              }

              .page-detail-content figure {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 28px 0;
                text-align: center;
              }

              .page-detail-content .article-content,
              .page-detail-content .article-content_toc,
              .page-detail-content table,
              .page-detail-content iframe {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box;
              }

              .page-detail-content table {
                display: table;
                table-layout: fixed;
              }

              .page-detail-content figcaption,
              .page-detail-content .wp-caption-text {
                margin-top: 10px;
                color: #6b7280;
                font-size: 14px;
                line-height: 1.6;
                text-align: center;
              }

              .page-detail-content a {
                color: #14519f;
                font-weight: 600;
              }

              .page-detail-content ul,
              .page-detail-content ol {
                margin: 18px 0;
                padding-left: 24px;
              }

              .page-detail-content li {
                margin: 8px 0;
              }
            `}</style>
          </div>
        </main>
      </div>
    </div>
  );
}
