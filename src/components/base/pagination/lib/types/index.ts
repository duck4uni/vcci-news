// Types
export interface PaginationProps {
  pageCount: number
  page: number
  isHasPreviousPage?: boolean
  isHasNextPage?: boolean
  neighborPageCount?: number
  jumpedPageCount?: number
  onGoToPreviousPage?: () => void
  onGoToNextPage?: () => void
  onChangePage: (page: number) => void
}
