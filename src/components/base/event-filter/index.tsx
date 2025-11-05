"use client"
import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Category = { id: string; title: string }

const MOCK_CATEGORIES: Category[] = [
  { id: 'topic', title: 'Chuyên đề' },
  { id: 'training', title: 'Tập huấn NSDLĐ' },
  { id: 'law', title: 'Xây dựng và Phổ biến pháp luật' },
  { id: 'trade', title: 'Xúc tiến thương mại và Đầu tư' }
]

type FilterPayload = {
  upcoming: boolean
  past: boolean
  query: string
  categories: string[]
  fromDate: string
  toDate: string
}

export const EventFilter: React.FC<{ onFilter?: (payload: FilterPayload) => void; onReset?: () => void }> = ({ onFilter, onReset }) => {
  const [upcoming, setUpcoming] = useState(false)
  const [past, setPast] = useState(false)
  const [query, setQuery] = useState('')
  const [categories, setCategories] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    MOCK_CATEGORIES.forEach((c) => (map[c.id] = false))
    return map
  })
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const toggleCategory = (id: string) => {
    setCategories((s) => ({ ...s, [id]: !s[id] }))
  }

  const handleFilter = () => {
    const payload = {
      upcoming,
      past,
      query,
      categories: Object.keys(categories).filter((k) => categories[k]),
      fromDate,
      toDate
    }
    onFilter?.(payload)
  }

  const handleReset = () => {
    setUpcoming(false)
    setPast(false)
    setQuery('')
    setCategories(Object.keys(categories).reduce((acc, k) => ({ ...acc, [k]: false }), {} as Record<string, boolean>))
    setFromDate('')
    setToDate('')
    onReset?.()
  }

  return (
    <aside className="p-6 bg-white border rounded-md">
      <h3 className="text-lg font-semibold mb-4">Tìm kiếm sự kiện</h3>

      <div className="flex flex-col gap-3 mb-4">
        <label className="flex items-center gap-2">
          <Checkbox checked={upcoming} onCheckedChange={() => setUpcoming((v) => !v)} />
          <span className="text-sm">Sự kiện sắp diễn ra</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox checked={past} onCheckedChange={() => setPast((v) => !v)} />
          <span className="text-sm">Sự kiện đã diễn ra</span>
        </label>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Tên sự kiện ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='text-black placeholder:text-gray-400 rounded-none py-2.5 px-2'
        />
      </div>

      <div className="mb-4">
        {MOCK_CATEGORIES.map((c) => (
          <label key={c.id} className="flex items-center gap-2 mb-2">
            <Checkbox checked={!!categories[c.id]} onCheckedChange={() => toggleCategory(c.id)} />
            <span className="text-sm">{c.title}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
  <Label className="block text-sm mb-1">Từ ngày:</Label>
  <Input value={fromDate} onChange={(e) => setFromDate(e.target.value)} type="date" />
      </div>

      <div className="mb-4">
  <Label className="block text-sm mb-1">Đến ngày:</Label>
  <Input value={toDate} onChange={(e) => setToDate(e.target.value)} type="date" />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleFilter} className="flex-1 rounded-none font-medium text-lg text-white hover:bg-muted-foreground hover:outline-1 outline-primary hover:text-primary">Lọc sự kiện</Button>
        <Button onClick={handleReset} className="flex-1 rounded-none font-medium text-lg text-white hover:bg-muted-foreground hover:outline-1 outline-primary hover:text-primary">Bỏ lọc</Button>
      </div>
    </aside>
  )
}

export default EventFilter
