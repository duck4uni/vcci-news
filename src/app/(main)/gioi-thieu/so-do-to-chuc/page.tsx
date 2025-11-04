'use client'
import React from "react";
import ListCategory from "../components/list-category";

const Page = () => {
  return (
    <div className="min-h-screen container mx-auto pb-4">
      <div className="w-full flex flex-col gap-5">
        <ListCategory />
        {/* Main content */}
        <main className="lg:col-span-2 bg-white border rounded-md py-10 px-5 md:px-10 xl:px-50 text-justify">
          <h1 className="text-2xl font-bold text-[#153e8e]">Về VCCI-HCM</h1>
          <hr className="my-5" />
          <img src="/gioi-thieu/so-do-to-chuc/2025-SO-DO-TO-CHUC-01-VN.jpg.webp" alt="Sơ đồ tổ chức VCCI-HCM" />
        </main>
      </div >
    </div >
  );
};

export default Page;