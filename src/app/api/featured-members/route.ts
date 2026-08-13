import { NextResponse } from "next/server";
import { MOCK_FEATURED_MEMBERS_RESPONSE } from "@/app/api/mock-data";

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://news.vccihcm.vn";
const BACKEND_FEATURED_MEMBER_API_URL = `${BACKEND_HOST.replace(/\/+$/, "")}/api/v1.0/vcci/featured-members`;

// Ưu tiên gọi trực tiếp VCCI HCM API (BE hiện chưa có endpoint này)
const VCCI_FEATURED_MEMBER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations" +
  "?filters=users.status_id+%3D%3D+36ca1cc5-7b6e-4f9f-b973-69c5207deb62" +
  "&pageSize=12&sortField=created_at&sortOrder=ASC";

export async function GET() {
  // 1) Ưu tiên VCCI HCM API
  try {
    const response = await fetch(VCCI_FEATURED_MEMBER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    console.warn(`[api/featured-members] VCCI API returned ${response.status}, trying backend`);
  } catch (error) {
    console.error("[api/featured-members] VCCI API failed, trying backend", error);
  }

  // 2) Fallback: BE endpoint (nếu có)
  try {
    const response = await fetch(BACKEND_FEATURED_MEMBER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    console.warn(`[api/featured-members] backend returned ${response.status}, serving mock data`);
  } catch (error) {
    console.error("[api/featured-members] backend failed, serving mock data", error);
  }

  // 3) Cuối cùng: mock data
  return NextResponse.json(MOCK_FEATURED_MEMBERS_RESPONSE, { status: 200 });
}
