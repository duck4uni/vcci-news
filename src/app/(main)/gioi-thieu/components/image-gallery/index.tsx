'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Ảnh lớn */}
      <div
        className="w-full mb-4 overflow-hidden rounded-lg shadow-md cursor-zoom-in"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={images[activeIndex]}
          alt={`Image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      {/* Slider ảnh nhỏ */}
      <Swiper spaceBetween={10} slidesPerView={4} className="cursor-pointer">
        {images.map((img, index) => (
          <SwiperSlide key={index} onClick={() => setActiveIndex(index)}>
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`w-full object-cover rounded-lg border-2 transition-all duration-300
                ${activeIndex === index
                  ? 'border-blue-500 filter brightness-100'
                  : 'border-transparent filter brightness-50 hover:brightness-75'
                }`}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={images[activeIndex]}
            alt={`Image ${activeIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
  )
}
