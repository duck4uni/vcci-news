interface BannerEventType {
  id: string
  media: File | string | null
  link: string
  month: string
  listEvent: Array<{
    id: string
    introduction: string
  }>
}

export type { BannerEventType }
