import { PageConfigTab } from '../models'
import { ResponseType } from './common'

export type PageConfig = {
  id: string
  name: string
  code: string
  static_link: string
  created_at: Date
  static_link_en: string
}

export type GetPageConfigResponseType = ResponseType<PageConfig>
export type GetPageConfigCodeResponseType = ResponseType<{ page_config: PageConfig; page_config_tab: PageConfigTab[] }>

// useGetPageConfig
type GetPageConfigQueryResponseType = ResponseType<{
  count: number
  rows: Array<{
    id: string
    name: string
    code: string
    static_link: string
    created_at: string | null
    static_link_en: string | null
  }>
}>

// useGetPageConfigTabCode
type GetPageConfigTabCodeQueryResponseType = ResponseType<{
  page_config: {
    id: string
    name: string
    code: string
    static_link: string
    created_at: string | null
    static_link_en: string | null
  }
  page_config_tab: Array<{
    id: string
    name: string
    code: string
    static_link: string
    updated_at: string | null
    updated_by: string | null
    page_config_id: string
    content: string | null
    parent_id: string | null
    config: string
    content_tablet: string | null
    content_mobile: string | null
    created_at: string
    sort_order: number
    childrens: any[]
  }>
}>

// useGetPageConfigTabCodeGetByTabCode
type GetPageConfigTabCodeGetByTabCodeQueryResponseType = ResponseType<{
  name: string
  code: string
  static_link: string | null
  updated_at: string | null
  updated_by: string | null
  page_config_id: string
  content: string | null
  parent_id: string | null
  config: string | null
  content_tablet: string | null
  content_mobile: string | null
  created_at: string
  id: string
  sort_order: number
}>

export type {
  GetPageConfigTabCodeQueryResponseType,
  GetPageConfigQueryResponseType,
  GetPageConfigTabCodeGetByTabCodeQueryResponseType
}
