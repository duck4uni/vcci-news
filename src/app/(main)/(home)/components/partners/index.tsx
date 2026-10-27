import Image from "next/image";

const PARTNERS_IMAGE = "/home/doi-tac/meu-partner.jpg";

export function Partners() {
  return (
    <aside className="flex w-full flex-col xl:contents">
      <div className="mb-5 flex items-start justify-between gap-3 xl:col-start-2 xl:row-start-1 xl:mb-0">
        <div>
          <h2 className="client-section-title uppercase text-[#24469c]">
            Đối tác
          </h2>
          <div className="mt-2.5 h-[4px] w-[40px] rounded-full bg-[#f7b500]" />
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] border border-[#edf1f7] bg-white shadow-[0_8px_20px_rgba(31,59,124,0.05)] xl:col-start-2 xl:row-start-2 xl:h-full xl:w-auto xl:justify-self-start">
          <Image
          src={PARTNERS_IMAGE}
          alt="Đối tác"
          fill
            priority
            sizes="(min-width: 1280px) 43vw, 100vw"
          className="object-contain object-left"
        />
      </div>
    </aside>
  );
}
