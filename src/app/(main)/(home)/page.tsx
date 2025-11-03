'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BASE_URL from '@/links/index'
import NewsContent from './components/card-news'
import { Spinner } from '@/components/ui'
import { useGetCategory } from '@/api/endpoints/category'
import { useGetNews } from '@/api/endpoints/news'
import { GetCategoryAdminResponseType } from '@/api/types/category'
import { GetNewsAdminResponseType } from '@/api/types/news'
import EventCalendar from './components/event-calendar'

const Home = () => {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [submitSearch, setSubmitSearch] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState<number>(3)
  const swiperRef = useRef<SwiperType | null>(null)

  const { data: categoryData } = useGetCategory<GetCategoryAdminResponseType>()
  const { data: allData, isLoading } = useGetNews<GetNewsAdminResponseType>({
    pageSize: '999',
    filters: submitSearch ? `title @=${submitSearch}` : undefined,
  })

  const rows = allData?.responseData?.rows ?? []
  const filteredRows = tab === 'all' ? rows : rows.filter((n) => n.category === tab)

  useEffect(() => {
    const getSlides = (w: number) => {
      if (w >= 1024) return 3
      if (w >= 640) return 2
      return 1
    }
    const update = () => setSlidesPerView(getSlides(window.innerWidth))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  if (isLoading)
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Spinner />
      </div>
    )

  return (
    <>
      {/* Banner */}
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) =>
          setCurrentIndex(typeof s.realIndex === 'number' ? s.realIndex : s.activeIndex)
        }
      >
        <SwiperSlide>
          <img
            src="https://vcci-hcm.org.vn/wp-content/uploads/2025/10/1.1.-Hero-Banner-CEO-2025-Bi-Sai-Nam-2025-Nhe-2560x720-Px.jpg"
            alt="Banner"
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://vcci-hcm.org.vn/wp-content/uploads/2022/07/Landscape-HCM_3-01.png"
            alt="Banner"
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] object-cover"
          />
        </SwiperSlide>
      </Swiper>

      <div className="container mx-auto px-3 sm:px-6 lg:px-10 space-y-12">
        {/* Featured News */}
        <section>
          <div className="flex flex-col items-center py-8 text-center">
            <h1 className="text-app-blue text-[20px] sm:text-[24px] md:text-[28px] uppercase font-bold text-blue-900">
              Tin Nổi Bật
            </h1>
            <div className="w-16 h-[3px] bg-blue-900 mt-2 rounded-full"></div>
          </div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            breakpoints={{
              0: { slidesPerView: 1.1, spaceBetween: 10 },
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="pb-5"
          >
            {rows.map((news) => (
              <SwiperSlide key={news.id}>
                <a
                  href={`/tin-tuc/${news.id}`}
                  className="relative block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                    alt={news.title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-20 md:h-24 bg-linear-to-t from-black/80 to-transparent flex items-center justify-center p-3">
                    <p className="text-white text-center font-semibold line-clamp-2 text-sm sm:text-base leading-snug">
                      {news.title}
                    </p>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Tin tức + Liên kết nhanh */}
        <section className="flex flex-col lg:flex-row gap-8">
          {/* Left */}
          <div className="flex-1">
            <div className="pb-4 flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-blue-900">
                Tin tức
              </h2>
              <a href="#" className="text-blue-900 hover:underline text-sm sm:text-base">
                {'>>'}
              </a>
            </div>
            <hr className="border-blue-900 mb-4" />

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-1/2 bg-gray-500 flex items-center justify-center rounded-lg p-4 min-h-[180px] sm:min-h-[220px]">
                <p className="text-white text-center">Khung tin tức VIP</p>
              </div>

              <div className="w-full md:w-1/2">
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                  <button
                    className={`flex-1 px-3 sm:px-4 py-2 rounded-md border text-sm transition-colors ${tab === 'all'
                      ? 'border-blue-700 bg-blue-50 text-blue-800 font-semibold'
                      : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    onClick={() => setTab('all')}
                  >
                    Tất cả
                  </button>
                  {categoryData?.responseData.rows.slice(0, 3).map((category) => (
                    <button
                      key={category.id}
                      className={`flex-1 px-3 sm:px-4 py-2 rounded-md border text-sm transition-colors ${category.name === tab
                        ? 'border-blue-700 bg-blue-50 text-blue-800 font-semibold'
                        : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      onClick={() => setTab(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {filteredRows.slice(0, 5).map((news) => (
                  <NewsContent key={news.id} news={news} />
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <aside className="w-full lg:w-1/3">
            <div className="pb-4 flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-blue-900">
                Liên kết nhanh
              </h2>
              <a href="#" className="text-blue-900 hover:underline text-sm sm:text-base">
                {'>>'}
              </a>
            </div>
            <hr className="border-blue-900 mb-4" />
            <div className="space-y-2 text-blue-900 text-sm md:text-base">
              <p>🔗 Cẩm nang hướng dẫn đầu tư kinh doanh tại Việt Nam</p>
              <p>🔗 Doanh nghiệp kiến nghị về chính sách và pháp luật</p>
            </div>
          </aside>
        </section>

        {/* Sự kiện */}
        <section className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="pb-4 flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-blue-900">
                Sự kiện sắp diễn ra
              </h2>
              <a href="#" className="text-blue-900 hover:underline text-sm sm:text-base">
                {'>>'}
              </a>
            </div>
            <hr className="border-blue-900 mb-4" />

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-1/2 bg-gray-500 flex items-center justify-center rounded-lg p-4 min-h-[180px] sm:min-h-[220px]">
                <p className="text-white">Khung tin tức VIP</p>
              </div>
              <div className="w-full md:w-1/2">
                {rows.slice(0, 5).map((news) => (
                  <NewsContent key={news.id} news={news} />
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-1/3">
            <div className="pb-4 flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-blue-900">
                Lịch sự kiện
              </h2>
              <a href="#" className="text-blue-900 hover:underline text-sm sm:text-base">
                {'>>'}
              </a>
            </div>
            <hr className="border-blue-900 mb-4" />
            <EventCalendar />
          </aside>
        </section>

        {/* Cơ hội kinh doanh + Chính sách */}
        <section className="flex flex-col md:flex-row gap-6 lg:gap-10 border-t border-gray-200 pt-8 pb-16">
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-blue-900">
                Cơ hội kinh doanh
              </h2>
              <a href="#" className="text-blue-900 hover:underline text-sm sm:text-base">
                {'>>'}
              </a>
            </div>
            <hr className="border-blue-900 mb-4" />
            <div className="pt-2 space-y-3">
              {rows.slice(0, 5).map((news) => (
                <NewsContent key={news.id} news={news} />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h2 className="text-[18px] sm:text-[20px] font-bold uppercase text-blue-900">
                Chính sách & pháp luật
              </h2>
              <a href="#" className="text-blue-900 hover:underline text-sm sm:text-base">
                {'>>'}
              </a>
            </div>
            <hr className="border-blue-900 mb-4" />
            <div className="pt-2 space-y-3">
              {rows.slice(0, 5).map((news) => (
                <NewsContent key={news.id} news={news} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
