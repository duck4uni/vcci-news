import { ResponseType } from './common'

interface GetMyScheduleQueryResponseItemType {
  count: number
  rows: Array<{
    event: {
      end_time: string
      location: string
      name: string
      province: string
      seo_text: string
      start_time: string
    }
    event_id: string
    id: string
    is_canceled: boolean
    note: string | null
    partner: {
      id: string
      name: string
      org_email: string
      org_link: string
      users: Array<{
        id: string
      }>
    }
    phone: string
    require_translator: boolean
    schedule_time: string
    scheduler_email: string
    scheduler_name: string
  }>
  totalPages: number
  currentPage: number
}

interface GetManageMyScheduleQueryResponseItemType {
  schedule_time: string
  require_translator: boolean
  scheduler_name: string
  scheduler_email: string
  event_id: string
  id: string
  user: {
    id: string
    organization_organization: {
      avatar: string | null
      id: string
      name: string
      org_categories?: string[]
      org_link: string | null
      province?: string[]
    }
  }
  event: {
    id: string
    name: string
    location: string
    province: string
    start_time: string
    end_time: string
  }
}

interface GetScheduledTimeByEventIdAndPartnerIdQueryResponseItemType {
  count: number
  rows: Array<{
    id: string
    event_id: string
    schedule_time: string
    user_id: string
  }>
}

type GetMyScheduleQueryResponseType = ResponseType<GetMyScheduleQueryResponseItemType>
type GetManageMyScheduleQueryResponseType = ResponseType<{
  count: number
  rows: Array<GetManageMyScheduleQueryResponseItemType>
  totalPages: number
  currentPage: number
}>
type GetScheduledTimeByEventIdAndPartnerIdQueryResponseType =
  ResponseType<GetScheduledTimeByEventIdAndPartnerIdQueryResponseItemType>

export type {
  GetMyScheduleQueryResponseType,
  GetMyScheduleQueryResponseItemType,
  GetScheduledTimeByEventIdAndPartnerIdQueryResponseType,
  GetManageMyScheduleQueryResponseItemType,
  GetManageMyScheduleQueryResponseType
}
