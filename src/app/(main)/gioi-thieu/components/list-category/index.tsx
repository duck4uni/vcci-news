"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

type Category = {
  title: string
  href: string
}

const CATEGORIES: Category[] = [
  { title: "Về VCCI-HCM", href: "/gioi-thieu" },
  { title: "Chức năng và nhiệm vụ", href: "/gioi-thieu/chuc-nang-nhiem-vu" },
  { title: "Sơ đồ tổ chức", href: "/gioi-thieu/so-do-to-chuc" },
  { title: "Dịch vụ cung cấp", href: "/gioi-thieu/dich-vu-cung-cap" },
]

const ListCategory: React.FC = () => {
  const pathname = usePathname() || ""
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === "/gioi-thieu") return pathname === "/gioi-thieu"
    return pathname === href
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value)
  }

  return (
    <div className="border-t border-gray-200 bg-white p-2.5">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Danh mục" className="py-3">
          {/* --- Desktop view --- */}
          <ul className="hidden sm:flex items-center">
            {CATEGORIES.map((c) => {
              const active = isActive(c.href)
              return (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className={
                      "text-sm font-bold py-3.5 px-5 transition-colors duration-150 " +
                      (active
                        ? "text-yellow-500 font-semibold decoration-yellow-300"
                        : "text-gray-600 hover:text-yellow-500")
                    }
                  >
                    {c.title}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* --- Mobile view (Dropdown) --- */}
          <div className="sm:hidden">
            <select
              value={pathname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.href} value={c.href}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default ListCategory
