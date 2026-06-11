"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = { id: string; title: string; count: number };

export const ListFilter: React.FC<{
  categories?: Category[];
  onSearch?: (q: string) => void;
  onReset?: () => void;
}> = ({ categories, onSearch, onReset }) => {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    if (categories?.length) {
      categories.forEach((category) => {
        map[category.id] = false;
      });
    }
    return map;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelected((prev) => {
        const map: Record<string, boolean> = {};
        if (categories?.length) {
          categories.forEach((category) => {
            map[category.id] = Boolean(prev[category.id]);
          });
        }
        return map;
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [categories]);

  const toggle = (id: string) => setSelected((current) => ({ ...current, [id]: !current[id] }));

  return (
    <aside className="p-6 bg-white border rounded-md">
      <h3 className="text-lg font-semibold mb-3">Tìm kiếm</h3>

      <div className="mb-4">
        <Input
          placeholder="Tên văn bản..."
          value={query}
          className="text-black placeholder:text-gray-400 rounded-none py-2.5 px-2"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.(query);
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {categories?.length
          ? categories.slice(0, visibleCount).map((category) => (
              <label key={category.id} className="flex items-center gap-3">
                <Checkbox
                  checked={Boolean(selected[category.id])}
                  onCheckedChange={() => toggle(category.id)}
                />
                <div className="flex justify-between w-full items-center">
                  <span className="text-sm">{category.title}</span>
                  <span className="text-sm text-gray-400">({category.count})</span>
                </div>
              </label>
            ))
          : null}

        <div className="mt-2 flex items-center gap-3">
          {(categories?.length ?? 0) > visibleCount ? (
            <button
              className="text-sm text-primary self-start"
              onClick={() => setVisibleCount((current) => current + 5)}
            >
              Xem thêm
            </button>
          ) : null}

          {visibleCount > 5 ? (
            <button
              className="text-sm text-gray-500 self-start"
              onClick={() => setVisibleCount(5)}
            >
              Thu gọn
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1 rounded-none font-medium text-lg text-white hover:bg-muted-foreground hover:outline-1 outline-primary hover:text-primary"
          onClick={() => onSearch?.(query)}
        >
          Tìm kiếm
        </Button>
        <Button
          className="flex-1 rounded-none font-medium text-lg text-white hover:bg-muted-foreground hover:outline-1 outline-primary hover:text-primary"
          onClick={() => {
            setQuery("");
            const map: Record<string, boolean> = {};
            if (categories?.length) {
              categories.forEach((category) => {
                map[category.id] = false;
              });
            }
            setSelected(map);
            setVisibleCount(5);
            onReset?.();
          }}
        >
          Bỏ tìm
        </Button>
      </div>
    </aside>
  );
};

export default ListFilter;
