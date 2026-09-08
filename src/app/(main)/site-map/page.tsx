"use client";
import React from "react";
import Link from "next/link";
import { useGetApiV10PageConfig } from "@/api/vcci-news/endpoints/page-config";
import { GetNewsPageConfigResponseType } from "@/api/vcci-news/types/news-page-config";

function SiteMapPage() {
  const { data: categoriesData, isLoading, isError } = useGetApiV10PageConfig<GetNewsPageConfigResponseType>();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-[#063e8e] text-xl font-semibold">Đang tải...</div>
      </div>
    );
  }

  if (isError || !categoriesData?.responseData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">Không thể tải dữ liệu</div>
      </div>
    );
  }

  const sections = categoriesData.responseData.children || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12 text-[#063e8e]">
          SƠ ĐỒ TRANG WEB
        </h1>

        {/* Sitemap Structure */}
        <div className="relative flex flex-col items-center">
          {/* Homepage - Top Level */}
          <div className="relative mb-20">
            <Link
              href="/"
              className="block bg-[#063e8e] text-white px-8 py-4 rounded-lg font-semibold text-center hover:bg-[#0a4fb5] transition shadow-lg min-w-[200px]"
            >
              TRANG CHỦ
            </Link>

            {/* Vertical line from homepage down */}
            <div className="absolute left-[99px] -translate-x-1/2 top-full h-20 w-0.5 bg-gray-600"></div>
          </div>

          {/* Main Sections - Second Level */}
          <div className="relative w-full max-w-[1400px]">
            {/* Horizontal line connecting all sections */}
            <div className="absolute top-0 left-[6.3%] right-[6.3%] h-0.5 bg-gray-600 z-0"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 relative pt-4">
              {sections.map((section, idx) => (
                <div key={section.id} className="relative flex flex-col items-center">
                  {/* Vertical line from horizontal bar down to section */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-0.5 bg-gray-600 z-10"></div>

                  {/* Section Box */}
                  <div className="relative z-20">
                    <Link
                      href={section.static_link || "#"}
                      className="flex bg-[#063e8e] text-white px-4 py-3 rounded-md font-medium text-center hover:bg-[#0a4fb5] transition shadow-md w-full text-sm min-h-20 items-center justify-center"
                    >
                      <span className="leading-tight">{section.name.toUpperCase()}</span>
                    </Link>

                    {/* Vertical line from section down to children */}
                    {section.children && section.children.length > 0 && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full h-6 w-0.5 bg-gray-600 z-10"></div>
                    )}
                  </div>

                  {/* Children - Third Level */}
                  {section.children && section.children.length > 0 && (
                    <div className="mt-6 flex flex-col gap-3 w-full relative">
                      {/* Vertical spine connecting all children */}
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gray-600"
                        style={{
                          top: '-24px',
                          bottom: '0',
                        }}
                      ></div>

                      {section.children.map((child, childIdx) => (
                        <div key={child.id} className="relative">
                          {/* Horizontal line from spine to child box */}
                          <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-1/2 h-0.5 bg-gray-600"></div>

                          <Link
                            href={child.static_link || "#"}
                            className="block bg-gray-400 text-white px-3 py-2.5 rounded text-xs font-medium text-center hover:bg-gray-500 transition shadow-sm leading-tight relative z-10"
                          >
                            {child.name.toUpperCase()}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default SiteMapPage;
