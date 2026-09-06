export function MediaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[#063e8e]/10 bg-white shadow-[0_18px_45px_rgba(6,62,142,0.08)]">
      <div className="aspect-square animate-pulse bg-[#063e8e]/8" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#063e8e]/10" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[#063e8e]/10" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-[#063e8e]/10" />
      </div>
    </div>
  );
}
