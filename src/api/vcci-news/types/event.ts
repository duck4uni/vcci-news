import { ResponseType } from '@lib/types/common'
export type EventStatus = {
  id: string;
  name: string;
  name_en: string;
  code: string;
};

export type EventOrganization = {
  id: string;
  organization_id: string | null;
  event_id: string;
  status: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: string;
  updated_by: string | null;
  role: string;
  guest_name: string;
  guest_image: string;
  org_table_count: number | null;
  org_counter_count: number | null;
  add_info: unknown | null;
  organization: unknown | null;
};
// useGetEventsId
export type GetEventsIdQueryResponseType = ResponseType<{
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
export type EventItem = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
  status: string;
  image: string;
  description: string;
  location: string;
  province: string;
  table_count: number;
  counter_count: number;
  seo_text: string;
  seo_text_en: string | null;
  table_cost: number;
  counter_cost: number;
  table_min_pick: number | null;
  counter_min_pick: number | null;
  table_max_pick: number | null;
  counter_max_pick: number | null;
  org_support_titles: string[];
  accept_entries: boolean;
  type: string;
  introduction: string;
  host_club: string | null;
  config: unknown | null;
  event_organizations: EventOrganization[];
  status_status: EventStatus;
};

export type EventResponseData = {
  count: number;
  rows: EventItem[];
  totalPages: number;
  currentPage: number;
};

export type EventApiResponse = {
  message: string;
  message_en: string;
  responseData: EventResponseData;
  status: string;
  timeStamp: string;
  violations: null | unknown;
};
