// Query data
export interface QueryData<Data = unknown> {
  message: string | null
  responseData: Data
  // data: Data
  // success: boolean
  status: 'success' | 'fail'
}

export type QueryParams = {
  filters?: string
  sortField?: string
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc'
  currentPage?: number
  pageSize?: number
  [key: string]: string | number | undefined
}

// Pagination query data
export type PaginationQueryData<Row = unknown> = QueryData<{
  count: number
  currentPage: number | string
  totalPages: number
  rows: Row[]
}>

// Mutation data
export interface MutationData<Data = unknown> {
  message: string | null
  message_en: string | null
  responseData: Data
  status: 'fail' | 'success'
  timeStamp: string
  violations: Array<{
    key: string
    code: 'DUPLICATE' | string
    message: string
  }>
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
