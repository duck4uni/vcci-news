import React from "react";
import Image from "next/image";
import ListCategory from "../components/list-category";
import EventCalendar from "@/components/base/event-calendar";

export default function page() {
  return (
    <div className="bg-[#f6f6f6]">
      <div className="max-w-[1200px] m-auto flex flex-col gap-5 mb-[50px]">
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
                <div className="space-y-6 text-[16px] leading-relaxed">
                  <div>
                    <p className="font-bold text-[#363636]">PHÒNG PHÁP CHẾ</p>
                    <p>
                      <strong>
                        Chi nhánh Phòng Thương mại và Công nghiệp Việt Nam tại
                        Tp. HCM (VCCI HCM)
                      </strong>
                      <br />
                      <strong>
                        Lầu 1, Tòa nhà VCCI HCM, 171 Võ Thị Sáu, P. 7, Quận 3,
                        TP. HCM
                      </strong>
                      <br />
                      <strong>Điện thoại:</strong> 028-3932 6498 / 3932 2806
                      <br />
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:co@vcci-hcm.org.vn"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        co@vcci-hcm.org.vn
                      </a>
                    </p>
                  </div>

                  {/* Xử lý vướng mắc, phản ánh, góp ý */}
                  <div>
                    <p className="font-bold text-[#363636]">
                      XỬ LÝ VƯỚNG MẮC, PHẢN ÁNH, GÓP Ý TRONG QUÁ TRÌNH LÀM THỦ
                      TỤC CẤP C/O:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-3">
                      <li>
                        <strong>Tổ cấp C/O tại Tp. HCM:</strong>
                        <br />
                        <strong>Điện thoại:</strong> 028-3232 5176
                        <br />
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:co@vcci-hcm.org.vn"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          co@vcci-hcm.org.vn
                        </a>
                      </li>

                      <li>
                        <strong>Điểm cấp C/O tại Bình Dương:</strong>
                        <br />
                        <strong>Phó trưởng phòng Pháp chế:</strong> Nguyễn Văn
                        Đức
                        <br />
                        <strong>Mobile:</strong> 090 949 7155
                        <br />
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:nvduc1980@gmail.com"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          nvduc1980@gmail.com
                        </a>
                      </li>

                      <li>
                        <strong>Tổ cấp C/O tại Đồng Nai:</strong>
                        <br />
                        <strong>Phó trưởng phòng Pháp chế:</strong> Ông Bùi Mạnh
                        Hùng
                        <br />
                        <strong>Mobile:</strong> 087 789 2442
                        <br />
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:hungbui@vcci-hcm.org.vn"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          hungbui@vcci-hcm.org.vn
                        </a>
                      </li>

                      <li>
                        <strong>
                          HƯỚNG DẪN KHAI HỒ SƠ THƯƠNG NHÂN, CHỮ KÝ SỐ VÀ IT;
                          GIẢI ĐÁP VỀ REX:
                        </strong>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>
                            <strong>Tổ cấp C/O tại Tp.HCM:</strong> 028-3932
                            6498 / 3932 2806
                          </li>
                          <li>
                            <strong>Tổ cấp C/O tại Bình Dương:</strong> 0274-380
                            0048
                          </li>
                          <li>
                            <strong>Tổ cấp C/O tại Đồng Nai:</strong> 0251-383
                            1383
                          </li>
                        </ul>
                      </li>

                      <li>
                        <strong>
                          TIẾP THU, GIẢI QUYẾT PHẢN ÁNH, KHIẾU NẠI, GÓP Ý:
                        </strong>
                        <br />
                        <strong>Trưởng phòng Pháp chế:</strong> Ông Vũ Xuân Hưng
                        <br />
                        <strong>Điện thoại:</strong> 028-3932 6929 hoặc{" "}
                        <strong>Mobile:</strong> 0909 170 171{" "}
                        <em>(Đường dây nóng)</em>
                        <br />
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:vuxuanhung@vcci-hcm.org.vn"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          vuxuanhung@vcci-hcm.org.vn
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
            <div className="relative w-full mt-4 h-[185px] aspect-video rounded-lg overflow-hidden">
              <Image
                src="/VCCI-thongTinLienHeBanner.jpg.webp"
                alt="Quảng cáo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="lg:w-[calc(35%-10px)] w-full ">
            <EventCalendar />
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
