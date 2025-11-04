"use client"
import MapRegion, { DEFAULT_REGIONS } from "./components/map-region"
import React, { useState } from "react";
import ListCategory from "@app/dai-dien-gioi-chu/components/list-category";
import { TRADE_PROMOTION_CATEGORIES } from "@constants/categories";
// ...existing code...

export default function Page() {
  const [active, setActive] = useState<string | null>(DEFAULT_REGIONS[0]?.id ?? null)

  return (
    <div className="min-h-screen container mx-auto p-4">
      <div className="w-full flex flex-col gap-5">
  <ListCategory categories={TRADE_PROMOTION_CATEGORIES} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <main className="lg:col-span-2 bg-background ">
      <div className="pb-5 overflow-hidden">
        <MapRegion active={active} />
      </div>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">

            <div className="bg-white border rounded-md p-6">
              <h3 className="text-2xl font-semibold text-primary mb-3">KHU VỰC</h3>
              <nav aria-label="Khu vực" className="space-y-2">
                {DEFAULT_REGIONS.map((r) => {
                  const isActive = r.id === active
                  return (
                    <button
                      key={r.id}
                      onClick={() => setActive(r.id)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-foreground ${
                        isActive
                          ? "border-2 border-primary-foreground"
                          : "hover:bg-muted hover:text-primary-foreground"
                      }`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span className={`text-sm ${isActive ? "text-primary-foreground font-semibold" : "text-primary"}`}>
                        {r.name}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
