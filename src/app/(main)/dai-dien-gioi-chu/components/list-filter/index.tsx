"use client"
import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type Category = { id: string; title: string; count: number }

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'ceo', title: 'CEO', count: 4 },
  { id: 'policy', title: 'Hỏi đáp về chính sách', count: 0 },
  { id: 'biz', title: 'Tin Doanh Nghiệp', count: 9 },
  { id: 'member', title: 'Tin Hội Viên', count: 17 },
  { id: 'law1', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law2', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law3', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law4', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law5', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law6', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law7', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law8', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law9', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
  { id: 'law51', title: 'Văn bản Pháp luật sắp có hiệu lực', count: 30 },
]

export const ListFilter: React.FC<{
  categories?: Category[]
  onSearch?: (q: string) => void
  onReset?: () => void
}> = ({ categories = DEFAULT_CATEGORIES, onSearch, onReset }) => {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(5)
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    categories.forEach((c) => (map[c.id] = false))
    return map
  })

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }))

  return (
    <aside className="p-6 bg-white border rounded-md">
      <h3 className="text-lg font-semibold mb-3">Tìm kiếm</h3>

      <div className="mb-4">
        <Input
          placeholder="Tên văn bản ..."
          value={query}
          className='text-black placeholder:text-gray-400 rounded-none py-2.5 px-2'
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch?.(query)
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-3 mb-6">
        {categories.slice(0, visibleCount).map((c) => (
          <label key={c.id} className="flex items-center gap-3">
            <Checkbox checked={!!selected[c.id]} onCheckedChange={() => toggle(c.id)} />
            <div className="flex justify-between w-full items-center">
              <span className="text-sm">{c.title}</span>
              <span className="text-sm text-gray-400">({c.count})</span>
            </div>
          </label>
        ))}
        <div className="mt-2 flex items-center gap-3">
          {categories.length > visibleCount && (
            <button
              className="text-sm text-primary self-start"
              onClick={() => setVisibleCount((v) => v + 5)}
            >
              Xem thêm
            </button>
          )}

          {visibleCount > 5 && (
            <button
              className="text-sm text-gray-500 self-start"
              onClick={() => setVisibleCount(5)}
            >
              Thu gọn
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 rounded-none font-medium text-lg text-white hover:bg-muted-foreground hover:outline-1 outline-primary hover:text-primary" onClick={() => onSearch?.(query)}>
          Tìm kiếm
        </Button>
        <Button
          className="flex-1 rounded-none font-medium text-lg text-white hover:bg-muted-foreground hover:outline-1 outline-primary hover:text-primary"
          onClick={() => {
            setQuery('')
            // restore initial map
            const map: Record<string, boolean> = {}
            categories.forEach((c) => (map[c.id] = false))
            setSelected(map)
            setVisibleCount(5)
            onReset?.()
          }}
        >
          Bỏ tìm
        </Button>
      </div>
    </aside>
  )
}

export default ListFilter
