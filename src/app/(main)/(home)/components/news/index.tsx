import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType, NewsItem } from "@/api/types/news";
import ImageNext from "@/components/shared/image-next";
import Link from "next/link";
import BASE_URL from "@/links/index";
import { ChevronsRight } from "lucide-react";
import { useState } from "react";
import stripImagesAndHtml from "@/helpers/stripImageAndHtml";
import CardNews from "./components/card-news";

const News = () => {
  const [tab, setTab] = useState("all");

  const { data: newsSpecial } = useGetNews<GetNewsResponseType>({ pageSize: '1' });
  const { data: newsFilters } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '5',
      filters: tab === "all" ? `` : `page_config.code @=${tab}`,
    }
  );

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <Link
          href="/thong-tin-truyen-thong/tin-vcci/"
          className="text-[18px] sm:text-[20px] font-semibold uppercase text-[#063e8e]"
        >
          Tin tức
        </Link>
        {/* <Link
          href="/thong-tin-truyen-thong/tin-vcci/"
          className="text-[#063e8e] text-sm sm:text-base"
        >
          <ChevronsRight />
        </Link> */}
      </div>
      <hr className="border-[#063e8e] mb-4" />

      <div className="flex flex-col md:flex-row gap-5">
        {newsSpecial?.responseData.rows
          .slice(0, 1)
          .map((news: NewsItem) => (
            <Link
              key={news.id}
              href={`${news.external_link}`}
              className="flex flex-col w-full md:w-1/2 min-h-[180px] sm:min-h-[220px] gap-3 mb-3 bg-white"
            >
              <div className="w-full aspect-3/2 overflow-hidden">
                <ImageNext
                  src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                  alt={news.title}
                  width={600}
                  height={400}
                  sizes="(max-width:768px) 100vw,50vw"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-5 pt-1">
                <p className="text-[#063E8E] font-bold pb-2 text-xl line-clamp-2">
                  {news.title}
                </p>
                <p className="line-clamp-4 text-justify">{stripImagesAndHtml(news.description)}</p>
              </div>
            </Link>
          ))}

        <div className="w-full md:w-1/2">
          {/* <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
            <button
              className={`flex-1 py-[3px] text-sm transition-colors cursor-pointer ${tab === "all"
                ? " bg-[#d3d3d3] text-[#063e8e] font-semibold"
                : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                }`}
              onClick={() => setTab("all")}>
              Tất cả
            </button>
            <button
              className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${`tin-vcci` === tab
                ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                }`}
              onClick={() => setTab("tin-vcci")}
            >
              Tin VCCI
            </button>
            <button
              className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${`tin-kinh-te` === tab
                ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                }`}
              onClick={() => setTab("tin-kinh-te")}
            >
              Tin Kinh Tế
            </button>
            <button
              className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${`chuyen-de` === tab
                ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                }`}
              onClick={() => setTab("chuyen-de")}
            >
              Chuyên Đề
            </button>
          </div> */}

          {newsFilters?.responseData?.rows.slice(0, 5).map((news) => (
            <CardNews key={news.id} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;