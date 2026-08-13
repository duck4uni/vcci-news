import { NextResponse } from "next/server";
import { MOCK_PARTNERS_RESPONSE } from "@/app/api/mock-data";

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://news.vccihcm.vn";
const PARTNER_API_URL = `${BACKEND_HOST.replace(/\/+$/, "")}/api/v1.0/vcci/partners`;

// Fallback: gọi trực tiếp VCCI HCM API
const FALLBACK_PARTNER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations" +
  "?filters=type%3D%3DSPONSOR&pageSize=12" +
  "&sortField=sort_order&sortOrder=ASC";

export async function GET() {
  try {
    const response = await fetch(PARTNER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.warn(
        `[api/partners] upstream returned ${response.status}, trying fallback`,
      );
      // Thử fallback - gọi trực tiếp VCCI HCM API
      return tryFallback();
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/partners] upstream failed, trying fallback", error);
    return tryFallback();
  }
}

async function tryFallback() {
  try {
    const fallbackResponse = await fetch(FALLBACK_PARTNER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!fallbackResponse.ok) {
      console.warn(
        `[api/partners] fallback returned ${fallbackResponse.status}, serving mock data`,
      );
      return NextResponse.json(MOCK_PARTNERS_RESPONSE, { status: 200 });
    }

    const data = await fallbackResponse.json();
    console.log("[api/partners] served from fallback");
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/partners] fallback failed, serving mock data", error);
    return NextResponse.json(MOCK_PARTNERS_RESPONSE, { status: 200 });
  }
}
