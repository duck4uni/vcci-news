"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGetEvents } from "@/api/endpoints/event";
import { EventApiResponse } from "@/api/types/event";

export default function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const { data } = useGetEvents<EventApiResponse>();
  const events = data?.responseData.rows ?? [];

  // Calculate the days to display in the current month grid
  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const firstDayOfWeek = start.getDay(); // Sunday = 0
    const gridStart = new Date(start);
    gridStart.setDate(start.getDate() - firstDayOfWeek);

    const result: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + i);
      result.push(day);
    }
    return result;
  }, [currentMonth]);

  // Helper: get all events for a specific day
  const getEventForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_time), date));

  // Month title formatting (Vietnamese)
  const formatMonthTitle = () => `THÁNG ${format(currentMonth, "M/yyyy")}`.toUpperCase();

  return (
    <div className="w-full mx-auto bg-white rounded-lg p-4">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-4 px-3">
        <h2 className="text-[15px] font-bold text-[#063E8E]">{formatMonthTitle()}</h2>

        {/* Month navigation buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 rounded-full group border border-[#363636] hover:border-[#063e8e] transition"
          >
            <ArrowLeft className="group-hover:text-[#e8c518] text-[#363636] w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 rounded-full group border border-[#363636] hover:border-[#063e8e] transition"
          >
            <ArrowRight className="group-hover:text-[#e8c518] text-[#363636] w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ===== DAYS OF WEEK ===== */}
      <div className="grid grid-cols-7 text-center text-sm font-medium mb-1">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
          <div key={day} className="py-2 text-[15px] text-[#063E8E]">
            {day}
          </div>
        ))}
      </div>

      {/* ===== CALENDAR GRID ===== */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map((day, idx) => {
          const dayEvents = getEventForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);

          // Example condition: color days that have "B2B" events
          const hasB2BEvent = dayEvents.some((e) => e.type === "B2B");

          return (
            <div
              key={idx}
              className={`
                relative group aspect-square flex items-center justify-center rounded-full
                ${!isCurrentMonth ? "text-gray-400" : ""}
                ${hasB2BEvent ? "bg-blue-600 text-white" : "text-[#333333]"}
                ${isToday ? "text-red-600 font-bold" : ""}
                transition
              `}
            >
              {/* Day number */}
              <span className="relative z-10">{format(day, "d")}</span>

              {/* Tooltip showing event details on hover */}
              {dayEvents.length > 0 && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                    w-64 p-3 bg-gray-900 text-white text-xs rounded-lg
                    shadow-xl opacity-0 pointer-events-none
                    group-hover:opacity-90 transition-opacity z-50"
                >
                  <div className="space-y-2">
                    {dayEvents.map((event, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-700 border-opacity-20 last:border-0 pb-2 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-400" />
                          <span className="font-medium">{event.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tooltip arrow */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1
                      w-0 h-0
                      border-l-8 border-l-transparent
                      border-r-8 border-r-transparent
                      border-b-8 border-b-gray-900"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== LEGEND ===== */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full" />
          <span>Sự kiện</span>
        </div>
      </div>
    </div>
  );
}
