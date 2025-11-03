"use client"

import { usePathname } from "next/navigation"
import React from "react"
import { MenuItem } from '../menu-category'
import {PATHS} from '@constants/paths'
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
    { title: "Chức năng Đại diện Người sử dụng lao động", href: "/dai-dien-gioi-chu" },
    { title: "Sự kiện – Tập huấn NSDLĐ", href: `${PATHS.ownerRepresentatives}/su-kien` },
    { title: "Tin liên quan", href: `${PATHS.ownerRepresentatives}/tin-lien-quan` },
    { title: "Chủ đề", href: `${PATHS.ownerRepresentatives}/chu-de` },

]

const ListCategory: React.FC<{ categories?: Category[] }> = ({ categories = CATEGORIES }) => {
    const pathname = usePathname() || ""

    const isActive = (href: string) => {
        // treat the base path as active for nested routes as well
        if (href === "/gioi-thieu") return pathname === href || pathname.startsWith(href + "/")
        return pathname === href
    }

    return (
        <div className="border-t border-gray-200 bg-white p-2.5">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="py-3">
                    <div className="flex flex-wrap gap-4 sm:gap-8 items-center max-w-full overflow-x-auto">
                        {categories.map((c) => {
                            const menu: Menu = { id: c.href, name: c.title, link: c.href }
                            const active = isActive(c.href)
                            return (
                                <div key={c.href} className="shrink-0">
                                    <MenuItem menu={menu} active={active} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListCategory