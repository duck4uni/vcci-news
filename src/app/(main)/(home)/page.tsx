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
import NewsContent from './components/news-content/NewsContent'
import { Spinner } from '@/components/ui'
import { useGetCategory } from '@/api/endpoints/category'
import { useGetNews } from '@/api/endpoints/news'
import { GetCategoryAdminResponseType } from '@/api/types/category'
import { GetNewsAdminResponseType } from '@/api/types/news'

const Home = () => {
  // states
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [submitSearch, setSubmitSearch] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  // responsive slidesPerView used to compute pagination pages
  const [slidesPerView, setSlidesPerView] = useState<number>(3)

  // Refs
  const swiperRef = useRef<SwiperType | null>(null)

  // server
  const { data: categoryData } = useGetCategory<GetCategoryAdminResponseType>();
  const { data: allData, isLoading } = useGetNews<GetNewsAdminResponseType>({
    pageSize: '999',
    filters: submitSearch ? `title @=${submitSearch}` : undefined,
  })

  //tab filter
  const rows = allData?.responseData?.rows ?? [];
  const filteredRows = tab === 'all'
    ? rows
    : rows.filter(news => news.category === tab);

  // update slidesPerView on resize to match the Swiper breakpoints
  useEffect(() => {
    const getSlides = (w: number) => {
      if (w >= 1024) return 3
      if (w >= 640) return 2
      return 1
    }

    const update = () => setSlidesPerView(getSlides(window.innerWidth))
    // run once on mount
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  //template
  return (
    isLoading ? (
      <div className='w-full h-[80vh] flex justify-center items-center'>
        <Spinner />
      </div>
    ) : (
      <>
        {/* Banner */}
        <Swiper
          modules={[Autoplay]}
          // navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onSlideChange={(swiper) => {
            setCurrentIndex(typeof swiper.realIndex === 'number' ? swiper.realIndex : swiper.activeIndex)
          }}
        >
          <SwiperSlide>
            <img
              src="https://vcci-hcm.org.vn/wp-content/uploads/2025/10/1.1.-Hero-Banner-CEO-2025-Bi-Sai-Nam-2025-Nhe-2560x720-Px.jpg"
              alt="Banner"
              className='w-full'
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://vcci-hcm.org.vn/wp-content/uploads/2022/07/Landscape-HCM_3-01.png"
              alt="Banner"
              className='w-full'
            />
          </SwiperSlide>
        </Swiper>

        <div className='container'>
          {/* Featured News */}
          <div>
            <div className='flex py-10 justify-center items-center w-full text-center'>
              <hr className='border-blue-900 w-full' />
              <h1 className='text-app-blue text-[28px] leading-normal uppercase font-bold w-full text-blue-900'>
                Tin Nổi Bật
              </h1>
              <hr className='border-blue-900 w-full' />
            </div>

            {/* slider */}
            <div>
              <Swiper
                modules={[Autoplay]}
                // navigation
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                spaceBetween={30}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 }
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper
                }}
                onSlideChange={(swiper) => {
                  setCurrentIndex(typeof swiper.realIndex === 'number' ? swiper.realIndex : swiper.activeIndex)
                }}
              >
                {allData?.responseData?.rows.map((news) => (
                  <SwiperSlide key={news.id}>
                    <a href={`/tin-tuc/${news.id}`} className='block bg-white shadow-md overflow-hidden relative'>
                      <img
                        src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                        alt={news.title}
                        className='w-full h-48 sm:h-56 md:h-64 object-cover'
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/90 to-transparent text-white px-4 font-semibold text-base flex items-center justify-center text-center md:h-24">
                        <div
                          className="w-full overflow-hidden"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {news.title}
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* news and quick links section */}
          <div className='flex flex-row gap-[30px] py-10'>
            <div className='w-[71%]'>
              <div>
                <div className='flex justify-between items-center'>
                  <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>Tin Tức</a>
                  <a href='#' className='text-blue-900'>{'>>'}</a>
                </div>
                <hr className=' border-blue-900' />
              </div>

              <div className='flex flex-row justify-center gap-[30px] pt-5'>
                {/* special news section */}
                <div className='bg-gray-500 w-[50%] flex items-center justify-center rounded-lg'>
                  <p className='text-white'>khung tin tức vip</p>
                </div>

                <div className='w-[50%]'>
                  {/* category tabs */}
                  <div className='flex mb-5 flex-wrap justify-between'>
                    <button
                      className={`w-22 cursor-pointer hover:bg-border-blue-700 hover:bg-blue-50 px-4 py-1 rounded-md border ${'all' === tab ? 'border-blue-700 bg-blue-50' : 'border-gray-300 bg-white'}`}
                      onClick={() => setTab('all')}
                    >
                      Tất cả
                    </button>
                    {categoryData?.responseData.rows.slice(0, 3).map((category) => (
                      <button
                        key={category.id}
                        className={`w-22 cursor-pointer hover:bg-border-blue-700 hover:bg-blue-50 px-4 py-1 rounded-md border ${category.name === tab ? 'border-blue-700 bg-blue-50' : 'border-gray-300 bg-white'}`}
                        onClick={() => setTab(category.name)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>

                  {/* News list */}
                  <div className='pb-5 overflow-hidden'>
                    {allData?.responseData.rows.slice(0, 5).map((news) => (
                      <NewsContent key={news.id} news={news} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* quick links section */}
            <div>
              <div>
                <div className='flex justify-between items-center'>
                  <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>Liên kết nhanh</a>
                  <a href='#' className='text-blue-900'>{'>>'}</a>
                </div>
                <hr className=' border-blue-900' />
              </div>
              <div className='pt-5'>
                <p>🔗 Cẩm nang Hướng dẫn đầu tư kinh doanh tại Việt Nam</p>
                <p>🔗 Doanh nghiệp kiến nghị về chính sách và pháp luật</p>
              </div>
            </div>
          </div>

          {/* content 2 */}
          <div className='flex flex-row gap-[30px] pb-10'>
            <div className='w-[71%]'>
              <div>
                <div className='flex justify-between items-center'>
                  <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>
                    Sự kiện sắp diễn ra
                  </a>
                  <a href='#' className='text-blue-900'>{'>>'}</a>
                </div>
                <hr className=' border-blue-900' />
              </div>

              <div className='flex flex-row justify-center gap-[30px] pt-5'>
                {/* special news section */}
                <div className='bg-gray-500 w-[50%] flex items-center justify-center rounded-lg'>
                  <p className='text-white'>khung tin tức vip</p>
                </div>
                {/* News list */}
                <div className='w-[50%] pb-5 overflow-hidden'>
                  {allData?.responseData.rows.slice(0, 5).map((news) => (
                    <NewsContent key={news.id} news={news} />
                  ))}
                </div>
              </div>
            </div>

            {/* calendar */}
            <div>
              <div>
                <div className='flex justify-between items-center'>
                  <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>Lịch sự kiện</a>
                  <a href='#' className='text-blue-900'>{'>>'}</a>
                </div>
                <hr className=' border-blue-900' />
              </div>
              <div className='pt-5'>
                <p>🔗 Cẩm nang Hướng dẫn đầu tư kinh doanh tại Việt Nam</p>
                <p>🔗 Doanh nghiệp kiến nghị về chính sách và pháp luật</p>
              </div>
            </div>
          </div>

          {/* content 3 */}
          <div className='flex flex-row gap-[30px] pb-10'>
            {/* Cơ hội kinh doanh */}
            <div className='flex flex-col'>
              <div>
                <div className='flex justify-between items-center w-full'>
                  <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>
                    Cơ hội kinh doanh
                  </a>
                  <a href='#' className='text-blue-900'>{'>>'}</a>
                </div>
                <hr className=' border-blue-900' />
              </div>

              <div className='pt-5'>
                {allData?.responseData.rows.slice(0, 5).map((news) => (
                  <NewsContent key={news.id} news={news} />
                ))}
              </div>
            </div>

            {/* Chính sách & pháp luật */}
            <div className='flex flex-col'>
              <div>
                <div className='flex justify-between items-center w-full'>
                  <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>
                    Chính sách & pháp luật
                  </a>
                  <a href='#' className='text-blue-900'>{'>>'}</a>
                </div>
                <hr className=' border-blue-900' />
              </div>

              <div className='pt-5'>
                {allData?.responseData.rows.slice(0, 5).map((news) => (
                  <NewsContent key={news.id} news={news} />
                ))}
              </div>
            </div>
          </div>
        </div >
      </>
    )
  )
}

export default Home
