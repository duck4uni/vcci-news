"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { Menu, X, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import Image from "next/image";
import MenuItem from "./MenuItem";
import Link from "next/link";
function Header() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const router = useRouter()

  return (
    <>
      <div className="sticky top-0 w-full h-[56px] hidden lg:flex items-center justify-center bg-[#063e8e]">
        <div className="container w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[130px] h-[36px] bg-[#e8c518] flex items-center justify-center border-4 rounded-sm border-[#647792]">
              <a
                className="font-[600] text-[14px] text-[#063E8E] hover:text-white transition"
                href="#"
              >
                Đăng Ký Hội Viên
              </a>
            </div>
            <a
              className="px-3 py-2 text-[14px] text-white hover:opacity-80"
              href="#"
            >
              Sitemap
            </a>
            <a
              className="px-3 py-2 text-[14px] text-white hover:opacity-80"
              href="#"
            >
              Liên hệ
            </a>
          </div>

          <div className="flex items-center gap-8">
            <input
              className="bg-white h-12 rounded-sm outline-none px-4 w-64 placeholder:text-sm"
              type="text"
              placeholder="Tìm kiếm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.currentTarget as HTMLInputElement).value || ''
                  const encoded = encodeURIComponent(value)
                  router.push(`/search?q=${encoded}`)
                }
              }}
            />
            <div className="flex gap-2">
              {[Facebook, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="bg-white size-7 rounded-full flex items-center justify-center text-[#063e8e] hover:opacity-80 transition"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-[#ededed] shadow-md py-4">
        <div className="container m-auto">
          <div className="w-full flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <Image
                className="w-[140px] object-contain"
                src={logo}
                alt="VCCI HCM"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center">
              {/* Dùng component MenuItem để gọn */}
              <MenuItem
                title="Giới thiệu"
                link="gioi-thieu"
                items={[
                  { title: "Về VCCI-HCM", link: "ve-vcci-hcm" },
                  {
                    title: "Chức Năng Và Nhiệm Vụ",
                    link: "chuc-nang-va-nhiem-vu",
                  },
                  { title: "Sơ Đồ Tổ Chức", link: "so-do-to-chuc" },
                  { title: "Dịch Vụ Cung Cấp", link: "dich-vu-cung-cap" },
                ]}

              />
              <MenuItem
                title="Hội viên"
                link="hoi-vien"
                 items={[
                  {
                    title: "Lợi Ích Của Hội Viên VCCI",
                    link: "",
                  },
                  { title: "Đăng Ký Hội Viên", link: "dang-ky-hoi-vien" },
                  { title: "Kết Nối Hội Viên", link: "ket-noi-hoi-vien" },
                  { title: "Tin Hội Viên", link: "tin-hoi-vien" },
                ]}

              />
              <MenuItem
                title="Hoạt động"
                link="hoat-dong"
                                items={[
                  { title: "Sự Kiện", link: "" },
                  { title: "Đào Tạo", link: "dao-tao" },
                ]}
           />
              <MenuItem
                title="Xuất Xứ Hàng Hóa"
                link="xuat-xu-hang-hoa"
                items={[
                  {
                    title: "Định Nghĩa Chung",
                    link: "",
                  },
                  {
                    title: "Mục Đích Của C/O",
                    link: "muc-dich",
                  },
                  {
                    title: "Luật Áp Dụng Về C/O",
                    link: "luat-ap-dung",
                  },
                  {
                    title: "Thủ Tục Cấp C/O",
                    link: "thu-tuc-cap",
                  },
                  {
                    title: "Biểu Mẫu C/O Và Cách Khai",
                    link: "bieu-mau-c-o-va-cach-khai",
                  },
                  {
                    title: "Phí Và Lệ Phí Cấp C/O",
                    link: "phi-va-le-phi-cap",
                  },
                  {
                    title: "Điểm Cấp Và Thời Gian Cấp C/O",
                    link: "diem-cap-va-thoi-gian-cap",
                  },
                  {
                    title: "Thông Tin Liên Hệ",
                    link: "thong-tin-lien-he",
                  },
                ]}
              />

              {/* Đại Diện Giới Chủ - có submenu cấp 2 */}
              <div className="group relative">
                <a
                  className="px-3 py-5 text-[16px] font-[600] text-[#124588] hover:text-[#E8C518] transition block"
                  href={`${"/dai-dien-gioi-chu"}`}
                >
                  Đại Diện Giới Chủ
                </a>
                <div className="absolute left-0 top-full hidden group-hover:block bg-[#124588]/98 text-white text-[14px] font-[500] min-w-[280px] shadow-lg">
                  <div className="flex flex-col">
                    <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer">
                      Chức Năng Đại Diện Người Sử Dụng Lao Động
                    </div>
                    <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer">
                      Sự Kiện – Tập Huấn NSDLĐ
                    </div>
                    <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer">
                      Tin Liên Quan
                    </div>

                    <div className="relative group/submenu">
                      <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer flex justify-between items-center">
                        Chủ Đề <span className="ml-2 text-xs">›</span>
                      </div>
                      <div className="absolute left-full top-0 hidden group-hover/submenu:block bg-[#124588]/98 text-white text-[14px] font-[500] min-w-[220px] shadow-lg">
                        <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer">
                          Quan Hệ Lao Động
                        </div>
                        <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer">
                          Phát Triển Kỹ Năng
                        </div>
                        <div className="px-5 py-3 hover:bg-[#e8c518]/80 cursor-pointer">
                          Phát Triển Bền Vững
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <MenuItem
                title="Xúc tiến thương mại"
                link="xuc-tien-thuong-mai"
 items={[
                  { title: "Hồ Sơ Thị Trường", link: "ho-so-thi-truong" },
                  {
                    title: "Môi Trường Kinh Doanh",
                    link: "moi-truong-kinh-doanh",
                  },
                  { title: "Cơ Hội Kinh Doanh", link: "co-hoi-kinh-doanh" },
                  { title: "Hỗ Trợ Kinh Doanh", link: "ho-tro-kinh-doanh" },
                ]}

              />
              <MenuItem
                title="Thông tin truyền thông"
                link="thong-tin-truyen-thong"
                 items={[
                  { title: "Tin VCCI", link: "tin-vcci" },
                  { title: "Tin Kinh Tế", link: "tin-kinh-te" },
                  { title: "Tin Doanh Nghiệp", link: "tin-doanh-nghiep" },
                  { title: "Chuyên Đề", link: "chuyen-de" },
                  {
                    title: "Thông Tin Chính Sách Và Pháp Luật",
                    link: "thong-tin-chinh-sach-va-phap-luat",
                  },
                  { title: "Ấn Phẩm", link: "an-pham" },
                  { title: "Thư Viện Tài Liệu", link: "thu-vien-tai-lieu" },
                ]}

              />
            </nav>

            {/* Mobile Button */}
            <button
              onClick={() => setToggleMenu((prev) => !prev)}
              className="lg:hidden h-10 p-2 bg-[#063e8e] text-white rounded-sm mr-5"
            >
              {toggleMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${toggleMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          {[
            "Giới thiệu",
            "Hội viên",
            "Hoạt động",
            "Xuất Xứ Hàng Hóa",
            "Đại Diện Giới Chủ",
            "Xúc tiến thương mại",
            "Thông tin truyền thông",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className="block py-3 text-center hover:bg-[#124588] hover:text-white text-[16px]"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default Header;
