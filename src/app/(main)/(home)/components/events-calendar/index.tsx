'use client';

import Link from "next/link";
import { addMonths, format, getDay, startOfMonth, subMonths } from "date-fns";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useEventCalendarPosts, type HomePostItem } from "@/app/(main)/(home)/lib/use-home-posts";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const formatDateTime = (value: string) =>
  value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "Đang cập nhật";

const getEventDateRange = (item: HomePostItem) => {
  // Ưu tiên event_dates (ngày cụ thể)
  if (item.eventDates && item.eventDates.length > 0) {
    return item.eventDates.map((d) => dayjs(d).format("YYYY-MM-DD")).filter(Boolean);
  }

  const startedAt = item.startedAt ? dayjs(item.startedAt) : null;
  const endedAt = item.endedAt ? dayjs(item.endedAt) : null;

  if (startedAt && endedAt) {
    const dates: string[] = [];
    let current = startedAt;
    while (current.isBefore(endedAt) || current.isSame(endedAt, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return dates;
  }

  if (startedAt) {
    return [startedAt.format("YYYY-MM-DD")];
  }

  if (endedAt) {
    return [endedAt.format("YYYY-MM-DD")];
  }

  // Fallback to registrationDeadline
  if (item.registrationDeadline) {
    return [dayjs(item.registrationDeadline).format("YYYY-MM-DD")];
  }

  return [];
};

const isTrainingEvent = (item: HomePostItem) =>
  item.categories.some((category) => {
    const key = `${category.name} ${category.slug} ${category.url}`.toLowerCase();
    return key.includes("đào tạo") || key.includes("dao-tao");
  });

const getDayVariant = (items: HomePostItem[]) => {
  const hasTraining = items.some((item) => isTrainingEvent(item));
  const hasEvent = items.some((item) => !isTrainingEvent(item));

  if (hasTraining && hasEvent) return "mixed";
  if (hasTraining) return "training";
  if (hasEvent) return "event";
  return "default";
};

function EventsCalendar({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const today = dayjs();
  const todayKey = today.format("YYYY-MM-DD");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const eventCalendarQuery = useEventCalendarPosts(currentMonth);
  const monthEvents = useMemo(() => eventCalendarQuery.data ?? [], [eventCalendarQuery.data]);

  const viewingCurrentMonth =
    currentMonth.getMonth() === today.month() && currentMonth.getFullYear() === today.year();
  const defaultSelectedKey = viewingCurrentMonth ? todayKey : null;

  // Initialize selectedDateKey when month changes
  useEffect(() => {
    setSelectedDateKey(defaultSelectedKey);
  }, [defaultSelectedKey]);

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
    const map = new Map<string, HomePostItem[]>();

    monthEvents.forEach((item) => {
      const eventDates = getEventDateRange(item);

      eventDates.forEach((dateKey) => {
        const existing = map.get(dateKey) ?? [];
        if (!existing.some((e) => e.id === item.id)) {
          existing.push(item);
        }
        map.set(
          dateKey,
          existing.sort((left, right) => {
            const leftStart = dayjs(left.startedAt || left.endedAt || left.registrationDeadline).valueOf();
            const rightStart = dayjs(right.startedAt || right.endedAt || right.registrationDeadline).valueOf();
            return leftStart - rightStart;
          }),
        );
      });
    });

    return map;
  }, [monthEvents]);

  const selectedEvents = selectedDateKey ? eventMap.get(selectedDateKey) ?? [] : [];
  const highlightedEvents = selectedEvents.length > 0 ? selectedEvents : monthEvents.slice(0, 1);

  return (
    <aside
      className={cn(
        "w-full rounded-[28px] bg-white text-[#24469c] shadow-[0_18px_38px_rgba(16,61,130,0.16)]",
        compact ? "p-4" : "p-4 md:p-5",
        className ?? "xl:w-[28%] xl:min-w-[320px]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            className={cn(
              "uppercase",
              compact
                ? "text-[26px] font-bold leading-tight tracking-normal"
                : "client-section-title",
            )}
          >
            Lịch sự kiện
          </h2>
          <p
            className={cn(
              "mt-1.5 text-[12px] uppercase text-[#7f8eab]",
              compact ? "tracking-[0.18em]" : "tracking-[0.28em]",
            )}
          >
            {`THÁNG ${format(currentMonth, "MM/yyyy")}`}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dbe4f2] text-[#7f8eab] transition-colors hover:border-[#24469c] hover:text-[#24469c]"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dbe4f2] text-[#7f8eab] transition-colors hover:border-[#24469c] hover:text-[#24469c]"
            aria-label="Tháng sau"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={cn("mt-3 h-[4px] w-[60px] rounded-full bg-[#f7b500]", compact && "mt-2.5")} />

      <div className={cn("mt-4 border-t border-[#ebf0f8] pt-3.5", compact && "mt-3")}>
        {eventCalendarQuery.isLoading ? (
          <div className="mb-3 rounded-[16px] bg-[#f7f9fd] p-3 text-[12px] text-[#3d547f]">
            Đang tải dữ liệu tháng này...
          </div>
        ) : null}

        <div className="grid grid-cols-7 gap-y-2.5 text-center text-[11px] font-semibold uppercase text-[#9aabc6]">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-2.5 grid grid-cols-7 gap-y-3 text-center text-[13px] text-[#5e7090]">
          {days.map((day) => {
            const key = dayjs(day).format("YYYY-MM-DD");
            const items = eventMap.get(key) ?? [];
            const inMonth = day.getMonth() === currentMonth.getMonth();
            const selectable = inMonth && items.length > 0;
            const selected = selectable && selectedDateKey === key;
            const isToday = key === todayKey;
            const variant = getDayVariant(items);

            const dayButton = (
              <button
                type="button"
                disabled={!selectable}
                onClick={() => setSelectedDateKey(key)}
                aria-label={
                  selectable
                    ? `${format(day, "dd/MM/yyyy")} có ${items.length} hoạt động`
                    : format(day, "dd/MM/yyyy")
                }
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-all sm:h-9 sm:w-9",
                  !inMonth && "text-[#c9d2e2]",
                  isToday && inMonth && !selectable && "bg-[#eef3fb] font-semibold text-[#24469c] ring-2 ring-[#d7e2f5]",
                  variant === "training" && "bg-[#ffbc11] font-semibold text-[#163b73]",
                  variant === "event" && "bg-[#1e3f9a] font-semibold text-white",
                  variant === "mixed" && "bg-[#1e3f9a] font-semibold text-white",
                  selectable
                    ? "cursor-pointer hover:scale-[1.04] hover:shadow-[0_10px_20px_rgba(36,70,156,0.16)]"
                    : "cursor-default",
                  selected && "ring-2 ring-[#f7b500] ring-offset-2 ring-offset-white",
                  isToday &&
                    selectable &&
                    !selected &&
                    "ring-2 ring-[#9fb3db] ring-offset-2 ring-offset-white",
                )}
              >
                {format(day, "d")}
                {items.length > 1 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f7b500] px-1 text-[10px] font-bold leading-none text-[#163b73] shadow-sm">
                    {items.length}
                  </span>
                ) : null}
                {isToday ? (
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7f8eab]"></span>
                ) : null}
              </button>
            );

            return (
              <div key={key} className="relative flex items-center justify-center">
                {selectable ? (
                  <HoverCard openDelay={90} closeDelay={120}>
                    <HoverCardTrigger asChild>{dayButton}</HoverCardTrigger>
                    <HoverCardContent
                      side="top"
                      align="center"
                      sideOffset={12}
                      className="hidden w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-[20px] border border-[#d9e3f2] bg-white p-0 text-[#234171] shadow-[0_20px_45px_rgba(16,61,130,0.18)] lg:block"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-[#edf2f9] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7f8eab]">
                          {format(day, "dd/MM/yyyy")}
                        </p>
                        <p className="shrink-0 text-sm font-semibold text-[#24469c]">
                          {items.length === 1 ? "1 hoạt động" : `${items.length} hoạt động`}
                        </p>
                      </div>

                      <div className="calendar-hover-scroll max-h-[260px] space-y-2.5 overflow-y-auto px-3 py-3">
                        {items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.externalLink || "#"}
                            className="block rounded-[16px] border border-[#e3ebf8] bg-[#fbfdff] px-3.5 py-3 transition-colors hover:border-[#c9d7ee] hover:bg-white"
                          >
                            <div className="flex items-start gap-2.5">
                              <span
                                className={cn(
                                  "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                                  isTrainingEvent(item) ? "bg-[#ffbc11]" : "bg-[#1e3f9a]",
                                )}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-[#1f3768]">
                                  {item.title}
                                </p>
                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6f84aa]">
                                  <span>Hạn đăng ký: {formatDateTime(item.registrationDeadline)}</span>
                                  <span>Chi phí: {item.participationFee || "Miễn phí"}</span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6f84aa]">
                                  <span>Địa điểm: {item.location || "Đang cập nhật"}</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  dayButton
                )}

                {items.length > 0 && inMonth ? (
                  <span
                    className={cn(
                      "absolute bottom-[-5px] h-1.5 w-1.5 rounded-full",
                      variant === "training" && "bg-[#ffbc11]",
                      variant === "event" && "bg-[#1e3f9a]",
                      variant === "mixed" && "bg-[#24469c] shadow-[0_0_0_2px_#ffbc11]",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-[12px] font-medium text-[#45608f]">
        <div className="flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1e3f9a]" />
          <span>Sự kiện</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbc11]" />
          <span>Đào tạo</span>
        </div>
      </div>

      {highlightedEvents.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-[#f7f9fd] p-3.5 text-[12px] leading-5 text-[#3d547f] lg:hidden">
          {selectedEvents.length > 1 ? (
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#e5edf8] pb-2.5">
              <p className="text-[12px] font-semibold text-[#24469c]">
                {selectedEvents.length} hoạt động trong ngày này
              </p>
            </div>
          ) : null}

          <div className="space-y-3">
            {highlightedEvents.map((item) => (
              <div key={item.id} className="rounded-[14px] bg-white/70 px-3 py-2.5">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                      isTrainingEvent(item) ? "bg-[#ffbc11]" : "bg-[#1e3f9a]",
                    )}
                  />
                  <div className="min-w-0 space-y-1">
                    <Link
                      href={item.externalLink || "#"}
                      className="line-clamp-2 text-[13px] font-semibold leading-5 text-[#1f3768] hover:text-[#24469c]"
                    >
                      {item.title}
                    </Link>
                    <p>
                      Hạn đăng ký: {formatDateTime(item.registrationDeadline)} · Chi phí:{" "}
                      {item.participationFee || "Miễn phí"}
                    </p>
                    <p>Địa điểm: {item.location || "Đang cập nhật"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .calendar-hover-scroll {
          scrollbar-width: thin;
          scrollbar-color: #9fb3db #eef3fb;
        }

        .calendar-hover-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .calendar-hover-scroll::-webkit-scrollbar-track {
          border-radius: 9999px;
          background: #eef3fb;
        }

        .calendar-hover-scroll::-webkit-scrollbar-thumb {
          border: 2px solid #eef3fb;
          border-radius: 9999px;
          background: linear-gradient(180deg, #24469c 0%, #5a76bd 100%);
        }

        .calendar-hover-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #1d3a86 0%, #4f6bb2 100%);
        }
      `}</style>
    </aside>
  );
}

export default EventsCalendar;
