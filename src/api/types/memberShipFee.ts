import { ResponseType } from './common'

interface GetMemberShipFeeQueryResponeItemType {
  id :  string ,
  organization_id :  string ,
  admin_information :  string ,
  customer_information :  string ,
  amount_paid :  string ,
  created_by :  string ,
  image_evidence :  string ,
  created_at :  string 
}
// Response data type
type GetMembershipFeeQueryResponseType = ResponseType<{
    count: number
    currentPage: number
    totalPages: number
    rows: GetMemberShipFeeQueryResponeItemType[]
  }>


type GetMemberShipFeeQueryResponeType = ResponseType<GetMemberShipFeeQueryResponeItemType>
export type { 
  GetMemberShipFeeQueryResponeType,
  GetMemberShipFeeQueryResponeItemType,
  GetMembershipFeeQueryResponseType
}