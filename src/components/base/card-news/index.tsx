import dayjs from "dayjs";
import Links from "@links/index";
import { NewsItem } from "@/api/types/news";

const stripImagesAndHtml = (html?: string) => {
  if (!html) return "";

  const withoutImages = html.replace(/<img[^>]*>/gi, "");

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(withoutImages, "text/html");
      return doc.body.textContent || "";
    } catch {
      return withoutImages.replace(/<[^>]*>/g, "");
    }
  }

  return withoutImages.replace(/<[^>]*>/g, "");
};

const resolveThumbnail = (thumbnail?: string) => {
  if (!thumbnail) return "/img-error.png";
  if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) return thumbnail;
  return `${Links.imageEndpoint}${thumbnail.replace(/^\/+/, "")}`;
};

const CardNews = ({ news, link }: { news: NewsItem; link: string }) => {
  return (
    <a
      href={link}
      className="flex flex-col hover:no-underline sm:flex-row gap-2 mb-6 bg-white rounded-lg shadow-sm p-4 border items-start min-w-0"
    >
      <img
        src={resolveThumbnail(news.thumbnail)}
        alt={news.title}
        className="w-full sm:w-56 md:w-64 h-40 md:h-36 object-cover shrink-0"
        onError={(e) => {
          e.currentTarget.src = "/img-error.png";
        }}
      />

      <div className="flex-1 min-w-0 pl-0 sm:pl-4">
        <p className="text-primary font-semibold text-base md:text-lg hover:underline line-clamp-2 break-words">
          {news.title}
        </p>

        <div className="text-sm my-2 text-[#00AED5]">
          {dayjs(news.release_at).format("DD/MM/YYYY")}
        </div>

        <div className="text-sm text-[#777] line-clamp-3">
          <div className="text-sm prose tiptap">
            {stripImagesAndHtml(news.description)}
          </div>
        </div>
      </div>
    </a>
  );
};

export default CardNews;
