import { ResponseType } from './common'

// Response data item type
interface GetFooterQueryResponseDataItemType {
  id: string
  display: boolean
  image: string | null
  name: string
  name_en: string
  sequency: number | null
  type: 'ABOUT' | 'INFO' | 'CONTACT'
  value: string
  value_en: string
  created_at: string
  updated_at: string
  updated_by: string
}

// Response data type
type GetFooterQueryResponseType = ResponseType<{
  count: number
  currentPage: number
  rows: GetFooterQueryResponseDataItemType[]
}>

// Request body data type
interface PostFooterMutationRequestBodyDataType {
  display?: boolean
  image?: string
  name: string
  name_en: string
  value: string
  value_en: string
  sequency?: number
  type: 'ABOUT' | 'INFO' | 'CONTACT'
}

export type { GetFooterQueryResponseDataItemType, GetFooterQueryResponseType, PostFooterMutationRequestBodyDataType }
