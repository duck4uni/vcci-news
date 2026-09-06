export function NewsFormLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-[#063e8e]/10" />
      </div>

      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-[#063e8e]/15 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 space-y-2">
            <div className="h-5 w-48 animate-pulse rounded bg-[#063e8e]/10" />
            <div className="h-4 w-72 animate-pulse rounded bg-[#063e8e]/[0.05]" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-11 animate-pulse rounded-xl bg-[#063e8e]/[0.05]" />
            <div className="h-11 animate-pulse rounded-xl bg-[#063e8e]/[0.05]" />
            <div className="h-11 animate-pulse rounded-xl bg-[#063e8e]/[0.05] md:col-span-2" />
            <div className="h-40 animate-pulse rounded-2xl bg-[#063e8e]/[0.05] md:col-span-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
