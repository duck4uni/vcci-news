import { ResponseType } from './common'
import { OrgTypeType } from './organization'

// usePostValidatorCheckEventSlotsEventId
type PostValidatorCheckEventSlotsEventIdMutationResponseType = ResponseType<{
  booked_counter_count: number
  booked_table_count: number
  counter_count: number
  id: string
  name: string
  table_count: number
}>

// usePostValidatorOrgCode
type PostValidatorOrgCodeMutationResponseType = ResponseType<{
  id: string
  name: string
  type: OrgTypeType
  users: Array<{
    id: string
  }>
}>

export type { PostValidatorCheckEventSlotsEventIdMutationResponseType, PostValidatorOrgCodeMutationResponseType }
