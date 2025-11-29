import ImageNext from "@/components/shared/image-next";
import partnerImages from "@/constants/partnerImages";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";

import { Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/grid";

const VideoAndPartners = () => {
  return (
    <section className="flex flex-col lg:flex-row gap-5 pb-10">
      {/* LEFT: VIDEO */}
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold uppercase text-[#063e8e]">Video</h2>
          <Link
            href="/video"
            className="text-[#063e8e] hover:underline text-sm font-medium"
          >
            <ChevronsRight />
          </Link>
        </div>

        <hr className="border-[#063e8e] mb-5" />

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {[
            {
              src: "https://www.youtube.com/embed/J0Iz0iGuAXY",
              title: "VCCI-HCM 2024 IN REVIEW (ENGLISH VERSION)",
            },
            {
              src: "https://www.youtube.com/embed/_OnnGWv2ehM",
              title: "Hội nghị Hội viên VCCI - Gala Mừng Xuân Ất Tỵ 2025",
            },
          ].map((video, i) => (
            <div key={i} className="w-full md:w-1/2">
              <div className="aspect-video rounded-lg overflow-hidden shadow">
                <iframe
                  className="w-full h-full font-bold"
                  src={video.src}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-sm text-gray-700 font-medium">
                {video.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: ĐỐI TÁC */}
      <aside className="w-full lg:w-[30%]">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold uppercase text-[#063e8e]">
            Đối tác
          </h2>
        </div>

        <hr className="border-[#063e8e] mb-5" />

        <div className="pb-10">
          <Swiper
            modules={[Autoplay, Grid]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            grid={{ rows: 2, fill: "row" }}
            slidesPerView={3}
            spaceBetween={16}
            breakpoints={{
              0: { slidesPerView: 3, spaceBetween: 10, grid: { rows: 1 } },
              640: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="partner-swiper"
          >
            {partnerImages.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="flex justify-center items-center bg-white rounded-lg shadow p-3 w-[120px] h-[120px]">
                  <ImageNext
                    src={src}
                    alt={`partner-${i}`}
                    width={120}
                    height={120}
                    className="object-contain w-full h-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </aside>
    </section>
  );
};

export default VideoAndPartners;
