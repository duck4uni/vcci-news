import React from "react";
import ListCategory from "./components/list-category";
import Calendar from "./components/Calendar";
import Image from "next/image";

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
              Xuất Xứ Hàng Hóa (C/O)
            </h1>
            <div className="w-full h-[1px] bg-[#eeeeee]"></div>
            <div className="text-[#363636]">
              {/* I. ĐỊNH NGHĨA CHUNG */}
              <section className="mb-10">
                <h2 className="text-[16px] font-[600] text-[#363636] uppercase mb-4 pb-1">
                  I. ĐỊNH NGHĨA CHUNG
                  <sup className="text-[10px] align-super ml-0.5">1</sup>:
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Xuất xứ hàng hóa</strong> là nước, nhóm nước, hoặc
                    vùng lãnh thổ nơi sản xuất ra toàn bộ hàng hóa hoặc nơi thực
                    hiện công đoạn chế biến cơ bản cuối cùng đối với hàng hóa
                    trong trường hợp có nhiều nước, nhóm nước, hoặc vùng lãnh
                    thổ tham gia vào quá trình sản xuất ra hàng hóa đó.
                  </li>
                  <li>
                    <strong>Quy tắc xuất xứ ưu đãi</strong> là các quy định về
                    xuất xứ áp dụng cho hàng hóa có cam kết hoặc thỏa thuận ưu
                    đãi về thuế quan và ưu đãi về phi thuế quan.
                  </li>
                  <li>
                    <strong>Quy tắc xuất xứ không ưu đãi</strong> là các quy
                    định về xuất xứ áp dụng cho hàng hóa ngoài quy định tại
                    Khoản 2 Điều này và trong các trường hợp áp dụng các biện
                    pháp thương mại không ưu đãi về đối xử tối huệ quốc, chống
                    bán phá giá, chống trợ cấp, tự vệ, hạn chế số lượng hay hạn
                    ngạch thuế quan, mua sắm chính phủ và thống kê thương mại.
                  </li>
                  <li>
                    <strong>Giấy chứng nhận xuất xứ hàng hóa</strong> là văn bản
                    hoặc các hình thức có giá trị pháp lý tương đương do cơ
                    quan, tổ chức thuộc nước, nhóm nước, hoặc vùng lãnh thổ xuất
                    khẩu hàng hóa cấp dựa trên quy định và yêu cầu liên quan về
                    xuất xứ, chỉ rõ nguồn gốc xuất xứ của hàng hóa đó.
                  </li>
                  <li>
                    <strong>Giấy chứng nhận xuất xứ hàng hóa giáp lưng</strong>{" "}
                    là Giấy chứng nhận xuất xứ hàng hóa theo quy định tại Điều
                    ước quốc tế mà Việt Nam ký kết hoặc gia nhập, được cấp bởi
                    nước thành viên xuất khẩu trung gian dựa trên Giấy chứng
                    nhận xuất xứ hàng hóa của nước thành viên xuất khẩu đầu
                    tiên.
                  </li>
                  <li>
                    <strong>
                      {" "}
                      Giấy chứng nhận hàng hóa không thay đổi xuất xứ
                    </strong>{" "}
                    là Giấy chứng nhận cấp cho hàng hóa nước ngoài được đưa vào
                    kho ngoại quan của Việt Nam, sau đó xuất khẩu đi nước khác,
                    đưa vào nội địa trên cơ sở Giấy chứng nhận xuất xứ hàng hóa
                    đã được cấp đầu tiên.
                  </li>
                  <li>
                    <strong>Tự chứng nhận xuất xứ hàng hóa</strong> là hình thức
                    thương nhân tự khai báo và cam kết về xuất xứ của hàng hóa
                    theo quy định của pháp luật.
                  </li>
                  <li>
                    <strong>Chứng từ tự chứng nhận xuất xứ hàng hóa</strong> là
                    văn bản hoặc các hình thức có giá trị pháp lý tương đương do
                    thương nhân tự phát hành theo quy định tại Khoản 7 Điều này.
                  </li>
                  <li>
                    <strong>Chuyển đổi mã số hàng hóa</strong> là sự thay đổi về
                    mã số HS (trong Biểu thuế xuất khẩu, Biểu thuế nhập khẩu)
                    của hàng hóa được tạo ra ở một nước, nhóm nước, hoặc vùng
                    lãnh thổ trong quá trình sản xuất từ nguyên liệu không có
                    xuất xứ của nước, nhóm nước, hoặc vùng lãnh thổ này.
                  </li>
                  <li>
                    <strong>Tỷ lệ Phần trăm giá trị</strong> là hàm lượng giá
                    trị có được đủ để coi là có xuất xứ tại một nước, nhóm nước,
                    hoặc vùng lãnh thổ nơi diễn ra công đoạn sản xuất, gia công,
                    chế biến cuối cùng. Tỷ lệ này được xác định là Phần giá trị
                    gia tăng có được tính trên tổng giá trị của hàng hóa được
                    sản xuất, gia công, chế biến tại một nước, nhóm nước, hoặc
                    vùng lãnh thổ sau khi trừ đi giá nguyên liệu đầu vào nhập
                    khẩu không thuộc nước, nhóm nước, hoặc vùng lãnh thổ đó hoặc
                    giá trị nguyên liệu đầu vào không xác định được xuất xứ dùng
                    để sản xuất ra hàng hóa.
                  </li>
                  <li>
                    <strong>Công đoạn gia công, chế biến hàng hóa</strong> là
                    quá trình sản xuất chính tạo ra đặc điểm cơ bản của hàng
                    hóa.
                  </li>
                  <li>
                    <strong>Thay đổi cơ bản</strong> là việc hàng hóa được biến
                    đổi qua quá trình sản xuất, để hình thành vật phẩm thương
                    mại mới, khác biệt về hình dạng, tính năng, đặc điểm cơ bản,
                    hoặc mục đích sử dụng so với hàng hóa ban đầu.
                  </li>
                  <li>
                    <strong>Đơn giản</strong> là hoạt động không cần sử dụng các
                    kỹ năng đặc biệt, máy móc, dây chuyền hoặc các thiết bị
                    chuyên dụng.
                  </li>
                  <li>
                    <strong>Sản xuất</strong> là các phương thức để tạo ra hàng
                    hóa bao gồm trồng trọt, khai thác, thu hoạch, chăn nuôi, gây
                    giống, chiết xuất, thu lượm, thu nhặt, săn bắt, đánh bắt,
                    đánh bẫy, săn bắn, chế tạo, chế biến, gia công hay lắp ráp.
                  </li>
                  <li>
                    <strong>Nguyên liệu</strong> là bất cứ vật liệu hay chất
                    liệu nào được sử dụng hoặc tiêu tốn trong quá trình sản xuất
                    ra hàng hóa, hoặc kết hợp tự nhiên thành một hàng hóa khác,
                    hoặc tham gia vào quy trình sản xuất ra một hàng hóa khác.
                  </li>
                  <li>
                    <strong>
                      Hàng hóa có xuất xứ hoặc nguyên liệu có xuất xứ
                    </strong>{" "}
                    là hàng hóa hoặc nguyên liệu đáp ứng quy tắc xuất xứ ưu đãi
                    theo quy định tại Chương II hoặc quy tắc xuất xứ không ưu
                    đãi theo quy định tại Chương III Nghị định này.
                  </li>
                  <li>
                    <strong>
                      Thương nhân đề nghị cấp Giấy chứng nhận xuất xứ hàng hóa
                    </strong>{" "}
                    là người xuất khẩu, nhà sản xuất, người đại diện hợp pháp
                    của người xuất khẩu hoặc nhà sản xuất.
                  </li>
                </ol>
              </section>

              {/* II. ĐỊNH NGHĨA LIÊN QUAN KHÁC */}
              <section>
                <h2 className="text-[16px] font-[600] text-[#363636] uppercase mb-4 pb-1">
                  II. ĐỊNH NGHĨA LIÊN QUAN KHÁC:
                </h2>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Giấy chứng nhận xuất xứ</strong> thường được viết
                    tắt là <strong>C/O</strong> (Certificate of Origin) là chứng
                    từ quan trọng trong thương mại quốc tế chứng nhận lô hàng cụ
                    thể được xuất khẩu có xuất xứ thuần túy, hoặc được sản xuất
                    hoặc được chế biến tại một quốc gia cụ thể.
                    <sup className="text-[10px] align-super ml-0.5">2</sup>
                  </li>
                  <li>
                    <strong>Giấy chứng nhận xuất xứ</strong> là văn bản nêu cụ
                    thể quốc gia mà tại đó hàng hóa được trồng, được sản xuất,
                    được chế biến hay lắp ráp.
                    <sup className="text-[10px] align-super ml-0.5">3</sup>
                  </li>
                  <li>
                    <strong>Hệ thống hài hòa hóa</strong> hay gọi đơn giản là{" "}
                    <strong>HS</strong> (Harmonized System) là một danh pháp
                    thuế quan toàn cầu, một hệ thống được tiêu chuẩn hóa quốc tế
                    về tên gọi (mô tả) và mã số (mã HS) được sử dụng để phân
                    loại mọi mặt hàng thương mại trên toàn thế giới bao gồm cả
                    hàng hóa xuất khẩu và nhập khẩu. Hệ thống này có hiệu lực
                    năm 1988 và được quản lý bởi Tổ chức Hải quan Quốc tế (WCO).
                    Danh mục này bao gồm khoảng 5.000 nhóm hàng, được xác định
                    bằng 6 chữ số, được sắp xếp theo một cấu trúc pháp lý và hợp
                    lý và chúng được giải thích bằng những quy tắc được định
                    nghĩa rõ ràng để đảm bảo việc phân loại hàng hóa theo 1 cách
                    thống nhất.
                    <sup className="text-[10px] align-super ml-0.5">4</sup>
                  </li>
                </ol>

                {/* Phần chú thích */}
                <div className="mt-6 pt-4 text-sm text-gray-700">
                  <div className="h-[1px] w-[170px] bg-black mb-3"></div>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">1</sup> Theo điều
                    3, Nghị định 31/2018/NĐ-CP ngày 08 tháng 3 năm 2018
                  </p>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">2</sup> Theo ICC
                  </p>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">3</sup> Theo USAID
                  </p>
                  <p className="text-[16px] italic">
                    <sup className="text-[10px] align-super">4</sup> Theo WCO
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
