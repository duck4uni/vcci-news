import { NewsAdminItem } from '@/api/types/news'
import BASE_URL from '@/links'
import dayjs from 'dayjs';
import AppEditorContent from '@/components/shared/editor-content';

function NewsContent({ news }: { news: NewsAdminItem }) {

  return (
    <a
      href={`/tin-tuc/${news.id}`}
      className='flex flex-col sm:flex-row gap-4 mb-3 bg-white rounded-lg shadow-sm p-3'
    >
      <img
        // src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
        src={news.thumbnail}
        alt={news.title}
        className='w-full sm:w-[120px] h-[80px] object-cover rounded-sm'
      />
      <div className='flex-1'>
        <p className='text-[#0056b3] font-semibold text-base hover:underline line-clamp-2'>
          {news.title}
        </p>
        <div className='text-gray-500 text-sm my-1'>{dayjs(news.release_at).format('DD/MM/YYYY')}</div>
        {/* <AppEditorContent className='line-clamp-4' value={news.description} />   */}
      </div>
    </a>
  );
}

export default NewsContent;