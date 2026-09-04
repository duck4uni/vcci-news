
import { EventItem } from '@/api/vcci-news/types/event';
import links from '@/links'
import dayjs from 'dayjs';

// Helper: remove <img> tags and extract plain text from HTML
const stripImagesAndHtml = (html?: string) => {
  if (!html) return ''
  // remove img tags first
  const withoutImgs = html.replace(/<img[^>]*>/gi, '')
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(withoutImgs, 'text/html')
      return doc.body.textContent || ''
    } catch {
      // fallback to regex
    }
  }
  return withoutImgs.replace(/<[^>]*>/g, '')
}

const CardEvents = ({ event, link }: { event: EventItem, link: string }) => {
  return (
    <a
      href={`${link}`}
      className="flex flex-col hover:no-underline sm:flex-row gap-2 mb-6 bg-white rounded-lg shadow-sm p-4 border items-start min-w-0"
    >
      <img
        src={links.resolveImageUrl(event.image) || "/img-error.png"}
        alt={event.name}
        className="w-full sm:w-56 md:w-64 h-40 md:h-36 object-cover shrink-0"
        onError={(e) => {
          e.currentTarget.src = "/img-error.png"
        }}
      />

      <div className="flex-1 min-w-0 pl-0 sm:pl-4">
        <p className="text-primary font-semibold text-base md:text-lg hover:underline line-clamp-2 wrap-break-word">
          {event.name}
        </p>
        <div className="text-sm my-2 text-[#00AED5]">{dayjs(event.start_time).format('DD/MM/YYYY')}</div>
        <div className="text-sm text-[#777] line-clamp-3">
          <div className="text-sm prose tiptap">{stripImagesAndHtml(event.description)}</div>
        </div>
      </div>
    </a>
  )
}

export default CardEvents;
