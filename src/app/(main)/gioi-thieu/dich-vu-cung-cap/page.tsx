'use client'
import React from "react";
import ListCategory from "../components/list-category";
import EventCalendar from "../components/event-calendar";

const Page = () => {
  return (
    <div className="min-h-screen container mx-auto pb-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-white border rounded-md p-7">
            <h1 className="text-2xl font-bold text-[#153e8e]">Dịch vụ cung cấp</h1>
            <hr className="my-5" />
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/1-7.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Tổ chức sự kiện, hội nghị, hội thảo, giao lưu thương mại, hội chợ, triển lãm</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/3-4-150x145.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Đào tạo nâng cao năng lực quản trị doanh nghiệp</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/5-1.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Khảo sát thị trường nước ngoài</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/7-150x147.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Cho thuê văn phòng, hội trường</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/8.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Quảng cáo, truyền thông</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/2-6.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Tư vấn về pháp lý, quan hệ lao động, môi trường kinh doanh</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/4-1.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Cấp C/O và xác nhận các chứng từ thương mại</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/6-5.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Cung cấp thông tin thị trường và hồ sơ doanh nghiệp</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/9.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Thu xếp visa nhập cảnh</p>
            </div>
            <div className="flex items-center">
              <img src="/gioi-thieu/dich-vu-cung-cap/10.webp" alt="Thông tin" className="w-12 px-2 py-2" />
              <p>Biên phiên dịch</p>
            </div>
          </main>
          {/* Sidebar */}
          <aside className="space-y-6">
            <EventCalendar />
            <img src="/home/eCarAid_web_banner_600x400.webp" alt="banner" />
          </aside>
        </div >
      </div >
    </div >
  );
};

export default Page;