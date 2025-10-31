'use client'

//Core
import dayjs from 'dayjs'

// App
import { Spinner } from '@/components/ui'
import AppEditorContent from '@/components/shared/editor-content'
import BASE_URLS from '@/links'
import { useGetNewsId } from '@/api/endpoints/news';
import { GetNewsDetailResponseType } from './page.type';
import { Link, CalendarFold, Book } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation'
// import { t } from 'i18next'

// Component
const NewsDetailPage = () => {
  const { id } = useParams()

  // server
  const { data, isLoading } = useGetNewsId<GetNewsDetailResponseType>(id as string)

  // const { t, i18n } = useTranslation('newsPage')
  // const { newsDetail, fallbackClient } = data as Data
  // const lang = i18n.language == 'vi' ? 'vi' : 'vi'
  console.log('newsDetail', data);

  // Template
  return (
    <div className='pb-10'>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {/* Banner */}
          <img className='w-full h-100' src={`${BASE_URLS.imageEndpoint}${data?.responseData?.thumbnail}`} alt='Banner' />
          {/* Breadcrumb  */}
          <div className='container py-10'>
            <div className='flex gap-4 items-stretch'>
              {/* <Breadcrumbs aria-label='breadcrumb'>
                <Link
                  underline='hover'
                  color='inherit'
                  href='/'
                  className='!text-app-blue-secondary !text-sm !leading-normal'
                >
                  {t('breadcrumbHomePage')}
                  <p>Trang chủ</p>
                </Link>
                <Link
                  underline='hover'
                  color='inherit'
                  href='/tin-tuc'
                  className='!text-app-blue-secondary !text-sm !leading-normal'
                >
                  {t('breadcrumbNewsPage')}
                  <p>Tin tức</p>
                </Link>

                <Typography className='!text-sm !text-black !leading-normal'>
                  {t('breadcrumbNewsDetailPage')}
                  <p>Chi tiết</p>
                </Typography>
              </Breadcrumbs> */}
            </div>
          </div>

          <div className='container bg-gray-100 rounded p-10 flex flex-col gap-10'>
            {/* Heading */}
            <div className='text-blue-900 text-[32px] leading-normal font-medium text-center'>{data?.responseData?.title}</div>

            {/* body */}
            <div className='flex items-start gap-8 flex-col lg:flex-row'>
              {/* Info */}
              <div className='lg:w-[332px] bg-white p-4 rounded shadow-app-quaternary flex flex-col gap-2'>
                <div className='text-base text-app-grey font-semibold leading-normal text-center'>
                  {/* {t('information')} */}
                </div>

                {/* date */}
                <div className='flex items-center gap-2 text-app-grey'>
                  <CalendarFold />
                  <span className='text-base'>{dayjs(data?.responseData?.created_at).format('DD/MM/YYYY')}</span>
                </div>

                {/* author */}
                {/* <div className='flex items-center gap-2 text-app-grey'>
                  <PersonIcon />
                  <span className='text-base'>{data?.responseData?.created_by}</span>
                </div> */}

                {/* Category */}
                <div className='flex items-center gap-2 text-app-grey'>
                  <Book />
                  <span className='text-base'>{data?.responseData?.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className='flex-1 text-app-grey text-base overflow-hidden'>
                <AppEditorContent value={data?.responseData?.description ?? ''} />
              </div>
            </div>
          </div>

          {/* Related News */}
          {/* <RelatedNews newsQuery={getRelatedNewsQuery} lang={lang} newsId={infoNews.id} /> */}
        </div>
      )}
    </div>
  )
}

export default NewsDetailPage