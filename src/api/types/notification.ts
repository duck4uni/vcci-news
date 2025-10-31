import { ResponseType } from './common'

// Common types
interface NotificationAddInfoType {
  type: 'ORG' | 'CLUB'
  link: string
}

interface OriginalNotificationType {
  _id: string
  add_info: string | null
  belongs_to_user_id: string
  created_at: string
  has_noti_sent: boolean
  has_user_read: boolean
  sent_time: string
  title: string
  content: string
  sub_category: string
}

interface TransformedNotificationType {
  id: string
  addInfo: NotificationAddInfoType | null
  belongsToUserId: string
  createdAt: string
  hasNotiSent: boolean
  hasUserRead: boolean
  sentTime: string
  title: string
  content: string
  sub_category:string
}

// Transform GetNotificationsQueryResponse row
interface GetOrganizationsQueryTransformedResponseType {
  [x: string]: any
  count: number
  rows: TransformedNotificationType[]
  totalPages: string | number | null
  currentPage: string | number | null
}

// useGetNotifications
type GetNotificationsQueryResponseType = ResponseType<{
  count: number
  rows: OriginalNotificationType[]
  totalPages: string | number | null
  currentPage: string | number | null
}>

export type {
  GetNotificationsQueryResponseType,
  NotificationAddInfoType,
  GetOrganizationsQueryTransformedResponseType,
  TransformedNotificationType,
  OriginalNotificationType
}
