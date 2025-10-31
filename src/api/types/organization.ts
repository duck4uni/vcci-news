import { ResponseType } from './common'
import { EventType } from './event'
import { GetStatusQueryResponseCodeType } from './status'

type OrgTypeType = 'CLUB' | 'SPONSOR' | 'ORG'

// useGetOrganization
interface GetOrganizationQueryResponseItemType {
  address: string
  avatar: string | null
  banner: string | null
  certificates: string[] | null
  club_discount: number
  description: string | null
  is_hidden: boolean | null
  is_premium: boolean | null
  id: string
  name: string
  membership_fee: number
  org_categories: string[]
  org_email: string | null
  org_link: string | null
  org_number: string | null
  org_representative: string | null
  organization_validations: Array<{
    comment: string
    created_at: string
    created_by: string
    created_by_user: {
      email: string
      full_name: string
    }
    id: string
  }>
  province: string[]
  org_status: {
    name: string
    code: GetStatusQueryResponseCodeType
  } | null
  org_status_id: string
  draft_changes: string
  ref_code: string | null
  sort_order: number | null
  tax_code: string | null
  type: OrgTypeType
  created_at: string | null
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  users: Array<{
    id: string
    status_id: string
  }>
  website: string | null
  welcome_content: string | null
  welcome_media: string | null
  previous_revenue: string | null
  referrer: string | null
}

// Response data type
type GetOrganizationQueryResponseType = ResponseType<{
  forEach(arg0: (org: any) => void): unknown
  count: number
  currentPage: number
  totalPages: number
  rows: GetOrganizationQueryResponseItemType[]
}>

// useGetOrganizationsMyOrg
type GetOrganizationsMyOrgQueryResponseType = ResponseType<{
  address: string
  avatar: string | null
  banner: string | null
  certificates: string[] | null
  description: string | null
  draft_changes: string
  id: string
  name: string
  org_categories: string[] | null
  org_email: string | null
  org_number: string | null
  org_link: string | null
  org_representative: string | null
  org_status: {
    name: string
    code: GetStatusQueryResponseCodeType
  } | null
  organization_products: Array<{
    category_id: string
    description: string
    id: string
    images: string[]
    name: string
    seo_text: string
    supply_info: string
  }>
  province: string[]
  tax_code: string
  website: string
  welcome_content: string | null
  welcome_media: string | null
} | null>

// useGetOrganizationsClubMyClub
type GetOrganizationsClubMyClubQueryResponseType = ResponseType<{
  address: string | null
  avatar: string | null
  banner: string | null
  certificates: string[] | null
  description: string | null
  draft_changes: string | null
  id: string
  name: string | null
  org_categories: string[] | null
  org_email: string | null
  org_link: string | null
  org_number: string | null
  org_representative: string | null
  org_status: string | null
  organization_products: any[] | null
  province: string[]
  website: string | null
  welcome_media: string | null
}>

// useGetOrganizationsClubMembers
interface GetOrganizationsClubMembersQueryResponseDataItemType {
  created_at: string
  id: string
  org: {
    avatar: string | null
    created_by: string
    id: string
    isRegistered: boolean | null
    name: string
    org_categories: string[]
    org_link: string
    org_status_id: string | null
  } | null
  status_id: string
  updated_at: string | null
}

type GetOrganizationsClubMembersQueryResponseType = ResponseType<{
  id: string
  organization_clubs: GetOrganizationsClubMembersQueryResponseDataItemType[]
}>

// useGetOrganizationsClubMyEvents
type GetOrganizationsClubMyEventsQueryResponseType = ResponseType<{
  count: number
  currentPage: string | number
  rows: Array<{
    accept_entries: boolean
    counter_cost: number
    counter_count: number | null
    counter_max_pick: number | null
    counter_min_pick: number | null
    created_at: string
    created_by: string
    description: string
    end_time: string
    id: string
    image: string
    introduction: string
    location: string
    name: string
    org_support_titles: string[] | null
    organization_count: string | number
    province: string | null
    seo_text: string
    seo_text_en: string | null
    start_time: string
    status: string | null
    table_cost: number
    table_count: number | null
    table_max_pick: number | null
    table_min_pick: number | null
    type: EventType
    updated_at: string | null
    updated_by: string | null
  }>
  totalPages: number
}>

// useGetOrganizationsId
type GetOrganizationsIdResponseType = ResponseType<
  GetOrganizationQueryResponseItemType & {
    organization_products: Array<{
      category_id: string
      description: string
      id: string
      name: string
      images: string[]
      seo_text: string | null
      supply_info: string | null
    }>
    created_by_user: {
      email: string
      full_name: string
      phone: string
    }
    users: Array<{
      id: string
    }>
  }
>

// useGetOrganizationsSlugSlug
type GetOrganizationsSlugSlugResponseType = ResponseType<GetOrganizationsSlugSlugResponseItemType>
interface GetOrganizationsSlugSlugResponseProductItemType {
  category_id: string
  description: string
  id: string
  name: string
  images: string[]
  seo_text: string | null
  supply_info: string | null
}

type GetOrganizationsSlugSlugResponseItemType = GetOrganizationQueryResponseItemType & {
  organization_products: GetOrganizationsSlugSlugResponseProductItemType[]
  created_by_user: {
    email: string
    full_name: string
    phone: string
    status_id?: string
  }
}

//useGetOrganizationsClubMyJoinedClubs
interface GetOrganizationsClubMyJoinedClubsItemType {
  club_id: string
  org_id: string
  id: string
  status_id: string
  created_at: string
  created_by: string
  updated_at: string | null
  updated_by: string | null
  club: { id: string; name: string; club_discount: string | null; org_link: string | null }
}

type GetOrganizationsClubMyJoinedClubsResponseType = ResponseType<{
  count: string
  rows: GetOrganizationsClubMyJoinedClubsItemType[]
}>

// useGetOrganizationsIdJoinedClubs
type GetOrganizationsIdJoinedClubsQueryResponseType = ResponseType<
  Array<{
    club: {
      id: string
      name: string
      ref_code: string
    } | null
    id: string
    status: {
      code: string
      id: string
    }
    status_id: string
  }>
>

// useGetOrganizationsGetAllOrgFavorites
type getOrganizationsGetAllOrgFavoritesQueryResponseType = ResponseType<{
  count: number
  rows: Array<{
    id: string
    organization_organization: {
      id: string
      type: string
    }
  }>
  totalPages: number
  currentPage: number
}>

type GetOrganizationWithoutMembershipFeeQueryResponseItemType = {
  avatar: string | null
  banner: string | null
  certificates: string[] | null
  club_discount: number | null
  description: string | null
  is_hidden: boolean | null
  is_premium: boolean | null
  id: string
  name: string
  org_categories: string[]
  org_email: string | null
  org_link: string | null
  org_number: string | null
  org_representative: string | null
  org_status_id: string | null
  draft_changes: string | null
  ref_code: string | null
  sort_order: number | null
  tax_code: string | null
  type: OrgTypeType
  created_at: string | null
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  website: string | null
  welcome_content: string | null
  welcome_media: string | null
  province: string[]
  total_member: number | null
  total_employee: number | null
  phone: string
  fax: string | null
  office_address: string | null
  bussiness_regis_no: string | null
  bussiness_regis_time: string | null
  bussiness_regis_by: string | null
  org_representative_office: string | null
  registered_capital: number
  total_asset: number
  previous_revenue: number | null
  membership_fee: number
  social_media_info: string | null
  question: string | null
  type_of_ownership: string | null
  establish_decision_no: string | null
  establish_decision_time: string | null
  establish_decision_by: string | null
}
type GetOrganizationWithoutMembershipFeeQueryResponseType = ResponseType<{
  forEach(arg0: (org: any) => void): unknown
  count: number
  currentPage: number
  totalPages: number
  rows: GetOrganizationWithoutMembershipFeeQueryResponseItemType[]
}>

type GetOrganizationsByIdResponseType = ResponseType<{
  message: string
  message_en: string
  responseData: GetOrganizationsByIdResponseItemType
  status: string
  timeStamp: string
  violations: any | null
}>

interface OrganizationValidation {
  id: string
  created_at: string
  created_by: string
  comment: string
  created_by_user: {
    email: string
    full_name: string
  }
}

interface OrganizationProduct {
  id: string
  name: string
  description: string
  images: string[]
  category_id: string
  supply_info: string | null
  seo_text: string | null
  created_at: string | null
  created_by: string | null
  updated_at: string | null
  updated_by: string | null
  status_id: string | null
  organization: {
    name: string | null
    province: string[] | null
  } | null
}

interface CreatedByUser {
  email: string
  full_name: string
  phone: string
}

interface OrgStatus {
  name: string
  code: string
}

export interface GetOrganizationsByIdResponseItemType {
  name: string
  avatar: string
  is_premium: boolean | null
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  ref_code: string
  tax_code: string
  org_categories: string[]
  website: string
  address: string
  description: string
  type: string
  banner: string
  welcome_media: string
  certificates: string[]
  org_email: string
  org_number: string
  org_representative: string
  org_status_id: string
  draft_changes: any | null
  is_hidden: boolean | null
  org_link: string
  club_discount: any | null
  welcome_content: string
  time_club_discount: any | null
  contact_info: string | null
  sort_order: any | null
  id: string
  province: string[]
  english_name: string | null
  abbreviation: string | null
  phone: string | null
  fax: string | null
  office_address: string | null
  bussiness_regis_no: string | null
  bussiness_regis_time: string | null
  bussiness_regis_by: string | null
  org_representative_office: string | null
  registered_capital: number | null
  total_asset: number | null
  previous_revenue: number | null
  membership_fee: string
  social_media_info: string | null
  question: string | null
  type_of_ownership: string | null
  establish_decision_no: string | null
  establish_decision_time: string | null
  establish_decision_by: string | null
  total_member: number | null
  activities_area: string | null
  total_employee: number | null
  created_by_user: CreatedByUser
  users: { id: string }[]
  org_status: OrgStatus
  organization_validations: OrganizationValidation[]
  organization_products: OrganizationProduct[]
  business_regis_img: string | null
  referrer: {
    type: string
  }
}

// Exports
// Exports
export type {
  GetOrganizationQueryResponseType,
  GetOrganizationQueryResponseItemType,
  GetOrganizationsMyOrgQueryResponseType,
  GetOrganizationsIdResponseType,
  GetOrganizationsClubMyClubQueryResponseType,
  GetOrganizationsClubMembersQueryResponseType,
  GetOrganizationsClubMyJoinedClubsItemType,
  GetOrganizationsClubMyJoinedClubsResponseType,
  GetOrganizationsClubMembersQueryResponseDataItemType,
  GetOrganizationsIdJoinedClubsQueryResponseType,
  GetOrganizationsSlugSlugResponseType,
  GetOrganizationsSlugSlugResponseItemType,
  GetOrganizationsClubMyEventsQueryResponseType,
  GetOrganizationsSlugSlugResponseProductItemType,
  OrgTypeType,
  getOrganizationsGetAllOrgFavoritesQueryResponseType,
  GetOrganizationWithoutMembershipFeeQueryResponseItemType,
  GetOrganizationWithoutMembershipFeeQueryResponseType,
  GetOrganizationsByIdResponseType,
  OrganizationProduct
}
