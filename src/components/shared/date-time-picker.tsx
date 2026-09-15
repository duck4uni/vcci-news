"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TimePicker } from "@/components/shared/time-picker";

function splitDateTime(value: string): { date: string; time: string } {
  if (!value) return { date: "", time: "" };

  // Hỗ trợ cả "T" và space làm separator (YYYY-MM-DDTHH:mm hoặc YYYY-MM-DD HH:mm:ss)
  const separator = value.includes("T") ? "T" : " ";
  const [date, time] = value.split(separator);

  if (!time) return { date: date ?? "", time: "" };

  // Trim seconds & timezone (VD: 19:39:00.000Z -> 19:39)
  const cleanTime = time.slice(0, 5);
  return { date: date ?? "", time: cleanTime };
}

function combineDateTime(date: string, time: string): string {
  if (!date && !time) return "";
  if (!time) return date;
  if (!date) return "";
  return `${date}T${time}`;
}

export function DateTimePicker({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  // Giữ date/time trong local state để không mất khi pick time trước date
  const initial = splitDateTime(value);
  const [date, setDate] = React.useState(initial.date);
  const [time, setTime] = React.useState(initial.time);

  // Sync từ prop khi value thay đổi từ bên ngoài (VD: load data xong)
  React.useEffect(() => {
    const { date: nextDate, time: nextTime } = splitDateTime(value);
    setDate(nextDate);
    setTime(nextTime);
  }, [value]);

  const emit = React.useCallback(
    (nextDate: string, nextTime: string) => {
      setDate(nextDate);
      setTime(nextTime);
      // Nếu pick time mà chưa có date → auto-fill hôm nay
      if (!nextDate && nextTime) {
        const today = dayjs().format("YYYY-MM-DD");
        onChange(`${today}T${nextTime}`);
        return;
      }
      onChange(combineDateTime(nextDate, nextTime));
    },
    [onChange],
  );

  return (
    <div className={cn("flex gap-2", className)}>
      <Input
        type="date"
        value={date}
        onChange={(event) => emit(event.target.value, time)}
        className="rounded-xl border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700 focus-visible:ring-[#063e8e]/30 [color-scheme:light]"
      />
      <TimePicker
        value={time}
        onChange={(newTime) => emit(date, newTime)}
      />
    </div>
  );
}
