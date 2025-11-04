"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pagination } from "@components/base/pagination";
import { useGetNews } from "@api/endpoints/news";
import { GetNewsResponseType } from "@api/types/NewsPage.type";

const publications = [
  {
    id: "huong-dan-dau-tu-2024",
    title: "Cẩm nang Hướng dẫn đầu tư kinh doanh tại Việt Nam",
    img: "/an-pham/A-Guide-2023_Cover-725x1024.webp",
  },
  {
    id: "connections-2022-2023",
    title: "Danh bạ Hội viên CONNECTIONS 2022-2023",
    img: "/an-pham/Trang-bia_Connections_2022-2023-725x1024.jpg.webp",
  },
  {
    id: "chuyen-doi-so",
    title: "Chuyển đổi số – Động lực phục hồi và phát triển kinh tế",
    img: "/an-pham/Trang-bia_Chuyen-doi-so_2022-750x1024.webp",
  },
  {
    id: "huong-dan-dau-tu-2021",
    title: "Cẩm nang Hướng dẫn đầu tư kinh doanh tại Việt Nam 2021",
    img: "/an-pham/doing-in-business-cover-1-1.webp",
  },
  {
    id: "ban-tin-quy-4-2020",
    title: "Bản tin Quý IV năm 2020",
    img: "/an-pham/bia-ban-tin-quy-4-1.webp",
  },
  {
    id: "ban-tin-quy-1-2020",
    title: "Bản tin Quý I năm 2020",
    img: "/an-pham/bantintet-1.webp",
  },
];

export default function PublicationList() {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: allData } = useGetNews<GetNewsResponseType>({
    pageSize: String(pageSize),
    currentPage: String(page),
  });

  return (
    <div className="lg:w-[calc(65%-10px)] w-full flex flex-col gap-[15px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {publications.map((pub) => (
          <Link
            href={`/thong-tin-truyen-thong/an-pham/${pub.id}`}
            key={pub.id}
            className="flex flex-col items-center text-center h-full max-h-[342px] bg-white group"
          >
            <div className="w-full max-w-[260px] aspect-[3/4] overflow-hidden rounded-lg">
              <Image
                src={pub.img}
                alt={pub.title}
                width={300}
                height={400}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 text-[15px] font-semibold text-[#124588] group-hover:text-[#E8C518] leading-snug">
              {pub.title}
            </h3>
          </Link>
        ))}
      </div>

      <div className="w-full flex justify-center mt-4">
        <Pagination
          pageCount={Number(allData?.responseData.totalPages ?? 1)}
          page={Number(allData?.responseData.currentPage ?? page)}
          onChangePage={(p) => setPage(p)}
          onGoToPreviousPage={() => setPage(Math.max(1, page - 1))}
          onGoToNextPage={() =>
            setPage(
              Math.min(Number(allData?.responseData.totalPages ?? 1), page + 1)
            )
          }
        />
      </div>
    </div>
  );
}
