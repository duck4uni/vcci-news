import EventCalendar from "@/components/base/event-calendar"
import { ChevronsRight } from "lucide-react"
import Link from "next/link"

const EventsCalendar = () => {
  return (
    <div className="bg-[#063e8e] w-full lg:w-[30%] p-5">
      <aside>
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-[#e8c518]">
            Lịch sự kiện
          </h2>
          {/* <Link
            href="#"
            className="text-[#e8c518] hover:underline text-sm sm:text-base"
          >
            <ChevronsRight />
          </Link> */}
        </div>
        <hr className="border-[#e8c518] mb-4" />
        <EventCalendar />
      </aside>
    </div>
  )
}

export default EventsCalendar