import { NewsAdminItem } from '@/api/types/news'
import BASE_URL from '@/links'
import dayjs from 'dayjs';
import AppEditorContent from '@/components/shared/editor-content';
import parse from 'html-react-parser'

function CardNews({ news }: { news: NewsAdminItem }) {
  return (
    <a
      href={`${news.id}`}
      className="flex flex-col sm:flex-row gap-3 mb-3 border border-gray-200 bg-white rounded-md p-3 hover:shadow-md transition"
    >
      <img
        src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
        alt={news.title}
        className="w-full sm:w-40 h-40 sm:h-28 object-cover rounded-md"
      />

      <div className="flex-1">
        <p className="text-[#0056b3] font-bold text-sm sm:text-base line-clamp-2">
          {news.title}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm my-1">
          {dayjs(news.release_at).format('DD/MM/YYYY')}
        </p>
        <div className="text-xs sm:text-sm text-[#777] line-clamp-3 prose tiptap">
          {parse(news.description)}
        </div>
      </div>
    </a>
  );
}

export default CardNews;