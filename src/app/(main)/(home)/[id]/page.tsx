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
import ListCategory from '@/components/base/list-category'
import { MEDIA_INFORMATION_CATEGORIES } from '@/constants/categories'
import EventCalendar from '@/components/base/event-calendar'
import parse from "html-react-parser";
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
          <div className='container flex flex-col gap-5'>
            <ListCategory categories={MEDIA_INFORMATION_CATEGORIES} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Main content */}
              <main className="lg:col-span-2 bg-white border rounded-md p-7">
                <div className='pb-5 text-primary text-2xl leading-normal font-medium'>
                  {data?.responseData?.title}
                </div>
                <div className='flex items-center gap-2 text-sm mb-4'>
                  <CalendarFold />
                  <span className='text-base text-blue-700'>{dayjs(data?.responseData?.created_at).format('DD/MM/YYYY')}</span>
                </div>
                <div className='py-5' >
                  <hr />
                </div>
                <div className='flex-1 text-app-grey text-base overflow-hidden'>
                  <div className="p-7.5 prose tiptap overflow-hidden">{parse(data?.responseData?.description ?? '')}</div>
                </div>
              </main>
              {/* Sidebar */}
              <aside className="space-y-6">
                <EventCalendar />
              </aside>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}

export default NewsDetailPage