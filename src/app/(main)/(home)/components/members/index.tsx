import ImageNext from "@/components/shared/image-next";
import memberImages from "@/constants/memberImages";
import { ChevronsRight } from "lucide-react";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import { GetNewsResponseType, NewsItem } from "@/api/types/news";
import BASE_URL from "@/links/index";
import { useGetNews } from "@/api/endpoints/news";
import { Spinner } from "@/components/ui/spinner";

const Members = () => {
  const { data, isLoading } = useGetNews<GetNewsResponseType>(
    {
      filters: `page_config.code @=ket-noi-hoi-vien`,
    }
  );
  return (
    <section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0">
      {/* LEFT: HỘI VIÊN TIÊU BIỂU */}
      <aside className="w-full lg:w-1/3 flex-1 bg-[#e8c518] p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold uppercase text-[#063e8e]">
            Hội viên tiêu biểu
          </h2>
          <Link
            href="/danh-ba-hoi-vien"
            className="text-[#063e8e] hover:underline text-sm font-medium"
          >
            <ChevronsRight />
          </Link>
        </div>

        <hr className="border-[#063e8e] mb-5" />

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={3}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="partner-swiper"
        >
          {memberImages.map((src, i) => (
            <SwiperSlide key={i}>
              <div className="flex justify-center items-center bg-white rounded-lg shadow p-3">
                <ImageNext
                  src={src}
                  alt={`member-${i}`}
                  width={160}
                  height={160}
                  sizes="(max-width:640px) 25vw,(max-width:1024px) 15vw,10vw"
                  className="object-contain w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </aside>

      {/* RIGHT: KẾT NỐI HỘI VIÊN */}
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Spinner />
        </div>
      ) : (
        <aside className="w-full lg:w-[30%] py-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold uppercase text-[#063e8e]">
              Kết nối hội viên
            </h2>
          </div>
          <hr className="border-[#063e8e] mb-5" />
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="partner-swiper"
          >
            {data?.responseData.rows.map((news: NewsItem) => (
              <SwiperSlide key={news.id}>
                <a href={`${news.external_link}`}>
                  <div className="w-full aspect-3/2 relative overflow-hidden mb-5">
                    <ImageNext
                      src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                      alt={news.title}
                      width={600}
                      height={400}
                      sizes="(max-width:768px) 100vw,50vw"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bg-white opacity-90 bottom-5 left-5 right-5 p-5">
                      <p className="text-[#063e8e] font-semibold text-sm sm:text-base z-10 line-clamp-3">
                        {news.title}
                      </p>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </aside>
      )}
    </section>
  );
};

export default Members;
