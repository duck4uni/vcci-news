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
              Điểm cấp và Thời gian cấp C/O
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              <section className="mb-10">
                <ol className="list-decimal pl-6 space-y-6 text-[16px]">
                  {/* 1. CÁC TỔ CẤP C/O THUỘC CHI NHÁNH VCCI TẠI TP. HCM */}
                  <li className="leading-relaxed">
                    <strong>
                      CÁC TỔ CẤP C/O THUỘC CHI NHÁNH PHÒNG THƯƠNG MẠI & CÔNG
                      NGHIỆP TẠI TP. HCM
                    </strong>
                    <sup className="text-[10px] align-super ml-0.5">1</sup>:
                    <ol className="list-decimal pl-6 mt-3 space-y-2">
                      <li>
                        <strong>Tổ cấp C/O tại TP. HCM:</strong>
                        <br />
                        <strong>
                          Lầu 1, Tòa nhà VCCI HCM, 171 Võ Thị Sáu, Q. 3, Tp. HCM
                        </strong>
                        <br />
                        <strong>Điện thoại:</strong> 028-3932 6498 / 3932 2806
                      </li>
                      <li>
                        <strong>
                          Tổ cấp C/O tại Bình Dương (DN tại Tỉnh Bình Dương):
                        </strong>
                        <br />
                        <strong>
                          Lầu 3, Tòa nhà Công ty CP ICD Tân Cảng Sóng Thần, Số
                          7/20, Đường ĐT 743, KP. Bình Đáng, P. Bình Hòa, TX.
                          Thuận An, T. Bình Dương
                        </strong>
                        <br />
                        <strong>Điện thoại:</strong> 0274-380 0048
                      </li>
                      <li>
                        <strong>
                          Tổ cấp C/O tại Đồng Nai (DN tại Tỉnh Đồng Nai):
                        </strong>
                        <br />
                        <strong>
                          Tòa nhà Sonadezi, số 1 đường 3A, KCN Biên Hòa 2, T.
                          Đồng Nai
                        </strong>
                        <br />
                        <strong>Điện thoại:</strong> 0251-383 1383
                      </li>
                    </ol>
                  </li>

                  {/* 2. GIỜ TIẾP NHẬN HỒ SƠ */}
                  <li className="leading-relaxed">
                    <strong>GIỜ TIẾP NHẬN HỒ SƠ:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Từ thứ Hai đến thứ Sáu:</strong>
                        <br />
                        <strong>Buổi sáng:</strong> 7h30 – 11h30
                        <br />
                        <strong>Buổi chiều:</strong> 13h30 – 16h30
                      </li>
                      <li>
                        <strong>Thứ Bảy:</strong> 7h30 – 11h30 (
                        <em>
                          Riêng Tổ cấp C/O tại Đồng Nai không làm việc sáng thứ
                          7
                        </em>
                        )
                      </li>
                    </ul>
                    <p className="mt-2 font-medium text-[#363636]">
                      * Từ <strong>28/11/2020</strong> các Tổ cấp C/O thuộc VCCI
                      tại <strong>Tp.HCM, Bình Dương và Đồng Nai</strong>{" "}
                      <strong>tạm nghỉ làm việc sáng thứ 7</strong>. Đề nghị đại
                      diện Doanh nghiệp thu xếp thời gian đến liên hệ cấp C/O
                      phù hợp.
                    </p>
                  </li>

                  {/* 3. THỜI GIAN CẤP C/O */}
                  <li className="leading-relaxed">
                    <strong>THỜI GIAN CẤP C/O</strong>
                    <sup className="text-[10px] align-super ml-0.5">2</sup>:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        <strong>Tổ cấp C/O tại TP. HCM:</strong>{" "}
                        <strong>Không quá 08 giờ làm việc</strong>
                      </li>
                      <li>
                        <strong>Tổ cấp C/O tại Bình Dương:</strong>{" "}
                        <strong>Không quá 08 giờ làm việc</strong>
                      </li>
                      <li>
                        <strong>Tổ cấp C/O tại Đồng Nai:</strong>{" "}
                        <strong>Không quá 08 giờ làm việc</strong>
                      </li>
                    </ul>
                  </li>
                </ol>

                {/* Chú thích cuối trang */}
                <div className="mt-6 pt-4 text-sm text-gray-700">
                  <div className="h-[1px] w-[170px] bg-black mb-3"></div>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">1</sup> Doanh
                    nghiệp thuộc tỉnh Bình Dương hoặc Đồng Nai có quyền lựa chọn
                    điểm cấp C/O tại địa phương hoặc tại TP. HCM theo đề nghị
                    của doanh nghiệp. Lưu ý một doanh nghiệp chỉ được quyền đề
                    nghị cấp C/O tại một điểm cấp theo đề nghị của doanh nghiệp,
                    không áp dụng cùng lúc cho một doanh nghiệp đề nghị cấp C/O
                    tại nhiều điểm cấp.
                  </p>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">2</sup> Tại tất cả
                    các tổ cấp C/O, khi doanh nghiệp cần C/O gấp có thể đề nghị,
                    đăng ký ký gấp. Thời gian xét cấp gấp không quá 01 giờ làm
                    việc.
                  </p>
                </div>
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
