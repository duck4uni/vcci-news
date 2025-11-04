"use client";

import React from "react";
import ReactCountryFlag from "react-country-flag";
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
            <h3 className="text-2xl font-semibold text-primary mb-0">
              {activeRegion?.name ?? ""}
            </h3>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="bg-gray-50 p-4 flex items-center justify-center">
                <div className="relative">
                  <img
                    src={displayedImage}
                    alt={activeRegion?.name ?? "Map"}
                    className="w-full h-auto object-contain block mx-auto"
                    style={{ maxHeight: 520 }}
                  />
                  {/* Country Flags*/}
                  {active == "dong-nam-a" && (
                    <>
                      <div className="absolute top-[17%] left-[29%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="MM"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[23%] left-[40%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="LA"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[20%] left-[43%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="VN"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[38%] left-[43%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="KH"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[27%] left-[68%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="PH"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[55%] left-[40%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="MY"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[55%] left-[57%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="BN"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[62%] left-[47%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="SG"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[65%] left-[57%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="ID"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[32%] left-[36%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="TH"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                    </>
                  )}
                  {active == "dong-bac-a" && (
                    <>
                      <div className="absolute top-[40%] left-[60%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="CN"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[37%] left-[77%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="KR"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[34%] left-[87%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="JP"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[60%] left-[73%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="TW"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                    </>
                  )}
                  {active == "nam-a" && (
                    <>
                      <div className="absolute top-[40%] left-[60%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="IN"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                    </>
                  )}
                  {active == "bac-my" && (
                    <>
                      <div className="absolute top-[60%] left-[40%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="US"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                      <div className="absolute top-[40%] left-[40%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="CA"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                    </>
                  )}
                  {active == "chau-uc" && (
                    <>
                      <div className="absolute top-[30%] left-[40%] w-4 h-4 md:w-6 md:h-6 rounded-full">
                        <ReactCountryFlag
                          countryCode="AU"
                          svg
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          className="rounded-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
