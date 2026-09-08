'use client'

type Menu = {
  id: string | number
  name: string
  link?: string
  children?: Array<{ id: string | number; name: string; link?: string }>
}

import { buttonVariants } from '@components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { cn } from '@lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function MenuItem(props: { variant?: 'main' | 'secondary'; menu: Menu; active?: boolean }) {
  const { menu, variant = 'main', active } = props

  const pathname = usePathname()
  const normalizedLink = menu.link && menu.link !== '#' ? menu.link : '/'
  const hasChildren = Boolean(menu.children?.length)
  const isRoot = normalizedLink === '/'
  const isActive = active || (isRoot ? pathname === '/' : pathname.startsWith(normalizedLink))
  const linkId = useMemo(() => `trigger_${menu.id}`, [menu.id])

  const hoverCardRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element) return
      element.style.minWidth = `${document.getElementById(linkId)?.offsetWidth ?? 0}px`
    },
    [linkId]
  )

  const trigger = (
    <Link
      aria-selected={isActive}
      id={linkId}
      target={normalizedLink.startsWith('/') ? '_self' : '_blank'}
      href={normalizedLink}
      className={menuItemTriggerClass(variant)}
    >
      <span className={cn("relative z-10", variant === "main" ? "truncate" : "")}>{menu.name}</span>
      {variant === 'main' ? <span className="menu-item-underline" aria-hidden="true" /> : null}
    </Link>
  )

  if (!hasChildren) {
    return trigger
  }

  return (
    <HoverCard openDelay={80} closeDelay={120}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent ref={hoverCardRef} className={menuItemHoverBoxVariant(variant)}>
        {menu.children?.map((subMenu) => (
          <Link key={subMenu.id} href={subMenu.link ?? '/'} className={menuItemChildVariant(variant)}>
            {subMenu.name}
          </Link>
        ))}
      </HoverCardContent>
    </HoverCard>
  )
}

function menuItemTriggerClass(variant: 'main' | 'secondary') {
  if (variant === 'secondary') {
    return cn(
      'inline-flex min-h-[38px] max-w-[280px] items-center justify-center rounded-full border border-[#d6dfeb] bg-white px-5 py-2 text-center text-[13px] font-medium leading-[1.25] text-[#5f6b7d] shadow-none transition-colors duration-150 sm:max-w-none sm:whitespace-nowrap',
      'hover:border-[#c5d2e3] hover:bg-[#f7faff] hover:text-[#1b5aa1]',
      'aria-selected:border-[#16559d] aria-selected:bg-[#16559d] aria-selected:text-white',
      'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
    )
  }

  return cn(
    buttonVariants({ variant: 'ghost' }),
    'group relative inline-flex h-[60px] rounded-none border-b-2 border-transparent px-3 py-0 text-[15px] font-semibold text-slate-700 shadow-none transition-colors duration-150',
    'hover:bg-transparent hover:text-[#2f57ff]',
    'aria-selected:bg-transparent aria-selected:text-[#2f57ff]',
    'focus-visible:ring-0 focus-visible:ring-offset-0 xl:px-4'
  )
}

function menuItemHoverBoxVariant(variant: 'main' | 'secondary') {
  return cn(
    'mt-1 flex w-full min-w-[220px] flex-col gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,0.12)]',
    variant === 'secondary' ? 'bg-white' : ''
  )
}

function menuItemChildVariant(_variant: 'main' | 'secondary') {
  return cn(
    buttonVariants({ variant: 'ghost' }),
    'h-10 justify-start rounded-md px-3 text-sm font-medium text-slate-600 transition-colors',
    'hover:bg-slate-50 hover:text-[#2f57ff]'
  )
}
