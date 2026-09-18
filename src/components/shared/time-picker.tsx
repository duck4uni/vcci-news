"use client";

import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function pad(num: number): string {
  return num.toString().padStart(2, "0");
}

export function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    if (value) {
      // Trim seconds & timezone (VD: 19:39:00.000Z -> 19:39)
      const cleanTime = value.slice(0, 5);
      const [h, m] = cleanTime.split(":").map(Number);
      setHour(Number.isNaN(h) ? null : h);
      // Round minute về bội số 5 gần nhất (grid chỉ có 0,5,10,...,55)
      const roundedM = Number.isNaN(m) ? null : Math.round(m / 5) * 5;
      setMinute(roundedM === 60 ? 55 : roundedM);
    } else {
      setHour(null);
      setMinute(null);
    }
  }, [open, value]);

  const handleSelectHour = (h: number) => {
    setHour(h);
    if (minute !== null) {
      onChange(`${pad(h)}:${pad(minute)}`);
      setOpen(false);
    }
  };

  const handleSelectMinute = (m: number) => {
    setMinute(m);
    if (hour !== null) {
      onChange(`${pad(hour)}:${pad(m)}`);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setHour(null);
    setMinute(null);
    onChange("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-xl border px-3 py-1 text-base shadow-sm transition-colors md:text-sm",
            "border-[#063e8e]/15 bg-white text-gray-700 placeholder:text-gray-700",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#063e8e]/30",
          )}
        >
          <Clock className="h-4 w-4 shrink-0 text-[#063e8e]" />
          <span className={cn("truncate", value ? "text-gray-700" : "text-gray-400")}>
            {value || "HH:mm"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-3" align="start">
        <div className="flex gap-4">
          <div>
            <p className="mb-2 text-center text-sm font-semibold text-[#063e8e]">Giờ</p>
            <div className="grid grid-cols-5 gap-1">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleSelectHour(h)}
                  className={cn(
                    "h-8 w-9 rounded-md text-sm transition-colors",
                    hour === h
                      ? "bg-[#063e8e] font-semibold text-white"
                      : "bg-[#063e8e]/5 text-gray-700 hover:bg-[#063e8e]/15",
                  )}
                >
                  {pad(h)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-center text-sm font-semibold text-[#063e8e]">Phút</p>
            <div className="grid grid-cols-3 gap-1">
              {MINUTES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectMinute(m)}
                  className={cn(
                    "h-8 w-9 rounded-md text-sm transition-colors",
                    minute === m
                      ? "bg-[#063e8e] font-semibold text-white"
                      : "bg-[#063e8e]/5 text-gray-700 hover:bg-[#063e8e]/15",
                  )}
                >
                  {pad(m)}
                </button>
              ))}
            </div>
          </div>
        </div>
        {value && (
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-700">Đã chọn: {value}</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Xóa
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
