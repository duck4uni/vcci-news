"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { MenuItem } from "../menu-category";

type Category = {
  id: string;
  name: string;
  static_link?: string;
  url?: string;
};

const resolveHref = (category: Category) => category.static_link ?? category.url ?? "#";

const ListCategory: React.FC<{ categories?: Category[] }> = ({ categories = [] }) => {
  const pathname = usePathname() || "";

  const isActive = (href: string) => pathname === href;

  return (
    <div className="border-t border-gray-200 bg-white py-2">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex flex-wrap items-center max-w-full overflow-x-auto">
            {categories.map((category) => {
              const href = resolveHref(category);
              const menu = { id: category.id, name: category.name, link: href };
              const active = isActive(href);

              return (
                <div key={category.id} className="shrink-0">
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
