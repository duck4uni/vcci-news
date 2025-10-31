
export interface CategoryAdminItem {
    id: string
    name: string
    description: string
    created_at: string
    created_by: string | null
    updated_at: string
    updated_by: string | null
}

export interface CategoryAdminResponseData {
    count: number
    rows: CategoryAdminItem[]
    totalPages: number
    currentPage: number
}

export interface GetCategoryAdminResponseType {
    message: string
    message_en: string
    responseData: CategoryAdminResponseData
    status: 'success' | 'error'
    timeStamp: string
    violations: any | null
}
