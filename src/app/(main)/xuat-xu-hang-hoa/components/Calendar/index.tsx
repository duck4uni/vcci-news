"use client";

import React, { useState, useMemo } from "react";
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
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { vi } from "date-fns/locale";

interface Event {
  date: Date;
  title: string;
  type: "event" | "training";
  description?: string;
}

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  // Dữ liệu mẫu
  const events: Event[] = [
    {
      date: new Date(2025, 10, 1),
      title: "Đào tạo nội bộ",
      type: "training",
      description: "Khóa học kỹ năng mềm",
    },
    {
      date: new Date(2025, 10, 3),
      title: "Họp cổ đông",
      type: "event",
      description: "Báo cáo Q3",
    },
    {
      date: new Date(2025, 10, 13),
      title: "Đào tạo kỹ thuật",
      type: "training",
      description: "React Advanced",
    },
    {
      date: new Date(2025, 10, 14),
      title: "Đào tạo an toàn",
      type: "training",
      description: "An toàn lao động",
    },
    {
      date: new Date(2025, 10, 20),
      title: "Hội thảo thuế",
      type: "event",
      description:
        "Cập nhật luật thuế thu nhập doanh nghiệp số 67/2025/QH15...",
    },
    {
      date: new Date(2025, 10, 28),
      title: "Sự kiện nội bộ",
      type: "event",
      description: "Team building",
    },
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = monthStart.getDay(); // 0 = CN, 1 = T2...
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - firstDayOfWeek);

  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }

  const getEventForDay = (date: Date) =>
    events.filter((e) => isSameDay(e.date, date));

  const formatMonthTitle = () => {
    return `THÁNG ${format(currentMonth, "M/yyyy")}`.toUpperCase();
  };

  return (
    <>
      <div className="w-full mx-auto bg-white rounded-lg p-4 ">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-3">
          <h2 className="text-[15px] font-bold text-[#063E8E]">
            {formatMonthTitle()}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 cursor-pointer rounded-full group border-3 border-[#363636] hover:border-[#063e8e] transition"
            >
              <ArrowLeft className="group-hover:text-[#e8c518] text-[#363636] w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 cursor-pointer rounded-full group border-3 border-[#363636] hover:border-[#063e8e] transition"
            >
              <ArrowRight className="group-hover:text-[#e8c518] text-[#363636] w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-600 mb-1">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
            <div key={day} className="py-2 text-[15px] text-[#063E8E]">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-sm">
          {days.map((day, idx) => {
            const dayEvents = getEventForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, today);
            const hasEvent = dayEvents.some((e) => e.type === "event");
            const hasTraining = dayEvents.some((e) => e.type === "training");

            return (
              <div
                key={idx}
                className={`
                  relative group aspect-square flex items-center justify-center rounded-full
                  ${!isCurrentMonth ? "text-[#A4A4A4]" : "text-[#333333]"}
                  ${hasEvent || hasTraining ? "text-white" : "text-[#333333]"}
                  ${isToday ? "text-red-600 font-bold" : ""}
                  hover:bg-gray-50 transition
                `}
              >
                <span className="relative z-10">{format(day, "d")}</span>

                {/* Event/Training dots */}
                {(hasEvent || hasTraining) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex">
                      {hasEvent && (
                        <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
                      )}
                      {hasTraining && (
                        <div className="w-10 h-10 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tooltip on hover */}
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
                            <div
                              className={`w-3 h-3 rounded-full ${
                                event.type === "event"
                                  ? "bg-blue-400"
                                  : "bg-yellow-400"
                              }`}
                            ></div>
                            <span className="font-medium">{event.title}</span>
                          </div>
                          {event.description && (
                            <p className="text-gray-300 mt-1 text-xs">
                              {event.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mũi tên nhọn HƯỚNG LÊN (chỉ vào ngày) */}
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 
                  w-0 h-0 
                  border-l-8 border-l-transparent 
                  border-r-8 border-r-transparent 
                  border-b-8 border-b-gray-900"
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Sự kiện</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Đào tạo</span>
          </div>
        </div>
      </div>
    </>
  );
}
