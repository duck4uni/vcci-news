'use client';

import { useParams } from "next/navigation";
import type { DynamicCategoryRouteItem, DynamicPostItem } from "../../types";
import ContactPage from "./ContactPage";
import CertificateTradeDocumentPage from "./CertificateTradeDocumentPage";
import FeesPage from "./FeesPage";
import FormsPage from "./FormsPage";
import LocationsPage from "./LocationsPage";
import PhapChePage from "./PhapChePage";
import ProcedurePage from "./ProcedurePage";

type LegalTradeRouterProps = {
  post: DynamicPostItem;
  category: DynamicCategoryRouteItem;
};

function resolveVariant(post: DynamicPostItem, category: DynamicCategoryRouteItem) {
  const url = category.url || post.external_link;
  const slug = category.slug || post.slug;
  const externalLink = post.external_link;

  if (
    slug === "phap-che" ||
    url === "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/phap-che"
  ) {
    return "phap-che" as const;
  }

  if (
    slug === "giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm" ||
    url ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/giay-chung-nhan-gcn-va-chung-tu-thuong-mai-cttm"
  ) {
    return "certificate-trade-document" as const;
  }

  if (
    slug === "quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm" ||
    slug === "thu-tuc-cap-co" ||
    url ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/quy-trinh-tiep-nhan-ho-so-cap-gcn-va-xac-nhan-cttm" ||
    url === "/xuat-xu-hang-hoa/thu-tuc-cap-co"
  ) {
    return "procedure" as const;
  }

  if (slug === "bieu-mau-co-va-cach-khai" || url === "/xuat-xu-hang-hoa/bieu-mau-co-va-cach-khai") {
    return "forms" as const;
  }

  if (
    slug === "bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm" ||
    externalLink ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm" ||
    url ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/bieu-mau-gcn-va-noi-dung-khai-bao-gcn-cttm"
  ) {
    return "forms" as const;
  }

  if (
    slug === "phi-cap-gcn-va-xac-nhan-cttm" ||
    slug === "phi-va-le-phi-cap-co" ||
    externalLink ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/phi-cap-gcn-va-xac-nhan-cttm" ||
    url ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/phi-cap-gcn-va-xac-nhan-cttm" ||
    url === "/xuat-xu-hang-hoa/phi-va-le-phi-cap-co"
  ) {
    return "fees" as const;
  }

  if (
    slug === "diem-cap-va-cap-gcn-va-xac-nhan-cttm" ||
    slug === "diem-cap-va-thoi-gian-cap-co" ||
    slug === "diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm" ||
    externalLink ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/diem-cap-va-cap-gcn-va-xac-nhan-cttm" ||
    externalLink ===
      "/phap-che-va-xac-nhan-chung-tu-tm/diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm" ||
    url ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/diem-cap-va-cap-gcn-va-xac-nhan-cttm" ||
    url ===
      "/phap-che-va-xac-nhan-chung-tu-tm/diem-cap-va-thoi-gian-cap-gcn-va-xac-nhan-cttm" ||
    url === "/xuat-xu-hang-hoa/diem-cap-va-thoi-gian-cap-co"
  ) {
    return "locations" as const;
  }

  if (
    slug === "thong-tin-lien-he" ||
    slug === "thong-tin-lien-he-co" ||
    externalLink ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/thong-tin-lien-he" ||
    url ===
      "/phap-che-cap-giay-chung-nhan-va-xac-nhan-chung-tu-thuong-mai/thong-tin-lien-he" ||
    url === "/xuat-xu-hang-hoa/thong-tin-lien-he-co"
  ) {
    return "contact" as const;
  }

  return "overview" as const;
}

export default function LegalTradePages({ post, category }: LegalTradeRouterProps) {
  const params = useParams();
  const pathSegments = Array.isArray(params.slug) ? params.slug : [params.slug];
  const currentSlug = pathSegments.at(-1) ?? "";
  const variant = resolveVariant(
    {
      ...post,
      slug: currentSlug || post.slug,
      external_link: `/${pathSegments.filter(Boolean).join("/")}` || post.external_link,
    },
    {
      ...category,
      slug: currentSlug || category.slug,
      url: `/${pathSegments.filter(Boolean).join("/")}` || category.url,
    },
  );

  if (variant === "phap-che") {
    return <PhapChePage post={post} category={category} />;
  }

  if (variant === "certificate-trade-document") {
    return <CertificateTradeDocumentPage post={post} category={category} />;
  }

  if (variant === "procedure") {
    return <ProcedurePage post={post} category={category} />;
  }

  if (variant === "forms") {
    return <FormsPage post={post} category={category} />;
  }

  if (variant === "fees") {
    return <FeesPage post={post} category={category} />;
  }

  if (variant === "locations") {
    return <LocationsPage post={post} category={category} />;
  }

  if (variant === "contact") {
    return <ContactPage post={post} category={category} />;
  }

  return <PhapChePage post={post} category={category} />;
}
