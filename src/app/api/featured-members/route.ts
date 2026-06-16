import { NextResponse } from "next/server";

const FEATURED_MEMBER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations?filters=users.status_id+%3D%3D+36ca1cc5-7b6e-4f9f-b973-69c5207deb62&pageSize=12&sortField=created_at&sortOrder=ASC";

export async function GET() {
  try {
    const response = await fetch(FEATURED_MEMBER_API_URL, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Không thể tải dữ liệu hội viên tiêu biểu" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch featured members", error);

    return NextResponse.json(
      { message: "Không thể tải dữ liệu hội viên tiêu biểu" },
      { status: 500 },
    );
  }
}
