import { ResponseType } from './common'

type EventType = 'PARTNER' | 'B2B'

// useGetEvents
interface GetEventsQueryResponseItemType {
  counter_cost: number
  counter_count: number
  counter_max_pick: number | null
  counter_min_pick: number | null
  created_at: string
  created_by: string
  description: string
  end_time: string
  event_organizations: Array<{
    add_info: string | null
    created_at: string
    guest_image: string | null
    guest_name: string | null
    id: string
    org_counter_count: number
    org_table_count: number
    organization: {
      avatar: string | null
      id: string
      name: string
      org_categories: string[]
      org_link: string | null
      organization_products: any[]
      province: string[]
      users: Array<{
        id: string
      }>
    } | null
    role: 'MAIN' | 'SUPPORT' | 'SUPPORT_1' | 'SUPPORT_2' | 'SUPPORT_3' | 'PARTAKER'
    status: string | null
  }>
  id: string
  image: string
  introduction: string | null
  location: string
  name: string
  province: string
  seo_text: string
  seo_text_en: string | null
  start_time: string
  status: string
  status_status: {
    code: string
    id: string
    name: string
    name_en: string
  }
  table_cost: number
  table_count: number
  table_max_pick: number | null
  table_min_pick: number | null
  updated_at: string
  updated_by: string
  created_by_user: {
    id: string | null
    organization_organization: {
      id: string | null
      name: string | null
      avatar: string | null
      org_link: string | null
    }
  }
}

type GetEventsQueryResponseType = ResponseType<{
  count: string | number
  currentPage: string | number
  totalPages: string | number
  rows: GetEventsQueryResponseItemType[]
}>

// useGetEventsMyEvents
type GetEventsMyEventsQueryResponseType = ResponseType<{
  count: number
  rows: Array<{
    created_at: string
    id: string
    event_id: string
    status: any
  }>
}>

// useGetEventsId
type GetEventsIdQueryResponseType = ResponseType<{
  accept_entries: boolean | null
  counter_cost: number
  counter_count: number
  created_at: string
  description: string
  end_time: string
  event_organizations: Array<{
    add_info: string | null
    created_at: string
    guest_image: string | null
    guest_name: string | null
    id: string
    org_counter_count: number | null
    org_table_count: number | null
    organization: {
      address: string
      avatar: string | null
      club_link: string | null
      club_name: string | null
      id: string
      name: string
      org_categories: string[]
      org_link: string | null
      org_status_id: string | null
      organization_products: Array<{
        id: string
        images: string[]
      }>
      province: string[]
      tax_code: string
      users: Array<{
        id: string
      }>
      website: string
    } | null
    role: 'PARTAKER' | 'MAIN' | 'SUPPORT' | 'SUPPORT_1' | 'SUPPORT_2' | 'SUPPORT_3' | 'GUEST'
    status: string | null
  }>
  host_club: string | null
  id: string
  image: string
  introduction: string | null
  location: string
  name: string
  org_support_titles: string[] | null
  province: string
  seo_text: string
  seo_text_en: string | null
  start_time: string
  status: string
  status_status: {
    code: string
    id: string
    name: string
    name_en: string
  }
  table_cost: number
  table_count: number
  updated_at: string | null
}>

// useGetEventsSlugSlug
interface GetEventsSlugSlugQueryResponseDataEventOrganizationType {
  add_info: string | null
  created_at: string
  guest_image: string | null
  guest_name: string | null
  id: string
  org_counter_count: number | null
  org_table_count: number | null
  organization: {
    address: string
    avatar: string | null
    club_link: string | null
    club_name: string | null
    id: string
    name: string
    org_categories: string[]
    org_email: string
    org_link: string
    organization_products: Array<{
      id: string
      images: string[]
    }>
    province: string[]
    tax_code: string
    users: Array<{
      id: string
    }>
    website: string
    welcome_content: string | null
    created_at: string
  } | null
  role: string | null
  status: string | null
}

interface GetEventsSlugSlugQueryResponseDataType {
  name: string
  created_at: string
  updated_at: string
  id: string
  start_time: string
  end_time: string
  status: string
  image: string
  description: string
  location: string
  seo_text: string
  seo_text_en: string | null
  org_support_titles: string[] | null
  event_organizations: GetEventsSlugSlugQueryResponseDataEventOrganizationType[]
  province: string
  status_status: {
    code: string
    id: string
    name: string
    name_en: string
  }
}

type GetEventsSlugSlugQueryResponseType = ResponseType<GetEventsSlugSlugQueryResponseDataType>

// useGetEventsLink
interface EventsLinkType {
  organization_id: string | null
  event_id?: string
  status: string | null
  created_at: string
  updated_at: string | null
  created_by: string
  updated_by: string | null
  role: 'MAIN' | 'SUPPORT' | 'SUPPORT_1' | 'SUPPORT_2' | 'SUPPORT_3' | 'PARTAKER'
  guest_name: string | null
  guest_image: string | null
  org_table_count: number | null
  org_counter_count: number | null
  id: string
  add_info: string | null
  event: {
    id: string
    name: string
    description: string
    location: string
    event_organizations: {
      id: string
      guest_name: string
    }
    image?: string | null
    start_time: string
    end_time: string
    created_by_user: {
      organization_organization: {
        org_link: string | null
        name: string | null
      }
    }
    seo_text: string
    seo_text_en: string | null
  }
  organization: {
    id: string | null
    name: string | null
    avatar: string | null
    province: string[] | null
    org_categories: string[] | null
    org_link: string | null
  }
}

type GetEventsLinkQueryResponseType = ResponseType<{
  count: string | number
  currentPage: string | number
  totalPages: string | number
  rows: Array<EventsLinkType>
}>

// GET /events/slug/getAllSlug
type GetEventsGetAllSlug = {
  seo_text: string | null
  seo_text_en: string | null
}[]

// POST /events
type PostEventsMutationResponseType = ResponseType<Array<Omit<GetEventsQueryResponseItemType, 'event_organizations'>>>

// Types
interface EventVisitingOrganizationInformationType {
  // Organization information
  name: string
  categories: string[]
  provinces: string[]
  foreignProvince: string
  address: string
  website: string

  // Contact information
  contactName: string
  contactTitle: string
  phoneNumber: string
  email: string

  // Event
  eventId: string
}

export type {
  EventType,
  GetEventsQueryResponseType,
  GetEventsIdQueryResponseType,
  GetEventsLinkQueryResponseType,
  EventsLinkType,
  PostEventsMutationResponseType,
  GetEventsQueryResponseItemType,
  GetEventsGetAllSlug,
  GetEventsSlugSlugQueryResponseType,
  GetEventsSlugSlugQueryResponseDataType,
  GetEventsSlugSlugQueryResponseDataEventOrganizationType,
  GetEventsMyEventsQueryResponseType,
  EventVisitingOrganizationInformationType
}
