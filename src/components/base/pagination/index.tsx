import React from 'react'
import { Button } from '@/components/ui/button'

type PaginationProps = {
  current: number
  total: number
  onChange?: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ current, total, onChange }) => {
  if (total <= 1) return null

  const handle = (p: number) => () => onChange?.(p)

  const pages: (number | '...')[] = []
  const delta = 2
  const left = Math.max(1, current - delta)
  const right = Math.min(total, current + delta)

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <nav className="flex items-center justify-center space-x-2 py-4" aria-label="Pagination">
      <Button variant="ghost" onClick={handle(Math.max(1, current - 1))} disabled={current === 1}>
        «
      </Button>

      {pages.map((p, idx) => (
        <React.Fragment key={`${p}-${idx}`}>
          {p === '...'
            ? <span className="px-2 text-muted-foreground">{p}</span>
            : (
              p === current
                ? (
                  <span
                    aria-current="page"
                    className="px-3 py-1 rounded text-yellow-500 font-semibold"
                  >
                    {p}
                  </span>
                )
                : (
                  <Button
                    variant="ghost"
                    onClick={handle(p as number)}
                  >
                    {p}
                  </Button>
                ))}
        </React.Fragment>
      ))}

      <Button variant="ghost" onClick={handle(Math.min(total, current + 1))} disabled={current === total}>
        »
      </Button>
    </nav>
  )
}

export default Pagination
