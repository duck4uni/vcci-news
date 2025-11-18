import { EventItem } from '@/api/types/event'
import BASE_URL from '@/links'
import dayjs from 'dayjs';
import AppEditorContent from '@/components/shared/editor-content';

function CardEvent({ event }: { event: EventItem }) {
  return (
    <a
      href={`hoat-dong/su-kien/${event.id}`}
      className='flex flex-row gap-2 mb-2 sm:gap-3 sm:mb-3 p-2 sm:p-3 border border-gray-200 bg-white rounded-md'
    >
      <img
        src={`${BASE_URL.imageEndpoint}${event.image}`}
        alt={event.name}
        className='w-[100px] md:w-[130px] aspect-3/2 object-cover'
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = "/img-error.png"
        }}
      />
      <div className='flex-1'>
        <p className='text-[#0056b3] font-bold text-sm line-clamp-2'>
          {event.name}
        </p>
        <p className='text-gray-500 text-sm my-1'>
          {dayjs(event.start_time).format('DD/MM/YYYY')}
        </p>
        {/* <AppEditorContent className='line-clamp-2' value={event.description} /> */}
      </div>
    </a>
  );
}

export default CardEvent;