import { ResponseType } from './common'

interface ClubMemberType {
  id: string
  status_id?: string | null
  created_at: string
  created_by?: string
  updated_at?: string
  updated_by?: string
  org: {
    id: string
    name: string | null
    avatar: string | null
    province: string[]
    org_categories: string[]
    org_link: string | null
    users: [{ id?: string; status_id?: string; is_org_verfied?: boolean }]
  }
}

type GetClubMembersClubIdResponseType = ResponseType<Array<ClubMemberType>>

export type { ClubMemberType, GetClubMembersClubIdResponseType }
