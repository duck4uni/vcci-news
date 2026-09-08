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
    <div className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="pt-6">
          <div className="client-category-scrollbar flex max-w-full items-center gap-3 overflow-x-auto overflow-y-hidden pb-1 pl-0.5 pr-2">
            {categories.map((category) => {
              const href = resolveHref(category);
              const menu = { id: category.id, name: category.name, link: href };
              const active = isActive(href);

              return (
                <div key={category.id} className="shrink-0">
                  <MenuItem menu={menu} active={active} variant="secondary" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .client-category-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(22, 85, 157, 0.35) transparent;
        }

        .client-category-scrollbar::-webkit-scrollbar {
          height: 6px;
        }

        .client-category-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .client-category-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(22, 85, 157, 0.28);
          border-radius: 999px;
        }

        .client-category-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(22, 85, 157, 0.48);
        }
      `}</style>
    </div>
  );
};

export default ListCategory;
