import { NewsAdminItem } from "@/api/types/news";
import BASE_URL from "@/links";
import dayjs from "dayjs";
import AppEditorContent from "@/components/shared/editor-content";

function CardNews({ news }: { news: NewsAdminItem }) {
  return (
    <a
      href={`${news.id}`}
      className="flex flex-row gap-2 mb-2 sm:gap-3 sm:mb-3"
    >
      <img
        src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
        alt={news.title}
        className="w-[100px] md:w-[130px] aspect-3/2 object-cover"
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
    </a>
  );
}

export default CardNews;
