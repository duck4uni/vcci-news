import { ImageResponse } from "next/og";
import {
  fetchDynamicPostById,
  fetchDynamicPostByExternalLink,
  getDynamicPostSeoImage,
  getDynamicPostExcerpt,
  stripHtml,
} from "@/app/(main)/[...slug]/templates/data";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";
    const slug = searchParams.get("slug") ?? "";

    let post = null;
    try {
      post = id
        ? await fetchDynamicPostById(id)
        : slug
          ? await fetchDynamicPostByExternalLink(`/${slug}`)
          : null;
    } catch {
      post = null;
    }

    const title = post?.title ?? "VCCI HCM";
    const description =
      stripHtml(post?.summary) ||
      (post ? getDynamicPostExcerpt(post).slice(0, 120) : "");
    const imageUrl = post ? getDynamicPostSeoImage(post) : "";
    const hasImage = imageUrl && imageUrl !== "/thumbnail.png";

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 1200,
            height: 630,
            backgroundColor: "#0a4d8c",
            position: "relative",
            fontFamily: "sans-serif",
          }}
        >
          {hasImage && (
            <img
              src={imageUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 1200,
                height: 630,
                objectFit: "cover",
              }}
            />
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 1200,
            height: 630,
            backgroundColor: "#0a4d8c",
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          VCCI-HCM
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
