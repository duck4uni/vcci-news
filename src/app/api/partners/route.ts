import { NextResponse } from "next/server";
import { MOCK_PARTNERS_RESPONSE } from "@/app/api/mock-data";

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://news.vccihcm.vn";
const BACKEND_PARTNER_API_URL = `${BACKEND_HOST.replace(/\/+$/, "")}/api/v1.0/vcci/partners`;

// Ưu tiên gọi trực tiếp VCCI HCM API (BE hiện chưa có endpoint này)
const VCCI_PARTNER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations" +
  "?filters=type%3D%3DSPONSOR&pageSize=12" +
  "&sortField=sort_order&sortOrder=ASC";

export async function GET() {
  // 1) Ưu tiên VCCI HCM API
  try {
    const response = await fetch(VCCI_PARTNER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    console.warn(`[api/partners] VCCI API returned ${response.status}, trying backend`);
  } catch (error) {
    console.error("[api/partners] VCCI API failed, trying backend", error);
  }

  // 2) Fallback: BE endpoint (nếu có)
  try {
    const response = await fetch(BACKEND_PARTNER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    console.warn(`[api/partners] backend returned ${response.status}, serving mock data`);
  } catch (error) {
    console.error("[api/partners] backend failed, serving mock data", error);
  }

  // 3) Cuối cùng: mock data
  return NextResponse.json(MOCK_PARTNERS_RESPONSE, { status: 200 });
}
