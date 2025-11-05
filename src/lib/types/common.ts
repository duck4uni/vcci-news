// Query response type
interface ResponseType<T = any> {
  data: any
  message: string | null
  message_en: string | null
  responseData: T
  status: 'fail' | 'success'
  statusCode: number
  timeStamp: string
  violations: Array<{
    code: number
    message: string
    action: Array<{
      location: string
      msg: {
        en: string
        vi: string
      }
      path: string
      value: string
    }>
  }> | null
}

// Infinite query statuses type
interface InfiniteQueryStatusesType {
  isFetchingInitialPage: boolean
  isFetchingNextPage: boolean
  isEmptyData: boolean
  isError?: boolean
}

export type { ResponseType, InfiniteQueryStatusesType }
