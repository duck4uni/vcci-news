import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import links from "@/links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = ["vcci-hcm.org.vn", "vccihcm.vn"];
const OUTPUT_WIDTH = 1200;
const OUTPUT_HEIGHT = 630;
const OUTPUT_QUALITY = 80;

type FetchResult = {
  ok: boolean;
  buffer?: Buffer;
  contentType?: string;
};

/**
 * Resolve a relative path (e.g. "/thumbnail.png") to an absolute URL on the
 * current site so we can fetch it from the local server.
 */
function resolveAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const origin = (links.siteURL || "").replace(/\/+$/, "");
  return `${origin}${value.startsWith("/") ? "" : "/"}${value}`;
}

/**
 * Validate that an absolute URL points to one of the allowed image hosts so
 * the endpoint cannot be abused as an open proxy.
 */
function isAllowedHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

async function fetchImage(url: string): Promise<FetchResult> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      redirect: "follow",
    });

    if (!response.ok) return { ok: false };

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return { ok: false };

    const arrayBuffer = await response.arrayBuffer();
    return { ok: true, buffer: Buffer.from(arrayBuffer), contentType };
  } catch {
    return { ok: false };
  }
}

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    })
    .jpeg({ quality: OUTPUT_QUALITY, mozjpeg: true })
    .toBuffer();
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url")?.trim() ?? "";

  if (!urlParam) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  const absoluteUrl = resolveAbsoluteUrl(urlParam);

  if (!isAllowedHost(absoluteUrl)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  const fetched = await fetchImage(absoluteUrl);

  let imageBuffer: Buffer;

  if (fetched.ok && fetched.buffer) {
    const optimized = await optimizeImage(fetched.buffer).catch(() => null);
    imageBuffer = optimized ?? fetched.buffer;
  } else {
    const fallbackUrl = resolveAbsoluteUrl("/thumbnail.png");
    const fallback = await fetchImage(fallbackUrl);
    if (!fallback.ok || !fallback.buffer) {
      return new NextResponse("Image not found", { status: 404 });
    }
    const optimized = await optimizeImage(fallback.buffer).catch(() => null);
    imageBuffer = optimized ?? fallback.buffer;
  }

  return new NextResponse(new Uint8Array(imageBuffer), {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control":
        "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url")?.trim() ?? "";

  if (!urlParam) {
    return new NextResponse(null, { status: 400 });
  }

  const absoluteUrl = resolveAbsoluteUrl(urlParam);

  if (!isAllowedHost(absoluteUrl)) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control":
        "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800",
    },
  });
}
