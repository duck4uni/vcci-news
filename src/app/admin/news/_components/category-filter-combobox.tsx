"use client";

import { useState } from "react";
import {
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { type HeaderCategoryItem } from "@/mockdata/header-config";
import { formatHeaderCategoryOptionLabel } from "./utils";

export function CategoryFilterCombobox({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<HeaderCategoryItem & { depth: number }>;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value) ?? null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-10 w-full justify-between rounded-xl border-[#063e8e]/15 bg-white px-3 font-normal text-gray-700 hover:bg-white hover:text-gray-700 focus-visible:ring-[#063e8e]/30 lg:w-[220px]",
            !selectedOption && "text-gray-700",
          )}
        >
          <span className="truncate text-left">
            {selectedOption
              ? formatHeaderCategoryOptionLabel(selectedOption)
              : "T\u1ea5t c\u1ea3 danh m\u1ee5c"}
          </span>
          <ChevronsUpDown className="ml-3 h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] border-[#063e8e]/15 bg-white p-0 text-gray-700"
      >
        <Command className="bg-white text-gray-700">
          <CommandInput
            placeholder={"T\u00ecm danh m\u1ee5c hi\u1ec3n th\u1ecb"}
            className="text-gray-700 placeholder:text-gray-500"
          />
          <CommandList className="max-h-72">
            <CommandEmpty className="text-gray-700">
              {"Kh\u00f4ng t\u00ecm th\u1ea5y danh m\u1ee5c ph\u00f9 h\u1ee3p"}
            </CommandEmpty>
            <CommandItem
              value="all Tat ca danh muc"
              onSelect={() => {
                onChange("all");
                setOpen(false);
              }}
              className="gap-3 px-3 py-2 text-gray-700 data-[selected=true]:bg-[#063e8e]/10 data-[selected=true]:text-[#063e8e]"
            >
              <Check
                className={cn(
                  "h-4 w-4 text-[#063e8e]",
                  value === "all" ? "opacity-100" : "opacity-0",
                )}
              />
              <span className="truncate">{"T\u1ea5t c\u1ea3 danh m\u1ee5c"}</span>
            </CommandItem>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={`${option.id} ${option.name} ${option.type}`}
                onSelect={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className="gap-3 px-3 py-2 text-gray-700 data-[selected=true]:bg-[#063e8e]/10 data-[selected=true]:text-[#063e8e]"
              >
                <Check
                  className={cn(
                    "h-4 w-4 text-[#063e8e]",
                    value === option.id ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="truncate">
                  {formatHeaderCategoryOptionLabel(option)}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
