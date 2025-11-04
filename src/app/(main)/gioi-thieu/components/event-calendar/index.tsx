"use client";
import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
export default function EventCalendar() {
  const mockCalendar = {
    month: 10,
    year: 2025,
    highlighted: [6, 9, 12],
  };
  const [month, setMonth] = useState<number>(mockCalendar.month);
  const [year, setYear] = useState<number>(mockCalendar.year);

  return (
    <div className="bg-white border rounded-md p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">
          THÁNG {month}/{year}
        </div>
        <div className="flex items-center gap-2">
          <div className="group">
            <button
              aria-label="Tháng trước"
              onClick={() => {
                // prev month
                if (month === 1) {
                  setMonth(12);
                  setYear((y) => y - 1);
                } else {
                  setMonth((m) => m - 1);
                }
              }}
              className="group-hover:border-primary p-1 h-10 w-10 flex items-center justify-center rounded-full border-2 border-[#363636] "
            >
              <ArrowLeft
                size={24}
                className="group-hover:text-muted-foreground text-[#363636]"
              />
            </button>
          </div>
          <div className="group">
            <button
              aria-label="Tháng sau"
              onClick={() => {
                // next month
                if (month === 12) {
                  setMonth(1);
                  setYear((y) => y + 1);
                } else {
                  setMonth((m) => m + 1);
                }
              }}
              className="p-1 group-hover:border-primary h-10 w-10 flex items-center justify-center rounded-full border-2 border-[#363636]"
            >
              <ArrowRight
                size={24}
                className="group-hover:text-muted-foreground"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (
          <div key={d} className="text-gray-400 py-1">
            {d}
          </div>
        ))}
        {
          (() => {
            const totalDays = new Date(year, month, 0).getDate()
            const firstDayIndex = new Date(year, month - 1, 1).getDay() // 0 (Sun) - 6 (Sat)
            // previous month total days
            const prevMonthTotalDays = new Date(year, month - 1, 0).getDate()
            const totalCells = firstDayIndex + totalDays
            const trailingCount = (7 - (totalCells % 7)) % 7

            return (
              <>
                {Array.from({ length: firstDayIndex }).map((_, i) => {
                  const dayNum = prevMonthTotalDays - (firstDayIndex - 1) + i
                  return (
                    <div key={`prev-${i}`} className="py-2 text-sm text-gray-300">
                      {dayNum}
                    </div>
                  )
                })}

                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                  const isHighlighted = mockCalendar.highlighted.includes(day)
                  return (
                    <div
                      key={day}
                      className={`py-2 rounded-full w-10 h-10 flex flex-col justify-center items-center text-sm ${isHighlighted ? 'bg-yellow-500 text-white' : 'text-gray-700'
                        }`}
                    >
                      {day}
                    </div>
                  )
                })}

                {Array.from({ length: trailingCount }).map((_, i) => (
                  <div key={`next-${i}`} className="py-2 text-sm text-gray-300">
                    {i + 1}
                  </div>
                ))}
              </>
            )
          })()
        }
      </div>
    </div>
  );
}
