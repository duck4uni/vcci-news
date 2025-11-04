"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { MenuItem } from "../menu-category";
import { PATHS } from "@constants/paths";
// Local Menu shape compatible with MenuItem
type Menu = {
  id: string | number;
  name: string;
  link?: string;
};

type Category = {
  title: string;
  href: string;
};

const CATEGORIES: Category[] = [
  { title: "Xuất Xứ Hàng Hóa (C/O)", href: "/xuat-xu-hang-hoa" },
  {
    title: "Mục đích của C/O",
    href: `${PATHS.originOfGoods}/muc-dich`,
  },
  {
    title: "Luật áp dụng về C/O",
    href: `${PATHS.originOfGoods}/luat-ap-dung`,
  },
  { title: "Thủ tục cấp C/O", href: `${PATHS.originOfGoods}/thu-tuc-cap` },
  {
    title: "Biểu mẫu C/O và cách khai",
    href: `${PATHS.originOfGoods}/bieu-mau-c-o-va-cach-khai`,
  },
  {
    title: "Phí và Lệ phí cấp C/O",
    href: `${PATHS.originOfGoods}/phi-va-le-phi-cap`,
  },
  {
    title: "Điểm cấp và Thời gian cấp C/O",
    href: `${PATHS.originOfGoods}/diem-cap-va-thoi-gian-cap`,
  },
  {
    title: "Thông tin liên hệ",
    href: `${PATHS.originOfGoods}/thong-tin-lien-he`,
  },
];

const ListCategory: React.FC<{ categories?: Category[] }> = ({
  categories = CATEGORIES,
}) => {
  const pathname = usePathname() || "";

  const isActive = (href: string) => {
    // treat the base path as active for nested routes as well
    if (href === "/gioi-thieu")
      return pathname === href || pathname.startsWith(href + "/");
    return pathname === href;
  };

  return (
    <div className="border-t border-gray-200 bg-white p-2.5">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex flex-wrap items-center max-w-full overflow-x-auto">
            {categories.map((c) => {
              const menu: Menu = { id: c.href, name: c.title, link: c.href };
              const active = isActive(c.href);
              return (
                <div key={c.href} className="shrink-0">
                  <MenuItem menu={menu} active={active} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCategory;
