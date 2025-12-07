import { EventItem } from '@/api/types/event'
import BASE_URL from '@/links'
import dayjs from 'dayjs';
import AppEditorContent from '@/components/shared/editor-content';
import Link from "next/link";
import ImageNext from "@/components/shared/image-next";

function CardEvent({ event }: { event: EventItem }) {
  return (
    <Link
      href={`hoat-dong/su-kien/${event.id}`}
      className='flex flex-row gap-2 mb-2 sm:gap-3 sm:mb-3 p-2 sm:p-3 border border-gray-200 bg-white rounded-md'
    >
      <ImageNext
        src={`${BASE_URL.imageEndpoint}${event.image}`}
        alt={event.name}
        className='aspect-3/2 object-cover'
        width={130}
        height={86}
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
    </Link>
  );
}

export default CardEvent;