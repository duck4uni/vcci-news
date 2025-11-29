import { useGetEvents } from "@/api/endpoints/event";
import { EventApiResponse, EventItem } from "@/api/types/event";
import ImageNext from "@/components/shared/image-next";
import { Spinner } from "@/components/ui/spinner";
import { ChevronsRight } from "lucide-react"
import Link from "next/link"
import BASE_URL from "@/links/index";
import CardEvent from "./components/card-event";
import stripImagesAndHtml from "@/helpers/stripImageAndHtml";
import dayjs from "dayjs";

function Events() {
  const { data, isLoading } = useGetEvents<EventApiResponse>();

  return (
    <div className="flex-1 bg-[#063e8e] p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-[#e8c518]">
          Sự kiện sắp diễn ra
        </h2>
        <Link href="/hoat-dong/su-kien" className="text-[#e8c518] text-sm sm:text-base">
          <ChevronsRight />
        </Link>
      </div>
      <hr className="border-[#e8c518] mb-4" />

      <div className="flex flex-col md:flex-row gap-5">
        {isLoading ? (
          <div className="container w-full h-[80vh] flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <>
            {data?.responseData.rows.slice(0, 1).map((event: EventItem) => (
              <Link
                key={event.id}
                href={`hoat-dong/su-kien/${event.id}`}
                className="flex flex-col w-full md:w-1/2 min-h-[180px] sm:min-h-[220px] gap-3 mb-3 border border-gray-200 bg-white rounded-md p-3"
              >
                <div className="w-full aspect-3/2 overflow-hidden">
                  <ImageNext
                    src={`${BASE_URL.imageEndpoint}${event.image}`}
                    alt={event.name}
                    width={600}
                    height={400}
                    sizes="(max-width:768px) 100vw,50vw"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[#0056b3] font-bold text-xl line-clamp-2">
                    {event.name}
                  </p>
                  <p className="text-gray-500 text-sm my-1">
                    {dayjs(event.start_time).format("DD/MM/YYYY")}
                  </p>
                  <p className="line-clamp-3 text-justify">{stripImagesAndHtml(event.description)}</p>
                </div>
              </Link>
            ))}
            <div className="w-full md:w-1/2">
              {data?.responseData.rows.slice(0, 4).map((event) => (
                <CardEvent key={event.id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Events