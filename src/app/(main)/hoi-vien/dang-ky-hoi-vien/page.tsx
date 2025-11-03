'use client'

import React from "react";
import ListCategory from "./../components/list-category";

const Page = () => {
  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex flex-col gap-5">
        <ListCategory />
        <main className="bg-white border rounded-md p-5 sm:p-7 lg:py-10 lg:px-40">
          <h1 className="text-center mb-4 text-xl sm:text-2xl font-bold text-[#153e8e]">
            THỦ TỤC GIA NHẬP HỘI VIÊN CHÍNH THỨC
          </h1>

          <p className="text-justify leading-7 mb-3">
            Điều lệ sửa đổi của Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) được Đại hội đại biểu toàn quốc VCCI lần thứ VII thông qua và được Thủ tướng Chính phủ Phê duyệt tại Quyết định số 1496/QĐ-TTg ngày 30/11/2022 đã quy định tất cả các doanh nghiệp, các tổ chức sản xuất, kinh doanh, người sử dụng lao động, các hiệp hội doanh nghiệp có đăng ký và hoạt động hợp pháp ở Việt Nam đều có thể trở thành hội viên của VCCI.
          </p>

          <p className="text-justify leading-7 mb-3">
            Để trở thành hội viên chính thức, tổ chức quan tâm cần gửi VCCI tại Hà Nội hoặc các Chi nhánh, Văn phòng đại diện của VCCI hồ sơ gia nhập gồm:
          </p>

          <ul className="list-disc pl-6 sm:pl-10 space-y-1 font-bold">
            <li className="text-justify leading-7">
              Đơn xin gia nhập làm hội viên chính thức VCCI (2 bản theo mẫu của VCCI)
            </li>
            <li className="text-justify leading-7">
              Giấy phép đăng ký kinh doanh, hoặc giấy phép thành lập hoặc quyết định thành lập (2 bản sao).
            </li>
          </ul>

          <p className="text-justify leading-7 my-3">
            Khi nhận được đơn, Ban Thường trực sẽ xét và thông báo cho tổ chức liên quan về quyết định kết nạp. Trong vòng 1 tháng kể từ ngày nhận thông báo, tổ chức phải thực hiện đóng lệ phí gia nhập. Chỉ khi nào tổ chức đóng lệ phí gia nhập mới được coi là hội viên chính thức.
          </p>

          <p className="text-justify leading-7 my-3">
            Mức lệ phí gia nhập bằng mức hội phí hàng năm, được tính căn cứ vào doanh số của tổ chức trong năm trước theo các mức:
          </p>

          <ul className="list-disc pl-6 sm:pl-10 space-y-1 font-bold">
            <li className="text-justify leading-7">
              Doanh số dưới 10 tỉ đồng đóng 3 triệu đồng/năm
            </li>
            <li className="text-justify leading-7">
              Doanh số từ 10 - 50 tỉ đồng đóng 7 triệu đồng/năm
            </li>
            <li className="text-justify leading-7">
              Doanh số trên 50 tỉ đồng đóng 15 triệu đồng/năm
            </li>
          </ul>

          <p className="text-justify leading-7 my-3">
            Mức lệ phí gia nhập và hội phí trên có thể được điều chỉnh bởi quyết định của Ban chấp hành VCCI trong từng thời gian cụ thể.
          </p>

          <div className="my-4">
            <p className="text-[#063e8e] mb-3">
              Để biết thêm thông tin chi tiết, vui lòng liên hệ:
            </p>
            <p className="text-[#063e8e]">
              <b>Phòng Hội viên Đào tạo và Truyền thông</b>
              <br />
              <b>C. Thúy - ĐĐ: 0903 909 756</b>
              <span className="block">
                Email: luuthanhthuy72@yahoo.com; hoivien@vcci-hcm.org.vn;
              </span>
              <span className="block">
                Điện thoại: 028.3932.0611 - Fax: 028.3932.5472
              </span>
              <span className="block">
                Địa chỉ: P. 306, Lầu 3, Tòa nhà VCCI, 171 Võ Thị Sáu, Phường Xuân Hoà, TP. Hồ Chí Minh
              </span>
            </p>
          </div>

          <p className="text-justify leading-7 my-3 font-semibold">
            Biểu mẫu đính kèm:
          </p>

          <ul className="list-disc pl-6 sm:pl-10 space-y-1">
            <li className="text-justify leading-7">
              <a
                href="https://vcci-hcm.org.vn/wp-content/uploads/2025/08/Don-dang-ky-tham-gia-nhap-hoi-vien-VCCI_Mau-Doanh-nghiep-1.docx"
                className="text-[#063e8e] hover:text-yellow-500 italic"
                download
              >
                Đơn đăng ký tham gia nhập hội viên VCCI (Mẫu Doanh nghiệp)
              </a>
            </li>
            <li className="text-justify leading-7">
              <a
                href="https://vcci-hcm.org.vn/wp-content/uploads/2025/08/Don-dang-ky-tham-gia-nhap-hoi-vien-VCCI_Mau-Hiep-hoi.docx"
                className="text-[#063e8e] hover:text-yellow-500 italic"
                download
              >
                Đơn đăng ký tham gia nhập hội viên VCCI (Mẫu Hiệp hội)
              </a>
            </li>
            <li className="text-justify leading-7">
              <a
                href="https://vcci-hcm.org.vn/wp-content/uploads/2025/08/Huong-dan-ho-so-dang-ky-Hoi-vien-VCCI.docx"
                className="text-[#063e8e] hover:text-yellow-500 italic"
                download
              >
                Hướng dẫn hồ sơ đăng ký Hội viên VCCI
              </a>
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
};

export default Page;
