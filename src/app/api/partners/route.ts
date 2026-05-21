import { NextResponse } from "next/server";

const PARTNER_API_URL =
  "https://vccihcm.vn/api/v1.0/organizations?filters=type%3D%3DSPONSOR&pageSize=12&sortField=sort_order&sortOrder=ASC";

export async function GET() {
  try {
    const response = await fetch(PARTNER_API_URL, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Không thể tải dữ liệu đối tác" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch partners", error);

    return NextResponse.json(
      { message: "Không thể tải dữ liệu đối tác" },
      { status: 500 },
    );
  }
}
