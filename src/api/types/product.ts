import { ResponseType } from './common'
import { OrganizationProduct } from './organization'
// useGetProducts

interface GetProductQueryResponseItemType {
  id: string
  category_id: string
  organization_id: string
  organization: { name: string; province: string[] }
  name: string
  description: string
  supply_info: string | null
  images: string[]
  created_at: string | null
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  status_id: string
  seo_text: string | null
}


type GetProductQueryResponseType = ResponseType<{
  count: number
  currentPage: number
  totalPages: number
  responseData: {
    rows: OrganizationProduct[]
    count: number
    currentPage: number
    totalPages: number
  }
  rows: GetProductQueryResponseItemType[]
}>

type GetProductIdResponseType = ResponseType<GetProductQueryResponseItemType>

export type { GetProductQueryResponseType, GetProductQueryResponseItemType, GetProductIdResponseType }
