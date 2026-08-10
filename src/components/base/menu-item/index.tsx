'use client'

import { buttonVariants } from '@components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { cn } from '@lib/utils'
import { cva } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

type MenuItemProps = {
  title: string
  link?: string
  items: { title: string; link: string }[]
}

const MenuItem = ({ title, link, items }: MenuItemProps) => {
  const pathname = usePathname()
  const normalizedLink = link && link !== '#' ? link : '/'
  const hasChildren = items.length > 0
  const isRoot = normalizedLink === '/'
  const isChildActive = items.some((item) => pathname === item.link || pathname.startsWith(item.link))
  const isActive = isRoot
    ? pathname === '/'
    : pathname === normalizedLink ||
      pathname.startsWith(normalizedLink) ||
      isChildActive
  const linkId = useMemo(() => `header-trigger-${title}`, [title])

  const hoverCardRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element) return
      const triggerWidth = document.getElementById(linkId)?.offsetWidth ?? 220
      element.style.minWidth = `${Math.max(triggerWidth, 320)}px`
      element.style.maxWidth = '420px'
    },
    [linkId]
  )

  const trigger = (
    <Link
      id={linkId}
      href={normalizedLink}
      aria-selected={isActive}
      className={menuItemTriggerVariant()}
    >
      <span className="relative z-10 whitespace-nowrap">{title}</span>
      <span
        className={`absolute bottom-[11px] left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#2f57ff] transition-all duration-200 ${
          isActive ? 'w-[44px]' : 'w-0 group-hover:w-[44px]'
        }`}
        aria-hidden="true"
      />
    </Link>
  )

  if (!hasChildren) {
    return <div className="relative shrink-0">{trigger}</div>
  }

  return (
    <HoverCard openDelay={0} closeDelay={90}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent
        ref={hoverCardRef}
        align="start"
        sideOffset={0}
        className={menuItemHoverBoxVariant()}
      >
        {items.map((item) => {
          const isItemActive = pathname === item.link

          return (
            <Link
              key={item.link}
              href={item.link}
              className={menuItemChildVariant({ active: isItemActive })}
            >
              {item.title}
            </Link>
          )
        })}
      </HoverCardContent>
    </HoverCard>
  )
}

const menuItemTriggerVariant = cva(
  cn(
    buttonVariants({ variant: 'ghost' }),
    'group relative inline-flex h-[58px] shrink-0 items-center whitespace-nowrap rounded-none bg-transparent px-[4px] py-0 text-[14px] font-semibold leading-none tracking-normal text-[#43506a] shadow-none transition',
    'hover:bg-transparent hover:text-[#2f57ff]',
    'aria-selected:bg-transparent aria-selected:text-[#2f57ff]',
    'focus-visible:ring-0 focus-visible:ring-offset-0'
  )
)

const menuItemHoverBoxVariant = cva(
  'z-[80] flex w-auto flex-col gap-1 rounded-b-md rounded-t-none border border-slate-200 bg-white p-2 text-[13px] font-medium text-slate-600 shadow-[0_18px_36px_rgba(15,23,42,0.16)]'
)

const menuItemChildVariant = cva(
  cn(
    buttonVariants({ variant: 'ghost' }),
    'h-auto min-h-10 justify-start rounded-md px-3 py-2.5 text-left text-sm font-medium leading-6 whitespace-normal break-words transition'
  ),
  {
    variants: {
      active: {
        true: 'bg-[#eef3ff] text-[#2f57ff]',
        false: 'text-slate-600 hover:bg-[#eef3ff] hover:text-[#2f57ff]'
      }
    },
    defaultVariants: {
      active: false
    }
  }
)

export default MenuItem
