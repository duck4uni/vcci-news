import { GetPageConfigTabCodeQueryResponseType } from './pageConfig'

// useGetContact
type GetContactResponseType = GetPageConfigTabCodeQueryResponseType

interface UserContactTabContentType {
  searching: Array<{
    actor: string
    date: string
    demand: string
    email: string
    feedback: boolean
    fullName: string
    id: string
    organizationName: string
    phoneNumber: string
  }>
  contactUs: Array<{
    date: string
    feedback: boolean
    id: string
    fullName: string
    organizationName: string
    email: string
    phoneNumber: string
    message: string
  }>
}

export type { GetContactResponseType, UserContactTabContentType }
