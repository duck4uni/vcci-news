import { WebConfig } from '../models'
import { ResponseType } from './common'

type GetWebsiteConfigQueryResponseType = ResponseType<WebConfig | null>

interface SocialMediaType {
  id: string
  order: number
  title: string
  link: string
  image: string
}

export type { GetWebsiteConfigQueryResponseType, SocialMediaType }
