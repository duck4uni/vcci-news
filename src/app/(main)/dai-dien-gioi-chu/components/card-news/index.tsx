
import { NewsItem } from '@app/dai-dien-gioi-chu/lib/types/NewsPage.type';
import Links from '@links/index'
import dayjs from 'dayjs';
import parse from 'html-react-parser'
function NewsContent({ news }: { news: NewsItem }) {

  return (
    <a
      href={`/tin-tuc/${news.id}`}
      className="flex flex-col hover:no-underline sm:flex-row gap-2 mb-6 bg-white rounded-lg shadow-sm p-4 border items-start min-w-0"
    >
      <img
        src={`${Links.imageEndpoint}${news.thumbnail}`}
        alt={news.title}
        className="w-full sm:w-56 md:w-64 h-40 md:h-36 object-cover shrink-0"
     onError={(e) => {
    e.currentTarget.src = "/img-error.png"
  }}

      />

      <div className="flex-1 min-w-0 pl-0 sm:pl-4">
        <p className="text-primary font-semibold text-base md:text-lg hover:underline line-clamp-2 wrap-break-word hover:no-underline">
          {news.title}
        </p>

        <div className="text-sm my-2 text-[#00AED5]">{dayjs(news.release_at).format('DD/MM/YYYY')}</div>

        <div className="text-sm text-[#777] line-clamp-3">
          <div className="text-sm prose tiptap">{parse(news.description)}</div>
        </div>
      </div>
    </a>
  )
}

export default NewsContent;