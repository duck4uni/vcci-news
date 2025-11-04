import React from "react";
import Image from "next/image";
import ListCategory from "../components/list-category";
import Calendar from "../components/Calendar";

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
              Mục đích của C/O
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              {/* I. MỤC ĐÍCH CỦA GIẤY CHỨNG NHẬN XUẤT XỨ (C/O) */}
              <section className="mb-10">
                <h2 className="text-[16px] font-[600] text-[#363636] uppercase mb-4 pb-1">
                  1. MỤC ĐÍCH CỦA GIẤY CHỨNG NHẬN XUẤT XỨ (C/O)
                  <sup className="text-[10px] align-super ml-0.5">1</sup>:
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    Để thiết lập biện pháp và là{" "}
                    <strong>công cụ của chính sách thương mại</strong>;
                  </li>
                  <li>
                    Để xác định sản phẩm nhập khẩu{" "}
                    <strong>
                      được hưởng quy chế tối huệ quốc (MFN) hoặc ưu đãi khác hay
                      không
                    </strong>
                    ;
                  </li>
                  <li>
                    <strong>Mục đích thống kê thương mại</strong> của một quốc
                    gia;
                  </li>
                  <li>
                    Áp dụng quy định về{" "}
                    <strong>yêu cầu gắn nhãn, mác đối với hàng hóa</strong>; và
                  </li>
                  <li>
                    Dùng cho việc <strong>mua bán của chính phủ</strong>.
                  </li>
                </ol>
              </section>

              {/* II. VAI TRÒ CỦA QUY TẮC XUẤT XỨ (ROO) */}
              <section>
                <h2 className="text-[16px] font-[600] text-[#363636] uppercase mb-4 pb-1">
                  2. VAI TRÒ CỦA QUY TẮC XUẤT XỨ (ROO)
                  <sup className="text-[10px] align-super ml-0.5">2</sup>:
                </h2>
                <p className="mb-4 leading-relaxed">
                  Vai trò cơ bản của <strong>Quy tắc Xuất xứ</strong> là việc
                  xác định <strong>quốc gia xuất xứ</strong> của một mặt hàng cụ
                  thể. Các yêu cầu pháp lý hoặc hành chính{" "}
                  <strong>bắt buộc phải tuân thủ</strong> khi hàng hóa được giao
                  dịch trên thị trường quốc tế. Điều này là cần thiết cho việc
                  thực hiện các công cụ chính sách thương mại khác nhau như áp
                  đặt thuế nhập khẩu, phân bổ hạn ngạch hoặc thống kê thương
                  mại.
                </p>
                <p className="leading-relaxed">
                  Các bước đầu tiên là <strong>phân loại hàng hóa</strong> và{" "}
                  <strong>xác định trị giá</strong> của hàng hóa, bước tiếp theo
                  và cuối cùng là việc xác định <strong>nước xuất xứ</strong>{" "}
                  của một sản phẩm cụ thể. Việc phân loại hàng hóa và xác định
                  trị giá là rất quan trọng trong công việc làm thủ tục hải
                  quan, nhưng đây là những công cụ cơ bản để xác định nước xuất
                  xứ của hàng hóa theo nghĩa các{" "}
                  <strong>quy tắc xuất xứ</strong> là những quy tắc áp dụng cụ
                  thể cho một sản phẩm nhất định liên quan đến các{" "}
                  <strong>mã HS cụ thể</strong>, và nếu quy tắc xuất xứ áp dụng
                  theo trị giá gia tăng thì cần phải xác định{" "}
                  <strong>
                    trị giá hải quan của các thành phần cấu thành sản phẩm
                  </strong>
                  .
                </p>

                {/* Phần chú thích */}
                <div className="mt-6 pt-4 text-sm text-gray-700">
                  <div className="h-[1px] w-[170px] bg-black mb-3"></div>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">1</sup> Theo WTO
                  </p>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">2</sup> Theo WCO
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
