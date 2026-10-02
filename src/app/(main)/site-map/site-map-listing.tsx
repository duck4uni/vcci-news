import Link from "next/link";
import { getApiV10CategoryTree } from "@/api/vcci-news/endpoints/category";
import type { HeaderCategoryTreeItem } from "@/api/vcci-news/types/header-config";

export default async function SiteMapListing() {
  let sections: HeaderCategoryTreeItem[] = [];

  try {
    const response = (await getApiV10CategoryTree()) as {
      responseData?: HeaderCategoryTreeItem[];
    };
    sections = response?.responseData ?? [];
  } catch {
    sections = [];
  }

  if (!sections.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
        <div className="text-xl font-semibold text-red-600">
          Không thể tải dữ liệu
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-12 text-center text-3xl font-bold text-[#063e8e]">
          SƠ ĐỒ TRANG WEB
        </h1>

        {/* Sitemap Structure */}
        <div className="relative flex flex-col items-center">
          {/* Homepage - Top Level */}
          <div className="relative mb-20">
            <Link
              href="/"
              className="block min-w-[200px] rounded-lg bg-[#063e8e] px-8 py-4 text-center font-semibold text-white shadow-lg transition hover:bg-[#0a4fb5]"
            >
              TRANG CHỦ
            </Link>

            {/* Vertical line from homepage down */}
            <div className="absolute left-[99px] top-full h-20 w-0.5 -translate-x-1/2 bg-gray-600" />
          </div>

          {/* Main Sections - Second Level */}
          <div className="relative w-full max-w-[1400px]">
            {/* Horizontal line connecting all sections */}
            <div className="absolute left-[6.3%] right-[6.3%] top-0 z-0 h-0.5 bg-gray-600" />

            <div className="relative grid grid-cols-2 gap-6 pt-4 md:grid-cols-4 lg:grid-cols-7">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="relative flex flex-col items-center"
                >
                  {/* Vertical line from horizontal bar down to section */}
                  <div className="absolute -top-4 left-1/2 z-10 h-4 w-0.5 -translate-x-1/2 bg-gray-600" />

                  {/* Section Box */}
                  <div className="relative z-20">
                    <Link
                      href={section.url || "#"}
                      className="flex min-h-20 w-full items-center justify-center rounded-md bg-[#063e8e] px-4 py-3 text-center text-sm font-medium text-white shadow-md transition hover:bg-[#0a4fb5]"
                    >
                      <span className="leading-tight">
                        {section.name.toUpperCase()}
                      </span>
                    </Link>

                    {/* Vertical line from section down to children */}
                    {section.children && section.children.length > 0 ? (
                      <div className="absolute left-1/2 top-full z-10 h-6 w-0.5 -translate-x-1/2 bg-gray-600" />
                    ) : null}
                  </div>

                  {/* Children - Third Level */}
                  {section.children && section.children.length > 0 ? (
                    <div className="relative mt-6 flex w-full flex-col gap-3">
                      {/* Vertical spine connecting all children */}
                      <div
                        className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-gray-600"
                        style={{ top: "-24px", bottom: "0" }}
                      />

                      {section.children.map((child) => (
                        <div key={child.id} className="relative">
                          {/* Horizontal line from spine to child box */}
                          <div className="absolute right-1/2 top-1/2 h-0.5 w-1/2 -translate-y-1/2 bg-gray-600" />

                          <Link
                            href={child.url || "#"}
                            className="relative z-10 block rounded bg-gray-400 px-3 py-2.5 text-center text-xs font-medium leading-tight text-white shadow-sm transition hover:bg-gray-500"
                          >
                            {child.name.toUpperCase()}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
