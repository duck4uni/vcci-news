import { NextResponse } from "next/server";
import { MOCK_PARTNERS_RESPONSE } from "@/app/api/mock-data";

const BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || "https://news.vccihcm.vn";
const PARTNER_API_URL = `${BACKEND_HOST.replace(/\/+$/, "")}/api/v1.0/vcci/partners`;

export async function GET() {
  try {
    const response = await fetch(PARTNER_API_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      // Khi upstream lỗi, vẫn trả mock để FE không hiển thị "Chưa có thông tin".
      console.warn(
        `[api/partners] upstream returned ${response.status}, serving mock data`,
      );
      return NextResponse.json(MOCK_PARTNERS_RESPONSE, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/partners] upstream failed, serving mock data", error);
    return NextResponse.json(MOCK_PARTNERS_RESPONSE, { status: 200 });
  }
}
