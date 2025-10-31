import { ResponseType } from './common'

type PaymentType = 'VNPAY' | 'ZALOPAY' | 'CASH'

// useGetOrderGetMyOrders
type GetOrderGetMyOrdersQueryResponseType = ResponseType<{
  count: number
  rows: Array<{
    add_info: string
    code: string
    description: string
    events: string
    id: string
    is_invoice: boolean
    payment: {
      id: string
      created_at: string
      type: string
    }
    sum: number
  }>
  totalPages: number
  currentPage: number
}>

// useGetOrder
interface GetOrderQueryResponseItemType {
  add_info: string
  code: string
  created_at: string
  created_by: string
  description: string
  id: string
  events: string
  payment: {
    id: string
    created_at: string
    type: string
  }
  payment_id: string
  products: string[]
  sum: number
  updated_at: null
  updated_by: null
  user_id: string
  is_invoice: boolean
}

type GetOrderQueryResponseType = ResponseType<{
  count: number
  rows: GetOrderQueryResponseItemType[]
  totalPages: number
  currentPage: number
}>

// usePostOrder
interface OrderDescriptionType {
  type: PaymentType
  totalPrice: number
  events: Array<{
    id: string
    name: string
    tableUnitPrice: number
    tableCount: number
    totalTablePrice: number
    shelveUnitPrice: number
    shelveCount: number
    totalShelvePrice: number
    discountPercent: number
    discountPrice: number
  }>
}

interface OrderInfoType {
  contactName: string
  contactPhoneNumber: string
  contactEmail: string
  contactTitle?: string
  invoice: {
    name: string
    taxCode: string
    email: string
    address: string
  }
}

// useGetOrderPayment
type GetOrderPaymentQueryResponseType = ResponseType<{
  count: number
  rows: Array<{
    type: PaymentType
    status_id: string
    created_at: string
    updated_at: string
    created_by: string
    add_info: string
    id: string
    orders: Array<{
      id: string
    }>
  }>
}>

export type {
  GetOrderGetMyOrdersQueryResponseType,
  OrderDescriptionType,
  OrderInfoType,
  GetOrderQueryResponseType,
  GetOrderQueryResponseItemType,
  PaymentType,
  GetOrderPaymentQueryResponseType
}
