'use client'

import Image from 'next/image'
import { Button, Card, Spinner } from '@/components/ui'
import { useEffect, useRef, useState } from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { is } from 'zod/v4/locales'

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
    // const { data: categoryData } = useGetCategory<GetCategoryAdminResponseType>();
    // const { data: allData, isLoading } = useGetNews<GetNewsResponseType>({
    //   pageSize: '999',
    //   filters: submitSearch ? `title @=${submitSearch}` : undefined,
    // })

    //tab filter
    // let data
    // if (tab === 'all') {
    //   data = allData
    // } else {
    //   // fillter by category
    //   const filteredRows = allData?.responseData?.rows?.filter(
    //     (news) => news.category === tab
    //   )
    //   data = {
    //     ...allData,
    //     responseData: {
    //       ...allData?.responseData,
    //       rows: filteredRows ?? []
    //     }
    //   }
    // }

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

    // demo
    const isLoading = false

    //template
    return (
        isLoading ? (
            <div className='w-full h-[80vh] flex justify-center items-center'>
                <Spinner />
            </div>
        ) : (
            <>
                {/* Banner */}
                <img
                    src="https://vcci-hcm.org.vn/wp-content/uploads/2025/10/1.1.-Hero-Banner-CEO-2025-Bi-Sai-Nam-2025-Nhe-2560x720-Px.jpg"
                    alt="Banner"
                    className='w-full'
                />
                <div className='app-container'>
                    {/* Featured News */}
                    <div className='pt-10'>
                        <div className='flex justify-center items-center w-full text-center'>
                            <hr className='border-blue-900 w-full' />
                            <h1 className='text-app-blue text-[28px] leading-normal uppercase font-bold w-full text-blue-900'>
                                Tin Nổi Bật
                            </h1>
                            <hr className='border-blue-900 w-full' />
                        </div>

                        {/* slider */}
                        <div className='py-10'>
                            <Swiper
                                modules={[Autoplay]}
                                // navigation
                                // pagination={{ clickable: true }}
                                autoplay={{ delay: 4000, disableOnInteraction: false }}
                                loop
                                spaceBetween={16}
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
                                {/* {allData?.responseData.rows.map((news) => (
                <SwiperSlide key={news.id}>
                  <a href={`/tin-tuc/${news.id}`} className='block bg-white shadow-md overflow-hidden relative'>
                    <AppImage
                      src={`${BASE_URL.imageEndpoint}${news.thumbnail}`}
                      alt={news.title}
                      className='w-full h-48 sm:h-56 md:h-64 object-cover'
                    />
                    <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-4 font-semibold text-base rounded-b-xl flex items-center justify-center text-center h-16 md:h-20'>
                      <div
                        className='w-full overflow-hidden'
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {news.title}
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))} */}

                                <SwiperSlide>
                                    <a href={`#`} className='block bg-white shadow-md overflow-hidden relative'>
                                        <img
                                            src={`https://media.istockphoto.com/id/814423752/vi/anh/con-m%E1%BA%AFt-c%E1%BB%A7a-ng%C6%B0%E1%BB%9Di-m%E1%BA%ABu-v%E1%BB%9Bi-trang-%C4%91i%E1%BB%83m-ngh%E1%BB%87-thu%E1%BA%ADt-%C4%91%E1%BA%A7y-m%C3%A0u-s%E1%BA%AFc-c%E1%BA%ADn-c%E1%BA%A3nh.jpg?s=1024x1024&w=is&k=20&c=g9JektNW0igwf2u2mT9uqSLkhzR91ZYviuVLXuhy2JQ=`}
                                            alt={'image'}
                                            className='w-full h-48 sm:h-56 md:h-64 object-cover'
                                        />
                                        <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-4 font-semibold text-base rounded-b-xl flex items-center justify-center text-center h-16 md:h-20'>
                                            <div
                                                className='w-full overflow-hidden'
                                                style={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                title
                                            </div>
                                        </div>
                                    </a>
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>

                    {/* news and quick links section */}
                    <div className='flex flex-row gap-5'>
                        <div className='w-[67%]'>
                            <div>
                                <div className='flex justify-between items-center'>
                                    <a href='#' className='text-[20px] font-bold uppercase text-blue-900'>Tin Tức</a>
                                    <a href='#' className='text-blue-900'>{'>>'}</a>
                                </div>
                                <hr className=' border-blue-900' />
                            </div>

                            <div className='flex flex-row justify-center gap-5 pt-5'>
                                {/* special news section */}
                                <div className='bg-gray-500 w-[50%] flex items-center justify-center rounded-lg'>
                                    <p className='text-white'>khung tin tức vip</p>
                                </div>

                                {/* news list section */}
                                <div className='w-[50%]'>
                                    {/* category tabs */}
                                    <div className='flex gap-2 mb-5 flex-wrap'>
                                        <button
                                            className={`px-4 py-1 rounded-md border ${'all' === tab ? 'border-blue-700 bg-blue-50' : 'border-gray-300 bg-white'}`}
                                            onClick={() => setTab('all')}
                                        >
                                            Tất cả
                                        </button>
                                        {/* {categoryData?.responseData.rows.slice(0, 3).map((category) => (
                    <button
                      key={category.id}
                      className={`px-4 py-1 rounded-md border ${category.name === tab ? 'border-blue-700 bg-blue-50' : 'border-gray-300 bg-white'}`}
                      onClick={() => setTab(category.name)}
                    >
                      {category.name}
                    </button>
                  ))} */}
                                    </div>

                                    {/* News list */}
                                    <div className='pb-5 overflow-hidden'>
                                        {/* {data?.responseData.rows.slice(0, 5).map((news) => (
                    <NewsContent key={news.id} news={news} />
                  ))} */}

                                        {/* <div className='w-full flex justify-center mt-4'>
                      <AppPagination
                        page={Math.floor(currentIndex / Math.max(slidesPerView, 1)) + 1}
                        count={Math.ceil((data?.responseData.rows?.length ?? 0) / Math.max(slidesPerView, 1))}
                        onChange={(_event, value) => {
                          const toIndex = (value - 1) * Math.max(slidesPerView, 1)
                          swiperRef.current?.slideTo(toIndex)
                        }}
                      />
                    </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* quick links section */}
                        <div className='w-[33%]'>
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

                    {/* Sidebar */}
                    {/* <div className='lg:flex-1 w-full'>
              <div className='bg-white rounded-lg p-4 mb-6 shadow-sm'>
                <div className='font-semibold mb-2'>Tìm kiếm</div>
                <input
                  type='text'
                  placeholder='Tên bài viết...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500'
                />
                <div className='flex gap-2'>
                  <button
                    onClick={() => setSubmitSearch(search)}
                    className='flex-1 bg-[#0056b3] text-white rounded p-2 font-semibold hover:bg-[#004999] transition'
                  >
                    Tìm kiếm
                  </button>
                  <button
                    onClick={() => setSearch('')}
                    className='flex-1 bg-gray-100 text-gray-700 rounded p-2 font-semibold hover:bg-gray-200 transition'
                  >
                    Bỏ tìm
                  </button>
                </div>
              </div>
            </div> */}
                </div>
            </>
        )
    )
}

export default Home