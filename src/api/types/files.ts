import { ResponseType } from './common'

type PostFilesMutationResponseType = ResponseType<{
  fileName: string
  contentType: string
  original: string
}>

export type { PostFilesMutationResponseType }
