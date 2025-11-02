export interface NewsItem {
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

export interface NewsResponseData {
    count: number
    rows: NewsItem[]
    totalPages: number
    currentPage: number
}

export interface GetNewsResponseType {
    message: string
    message_en: string
    responseData: NewsResponseData
    status: 'success' | 'error'
    timeStamp: string
    violations: string | null
}