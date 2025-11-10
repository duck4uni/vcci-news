export interface NewsDetailItem {
    id: string
    title: string
    thumbnail: string
    external_link: string
    description: string
    release_at: string
    is_active: boolean
    created_at: string
    created_by: string | null
    updated_at: string
    updated_by: string | null
    mode: 'NOW' | string
    category: string
}

export interface NewsDetailResponseData {
    count: number
    rows: NewsDetailItem[]
    totalPages: number
    currentPage: number
}

export interface GetNewsDetailResponseType {
    message: string
    message_en: string
    responseData: NewsDetailItem
    status: 'success' | 'error'
    timeStamp: string
    violations: any | null
}