"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import Image from "next/image";
import MenuItem from "@/components/base/menu-item";
import Link from "next/link";
import { useCustomClient } from "@/api/mutator/custom-client";
import type { Category } from "@/api/models/category";
import { getCategoryFallbackResponse } from "@/mockdata/categories";

type HeaderMenuItem = {
  id: string;
  name: string;
  url: string;
  sort_order: number | null;
  children: HeaderMenuItem[];
};

type CategoryListResponse = {
  responseData?: {
    rows?: Category[];
  };
};

function normalizeCategoryUrl(url?: string | null) {
  if (!url) return "#";
  return url.startsWith("/") ? url : `/${url}`;
}

function buildHeaderMenuTree(rows?: Category[]) {
  if (!rows?.length) return [];

  const itemMap = new Map<string, HeaderMenuItem>();
  const sortMenuItems = (items: HeaderMenuItem[]) => {
    items.sort((left, right) => {
      const leftOrder = left.sort_order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.sort_order ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.name.localeCompare(right.name, "vi");
    });
  };

  rows.forEach((item) => {
    if (!item.id || !item.name) return;

    itemMap.set(item.id, {
      id: item.id,
      name: item.name,
      url: normalizeCategoryUrl(item.url),
      sort_order: item.sort_order ?? null,
      children: [],
    });
  });

  const roots: HeaderMenuItem[] = [];

  rows.forEach((item) => {
    if (!item.id || !item.name) return;

    const current = itemMap.get(item.id);
    if (!current) return;

    if (item.parent_id && itemMap.has(item.parent_id)) {
      const parent = itemMap.get(item.parent_id);
      parent?.children.push(current);
      if (parent) sortMenuItems(parent.children);
      return;
    }

    if ((item.type ?? "") === "category") {
      roots.push(current);
    }
  });

  sortMenuItems(roots);
  return roots;
}

function Header() {
  const [toggleMenu, setToggleMenu] = useState<boolean>(false);
  const router = useRouter();

  const { data: categoriesResponse } = useQuery({
    queryKey: ["header-categories"],
    queryFn: () =>
      useCustomClient<CategoryListResponse>(
        "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
      ).catch(() => getCategoryFallbackResponse()),
  });

  const menuItems = React.useMemo(
    () => buildHeaderMenuTree(categoriesResponse?.responseData?.rows),
    [categoriesResponse?.responseData?.rows],
  );

  return (
    <>
      <div className="sticky top-0 w-full h-14 hidden lg:flex items-center justify-center bg-[#063e8e]">
        <div className="container w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-35 h-9 bg-[#e8c518] flex items-center justify-center border-3 rounded-sm border-[#647792]">
              <Link
                className="font-bold text-[14px] text-primary hover:text-white transition"
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
              className="bg-white h-10 rounded-sm outline-none px-4 w-64 placeholder:text-sm"
              type="text"
              placeholder="Tìm kiếm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value =
                    (e.currentTarget as HTMLInputElement).value || "";
                  const encoded = encodeURIComponent(value);
                  router.push(`/search?q=${encoded}&page=1`);
                }
              }}
            />
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/VCCIHCMC/"
                target="_blank"
                className="bg-white size-7 rounded-full flex items-center justify-center text-[#063e8e] hover:opacity-80 transition"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://twitter.com/VCCI_HCM"
                target="_blank"
                className="bg-white size-7 rounded-full flex items-center justify-center text-[#063e8e] hover:opacity-80 transition"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://www.youtube.com/user/VCCIHCMC"
                target="_blank"
                className="bg-white size-7 rounded-full flex items-center justify-center text-[#063e8e] hover:opacity-80 transition"
              >
                <Youtube size={16} />
              </a>
              <a
                href="https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym"
                target="_blank"
                className="bg-white size-7 rounded-full flex items-center justify-center text-[#063e8e] hover:opacity-80 transition"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-[#ededed] shadow-md py-2">
        <div className="container m-auto">
          <div className="w-full flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <Image
                className="w-[140px] object-contain"
                src={logo}
                alt="VCCI-HCM"
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center">
              {menuItems.map((category) => (
                <MenuItem
                  key={category.id}
                  title={category.name}
                  link={category.url}
                  items={[
                    ...category.children.map((child) => ({
                      title: child.name,
                      link: child.url,
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
          {menuItems.map((category) => (
            <div key={category.id} className="border-b border-gray-200">
              <Link
                href={category.url || "#"}
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
