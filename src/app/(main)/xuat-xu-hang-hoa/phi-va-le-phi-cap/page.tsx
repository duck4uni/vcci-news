import React from "react";
import Image from "next/image";
import ListCategory from "../components/list-category";
import Calendar from "../components/Calendar";

export default function page() {
  return (
    <div className="bg-[#f6f6f6]">
      <div className="container m-auto flex flex-col gap-5 mb-[50px]">
        <div className="border-[#e5e7f2] border-[1px]">
          <ListCategory />
        </div>
        <div className="w-full flex gap-5 flex-wrap">
          <div className="lg:w-[calc(65%-10px)] w-full border-[#e5e7f2] border-[1px] bg-white p-[30px] flex flex-col gap-[15px]">
            <h1 className="text-[#063e8e] text-[25px] font-semibold">
              Phí và Lệ phí cấp C/O
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              <section className="mb-10">
                <ol className="list-decimal pl-6 space-y-6 text-[16px]">
                  {/* 1. Lệ phí cấp C/O */}
                  <li className="leading-relaxed">
                    <strong>Lệ phí cấp C/O:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Phí cấp C/O:</strong>{" "}
                        <strong>60.000 VND/bộ cấp mới</strong> và{" "}
                        <strong>30.000 VND/bộ cấp lại</strong> (
                        <em>
                          TT36/2023/TT-BTC ngày 06/6/2023 của Bộ Tài chính quy
                          định mức thu, chế độ thu, nộp, quản lý và sử dụng phí
                          chứng nhận xuất xứ hàng hóa - C/O
                        </em>
                        ).
                      </li>
                    </ul>
                  </li>

                  {/* 2. Phí cấp chứng từ thương mại */}
                  <li className="leading-relaxed">
                    <strong>Phí cấp chứng từ thương mại:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>100.000 VND/bộ/4 trang</strong> theo{" "}
                        <strong>
                          Quy định số 2706/2009/PTM-TT ngày 9 tháng 9 năm 2010
                          của Phòng Thương mại và Công nghiệp Việt Nam về việc
                          Ban hành phí xác nhận chứng từ thương mại
                        </strong>
                        .
                      </li>
                    </ul>
                  </li>
                </ol>
              </section>
            </div>
          </div>
          <div className="lg:w-[calc(35%-10px)] w-full ">
            <Calendar />
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
