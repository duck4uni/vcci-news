"use client";
import React, { useState } from "react";
import { Menu, X, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import Image from "next/image";
import MenuItem from "./MenuItem";

function Header() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);

  return (
    <>
      <div className="sticky top-0 w-full h-[56px] hidden lg:flex items-center justify-center bg-[#063e8e]">
        <div className="max-w-[1215px] w-full px-4 flex items-center justify-between">
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
              sitemap
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

      <div className="sticky top-0 z-50 bg-[#ededed] shadow-md">
        <div className="max-w-[1200px] m-auto">
          <div className="w-full flex justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <Image
                className="w-[140px] object-contain lg:ml-0 ml-10"
                src={logo}
                alt="VCCI HCM"
              />
            </a>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center">
              {/* Dùng component MenuItem để gọn */}
              <MenuItem
                title="Giới thiệu"
                items={[
                  "Về VCCI-HCM",
                  "Chức Năng Và Nhiệm Vụ",
                  "Sơ Đồ Tổ Chức",
                  "Dịch Vụ Cung Cấp",
                ]}
              />
              <MenuItem
                title="Hội viên"
                items={[
                  "Lợi Ích Của Hội Viên VCCI",
                  "Đăng Ký Hội Viên",
                  "Kết Nối Hội Viên",
                  "Tin Hội Viên",
                ]}
              />
              <MenuItem title="Hoạt động" items={["Sự Kiện", "Đào Tạo"]} />
              <MenuItem
                title="Xuất Xứ Hàng Hóa"
                items={[
                  "Định Nghĩa Chung",
                  "Mục Đích Của C/O",
                  "Luật Áp Dụng Về C/O",
                  "Thủ Tục Cấp C/O",
                  "Biểu Mẫu C/O Và Cách Khai",
                  "Phí Và Lệ Phí Cấp C/O",
                  "Điểm Cấp Và Thời Gian Cấp C/O",
                  "Thông Tin Liên Hệ",
                ]}
              />

              {/* Đại Diện Giới Chủ - có submenu cấp 2 */}
              <div className="group relative">
                <a
                  className="px-3 py-5 text-[16px] font-[600] text-[#124588] hover:text-[#E8C518] transition block"
                  href="#"
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
                items={[
                  "Hồ Sơ Thị Trường",
                  "Môi Trường Kinh Doanh",
                  "Cơ Hội Kinh Doanh",
                  "Hỗ Trợ Kinh Doanh",
                ]}
              />
              <MenuItem
                title="Thông tin truyền thông"
                items={[
                  "Tin VCCI",
                  "Tin Kinh Tế",
                  "Tin Doanh Nghiệp",
                  "Chuyên Đề",
                  "Thông Tin Chính Sách Và Pháp Luật",
                  "Ấn Phẩm",
                  "Thư Viện Tài Liệu",
                ]}
              />
            </nav>

            {/* Mobile Button */}
            <button
              onClick={() => setToggleMenu((prev) => !prev)}
              className="lg:hidden p-2 bg-[#063e8e] text-white rounded-sm"
            >
              {toggleMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${
            toggleMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
