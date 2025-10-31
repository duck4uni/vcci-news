interface BannerType {
  id: string
  media: File | string | null
  isImage: boolean
  link: string
  order?: number
}

export type { BannerType }
