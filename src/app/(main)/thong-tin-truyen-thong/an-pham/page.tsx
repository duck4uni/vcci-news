import ListCategory from "@/components/base/list-category";
import { MEDIA_INFORMATION_CATEGORIES } from "@/constants/categories";
import EventFilter from "@app/dai-dien-gioi-chu/components/event-filter";
import Image from "next/image";
import PublicationList from "./components/publicationList";

export default function Page() {
  return (
    <div className="bg-[#f6f6f6]">
      <div className="container m-auto flex flex-col gap-5 mb-[50px]">
        <div className="border-[#e5e7f2] border-[1px]">
          <ListCategory categories={MEDIA_INFORMATION_CATEGORIES} />
        </div>
        <div className="w-full flex gap-5 flex-wrap">
          <PublicationList />
          <div className="lg:w-[calc(35%-10px)] w-full">
            <EventFilter />
            <div className="relative w-full mt-4 h-[300px] aspect-video rounded-lg overflow-hidden">
              <Image
                src="/banner.webp"
                alt="Quảng cáo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
