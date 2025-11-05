"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Autoplay, Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BASE_URL from "@/links/index";
import { Spinner } from "@/components/ui";
import CardNews from "./components/card-news";
import CardEvent from "./components/card-event";
import EventCalendar from "@components/base/event-calendar";
import dayjs from "dayjs";
import AppEditorContent from "@/components/shared/editor-content";

// server
import { useGetEvents } from "@/api/endpoints/event";
import { useGetCategory } from "@/api/endpoints/category";
import { useGetNews } from "@/api/endpoints/news";
import { GetCategoryAdminResponseType } from "@/api/types/category";
import { GetNewsAdminResponseType, NewsAdminItem } from "@/api/types/news";
import { EventApiResponse, EventItem } from "@/api/types/event";
import { ChevronsRight, Link } from "lucide-react";

const Page = () => {
  const [tab, setTab] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const { data: categoryData, isLoading: isLoadingCategory } = useGetCategory<GetCategoryAdminResponseType>();
  const { data: newsData, isLoading: isLoadingNews } = useGetNews<GetNewsAdminResponseType>(
    {
      pageSize: '5',
      filters: tab === "all" ? `` : `category @=${tab}`,
    }
  );
  const { data: businessOpportunities, isLoading: isLoadingBusinessOpportunities } = useGetNews<GetNewsAdminResponseType>(
    {
      pageSize: '5',
      filters: `category @=Cơ hội kinh doanh`,
    }
  );
  const { data: policyAndLegalInformation, isLoading: isLoadingPolicyAndLegalInformation } = useGetNews<GetNewsAdminResponseType>(
    {
      pageSize: '5',
      filters: `category @=Thông tin chính sách và pháp luật`,
    }
  );
  const { data: eventData, isLoading: isLoadingEvent } = useGetEvents<EventApiResponse>();

  const images = [
    "/home/doi-tac/AMFORI-1.png.webp",
    "/home/doi-tac/AUS4SKILLS-1.png.webp",
    "/home/doi-tac/BetterWork-1.png.webp",
    "/home/doi-tac/BOI-LOGO.jpg.webp",
    "/home/doi-tac/DNV-logo-1-1.png.webp",
    "/home/doi-tac/GERMAN-COOPERATION-1.png.webp",
    "/home/doi-tac/GIZ.png.webp",
    "/home/doi-tac/HBA.png.webp",
    "/home/doi-tac/ILO-1.png.webp",
    "/home/doi-tac/InvestHK.png.webp",
    "/home/doi-tac/IOM-1.png.webp",
    "/home/doi-tac/JICA-134x100-1-1.jpg.webp",
    "/home/doi-tac/KIRBY.png.webp",
    "/home/doi-tac/NHO-1.png.webp",
    "/home/doi-tac/OXFAM-1.png.webp",
    "/home/doi-tac/RECOTVET-1.png.webp",
    "/home/doi-tac/SC-1.png.webp",
    "/home/doi-tac/UNDP.png.webp",
  ];

  const hoivien = [
    "/home/hoi-vien-tieu-bieu/logo-GTD-768x768.png.webp",
    "/home/hoi-vien-tieu-bieu/Nhua-Long-Thanh_Logo.jpg.webp",
    "/home/hoi-vien-tieu-bieu/Nova_Group_logo-1.png.webp",
    "/home/hoi-vien-tieu-bieu/samngoclinh-1-768x768.png.webp",
    "/home/hoi-vien-tieu-bieu/Screenshot-2022-12-26-144136-768x768.png.webp",
    "/home/hoi-vien-tieu-bieu/UOB-logo_Vuong.jpeg.webp",
  ];

  return (
    (isLoadingBusinessOpportunities || isLoadingPolicyAndLegalInformation || isLoadingCategory || isLoadingEvent) ? (
      <div className="container w-full h-[80vh] flex justify-center items-center">
        <Spinner />
      </div>
    ) : (
      <>
        {/* Banner */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) =>
            setCurrentIndex(
              typeof s.realIndex === "number" ? s.realIndex : s.activeIndex
            )
          }
        >
          <SwiperSlide>
            <img
              src="https://vcci-hcm.org.vn/wp-content/uploads/2025/10/1.1.-Hero-Banner-CEO-2025-Bi-Sai-Nam-2025-Nhe-2560x720-Px.jpg"
              alt="Banner"
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://vcci-hcm.org.vn/wp-content/uploads/2022/07/Landscape-HCM_3-01.png"
              alt="Banner"
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
            />
          </SwiperSlide>
        </Swiper>

        <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-12">
          {/* Featured News */}
          <section>
            <div className="flex items-center justify-center py-8 px-4">
              <div className="flex items-center w-full max-w-4xl">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-gray-400"></div>
                <h1 className="px-6 text-[20px] sm:text-[24px] md:text-[28px] uppercase font-bold text-[#063e8e] whitespace-nowrap">
                  Tin Nổi Bật
                </h1>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-gray-300 to-gray-400"></div>
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
              {newsData?.responseData?.rows.map((news) => (
                <SwiperSlide key={news.id}>
                  <a
                    href={`/${news.id}`}
                    className="relative block bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <img
                      src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                      alt={news.title}
                      className="w-full aspect-3/2 sm:h-56 md:h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-linear-to-t from-black/80 to-transparent flex items-center justify-center p-3">
                      <p className="text-white text-center font-semibold line-clamp-2 text-sm sm:text-base leading-snug">
                        {news.title}
                      </p>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          <div>
            <a href="https://hardwaretools.com.vn/">
              <img src="/home/Standard-Banner-1-2024.png.webp" alt="banner" />
            </a>
          </div>

          {/* Tin tức + Liên kết nhanh */}
          <section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0">
            {/* Left */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <a
                  href="/thong-tin-truyen-thong/tin-vcci/"
                  className="text-[18px] sm:text-[20px] font-semibold uppercase text-[#063e8e]"
                >
                  Tin tức
                </a>
                <a
                  href="/thong-tin-truyen-thong/tin-vcci/"
                  className="text-[#063e8e] text-sm sm:text-base"
                >
                  <ChevronsRight />
                </a>
              </div>
              <hr className="border-[#063e8e] mb-4" />

              <div className="flex flex-col md:flex-row gap-5">
                {newsData?.responseData.rows
                  .slice(0, 1)
                  .map((news: NewsAdminItem) => (
                    <a
                      key={news.id}
                      href={`${news.id}`}
                      className="flex flex-col w-full md:w-1/2 min-h-[180px] sm:min-h-[220px] gap-3 mb-3 bg-white"
                    >
                      <div className="w-full aspect-3/2 overflow-hidden">
                        <img
                          src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-5 pt-0">
                        <p className="text-[#063E8E] font-bold text-xl line-clamp-2">
                          {news.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {dayjs(news.release_at).format("DD/MM/YYYY")}
                        </p>
                        <AppEditorContent
                          className="line-clamp-4"
                          value={news.description}
                        />
                      </div>
                    </a>
                  ))}

                <div className="w-full md:w-1/2">
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
                    <button
                      className={`flex-1 py-[3px] text-sm transition-colors cursor-pointer ${tab === "all"
                        ? " bg-[#d3d3d3] text-[#063e8e] font-semibold"
                        : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                        }`}
                      onClick={() => setTab("all")}
                    >
                      Tất cả
                    </button>
                    {categoryData?.responseData.rows
                      .slice(0, 3)
                      .map((category) => (
                        <button
                          key={category.id}
                          className={`flex-1 py-[3px] text-[14px] transition-colors cursor-pointer ${category.name === tab
                            ? "bg-[#d3d3d3] text-[#063e8e] font-semibold"
                            : "border-gray-300 text-[#363636] bg-[#e8e8e8] hover:bg-[#e8e8e8] hover:text-[#063e8e] font-semibold"
                            }`}
                          onClick={() => setTab(category.name)}
                        >
                          {category.name}
                        </button>
                      ))}
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
                <a href="#" className="text-[#063e8e] text-sm sm:text-base">
                  <ChevronsRight />
                </a>
              </div>
              <hr className="border-[#063e8e] mb-4" />
              <div className="space-y-2 text-[#063e8e] text-sm md:text-base pb-10">
                <div>
                  <a
                    className="text-[#363636]"
                    href="https://vcci-hcm.org.vn/lien-ket-nhanh/cam-nang-huong-dan-dau-tu-kinh-doanh-tai-viet-nam-2023/"
                  >
                    <Link
                      size={16}
                      className="inline mr-2 font-semibold text-[#063e8e]"
                      style={{ verticalAlign: "middle", marginTop: "-2px" }}
                    />
                    Cẩm nang hướng dẫn đầu tư kinh doanh tại Việt Nam
                  </a>
                </div>
                <div>
                  <a
                    className="text-[#363636]"
                    href="https://vcci-hcm.org.vn/lien-ket-nhanh/doanh-nghiep-kien-nghi-ve-chinh-sach-va-phap-luat/"
                  >
                    <Link
                      size={16}
                      className="inline mr-2 font-semibold text-[#063e8e]"
                      style={{ verticalAlign: "middle", marginTop: "-2px" }}
                    />
                    Doanh nghiệp kiến nghị về chính sách và pháp luật
                  </a>
                </div>
              </div>
              <div>
                <a href="https://hardwaretools.com.vn/">
                  <img src="/home/20-2048x1365.webp" alt="banner" />
                </a>
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
                <a href="#" className="text-[#e8c518] text-sm sm:text-base">
                  <ChevronsRight />
                </a>
              </div>
              <hr className="border-[#e8c518] mb-4" />

              <div className="flex flex-col md:flex-row gap-5">
                {eventData?.responseData.rows
                  .slice(0, 1)
                  .map((event: EventItem) => (
                    <a
                      key={event.id}
                      href={`${event.id}`}
                      className="flex flex-col w-full md:w-1/2 min-h-[180px] sm:min-h-[220px] gap-3 mb-3 border border-gray-200 bg-white rounded-md p-3"
                    >
                      <div className="w-full aspect-3/2 overflow-hidden">
                        <img
                          src={`${BASE_URL.imageEndpoint}${event.image}`}
                          alt={event.name}
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
                        <AppEditorContent
                          className="line-clamp-3"
                          value={event.description}
                        />
                      </div>
                    </a>
                  ))}
                <div className="w-full md:w-1/2">
                  {eventData?.responseData.rows.slice(0, 4).map((event) => (
                    <CardEvent key={event.id} event={event} />
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-[#063e8e] w-full lg:w-[30%] p-5">
              <aside>
                <div className="flex justify-between items-center">
                  <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-[#e8c518]">
                    Lịch sự kiện
                  </h2>
                  <a
                    href="#"
                    className="text-[#e8c518] hover:underline text-sm sm:text-base"
                  >
                    <ChevronsRight />
                  </a>
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
                <a href="https://vcci-hcm.org.vn/wp-content/uploads/2022/11/MEDIA-KIT_VCCI-HCM-2022-Final.pdf">
                  <img src="/home/Standard-Banner-1-2024.png.webp" alt="banner" />
                </a>
              </div>
              <section className="flex flex-col md:flex-row gap-5 pt-8">
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <a
                      href="/xuc-tien-thuong-mai/co-hoi-kinh-doanh/"
                      className="text-[18px] sm:text-[20px] font-bold uppercase text-[#063e8e]"
                    >
                      Cơ hội kinh doanh
                    </a>
                    <a
                      href="/xuc-tien-thuong-mai/co-hoi-kinh-doanh/"
                      className="text-[#063e8e] text-sm sm:text-base"
                    >
                      <ChevronsRight />
                    </a>
                  </div>
                  <hr className="border-[#063e8e] mb-4" />
                  <div className="pt-2">
                    {businessOpportunities?.responseData.rows
                      .slice(0, 1)
                      .map((news: NewsAdminItem) => (
                        <a key={news.id} href={`${news.id}`}>
                          <div className="w-full aspect-3/2 relative overflow-hidden mb-5">
                            <img
                              src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bg-white opacity-80 bottom-5 left-5 right-5 p-5">
                              <p className="text-[#063e8e] font-semibold text-sm sm:text-base z-10 line-clamp-3">
                                {news.title}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}

                    {businessOpportunities?.responseData.rows.slice(0, 3).map((news) => (
                      <CardNews key={news.id} news={news} />
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <a
                      href="/thong-tin-truyen-thong/thong-tin-chinh-sach-va-phap-luat"
                      className="text-[18px] sm:text-[20px] font-bold uppercase text-[#063e8e]"
                    >
                      Chính sách & pháp luật
                    </a>
                    <a
                      href="/thong-tin-truyen-thong/thong-tin-chinh-sach-va-phap-luat"
                      className="text-[#063e8e] text-sm sm:text-base"
                    >
                      <ChevronsRight />
                    </a>
                  </div>
                  <hr className="border-[#063e8e] mb-4" />
                  <div className="pt-2">
                    {policyAndLegalInformation?.responseData.rows
                      .slice(0, 1)
                      .map((news: NewsAdminItem) => (
                        <a key={news.id} href={`${news.id}`}>
                          <div className="w-full aspect-3/2 relative overflow-hidden mb-5">
                            <img
                              src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bg-white opacity-80 bottom-5 left-5 right-5 p-5">
                              <p className="text-[#063e8e] font-semibold text-sm sm:text-base z-10 line-clamp-3">
                                {news.title}
                              </p>
                            </div>
                          </div>
                        </a>
                      ))}

                    {policyAndLegalInformation?.responseData.rows.slice(0, 3).map((news) => (
                      <CardNews key={news.id} news={news} />
                    ))}
                  </div>
                </div>
              </section>
            </div>
            <div className="w-full lg:w-[30%] justify-center items-start flex">
              <a href="https://smartgara.ecaraid.com/">
                <img src="/home/eCarAid_web_banner_600x400.webp" alt="banner" />
              </a>
            </div>
          </div >

          {/* Hội viên tiêu biểu */}
          < section className="flex flex-col lg:flex-row gap-5 pb-10 mb-0" >
            {/* left */}
            < aside className="w-full lg:w-1/3 flex-1 bg-[#e8c518] p-5" >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold uppercase text-[#063e8e]">
                  Hội viên tiêu biểu
                </h2>
                <a
                  href="#"
                  className="text-[#063e8e] hover:underline text-sm font-medium"
                >
                  <ChevronsRight />
                </a>
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
                  {hoivien.map((src, i) => (
                    <SwiperSlide key={i}>
                      <div className="aspect-square flex justify-center items-center bg-white rounded-lg shadow">
                        <img
                          src={src}
                          alt={`partner-${i}`}
                          className="w-3/4 h-3/4 object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </aside >

            {/* right */}
            < aside className="w-full lg:w-[30%] py-5" >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold uppercase text-[#063e8e]">
                  Kết nối hội viên
                </h2>
                <a
                  href="#"
                  className="text-[#063e8e] hover:underline text-sm font-medium"
                >
                  <ChevronsRight />
                </a>
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
                  {images.map((src, i) => (
                    <SwiperSlide key={i}>
                      <div className="aspect-square flex justify-center items-center bg-white rounded-lg shadow">
                        <img
                          src={src}
                          alt={`partner-${i}`}
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
                <a
                  href="#"
                  className="text-[#063e8e] hover:underline text-sm font-medium"
                >
                  <ChevronsRight />
                </a>
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
                <a
                  href="#"
                  className="text-[#063e8e] hover:underline text-sm font-medium"
                >
                  <ChevronsRight />
                </a>
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
                  {images.map((src, i) => (
                    <SwiperSlide key={i}>
                      <div className="aspect-square flex justify-center items-center bg-white rounded-lg shadow">
                        <img
                          src={src}
                          alt={`partner-${i}`}
                          className="w-3/4 h-3/4 object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </aside >
          </section >
        </div >
      </>
    )
  );
};

export default Page;
