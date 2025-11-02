"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

type Category = {
  title: string
  href: string
}

const CATEGORIES: Category[] = [
  { title: "Lợi ích của Hội Viên VCCI", href: "/hoi-vien" },
  { title: "Đăng ký Hội Viên", href: "/hoi-vien/dang-ky-hoi-vien" },
  { title: "Kết nối Hội Viên", href: "/hoi-vien/ket-noi-hoi-vien" },
  { title: "Tin Hội Viên", href: "/hoi-vien/tin-hoi-vien" },
]

const ListCategory: React.FC = () => {
  const pathname = usePathname() || ""

  const isActive = (href: string) => {
    if (href === "/hoi-vien") return pathname === "/hoi-vien"
    return pathname === href
  }

  return (
    <div className="border-t border-gray-200 bg-white p-2.5">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Danh mục" className="py-3">
          <ul className="flex items-center">
            {CATEGORIES.map((c) => {
              const active = isActive(c.href)
              return (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className={
                      "text-sm font-bold py-3.5 px-5 transition-colors duration-150 " +
                      (active
                        ? "text-yellow-500 font-semibold decoration-yellow-300 "
                        : "text-gray-600 hover:text-yellow-500 ")
                    }
                  >
                    {c.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default ListCategory