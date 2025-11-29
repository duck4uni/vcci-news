'use client';

import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType } from "@/api/types/news";
import ImageNext from "@/components/shared/image-next";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Grid } from "swiper/modules";
import BASE_URL from "@/links/index";

function FeaturedNews() {
  const { data } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '10',
    }
  );

  return (
    <section>
      <div className="flex items-center justify-center py-8 px-4">
        <div className="flex items-center w-full max-w-4xl">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-gray-300 to-gray-400"></div>
          <h1 className="px-6 text-[20px] sm:text-[24px] md:text-[28px] uppercase font-bold text-[#063e8e] whitespace-nowrap">
            Tin Nổi Bật
          </h1>
          <div className="flex-1 h-px bg-linear-to-l from-transparent via-gray-300 to-gray-400"></div>
        </div>
      </div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        breakpoints={{
          0: { slidesPerView: 1.1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="pb-5"
      >
        {data?.responseData?.rows.map((news) => (
          <SwiperSlide key={news.id}>
            <Link
              href={`${news.external_link}`}
              className="relative block bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <ImageNext
                src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                alt={news.title}
                width={600}
                height={400}
                sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                className="w-full aspect-3/2 sm:h-56 md:h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-linear-to-t from-black/80 to-transparent flex items-center justify-center p-3">
                <p className="text-white text-center font-semibold line-clamp-2 text-sm sm:text-base leading-snug">
                  {news.title}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default FeaturedNews;
