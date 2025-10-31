import { ResponseType } from './common'

type GetStatusQueryResponseCodeType =
  | 'PENDING'
  | 'PAID'
  | 'PAYMENT_ERROR'
  | 'EVENT_PENDING'
  | 'EVENT_HAPPENING'
  | 'EVENT_FINISHED'
  | 'ORG_PENDING'
  | 'ORG_ACTIVE'
  | 'ORG_DENIED'
  | 'ORG_PENDING_REF'
  | 'ORG_PENDING_DETAIL'
  | 'ORG_ACTIVE_DETAIL'
  | 'ORG_DENIED_DETAIL'
  | 'ORG_HIDDEN_DETAIL'
  | 'CLUB_PENDING'
  | 'CLUB_VALIDATED'
  | 'CLUB_DENIED'
  | 'ORG_UNPAID'

type GetStatusQueryResponseType = ResponseType<{
  count: number
  currentPage: number
  totalPages: number
  rows: Array<{
    id: string
    name: string
    name_en: string
    code: GetStatusQueryResponseCodeType
    description: string
    group: 'PAYMENT' | 'EVENT' | 'ORG' | 'CLUB'
    sub_group: any
  }>
}>

export type { GetStatusQueryResponseType, GetStatusQueryResponseCodeType }
