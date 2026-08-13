import { NextResponse } from "next/server";
import { MOCK_FEATURED_MEMBERS_RESPONSE } from "@/app/api/mock-data";

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://news.vccihcm.vn";
const FEATURED_MEMBER_API_URL = `${BACKEND_HOST.replace(/\/+$/, "")}/api/v1.0/vcci/featured-members`;

// Fallback: gọi trực tiếp VCCI HCM API
const FALLBACK_FEATURED_MEMBER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations" +
  "?filters=users.status_id+%3D%3D+36ca1cc5-7b6e-4f9f-b973-69c5207deb62" +
  "&pageSize=12&sortField=created_at&sortOrder=ASC";

export async function GET() {
  try {
    const response = await fetch(FEATURED_MEMBER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(
        `[api/featured-members] upstream returned ${response.status}, trying fallback`,
      );
      // Thử fallback - gọi trực tiếp VCCI HCM API
      return tryFallback();
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/featured-members] upstream failed, trying fallback", error);
    return tryFallback();
  }
}

async function tryFallback() {
  try {
    const fallbackResponse = await fetch(FALLBACK_FEATURED_MEMBER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!fallbackResponse.ok) {
      console.warn(
        `[api/featured-members] fallback returned ${fallbackResponse.status}, serving mock data`,
      );
      return NextResponse.json(MOCK_FEATURED_MEMBERS_RESPONSE, { status: 200 });
    }

    const data = await fallbackResponse.json();
    console.log("[api/featured-members] served from fallback");
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/featured-members] fallback failed, serving mock data", error);
    return NextResponse.json(MOCK_FEATURED_MEMBERS_RESPONSE, { status: 200 });
  }
}
