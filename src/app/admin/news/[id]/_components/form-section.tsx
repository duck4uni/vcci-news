import * as React from "react";

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#063e8e]/15 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[#063e8e]">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-gray-700">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
