"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { MenuItem } from "../menu-category";

type Category = {
  id: string;
  name: string;
  static_link: string;

};

// Default categories removed — component now accepts `categories` via props.

const ListCategory: React.FC<{ categories?: Category[] }> = ({
  categories = [],
}) => {
  const pathname = usePathname() || "";

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="border-t border-gray-200 bg-white py-2">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <div className="flex flex-wrap items-center max-w-full overflow-x-auto">
            {categories.map((c) => {
              const menu = { id: c.id, name: c.name, link: c.static_link };
              const active = isActive(c.static_link);
              return (
                <div key={c.id} className="shrink-0">
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
