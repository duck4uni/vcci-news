"use client";

import * as React from "react";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function EventDatesDatePicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (dates: string[]) => void;
}) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const selectedDates = React.useMemo(
    () => value.map((d) => dayjs(d).toDate()).filter((d) => !Number.isNaN(d.getTime())),
    [value],
  );

  const handleMultipleSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      onChange([]);
      return;
    }
    const newDates = Array.from(
      new Set(dates.map((d) => dayjs(d).format("YYYY-MM-DD"))),
    ).sort();
    onChange(newDates);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-[#063e8e]/15 bg-white text-gray-700 hover:bg-[#063e8e]/10 hover:text-[#063e8e]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm ngày{value.length > 0 ? ` (${value.length})` : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <span className="text-base font-semibold text-[#063e8e]">
              {value.length > 0
                ? `Đã chọn ${value.length} ngày`
                : "Chọn các ngày cụ thể"}
            </span>
            {value.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onChange([])}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleMultipleSelect}
            className="w-full [--cell-size:3.5rem]"
            classNames={{
              root: "w-full",
              month: "flex w-full flex-col gap-4",
              month_caption: "flex h-12 w-full items-center justify-center px-2 text-xl font-bold text-[#063e8e]",
              nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
              button_previous: "h-12 w-12 select-none p-0 text-[#063e8e] hover:bg-[#063e8e]/10 aria-disabled:opacity-50 [&>svg]:size-6",
              button_next: "h-12 w-12 select-none p-0 text-[#063e8e] hover:bg-[#063e8e]/10 aria-disabled:opacity-50 [&>svg]:size-6",
              weekday: "flex-1 select-none rounded-md text-sm font-semibold uppercase text-gray-400",
              day: "group/day relative aspect-square h-full w-full select-none p-0 text-center text-lg",
              today: "ring-2 ring-[#063e8e]/40 rounded-full bg-[#063e8e]/5 text-[#063e8e] font-semibold",
              outside: "text-gray-300",
            }}
          />
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
            <span className="text-sm text-gray-400">
              Click ngày để chọn / bỏ chọn
            </span>
            <Button
              type="button"
              variant="default"
              size="default"
              className="bg-[#063e8e] hover:bg-[#063e8e]/90"
              onClick={() => setPopoverOpen(false)}
            >
              Xong
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
