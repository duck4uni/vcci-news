'use client';

import ImageNext from "@/components/shared/image-next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { useRef } from "react";

const Banner = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop
      slidesPerView={1}
      onSwiper={(s) => (swiperRef.current = s)}
    >
      <SwiperSlide>
        <ImageNext
          src="https://vcci-hcm.org.vn/wp-content/uploads/2025/10/1.1.-Hero-Banner-CEO-2025-Bi-Sai-Nam-2025-Nhe-2560x720-Px.jpg.webp"
          alt="Banner"
          width={2560}
          height={720}
          sizes="100vw"
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        />
      </SwiperSlide>
      <SwiperSlide>
        <ImageNext
          src="https://vcci-hcm.org.vn/wp-content/uploads/2022/07/Landscape-HCM_3-01.png"
          alt="Banner"
          width={2560}
          height={720}
          sizes="100vw"
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
        />
      </SwiperSlide>
    </Swiper>
  );
}

export default Banner;