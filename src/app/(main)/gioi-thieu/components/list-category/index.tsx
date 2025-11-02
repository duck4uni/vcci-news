"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

type Category = {
    title: string
    href: string
}

const CATEGORIES: Category[] = [
    { title: "Về VCCI-HCM", href: "/gioi-thieu" },
    { title: "Chức năng và Nhiệm vụ", href: "/gioi-thieu/chuc-nang" },
    { title: "Sơ đồ Tổ chức", href: "/gioi-thieu/so-do" },
    { title: "Dịch vụ cung cấp", href: "/gioi-thieu/dich-vu" },
]

const ListCategory: React.FC = () => {
    const pathname = usePathname() || ""

    const isActive = (href: string) => {
        // treat the base path as active for nested routes as well
        if (href === "/gioi-thieu") return pathname === href || pathname.startsWith(href + "/")
        return pathname === href
    }

    return (
        <div className="border-t border-gray-200 bg-white p-2.5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav aria-label="Danh mục" className="py-3">
                    <ul className="flex gap-8 items-center">
                        {CATEGORIES.map((c) => {
                            const active = isActive(c.href)
                            return (
                                <li key={c.href}>
                                    <Link
                                        href={c.href}
                                        className={
                                            "text-sm font-medium py-3.5 px-5 transition-colors duration-150 " +
                                            (active
                                                ? "text-yellow-500 font-semibold decoration-yellow-300 "
                                                : "text-gray-600 hover:text-gray-800 hover:underline")
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