import { NewsItem } from "@/api/types/news";
import BASE_URL from "@/links";
import dayjs from "dayjs";
import AppEditorContent from "@/components/shared/editor-content";
import Link from "next/link";
import ImageNext from "@/components/base/image";

function CardNews({ news }: { news: NewsItem }) {
  return (
    <Link
      href={`${news.external_link}`}
      className="flex flex-row gap-2 mb-2 sm:gap-3 sm:mb-3"
    >
      <ImageNext
        src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
        alt={news.title}
        className="aspect-3/2 object-cover"
        width={130}
        height={86}
      />
      <div className="flex-1">
        <p className="text-[#363636] font-bold text-sm line-clamp-2">
          {news.title}
        </p>
        <p className="text-gray-500 text-sm my-1">
          {dayjs(news.release_at).format("DD/MM/YYYY")}
        </p>
        {/* <AppEditorContent className='line-clamp-2' value={news.description} /> */}
      </div>
    </Link>
  );
}

export default CardNews;
