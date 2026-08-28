import type { Metadata } from "next";
import links from "@links/index";
import {
  fetchDynamicPostById,
  fetchDynamicPostByExternalLink,
  getDynamicPostExcerpt,
  stripHtml,
} from "./templates/data";
import DynamicPageClient from "./DynamicPageClient";

type GenerateMetadataArgs = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string; categoryId?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: GenerateMetadataArgs): Promise<Metadata> {
  const { slug } = await params;
  const { id, categoryId } = await searchParams;

  const path = `/${(slug ?? []).join("/")}`;
  const postId = id?.trim() ?? "";
  const categoryIdParam = categoryId?.trim() ?? "";

  let post = null;
  try {
    post = postId
      ? await fetchDynamicPostById(postId)
      : await fetchDynamicPostByExternalLink(path);
  } catch {
    post = null;
  }

  if (!post || !post.title) {
    return {
      title: "Bài viết không tìm thấy",
      robots: { index: false, follow: false },
    };
  }

  const title = post.title;
  const description =
    stripHtml(post.summary) ||
    getDynamicPostExcerpt(post).slice(0, 160) ||
    "Tin tức từ VCCI HCM";
  const articleUrl = `${links.siteURL.replace(/\/+$/, "")}${path}${
    postId || categoryIdParam
      ? `?${new URLSearchParams({
          ...(postId && { id: postId }),
          ...(categoryIdParam && { categoryId: categoryIdParam }),
        }).toString()}`
      : ""
  }`;

  const ogImageParams = new URLSearchParams();
  if (postId) ogImageParams.set("id", postId);
  if (!postId && slug?.length) ogImageParams.set("slug", slug.join("/"));
  const ogImageUrl = `/api/og-post?${ogImageParams.toString()}`;

  return {
    title,
    description,
    alternates: { canonical: articleUrl },
    openGraph: {
      title,
      description,
      url: articleUrl,
      siteName: "VCCI HCM",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "vi_VN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function Page() {
  return <DynamicPageClient />;
}
