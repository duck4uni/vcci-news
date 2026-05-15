"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, Linkedin, Menu, Twitter, X, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/VCCI-HCM-logo-VN-2025.png";
import MenuItem from "@/components/base/menu-item";
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
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isTopBarHidden, setIsTopBarHidden] = useState(false);
  const router = useRouter();

  const handleDesktopMenuWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      const element = event.currentTarget;

      if (element.scrollWidth <= element.clientWidth) return;
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      event.preventDefault();
      element.scrollLeft += event.deltaY;
    },
    [],
  );

  const { data: categoriesResponse } = useQuery({
    queryKey: ["header-categories"],
    queryFn: () =>
      useCustomClient<CategoryListResponse>(
        "/category?page=1&pageSize=200&sortField=sort_order&sortOrder=ASC",
      ).catch(() => getCategoryFallbackResponse()),
    staleTime: 5 * 60 * 1000,
  });

  const menuItems = useMemo(
    () => buildHeaderMenuTree(categoriesResponse?.responseData?.rows),
    [categoriesResponse?.responseData?.rows],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsTopBarHidden(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-[0_1px_0_rgba(15,23,42,0.05)]">
      <div
        className={`hidden w-full items-center justify-center overflow-hidden bg-[#25439a] ${
          isTopBarHidden ? "lg:hidden" : "h-10 lg:flex"
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1460px] items-center justify-between gap-6 px-6 xl:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 items-center justify-center rounded-[4px] bg-[#f2b500] px-4 shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]">
              <Link
                className="text-[13px] font-semibold leading-none text-[#15357a] transition hover:opacity-85"
                href="https://vccihcm.vn/dang-ky"
              >
                {"\u0110\u0103ng K\u00fd H\u1ed9i Vi\u00ean"}
              </Link>
            </div>
            <Link
              className="px-3 py-1 text-[13px] font-medium text-white transition hover:opacity-80"
              href="/site-map"
            >
              Sitemap
            </Link>
            <Link
              className="px-3 py-1 text-[13px] font-medium text-white transition hover:opacity-80"
              href="https://vccihcm.vn/lien-he"
            >
              {"Li\u00ean h\u1ec7"}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <input
              className="h-[28px] w-[176px] rounded-[4px] border border-[#3a57b4] bg-[#3554b7] px-3 text-[13px] text-white outline-none placeholder:text-[13px] placeholder:text-[#b5c4ff]"
              type="text"
              placeholder={"T\u00ecm ki\u1ebfm"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.currentTarget as HTMLInputElement).value || "";
                  const encoded = encodeURIComponent(value);
                  router.push(`/search?q=${encoded}&page=1`);
                }
              }}
            />

            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com/VCCIHCMC/"
                target="_blank"
                rel="noreferrer"
                className="flex size-[22px] items-center justify-center rounded-full bg-white text-[#2f57ff] transition hover:opacity-80"
              >
                <Facebook size={12} fill="currentColor" />
              </a>
              <a
                href="https://twitter.com/VCCI_HCM"
                target="_blank"
                rel="noreferrer"
                className="flex size-[22px] items-center justify-center rounded-full bg-white text-[#2f57ff] transition hover:opacity-80"
              >
                <Twitter size={12} fill="currentColor" />
              </a>
              <a
                href="https://www.youtube.com/user/VCCIHCMC"
                target="_blank"
                rel="noreferrer"
                className="flex size-[22px] items-center justify-center rounded-full bg-white text-[#2f57ff] transition hover:opacity-80"
              >
                <Youtube size={12} fill="currentColor" />
              </a>
              <a
                href="https://www.linkedin.com/company/vietnam-chamber-of-commerce-and-industry-ho-chi-minh-city-branch-vcci-hcm-?trk=biz-companies-cym"
                target="_blank"
                rel="noreferrer"
                className="flex size-[22px] items-center justify-center rounded-full bg-white text-[#2f57ff] transition hover:opacity-80"
              >
                <Linkedin size={12} fill="currentColor" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[80px] w-full max-w-[1460px] items-center justify-between gap-10 px-6 xl:px-8">
          <Link href="/" className="flex w-[136px] shrink-0 items-center xl:w-[152px]">
            <Image
              className="h-auto w-[108px] object-contain"
              src={logo}
              alt="VCCI-HCM"
              priority
            />
          </Link>

          <div className="hidden min-w-0 flex-1 justify-end pl-6 lg:flex xl:pl-10">
            <nav
              className="header-menu-scroll min-w-0 max-w-full overflow-x-auto overflow-y-hidden"
              onWheel={handleDesktopMenuWheel}
            >
              <div className="flex w-max min-w-full items-center justify-end gap-4 whitespace-nowrap pr-1 xl:gap-6">
                {menuItems.map((category) => (
                  <MenuItem
                    key={category.id}
                    title={category.name}
                    link={category.url}
                    items={category.children.map((child) => ({
                      title: child.name,
                      link: child.url,
                    }))}
                  />
                ))}
              </div>
            </nav>
          </div>
          
          <button
            onClick={() => setToggleMenu((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-[#163b73] transition hover:bg-slate-50 lg:hidden"
            aria-label={"M\u1edf menu"}
          >
            {toggleMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white transition-all duration-300 lg:hidden ${
          toggleMenu ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3">
          <input
            className="h-11 w-full rounded-md border border-slate-200 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-[#2f57ff]"
            type="text"
            placeholder={"T\u00ecm ki\u1ebfm"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.currentTarget as HTMLInputElement).value || "";
                const encoded = encodeURIComponent(value);
                router.push(`/search?q=${encoded}&page=1`);
                setToggleMenu(false);
              }
            }}
          />
        </div>

        <div className="pb-3">
          {menuItems.map((category) => (
            <div key={category.id} className="border-t border-slate-100 first:border-t-0">
              <Link
                href={category.url || "#"}
                className="block px-5 py-3 text-[15px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-[#2f57ff]"
                onClick={() => setToggleMenu(false)}
              >
                {category.name}
              </Link>
              {category.children.length > 0 ? (
                <div className="pb-2 pl-8 pr-5">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={child.url || "#"}
                      className="block py-2 text-sm text-slate-500 transition hover:text-[#2f57ff]"
                      onClick={() => setToggleMenu(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
