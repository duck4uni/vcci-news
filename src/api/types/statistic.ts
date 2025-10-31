import { ResponseType } from './common'

// useGetStatisticSiteAccess
type GetStatisticSiteAccessQueryResponseType = ResponseType<{
  rows: Array<{
    date: string
    group: string
    value: number
  }>
}>

export type { GetStatisticSiteAccessQueryResponseType }
