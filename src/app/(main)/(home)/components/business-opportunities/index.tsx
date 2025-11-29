import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType, NewsItem } from "@/api/types/news";
import ImageNext from "@/components/shared/image-next";
import { Spinner } from "@/components/ui/spinner";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import BASE_URL from "@/links/index";
import CardNews from "./components/card-news";

const businessOpportunities = () => {
  const { data, isLoading } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '5',
      filters: `page_config.code @=co-hoi-kinh-doanh`,
    }
  );

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <Link
          href="/xuc-tien-thuong-mai/co-hoi/"
          className="text-[18px] sm:text-[20px] font-bold uppercase text-[#063e8e]"
        >
          Cơ hội kinh doanh
        </Link>
        <Link
          href="/xuc-tien-thuong-mai/co-hoi/"
          className="text-[#063e8e] text-sm sm:text-base"
        >
          <ChevronsRight />
        </Link>
      </div>
      <hr className="border-[#063e8e] mb-4" />
      <div className="pt-2">
        {isLoading ? (
          <div className="container w-full h-[80vh] flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            {data?.responseData.rows
              .slice(0, 1)
              .map((news: NewsItem) => (
                <Link key={news.id} href={`${news.external_link}`}>
                  <div className="w-full aspect-3/2 relative overflow-hidden mb-5">
                    <ImageNext
                      src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                      alt={news.title}
                      width={600}
                      height={400}
                      sizes="(max-width:768px) 100vw,50vw"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bg-white opacity-80 bottom-5 left-5 right-5 p-5">
                      <p className="text-[#063e8e] font-semibold text-sm sm:text-base z-10 line-clamp-3">
                        {news.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

            {data?.responseData.rows.slice(0, 3).map((news) => (
              <CardNews key={news.id} news={news} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default businessOpportunities;
