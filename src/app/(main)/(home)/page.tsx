"use client";

// core
import { useRef, useState } from "react";
import Link from 'next/link'

// app
import { Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BASE_URL from "@/links/index";
import dayjs from "dayjs";
import ImageNext from '@/components/shared/image-next';
import { Spinner } from "@/components/ui";
import CardNews from "./components/card-news";
import CardEvent from "./components/card-event";
import EventCalendar from "@components/base/event-calendar";
import stripImagesAndHtml from '@/helpers/stripImageAndHtml';
import partnerImages from '@/constants/partnerImages';
import memberImages from '@/constants/memberImages';

// server
import { useGetEvents } from "@/api/endpoints/event";
import { useGetNews } from "@/api/endpoints/news";
import { GetNewsResponseType, NewsItem } from "@/api/types/news";
import { EventApiResponse, EventItem } from "@/api/types/event";
import { ChevronsRight } from "lucide-react";

const Page = () => {
  const [tab, setTab] = useState("all");
  const swiperRef = useRef<SwiperType | null>(null);

  // query
  const { data: newsAll } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '10',
    }
  );
  const { data: newsData } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '5',
      filters: tab === "all" ? `` : `page_config.code @=${tab}`,
    }
  );
  const { data: eventData, isLoading: isLoadingEvent } = useGetEvents<EventApiResponse>();
  const { data: businessOpportunities, isLoading: isLoadingBusinessOpportunities } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '5',
      filters: `page_config.code @=co-hoi-kinh-doanh`,
    }
  );
  const { data: policyAndLegalInformation, isLoading: isLoadingPolicyAndLegalInformation } = useGetNews<GetNewsResponseType>(
    {
      pageSize: '5',
      filters: `page_config.code @=phap-luat`,
    }
  );

  // template
  return (
    <>
      {/* Banner */}
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
            priority
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

      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-12">
        {/* Featured News */}
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
            {newsAll?.responseData?.rows.map((news) => (
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

        <div>
          <Link href="https://hardwaretools.com.vn/">
            <ImageNext
              src="/home/Standard-Banner-1-2024.png.webp"
              alt="banner"
              width={2560}
              height={720}
            />
          </Link>
        </div>

        {/* Tin tức + Liên kết nhanh */}
        <section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0">
          {/* Left */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Link
                href="/thong-tin-truyen-thong/tin-vcci/"
                className="text-[18px] sm:text-[20px] font-semibold uppercase text-[#063e8e]"
              >
                Tin tức
              </Link>
              <Link
                href="/thong-tin-truyen-thong/tin-vcci/"
                className="text-[#063e8e] text-sm sm:text-base"
              >
                <ChevronsRight />
              </Link>
            </div>
            <hr className="border-[#063e8e] mb-4" />

            <div className="flex flex-col md:flex-row gap-5">
              {newsAll?.responseData.rows
                .slice(0, 1)
                .map((news: NewsItem) => (
                  <Link
                    key={news.id}
                    href={`${news.external_link}`}
                    className="flex flex-col w-full md:w-1/2 min-h-[180px] sm:min-h-[220px] gap-3 mb-3 bg-white"
                  >
                    <div className="w-full aspect-3/2 overflow-hidden">
                      <ImageNext
                        src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                        alt={news.title}
                        width={600}
                        height={400}
                        sizes="(max-width:768px) 100vw,50vw"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-5 pt-1">
                      <p className="text-[#063E8E] font-bold pb-2 text-xl line-clamp-2">
                        {news.title}
                      </p>
                      <p className="line-clamp-4 text-justify">{stripImagesAndHtml(news.description)}</p>
                    </div>
                  </Link>
                ))}

              <div className="w-full md:w-1/2">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
                  <button
                    className={`flex-1 py-[3px] text-sm transition-colors cursor-pointer ${tab === "all"
                      ? " bg-[#d3d3d3] text-[#063e8e] font-semibold"
                      : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                      }`}
                    onClick={() => setTab("all")}>
                    Tất cả
                  </button>
                  <button
                    className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${`tin-vcci` === tab
                      ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                      : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                      }`}
                    onClick={() => setTab("tin-vcci")}
                  >
                    Tin VCCI
                  </button>
                  <button
                    className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${`tin-kinh-te` === tab
                      ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                      : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                      }`}
                    onClick={() => setTab("tin-kinh-te")}
                  >
                    Tin Kinh Tế
                  </button>
                  <button
                    className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${`chuyen-de` === tab
                      ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                      : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                      }`}
                    onClick={() => setTab("chuyen-de")}
                  >
                    Chuyên Đề
                  </button>
                </div>

                {newsData?.responseData?.rows.slice(0, 4).map((news) => (
                  <CardNews key={news.id} news={news} />
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <aside className="w-full lg:w-[30%]">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-semibold uppercase text-[#063e8e]">
                Liên kết nhanh
              </h2>
            </div>
            <hr className="border-[#063e8e] mb-4" />
            <div className="space-y-2 text-[#063e8e] text-sm md:text-base pb-10">
              <div>
                <Link
                  className="text-[#363636]"
                  href="https://vcci-hcm.org.vn/lien-ket-nhanh/cam-nang-huong-dan-dau-tu-kinh-doanh-tai-viet-nam-2023/"
                >
                  🔗 Cẩm nang hướng dẫn đầu tư kinh doanh tại Việt Nam
                </Link>
              </div>
              <div>
                <Link
                  className="text-[#363636]"
                  href="https://vcci-hcm.org.vn/lien-ket-nhanh/doanh-nghiep-kien-nghi-ve-chinh-sach-va-phap-luat/"
                >
                  🔗 Doanh nghiệp kiến nghị về chính sách và pháp luật
                </Link>
              </div>
            </div>
            <div>
              <Link href="https://hardwaretools.com.vn/">
                <ImageNext
                  src="/home/20-2048x1365.webp"
                  alt="banner"
                  width={2048}
                  height={1365}
                />
              </Link>
            </div>
          </aside>
        </section >

        {/* Sự kiện */}
        < section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0" >
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
              {isLoadingEvent ? (
                <div className="container w-full h-[80vh] flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  {eventData?.responseData.rows.slice(0, 1).map((event: EventItem) => (
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
                    {eventData?.responseData.rows.slice(0, 4).map((event) => (
                      <CardEvent key={event.id} event={event} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-[#063e8e] w-full lg:w-[30%] p-5">
            <aside>
              <div className="flex justify-between items-center">
                <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-[#e8c518]">
                  Lịch sự kiện
                </h2>
                <Link
                  href="/hoat-dong/su-kien"
                  className="text-[#e8c518] hover:underline text-sm sm:text-base"
                >
                  <ChevronsRight />
                </Link>
              </div>
              <hr className="border-[#e8c518] mb-4" />
              <EventCalendar />
            </aside>
          </div>
        </section >

        {/* Cơ hội kinh doanh + Chính sách */}
        < div className="flex flex-col lg:flex-row gap-5 pb-10 mb-0" >
          <div className="flex flex-col flex-1">
            <div>
              <Link href="https://vcci-hcm.org.vn/wp-content/uploads/2022/11/MEDIA-KIT_VCCI-HCM-2022-Final.pdf">
                <ImageNext
                  src="/home/Standard-Banner-1-2024.png.webp"
                  alt="banner"
                  width={2560}
                  height={720}
                />
              </Link>
            </div>
            <section className="flex flex-col md:flex-row gap-5 pt-8">
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <Link
                    href="/xuc-tien-thuong-mai/co-hoi/"
                    className="text-[18px] sm:text-[20px] font-bold uppercase text-[#063e8e]"
                  >
                    Cơ hội kinh doanh
                  </Link>
                  <Link
                    href="/xuc-tien-thuong-mai/co-hoi/"
                    className="text-[#063e8e] text-sm sm:text-base"
                  >
                    <ChevronsRight />
                  </Link>
                </div>
                <hr className="border-[#063e8e] mb-4" />
                <div className="pt-2">
                  {isLoadingBusinessOpportunities ? (
                    <div className="container w-full h-[80vh] flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      {businessOpportunities?.responseData.rows
                        .slice(0, 1)
                        .map((news: NewsItem) => (
                          <Link key={news.id} href={`${news.external_link}`}>
                            <div className="w-full aspect-3/2 relative overflow-hidden mb-5">
                              <ImageNext
                                src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                                alt={news.title}
                                width={600}
                                height={400}
                                sizes="(max-width:768px) 100vw,50vw"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bg-white opacity-80 bottom-5 left-5 right-5 p-5">
                                <p className="text-[#063e8e] font-semibold text-sm sm:text-base z-10 line-clamp-3">
                                  {news.title}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}

                      {businessOpportunities?.responseData.rows.slice(0, 3).map((news) => (
                        <CardNews key={news.id} news={news} />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <Link
                    href="/thong-tin-truyen-thong/phap-luat"
                    className="text-[18px] sm:text-[20px] font-bold uppercase text-[#063e8e]"
                  >
                    Chính sách & pháp luật
                  </Link>
                  <Link
                    href="/thong-tin-truyen-thong/phap-luat"
                    className="text-[#063e8e] text-sm sm:text-base"
                  >
                    <ChevronsRight />
                  </Link>
                </div>
                <hr className="border-[#063e8e] mb-4" />
                <div className="pt-2">
                  {isLoadingPolicyAndLegalInformation ? (
                    <div className="container w-full h-[80vh] flex justify-center items-center">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      {policyAndLegalInformation?.responseData.rows
                        .slice(0, 1)
                        .map((news: NewsItem) => (
                          <Link key={news.id} href={`${news.external_link}`}>
                            <div className="w-full aspect-3/2 relative overflow-hidden mb-5">
                              <ImageNext
                                src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                                alt={news.title}
                                width={600}
                                height={400}
                                sizes="(max-width:768px) 100vw,50vw"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bg-white opacity-80 bottom-5 left-5 right-5 p-5">
                                <p className="text-[#063e8e] font-semibold text-sm sm:text-base z-10 line-clamp-3">
                                  {news.title}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      {policyAndLegalInformation?.responseData.rows.slice(0, 3).map((news) => (
                        <CardNews key={news.id} news={news} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </section>
          </div>
          <div className="w-full lg:w-[30%] justify-center items-start flex">
            <Link href="https://smartgara.ecaraid.com/">
              <ImageNext
                src="/home/eCarAid_web_banner_600x400.webp"
                alt="banner"
                width={600}
                height={400}
              />
            </Link>
          </div>
        </div >

        {/* Hội viên tiêu biểu */}
        <section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0" >
          {/* left */}
          < aside className="w-full lg:w-1/3 flex-1 bg-[#e8c518] p-5" >
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
            <div>
              <Swiper
                modules={[Autoplay, Grid]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                grid={{ rows: 1, fill: "row" }}
                slidesPerGroup={3}
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 10 },
                  640: { slidesPerView: 3, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className="partner-swiper"
              >
                {memberImages.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-square flex justify-center items-center bg-white rounded-lg shadow">
                      <ImageNext
                        src={src}
                        alt={`partner-${i}`}
                        width={160}
                        height={160}
                        sizes="(max-width:640px) 25vw,(max-width:1024px) 15vw,10vw"
                        className="w-3/4 h-3/4 object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </aside >

          {/* right */}
          <aside className="w-full lg:w-[30%] py-5" >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold uppercase text-[#063e8e]">
                Kết nối hội viên
              </h2>
            </div>
            <hr className="border-[#063e8e] mb-5" />
            <div className="pb-10">
              <Swiper
                modules={[Autoplay, Grid]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                grid={{ rows: 2, fill: "row" }}
                slidesPerGroup={3}
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 10 },
                  640: { slidesPerView: 3, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className="partner-swiper"
              >
                {partnerImages.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-square flex justify-center items-center bg-white rounded-lg shadow">
                      <ImageNext
                        src={src}
                        alt={`partner-${i}`}
                        width={160}
                        height={160}
                        sizes="(max-width:640px) 25vw,(max-width:1024px) 15vw,10vw"
                        className="w-3/4 h-3/4 object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </aside >
        </section >

        {/* Video + đối tác */}
        < section className="flex flex-col lg:flex-row gap-5 pb-10" >
          {/* left */}
          < div className="flex flex-col flex-1" >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold uppercase text-[#063e8e]">
                Video
              </h2>
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
          </div >

          {/* right */}
          < aside className="w-full lg:w-[30%]" >
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
                slidesPerGroup={3}
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 10 },
                  640: { slidesPerView: 3, spaceBetween: 16 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                }}
                className="partner-swiper"
              >
                {partnerImages.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="aspect-square flex justify-center items-center bg-white rounded-lg shadow">
                      <ImageNext
                        src={src}
                        alt={`partner-${i}`}
                        width={160}
                        height={160}
                        sizes="(max-width:640px) 25vw,(max-width:1024px) 15vw,10vw"
                        className="w-3/4 h-3/4 object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </aside>
        </section>
      </div>
    </>
  );
};

export default Page;
