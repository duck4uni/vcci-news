import type { Metadata } from "next";
import links from "@links/index";
import {
  fetchDynamicPostById,
  fetchDynamicPostByExternalLink,
  getDynamicPostSeoImage,
  getDynamicPostExcerpt,
  stripHtml,
} from "./templates/data";
import DynamicPageClient from "./DynamicPageClient";

/**
 * Build an absolute og:image URL routed through the custom /api/seo-image
 * endpoint which resizes the source image to 1200x630 JPEG (~a few hundred KB)
 * so social media crawlers receive a reasonably-sized image instead of the
 * original full-resolution upload (which can be 5+ MB and get rejected by
 * Twitter/Zalo/Facebook).
 */
function toSeoImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";
  const origin = (links.siteURL || "").replace(/\/+$/, "");
  const encoded = encodeURIComponent(imageUrl);
  return `${origin}/api/seo-image?url=${encoded}`;
}

type GenerateMetadataArgs = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ id?: string; categoryId?: string }>;
};

/**
 * Verify that a remote image URL actually serves an image (not an HTML 404
 * page or redirect). Returns true for relative paths and on network errors
 * (benefit of the doubt) so we only fall back when we're certain the URL is
 * not an image.
 */
async function isRemoteImageValid(url: string): Promise<boolean> {
  if (!url || !/^https?:\/\//i.test(url)) return true;

  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
      redirect: "follow",
    });

    // If the server rejects HEAD, give the benefit of the doubt
    if (!response.ok) return true;

    const contentType = response.headers.get("content-type") ?? "";
    return contentType.startsWith("image/");
  } catch {
    return true;
  }
}

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
  const rawImageUrl = getDynamicPostSeoImage(post);
  const isImageValid = await isRemoteImageValid(rawImageUrl);
  const imageUrl = toSeoImageUrl(
    isImageValid ? rawImageUrl : "/thumbnail.png",
  );
  const articleUrl = `${links.siteURL.replace(/\/+$/, "")}${path}${postId || categoryIdParam
    ? `?${new URLSearchParams({
      ...(postId && { id: postId }),
      ...(categoryIdParam && { categoryId: categoryIdParam }),
    }).toString()}`
    : ""
    }`;

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
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}

export default function Page() {
  return <DynamicPageClient />;
}
