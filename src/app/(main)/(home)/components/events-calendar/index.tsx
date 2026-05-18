'use client';

import { useHomePosts, type HomePostItem } from "@/app/(main)/(home)/lib/use-home-posts";
import { addMonths, format, getDay, startOfMonth, subMonths } from "date-fns";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const formatDateTime = (value: string) =>
  value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "Đang cập nhật";

const isTrainingEvent = (item: HomePostItem) =>
  item.categories.some((category) => {
    const key = `${category.name} ${category.slug} ${category.url}`.toLowerCase();
    return key.includes("đào tạo") || key.includes("dao-tao");
  });

function EventsCalendar({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { eventCalendarPosts } = useHomePosts();

  const firstEventDate = eventCalendarPosts[0]?.registrationDeadline
    ? new Date(eventCalendarPosts[0].registrationDeadline)
    : new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1),
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const monthEvents = useMemo(
    () =>
      eventCalendarPosts.filter((item) => {
        const date = new Date(item.registrationDeadline);
        return (
          date.getMonth() === currentMonth.getMonth() &&
          date.getFullYear() === currentMonth.getFullYear()
        );
      }),
    [currentMonth, eventCalendarPosts],
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
    const map = new Map<string, HomePostItem[]>();

    monthEvents.forEach((item) => {
      const key = dayjs(item.registrationDeadline).format("YYYY-MM-DD");
      const existing = map.get(key) ?? [];
      existing.push(item);
      map.set(key, existing);
    });

    return map;
  }, [monthEvents]);

  const selectedEvents = selectedDateKey ? eventMap.get(selectedDateKey) ?? [] : [];
  const highlightedEvent = selectedEvents[0] ?? monthEvents[0];

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

      <div className={cn("h-[4px] w-[60px] rounded-full bg-[#f7b500]", compact ? "mt-2.5" : "mt-3")} />
      <div className={cn("border-t border-[#ebf0f8] pt-3.5", compact ? "mt-3" : "mt-4")}>
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
            const tooltip = items.map((item) => item.title).join("\n");
            const selectable = inMonth && items.length > 0;
            const selected = selectable && selectedDateKey === key;

            return (
              <div
                key={key}
                className="relative flex items-center justify-center"
              >
                <button
                  type="button"
                  title={tooltip || undefined}
                  disabled={!selectable}
                  onClick={() => setSelectedDateKey(key)}
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full transition-all ${
                    !inMonth
                      ? "text-[#c9d2e2]"
                      : hasTraining
                        ? "bg-[#ffbc11] font-semibold text-[#163b73]"
                        : hasEvent
                          ? "bg-[#1e3f9a] font-semibold text-white"
                          : ""
                  } ${
                    selectable
                      ? "cursor-pointer hover:ring-2 hover:ring-[#f7b500]/60"
                      : "cursor-default"
                  } ${selected ? "ring-2 ring-[#f7b500] ring-offset-2" : ""}`}
                >
                  {format(day, "d")}
                </button>

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

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-medium text-[#45608f]">
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
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                isTrainingEvent(highlightedEvent) ? "bg-[#ffbc11]" : "bg-[#1e3f9a]"
              }`}
            />
            <div className="min-w-0 space-y-1">
              <p>
                Hạn đăng ký: {formatDateTime(highlightedEvent.registrationDeadline)} · Chi phí:{" "}
                {highlightedEvent.participationFee || "Đang cập nhật"}
              </p>
              <p>Địa điểm: {highlightedEvent.location || "Đang cập nhật"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default EventsCalendar;
