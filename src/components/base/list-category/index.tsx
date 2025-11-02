"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { MenuItem } from '../menu-category'

// Local Menu shape compatible with MenuItem
type Menu = {
    id: string | number
    name: string
    link?: string
}

type Category = {
    title: string
    href: string
}

const CATEGORIES: Category[] = [
    { title: "Về VCCI-HCM", href: "/dai-dien-gioi-chu" },
    { title: "Chức năng và Nhiệm vụ", href: "/gioi-thieu/chuc-nang" },
    { title: "Sơ đồ Tổ chức", href: "/gioi-thieu/so-do" },
    { title: "Dịch vụ cung cấp", href: "/gioi-thieu/dich-vu" },
    { title: "Dịch vụ cung cấp", href: "/gioi-thieu/dich-vu" },
    { title: "Dịch vụ cung cấp", href: "/gioi-thieu/dich-vu" },
    { title: "Dịch vụ cung cấp", href: "/gioi-thieu/dich-vu" },
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
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <nav aria-label="Danh mục" className="py-3">
                    <ul className="flex flex-wrap gap-4 sm:gap-8 items-center max-w-full overflow-x-auto">
                        {CATEGORIES.map((c) => {
                            const menu: Menu = { id: c.href, name: c.title, link: c.href }
                            const active = isActive(c.href)
                            return (
                                <li key={c.href} className="shrink-0">
                                    <MenuItem menu={menu} active={active} />
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