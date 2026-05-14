'use client';

import {
  type AdminNewsItem,
  getAdminNewsSeed,
} from "@/mockdata/admin-news";
import { addMonths, format, getDay, startOfMonth, subMonths } from "date-fns";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const eventItems = getAdminNewsSeed()
  .filter(
    (item) =>
      item.type === "tintuc" &&
      !item.is_hidden &&
      item.started_at,
  )
  .sort(
    (left, right) =>
      new Date(left.started_at).getTime() - new Date(right.started_at).getTime(),
  );

function isTrainingEvent(item: AdminNewsItem) {
  return item.tagsearch_values.some((tag) => tag.toLowerCase().includes("đào tạo"));
}

function EventsCalendar() {
  const firstEventDate = eventItems[0]?.started_at
    ? new Date(eventItems[0].started_at)
    : new Date("2026-11-01T00:00:00");

  const [currentMonth, setCurrentMonth] = useState(
    new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1),
  );

  const monthEvents = useMemo(
    () =>
      eventItems.filter((item) => {
        const date = new Date(item.started_at);
        return (
          date.getMonth() === currentMonth.getMonth() &&
          date.getFullYear() === currentMonth.getFullYear()
        );
      }),
    [currentMonth],
  );

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const startWeekDay = getDay(monthStart);
    const start = new Date(monthStart);
    start.setDate(monthStart.getDate() - startWeekDay);

    return Array.from({ length: 35 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [currentMonth]);

  const eventMap = useMemo(() => {
    const map = new Map<string, AdminNewsItem[]>();

    monthEvents.forEach((item) => {
      const key = dayjs(item.started_at).format("YYYY-MM-DD");
      const existing = map.get(key) ?? [];
      existing.push(item);
      map.set(key, existing);
    });

    return map;
  }, [monthEvents]);

  const highlightedEvent = monthEvents[0];

  return (
    <aside className="w-full rounded-[28px] bg-white p-4 text-[#24469c] shadow-[0_18px_38px_rgba(16,61,130,0.16)] md:p-5 xl:w-[28%] xl:min-w-[320px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[28px] font-extrabold uppercase tracking-tight md:text-[34px]">
            Lịch sự kiện
          </h2>
          <p className="mt-1.5 text-[12px] uppercase tracking-[0.28em] text-[#7f8eab]">
            {`THÁNG ${format(currentMonth, "MM/yyyy")}`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dbe4f2] text-[#7f8eab] transition-colors hover:border-[#24469c] hover:text-[#24469c]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dbe4f2] text-[#7f8eab] transition-colors hover:border-[#24469c] hover:text-[#24469c]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 h-[4px] w-[60px] rounded-full bg-[#f7b500]" />
      <div className="mt-4 border-t border-[#ebf0f8] pt-3.5">
        <div className="grid grid-cols-7 gap-y-2.5 text-center text-[11px] font-semibold uppercase text-[#9aabc6]">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-7 gap-y-2.5 text-center text-[13px] text-[#5e7090]">
          {days.map((day) => {
            const key = dayjs(day).format("YYYY-MM-DD");
            const items = eventMap.get(key) ?? [];
            const inMonth = day.getMonth() === currentMonth.getMonth();
            const hasTraining = items.some((item) => isTrainingEvent(item));
            const hasEvent = items.length > 0 && !hasTraining;

            return (
              <div key={key} className="relative flex items-center justify-center">
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full ${
                    !inMonth
                      ? "text-[#c9d2e2]"
                      : hasTraining
                        ? "bg-[#ffbc11] font-semibold text-[#163b73]"
                        : hasEvent
                          ? "bg-[#1e3f9a] font-semibold text-white"
                          : ""
                  }`}
                >
                  {format(day, "d")}
                </span>

                {items.length > 0 && !hasTraining && inMonth ? (
                  <span className="absolute bottom-[-5px] h-1.5 w-1.5 rounded-full bg-[#1e3f9a]" />
                ) : null}

                {items.length > 0 && hasTraining && inMonth ? (
                  <span className="absolute bottom-[-5px] h-1.5 w-1.5 rounded-full bg-[#ffbc11]" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-5 text-[12px] font-medium text-[#45608f]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1e3f9a]" />
          <span>Sự kiện</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbc11]" />
          <span>Đào tạo</span>
        </div>
      </div>

      {highlightedEvent ? (
        <div className="mt-4 rounded-[16px] bg-[#f7f9fd] p-3.5 text-[12px] leading-5 text-[#3d547f]">
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 h-2.5 w-2.5 rounded-full ${
                isTrainingEvent(highlightedEvent) ? "bg-[#ffbc11]" : "bg-[#1e3f9a]"
              }`}
            />
            <p className="line-clamp-3">{highlightedEvent.title}</p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default EventsCalendar;
