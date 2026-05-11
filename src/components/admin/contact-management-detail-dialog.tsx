"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DetailField {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}

interface DetailSection {
  title: string;
  fields: DetailField[];
}

interface ContactManagementDetailDialogProps {
  open: boolean;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  sections: DetailSection[];
  onOpenChange: (open: boolean) => void;
}

export function ContactManagementDetailDialog({
  open,
  title,
  description,
  badge,
  sections,
  onOpenChange,
}: ContactManagementDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl rounded-3xl border-[#063e8e]/15 bg-white">
        <DialogHeader className="space-y-3">
          <div className="flex flex-col gap-3 pr-12 sm:flex-row sm:items-center sm:justify-between sm:pr-14">
            <DialogTitle className="text-xl text-[#063e8e]">{title}</DialogTitle>
            {badge}
          </div>
          {description ? (
            <DialogDescription className="text-sm leading-6 text-gray-600">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <div className="border-b border-[#063e8e]/12 pb-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#063e8e]">
                  {section.title}
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div
                    key={`${section.title}-${field.label}`}
                    className={cn(
                      "rounded-2xl border border-[#063e8e]/12 bg-[#063e8e]/[0.03] p-4",
                      field.fullWidth && "md:col-span-2",
                    )}
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                      {field.label}
                    </div>
                    <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
                      {field.value || "—"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
