'use client';

import links from "@/links";
import type { DynamicPostItem } from "../types";

type MemberRegistrationPageProps = {
  post: DynamicPostItem;
};

const MEMBERSHIP_REQUIREMENTS = [
  "Đơn xin gia nhập làm hội viên chính thức VCCI (2 bản theo mẫu của VCCI)",
  "Giấy phép đăng ký kinh doanh, hoặc giấy phép thành lập hoặc quyết định thành lập (2 bản sao)",
];

const MEMBERSHIP_FEES = [
  "Doanh số dưới 10 tỉ đồng đóng 3 triệu đồng/năm",
  "Doanh số từ 10 - 50 tỉ đồng đóng 7 triệu đồng/năm",
  "Doanh số trên 50 tỉ đồng đóng 15 triệu đồng/năm",
];

const ATTACHED_FORMS = [
  {
    label: "Đơn đăng ký tham gia nhập hội viên VCCI (Mẫu Doanh nghiệp)",
    href: "/Don-dang-ky-tham-gia-nhap-hoi-vien-VCCI_Mau-Doanh-nghiep-1.docx",
    download: true,
  },
  {
    label: "Đơn đăng ký tham gia nhập hội viên VCCI (Mẫu Hiệp hội)",
    href: "/Don-dang-ky-tham-gia-nhap-hoi-vien-VCCI_Mau-Hiep-hoi.docx",
    download: true,
  },
  {
    label: "Hướng dẫn hồ sơ đăng ký Hội viên VCCI",
    href: `${links.externalApiOrigin}/dang-ky`,
    download: false,
  },
] as const;

export default function MemberRegistrationPage({ post }: MemberRegistrationPageProps) {
  return (
    <section className="">
      <div className="min-w-0">
        <h1 className="max-w-6xl text-3xl font-bold leading-tight text-[#111827] md:text-[38px] md:leading-[1.15]">
          Đăng ký hội viên
        </h1>
        <div className="mt-3 h-[3px] w-16 rounded-full bg-[#f5a400]" />

        <div className="mt-7 space-y-7 rounded-3xl bg-white px-5 py-6 shadow-[0_18px_42px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10">
          <p className="text-justify text-[18px] leading-9 text-[#1f2a44]">
            {post.content?.trim() ||
              "Điều lệ sửa đổi của Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) được Đại hội đại biểu toàn quốc VCCI lần thứ VII thông qua và được Thủ tướng Chính phủ phê duyệt tại Quyết định số 1496/QĐ-TTg ngày 30/11/2022 đã quy định tất cả các doanh nghiệp, các tổ chức sản xuất, kinh doanh, người sử dụng lao động, các hiệp hội doanh nghiệp có đăng ký và hoạt động hợp pháp ở Việt Nam đều có thể trở thành hội viên của VCCI."}
          </p>

          <p className="text-justify text-[18px] leading-9 text-[#1f2a44]">
            Để trở thành hội viên chính thức, tổ chức quan tâm cần gửi VCCI tại Hà Nội hoặc các Chi nhánh, Văn phòng đại diện của VCCI hồ sơ gia nhập gồm:
          </p>

          <ul className="space-y-2 pl-6 text-[18px] leading-9 text-[#1f2a44]">
            {MEMBERSHIP_REQUIREMENTS.map((item) => (
              <li key={item} className="list-disc">
                <strong>{item}</strong>
              </li>
            ))}
          </ul>

          <p className="text-justify text-[18px] leading-9 text-[#1f2a44]">
            Khi nhận được đơn, Ban Thường trực sẽ xét và thông báo cho tổ chức liên quan về quyết định kết nạp. Trong vòng 1 tháng kể từ ngày nhận thông báo, tổ chức phải thực hiện đóng lệ phí gia nhập. Chỉ khi nào tổ chức đóng lệ phí gia nhập mới được coi là hội viên chính thức. Theo quyết định của Ban chấp hành VCCI, lệ phí hiện hành được tính như sau:
          </p>

          <p className="text-justify text-[18px] leading-9 text-[#1f2a44]">
            Mức lệ phí gia nhập bằng mức hội phí hàng năm, được tính căn cứ vào doanh số của tổ chức trong năm trước theo các mức:
          </p>

          <ul className="space-y-2 pl-6 text-[18px] leading-9 text-[#1f2a44]">
            {MEMBERSHIP_FEES.map((item) => (
              <li key={item} className="list-disc">
                {item}
              </li>
            ))}
          </ul>

          <p className="text-justify text-[18px] leading-9 text-[#1f2a44]">
            Mức lệ phí gia nhập và hội phí trên có thể được điều chỉnh bởi quyết định của Ban chấp hành VCCI trong từng thời gian cụ thể.
          </p>

          <div>
            <p className="font-semibold text-[#2450b5]">Để biết thêm thông tin chi tiết, vui lòng liên hệ:</p>
            <div className="mt-4 space-y-1 text-[18px] leading-9 text-[#1f2a44]">
              <p className="font-semibold">Phòng Hội viên Đào tạo và Truyền thông:</p>
              <p>C. Thúy – ĐD: 0903 909 756</p>
              <p>Email: luuthanhthuy72@yahoo.com; hoivien@vcci-hcm.org.vn</p>
              <p>Điện thoại: 028. 3932 0611 – Fax: 028. 3932 5472</p>
              <p>Địa chỉ: P. 306, Lầu 3, Tòa nhà VCCI, 171 Võ Thị Sáu, Phường Xuân Hòa, TP. Hồ Chí Minh</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-[#1f2a44]">Biểu mẫu đính kèm:</p>
            <ul className="mt-3 space-y-2 pl-6 text-[#2450b5]">
              {ATTACHED_FORMS.map((item) => (
                <li key={item.label} className="list-disc italic">
                  {item.download ? (
                    <a href={item.href} download className="hover:text-[#173f9f]">
                      {item.label}
                    </a>
                  ) : (
                    <a href={item.href} target="_blank" rel="noreferrer" className="hover:text-[#173f9f]">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <a
              href={`${links.externalApiOrigin}/dang-ky`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-w-[220px] items-center justify-center rounded-[4px] bg-[#2450b5] px-6 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-[#173f9f]"
            >
              Đăng ký Hội viên
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
