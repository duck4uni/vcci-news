'use client'
type Menu = {
  id: string | number
  name: string
  link?: string
  children?: Array<{ id: string | number; name: string; link?: string }>
}

import { buttonVariants } from '@components/ui/button'
import { cn } from '@lib/utils'
import { useCallback, useMemo } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@components/ui/hover-card'
import { cva } from 'class-variance-authority'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function MenuItem(props: { variant?: 'main' | 'secondary'; menu: Menu; active?: boolean }) {
  const { menu, variant = 'main', active } = props

  const pathname = usePathname()
  const isActive = pathname.startsWith(menu.link ?? '');
  const linkId = useMemo(() => `trigger_${menu.id}`, [menu.id])
  const hoverCardRef = useCallback(
    (element: HTMLDivElement) => {
      if (!element) return
      element.style.minWidth = `${document.getElementById(linkId)?.offsetWidth ?? 0}px`
    },
    [linkId]
  )

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Link
          aria-selected={active || isActive}
          id={linkId}
          target={(menu.link ?? '').startsWith('/') ? '_self' : '_blank'}
          href={menu.link ?? '/'}
          className={menuItemTriggerVariant({ variant })}
        >
          {menu.name}
        </Link>
      </HoverCardTrigger>

      {menu.children && (
        <HoverCardContent ref={hoverCardRef} className={menuItemHoverBoxVariant({ variant })}>
          {menu.children.map((subMenu) => (
            <Link key={subMenu.id} href={subMenu.link ?? '/'} className={menuItemChildVariant({ variant })}>
              {subMenu.name}
            </Link>
          ))}
        </HoverCardContent>
      )}
    </HoverCard>
  )
}

const menuItemTriggerVariant = cva(
  cn(buttonVariants({ variant: 'ghost' }), 'font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 py-'),
  {
    variants: {
      variant: {
        main: cn(
          'font-semibold text-[#363636] text-2xl hover:text-muted-foreground hover:bg-white py-3.5 px-5',
          'aria-selected:text-muted-foreground'
        ),
        secondary: cn(
          'font-boldtext-primary border-t-2 border-t-transparent rounded-none',
          'hover:text-primary/90',
          'aria-selected:border-t-secondary aria-selected:bg-accent',
          'aria-selected:bg-[#E9C826]'
        )
      }
    },
    defaultVariants: {
      variant: 'main'
    }
  }
)

const menuItemHoverBoxVariant = cva('flex w-full flex-col gap-2 p-0', {
  variants: {
    variant: {
      main: 'bg-secondary',
      secondary: 'bg-muted '
    }
  },
  defaultVariants: {
    variant: 'main'
  }
})

const menuItemChildVariant = cva(cn(buttonVariants({ variant: 'ghost' }), 'justify-start'), {
  variants: {
    variant: {
      main: 'text-secondary-foreground hover:text-muted-foreground hover:bg-secondary',
      secondary: 'text-accent-foreground hover:text-primary/90 '
    }
  },
  defaultVariants: {
    variant: 'main'
  }
})
