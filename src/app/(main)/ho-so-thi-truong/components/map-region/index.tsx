"use client";

import React from "react";

type Region = { id: string; name: string; image?: string };

export const DEFAULT_REGIONS: Region[] = [
  { id: "dong-nam-a", name: "Đông Nam Á", image: "/Dong-Nam-A-scaled.webp" },
  { id: "dong-bac-a", name: "Đông Bắc Á", image: "/Dong-Bac-A-scaled.webp" },
  { id: "nam-a", name: "Nam Á", image: "/Nam-a-scaled.webp" },
  { id: "tay-a", name: "Tây Á", image: "/Tay-a-scaled.webp" },
  { id: "bac-my", name: "Bắc Mỹ", image: "/Bac-My-1-scaled.webp" },
  { id: "nam-my", name: "Nam Mỹ", image: "/Nam-My-1-scaled.webp" },
  { id: "chau-au", name: "Châu Âu", image: "/Chau-Au-scaled.jpg.webp" },
  { id: "chau-uc", name: "Châu Úc", image: "/Chau-Uc-scaled.jpg.webp" },
  { id: "chau-phi", name: "Châu Phi", image: "/Chau-Phi-1-scaled.jpg.webp" },
];

type Props = {
  imageSrc?: string; // relative to /public — default `images/map-se-asia.png`
  regions?: Region[];
  // controlled props (optional)
  active?: string | null;
  onSelect?: (id: string) => void;
};

export default function MapRegion({
  imageSrc = "/images/map-se-asia.png",
  regions = DEFAULT_REGIONS,
  active: activeProp,
}: Props) {
  // controlled usage: prefer activeProp; fallback to first region id
  const active = activeProp ?? regions[0]?.id ?? null;

  const activeRegion = regions.find((r) => r.id === active);
  const displayedImage = activeRegion?.image ?? imageSrc;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow-sm rounded-md overflow-hidden p-6">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-0">{activeRegion?.name ?? ""}</h3>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="bg-gray-50 p-4 flex items-center justify-center">
                <img
                  src={displayedImage}
                  alt={activeRegion?.name ?? "Map"}
                  className="w-full h-auto object-contain block mx-auto"
                  style={{ maxHeight: 520 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
