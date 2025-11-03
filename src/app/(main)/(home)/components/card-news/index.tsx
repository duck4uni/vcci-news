import { NewsAdminItem } from '@/api/types/news'
import BASE_URL from '@/links'
import dayjs from 'dayjs';
import AppEditorContent from '@/components/shared/editor-content';

function CardNews({ news }: { news: NewsAdminItem }) {
  return (
    <a
      href={`${news.id}`}
      className='flex flex-row gap-3 mb-3 border border-gray-200 bg-white rounded-md p-3'
    >
      <img
        src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
        alt={news.title}
        className='w-[120px] h-20 object-cover rounded-sm'
      />
      <div className='flex-1'>
        <p className='text-[#0056b3] font-bold text-sm line-clamp-2'>
          {news.title}
        </p>
        <p className='text-gray-500 text-sm my-1'>
          {dayjs(news.release_at).format('DD/MM/YYYY')}
        </p>
        {/* <AppEditorContent className='line-clamp-2' value={news.description} /> */}
      </div>
    </a>
  );
}

export default CardNews;