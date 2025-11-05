'use client'
import React from "react";
import ListCategory from "./components/list-category";
import EventCalendar from "./components/event-calendar";
import ImageGallery from "./components/image-gallery";

const Page = () => {

  const images = [
    '/gioi-thieu/VCCI-HCM-BROCHURE-2020_Tieng-Viet-1-scaled.webp',
    '/gioi-thieu/VCCI-HCM-BROCHURE-2020_Tieng-Viet-2-scaled.webp',
    '/gioi-thieu/VCCI-HCM-BROCHURE-2020_Tieng-Viet-3-scaled.webp',
    '/gioi-thieu/VCCI-HCM-BROCHURE-2020_Tieng-Viet-4-scaled.webp',
  ]

  return (
    <div className="min-h-screen container mx-auto pb-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory />
        {/* Main content */}
        <main className="lg:col-span-2 bg-white border rounded-md py-10 px-5 md:px-10 xl:px-50 text-justify">
          <h1 className="text-2xl font-bold text-[#153e8e]">Về VCCI-HCM</h1>
          <hr className="my-5" />
          <div className="flex flex-col justify-center items-center">
            <p className="text-center text-[#063e8e] text-[14pt] font-bold pb-5">
              GIỚI THIỆU CHUNG
            </p>
            <p className="pb-5">Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) là tổ chức quốc gia tập hợp và đại diện cho cộng đồng doanh nghiệp, doanh nhân, người sử dụng lao động và các hiệp hội doanh nghiệp ở Việt Nam nhằm mục đích phát triển, bảo vệ và hỗ trợ cộng đồng doanh nghiệp, góp phần phát triển kinh tế - xã hội của đất nước, thúc đẩy các quan hệ hợp tác kinh tế, thương mại và khoa học - công nghệ với nước ngoài trên cơ sở bình đẳng và cùng có lợi, theo quy định của pháp luật.</p>
            <p>Chi nhánh VCCI khu vực Thành phố Hồ Chí Minh (VCCI-HCM) là Chi nhánh lớn nhất, hoạt động trên địa bàn TP.HCM và 5 tỉnh thành phía Nam: Bình Dương, Bình Phước, Đồng Nai, Lâm Đồng, Tây Ninh.</p>
            <img src="/gioi-thieu/MAPS_VCCI-HCM-Upload-1259x1536.jpg.webp" alt="map" />
            <img src="/gioi-thieu/tam-nhin-1024x470.jpg.webp" alt="map" />

            <p className="text-[14pt] pb-5">
              <strong className="text-[#063e8e] font-sans">
                BROCHURE VCCI-HCM
              </strong>
            </p>

            <div className="pb-5">
              <ImageGallery images={images} />
            </div>

            <p className="text-[14pt] pb-5">
              <strong className="text-[#063e8e] font-sans">
                VIDEO VỀ VCCI-HCM
              </strong>
            </p>
            <iframe
              width="808"
              height="455"
              src="https://www.youtube.com/embed/j9ao-9b6Jf0"
              title="VCCI-HCM 2024 IN REVIEW"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen>
            </iframe>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;