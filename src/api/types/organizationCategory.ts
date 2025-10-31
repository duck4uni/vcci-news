import { ResponseType } from './common'

interface GetOrganizationCategoryQueryResponseItemType {
  id: string
  label: string
  label_en: string,
  name: string,
  name_en: string,
  image: string
  options: Array<{
    category_id: string
    value: string
    label: string
    label_en: string
    image: string
    created_by: string | null
    seo_text: string | null
  }>
}

interface GetOrganizationCategoryResponseItemType{
  id: string
  name: string
  name_en: string
  image: string
  seo_text: string
  seo_text_en: string
  parent_id: string
  group_code: string
  category_organizations: categoryorganizations[]
  label: string
  label_en: string
}

interface categoryorganizations {
  type: string
  organization: organization
}

interface organization {
  id: string
  name: string
  avatar: string
  org_email: string
}

interface OrganizationCategoryTableRowType {
  id: string
  order: number
  name: string
  image: string
  category_organizations: categoryorganizations[]
  isCategory: any
}


type GetOrganizationCategoryQueryResponseType = ResponseType<Array<GetOrganizationCategoryQueryResponseItemType>>
type GetOrganizationCategoryResponseType = ResponseType<Array<GetOrganizationCategoryResponseItemType>>

export type { GetOrganizationCategoryQueryResponseType, GetOrganizationCategoryQueryResponseItemType, GetOrganizationCategoryResponseType, OrganizationCategoryTableRowType, categoryorganizations, organization }
