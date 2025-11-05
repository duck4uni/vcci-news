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
              Biểu mẫu C/O và cách khai
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              <section className="mb-10">
                <ol className="list-decimal pl-6 space-y-6 text-[16px]">
                  {/* 1. Đăng ký hồ sơ thương nhân */}
                  <li className="leading-relaxed">
                    <strong>Đăng ký hồ sơ thương nhân:</strong>
                    <br />
                    <strong>Đăng ký Hồ sơ thương nhân</strong> (
                    <em>
                      áp dụng đối với thương nhân đề nghị cấp C/O lần đầu hoặc
                      bổ sung khi có thay đổi thông tin của thương nhân hoặc cập
                      nhật 2 năm/lần theo quy định
                    </em>
                    ).
                  </li>

                  {/* 2. Biểu mẫu về C/O */}
                  <li className="leading-relaxed">
                    <strong>Biểu mẫu về C/O:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Đơn đề nghị cấp C/O</strong>;
                      </li>
                      <li>
                        <strong>C/O mẫu A</strong> (
                        <em>
                          C/O ưu đãi thuế quan phổ cập (GSP) theo quy định của
                          nước nhập khẩu
                        </em>
                        );
                      </li>
                      <li>
                        <strong>C/O mẫu B</strong> (
                        <em>
                          C/O không ưu đãi theo quy định tại Thông tư
                          05/2018/TT-BCT ngày 3/4/2018
                        </em>
                        );
                      </li>
                      <li>
                        <strong>C/O mẫu ICO</strong> (
                        <em>
                          Cấp cho hàng cà phê theo quy định của Tổ chức Cà phê
                          Quốc tế
                        </em>
                        );
                      </li>
                      <li>
                        <strong>C/O mẫu Turkey</strong> (
                        <em>Thổ Nhĩ Kỳ – Tương đương C/O mẫu B</em>);
                      </li>
                      <li>
                        <strong>C/O mẫu DA59</strong> (
                        <em>Nam Phi – Tương đương C/O mẫu B</em>);
                      </li>
                      <li>
                        <strong>C/O mẫu Peru</strong> (
                        <em>Peru – Tương đương C/O mẫu B</em>);
                      </li>
                      <li>
                        <strong>
                          Giấy chứng nhận hàng hóa không thay đổi xuất xứ (CNM)
                        </strong>
                        ;
                      </li>
                      <li>
                        <strong>
                          Mẫu các bảng kê khai nguyên vật liệu sử dụng trong sản
                          xuất hàng hóa xuất khẩu
                        </strong>{" "}
                        khi đề nghị cấp C/O;
                      </li>
                      <li>
                        <strong>
                          Mẫu đơn đề nghị xét giảm chứng từ nguyên vật liệu
                        </strong>{" "}
                        trong hồ sơ đề nghị cấp C/O;
                      </li>
                      <li>
                        <strong>Mẫu đơn đề nghị cấp mã số REX</strong>.
                      </li>
                    </ul>
                  </li>

                  {/* 3. Mẫu khác */}
                  <li className="leading-relaxed">
                    <strong>Mẫu khác:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Mẫu GCN</strong> (
                        <em>
                          Giấy chứng nhận cho hàng hóa không đáp ứng quy định về
                          xuất xứ
                        </em>
                        );
                      </li>
                      <li>
                        <strong>Mẫu đề nghị thay đổi nơi cấp C/O</strong>.
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
