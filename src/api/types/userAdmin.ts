import { ResponseType } from './common'
interface GetUserAdminQueryResponseItemType {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar: string | null
  birthday: string | null
  address: string | null
  phone: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
  full_name: string | null
  organization_id: string
  is_web_verified: boolean | null
  is_org_verfied: boolean | null
  org_categories: string[] | null
  org_ref_code: string | null
  status_id: string | null
  reg_progress: string | null
  favorite_orgs: [] | null
  favorite_products: [] | null
  user_permisions: Array<{
    id: string
    permision: {
      id: string
      name: string
    }
  }>
}

type GetUsersAdminQueryResponseType = ResponseType<{
  count: number
  totalPages: number
  currentPage: number
  rows: GetUserAdminQueryResponseItemType[]
}>


type GetUserDepartmentQueryResponseItemType = {
  id: string;
  code: string;
  name: string;
  note: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;
};


type GetDepartmentQueryResponseType = ResponseType<{
  count: number
  totalPages: number
  currentPage: number
  rows: GetUserDepartmentQueryResponseItemType[]
}>

export type { GetUsersAdminQueryResponseType, GetUserAdminQueryResponseItemType, GetDepartmentQueryResponseType, GetUserDepartmentQueryResponseItemType }
