import { ResponseType } from './common'

// useGetUsersGetMyInfo
interface GetMyInfoQueryResponseItemType {
  address: string | null
  avatar: string | null
  birthday: string | null
  created_at: string | null
  email: string
  favorite_orgs: string[]
  favorite_products: string[]
  first_name: string | null
  full_name: string | null
  id: string
  is_active: boolean | null
  is_org_verfied: boolean | null
  is_web_verified: boolean | null
  last_name: string | null
  org_categories: string[] | null
  approvals: approvals[]
  org_ref_code: string | null
  organization_id: string
  organization_organization: {
    name: string
    is_premium: boolean
    tax_code: string
    type: 'ORG' | 'CLUB'
    avatar: string
    ref_code: string | null
    club_discount: string | null
    time_club_discount: string | null
    referrer: string | null
  } | null
  phone: string | null
  reg_progress: any
  status_id: string
  updated_at: string | null
  user_permisions: Array<{
    id: string
    permision: {
      id: string
      name: string
      code: string
      description: string
      group_code: string
    },
  }>
}
type GetMyInfoQueryResponseType = ResponseType<GetMyInfoQueryResponseItemType>

interface approvals {
  id: string
  reason?: string
  status?: 'pending | accepted | declined'
  updated_at: null
}

// useGetUsers
interface GetUsersQueryResponseItemType {
  name: string
  address: string | null
  avatar: string | null
  birthday: string | null
  created_at: string | null
  email: string
  favorite_orgs: string[]
  favorite_products: string[]
  first_name: string | null
  full_name: string | null
  id: string
  is_active: boolean
  is_org_verfied: boolean | null
  is_web_verified: boolean | null
  is_paid_membershipFee: boolean | null
  last_name: string | null
  org_categories: string[] | null
  org_ref_code: string[]
  organization_id: string | null
  organization_organization: {
    address: string
    name: string
    org_categories: string[]
    province: string[]
    tax_code: string
    website: string
    membership_fee: string
    signed_file: string
  } | null
  phone: string | null
  reg_progress: string | null
  status_id: string
  updated_at: string | null
  validated_at: string | null
  validation_comment: string | null
  validator_name: string | null
  approvals: approvals[]
  member_code?: string
}



type GetUsersQueryResponseType = ResponseType<{
  count: number
  totalPages: number
  currentPage: number
  rows: GetUsersQueryResponseItemType[]
}>

// useGetUsersId
type GetUsersIdQueryResponseType = ResponseType<{
  email: string
  first_name: string | null
  last_name: string | null
  birthday: string | null
  address: string | null
  phone: string | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  id: string
  avatar: string | null
  full_name: string | null
  organization_id: string | null
  gender: string | null
  is_org_verfied: boolean | null
  org_categories: any | null
  org_ref_code: string | null
  reg_progress: string | null
  registration_front: string | null
  registration_back: string | null
  status_id: string | null
}>

type GetFavoriteBusinessQueryResponseType = ResponseType<{
  count: number
  totalPages: number
  currentPage: number
  rows: GetFavoriteBusinessType[]
}>
//get list favorite business
interface GetFavoriteBusinessType {
  name: string
  avatar: string | null
  is_premium: boolean | null
  created_at: string
  created_by: string
  updated_at: string | null
  updated_by: string | null
  id: string
  ref_code: string
  tax_code: string
  org_categories: string[]
  website: string
  address: string
  description: string | null
  type: string
  province: string[]
  banner: string | null
  welcome_media: string | null
  certificates: string | null
  org_email: string | null
  org_number: string | null
  org_link: string | null
  org_representative: string | null
  org_status_id: string | null
  draft_changes: string | null
  is_hidden: boolean | null
}

type GetFavoriteProductQueryResponseType = ResponseType<{
  count: number
  totalPages: number
  currentPage: number
  rows: GetFavoriteProductType[]
}>
//get list favorite product
interface GetFavoriteProductType {
  id: string
  organization_id: string
  name: string
  description: string | null
  category_id: string
  images: string[]
  status_id: string
  created_at: string
  created_by: string
  updated_at: string | null
  updated_by: string | null
  seo_text: string | null
}
interface GetUsersClubQueryResponseItemType {
  avatar: string
  club_discount: string
  created_at: string
  id: string
  name: string
  org_count: number
  org_link: string
  ref_code: string
  sort_order: number | null
  updated_at: string | null
  users: Array<{
    email: string
    id: string
    is_active: boolean
  }>
}

type GetUsersClubQueryResponseType = ResponseType<{
  count: number
  totalPages: number
  currentPage: number
  rows: GetUsersClubQueryResponseItemType[]
}>

// useGetUsersPartaker
interface GetUsersPartakerQueryResponseItemType {
  avatar: string | null
  id: string
  name: string
  org_categories: string[]
  org_link: string | null
  province: string[]
}

type GetUsersPartakerQueryResponseType = ResponseType<GetUsersPartakerQueryResponseItemType[]>

type GetUsersPrintResponseType = ResponseType<{}>

export type {
  GetMyInfoQueryResponseType,
  GetUsersQueryResponseType,
  GetUsersIdQueryResponseType,
  GetMyInfoQueryResponseItemType,
  GetUsersQueryResponseItemType,
  GetFavoriteBusinessQueryResponseType,
  GetFavoriteBusinessType,
  GetFavoriteProductQueryResponseType,
  GetFavoriteProductType,
  GetUsersClubQueryResponseType,
  GetUsersClubQueryResponseItemType,
  GetUsersPartakerQueryResponseType,
  GetUsersPartakerQueryResponseItemType,
  GetUsersPrintResponseType
}
