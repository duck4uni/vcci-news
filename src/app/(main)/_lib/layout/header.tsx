"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import Image from "next/image";
import MenuItem from "@/components/base/menu-item";
import Link from "next/link";
import { useGetNewsPageConfigGetHierarchical } from "@/api/endpoints/news-page-config";
import { GetNewsPageConfigResponseType } from "@/api/types/news-page-config";

function Header() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const router = useRouter();

  const { data: categoriesPage } = useGetNewsPageConfigGetHierarchical<GetNewsPageConfigResponseType>();

  return (
    <>
      <div className="sticky top-0 w-full h-14 hidden lg:flex items-center justify-center bg-[#063e8e]">
        <div className="container w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[130px] h-9 bg-[#e8c518] flex items-center justify-center border-4 rounded-sm border-[#647792]">
              <Link
                className="font-semibold text-[14px] text-primary hover:text-white transition"
                href="https://vccihcm.vn/dang-ky"
              >
                Đăng Ký Hội Viên
              </Link>
            </div>
            <Link
              className="px-3 py-2 text-[14px] text-white hover:opacity-80"
              href="/site-map"
            >
              Sitemap
            </Link>
            <Link
              className="px-3 py-2 text-[14px] text-white hover:opacity-80"
              href="https://vccihcm.vn/lien-he"
            >
              Liên hệ
            </Link>
          </div>

          <div className="flex items-center gap-8">
            <input
              className="bg-white h-12 rounded-sm outline-none px-4 w-64 placeholder:text-sm"
              type="text"
              placeholder="Tìm kiếm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value =
                    (e.currentTarget as HTMLInputElement).value || "";
                  const encoded = encodeURIComponent(value);
                  router.push(`/search?q=${encoded}`);
                }
              }}
            />
            <div className="flex gap-2">
              {[
                Facebook,
                Twitter,
                Youtube,
                Linkedin
              ].map((Icon, i) => {
                const hrefs = [
                  "https://www.facebook.com/VCCIHCMC/",
                  "https://twitter.com/VCCI_HCM",
                  "https://www.youtube.com/user/VCCIHCMC",
                  "https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym",
                ];
                return (
                  <a
                    key={i}
                    href={hrefs[i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white size-7 rounded-full flex items-center justify-center text-[#063e8e] hover:opacity-80 transition"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
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
              {categoriesPage?.responseData?.children?.map((category) => (
                <MenuItem
                  key={category.id}
                  title={category.name}
                  link={category.static_link}
                  items={[
                    ...category.children.map((child) => ({
                      title: child.name,
                      link: child.static_link,
                    })),
                  ]}
                />
              ))}
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
          className={`lg:hidden bg-white shadow-lg transition-all duration-300 overflow-hidden ${toggleMenu ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          {categoriesPage?.responseData?.children?.map((category) => (
            <div key={category.id} className="border-b border-gray-200">
              <Link
                href={category.static_link || "#"}
                className="block py-3 text-center hover:bg-[#124588] hover:text-white text-[16px] font-medium"
                onClick={() => setToggleMenu(false)}
              >
                {category.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Header;
