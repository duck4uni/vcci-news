// Core
import { useMemo } from 'react'
// import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'

// Core
import { Button } from '@components/ui/button'
import { useIsMobile } from '@hooks/use-mobile'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'

// Internal
import { type PaginationProps } from './lib'
// import en from './lib/locales/en.json'
// import vi from './lib/locales/vi.json'

export * from './lib'

// Component

export function Pagination(props: PaginationProps) {
  // Props
  const {
    pageCount,
    page,
    isHasPreviousPage = page > 1,
    isHasNextPage = page < pageCount,
    neighborPageCount = 1,
    jumpedPageCount = 5,
    onChangePage,
    onGoToPreviousPage = () => props.onChangePage(page - 1),
    onGoToNextPage = () => props.onChangePage(page + 1)
  } = props

  // Hooks
  const isMobile = useIsMobile()
  // const { t } = useTranslation('component/pagination')

  // Methods
  // Handle jump previous page
  const handleJumpPreviousPage = () => {
    const newPage = Math.max(1, page - jumpedPageCount)
    onChangePage(newPage)
  }

  // Handle jump next page
  const handleJumpNextPage = () => {
    const newPage = Math.min(pageCount, page + jumpedPageCount)
    onChangePage(newPage)
  }

  // Memos
  // Displayed pages
  const displayedPages = useMemo(() => {
    const result: number[] = []

    if (isMobile) {
      result.push(page)
      return result
    }

    if (pageCount <= 3 + neighborPageCount * 2) {
      if (pageCount === 0) {
        result.push(1)
      }

      for (let i = 1; i <= pageCount; i += 1) {
        result.push(i)
      }
    } else {
      let left = Math.max(1, page - neighborPageCount)
      let right = Math.min(page + neighborPageCount, pageCount)

      if (page - 1 <= neighborPageCount) {
        right = 1 + neighborPageCount * 2
      }

      if (pageCount - page <= neighborPageCount) {
        left = pageCount - neighborPageCount * 2
      }

      for (let i = left; i <= right; i += 1) {
        result.push(i)
      }

      if (page - 1 >= neighborPageCount * 2 && page !== 1 + 2) {
        result.unshift(-Infinity)
      }

      if (pageCount - page >= neighborPageCount * 2 && page !== pageCount - 2) {
        result.push(Infinity)
      }

      if (left !== 1) {
        result.unshift(1)
      }
      if (right !== pageCount) {
        result.push(pageCount)
      }
    }

    return result
  }, [neighborPageCount, page, pageCount, isMobile])

  // Template
  return (
    <div className='flex items-center gap-1 select-none'>
      <Button
        variant='ghost'
        size={isMobile ? 'icon' : 'default'}
        disabled={!isHasPreviousPage}
        onClick={onGoToPreviousPage}
      >
        <ChevronLeft />
        {/* <span className='hidden xl:inline-block'>{t('previousPageButton')}</span> */}
      </Button>

      {displayedPages.map((displayedPage) => {
        if (displayedPage === -Infinity) {
          return (
            <TooltipProvider key={displayedPage} delayDuration={400}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size='icon' className='group' variant='ghost' onClick={handleJumpPreviousPage}>
                    <MoreHorizontal className='block group-hover:hidden' />
                    <ChevronsLeft className='hidden group-hover:block' />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  {/* {jumpedPageCount} {t('previousPageJumpingButton')} */}
                  {jumpedPageCount}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }

        if (displayedPage === Infinity) {
          return (
            <TooltipProvider key={displayedPage} delayDuration={400}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button key={page} size='icon' className='group' variant='ghost' onClick={handleJumpNextPage}>
                    <MoreHorizontal className='block group-hover:hidden' />
                    <ChevronsRight className='hidden group-hover:block' />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  {/* {jumpedPageCount} {t('nextPageJumpingButton')} */}
                  {jumpedPageCount}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }

        return (
          <Button
            size='icon'
            key={displayedPage}
            variant={displayedPage === page ? 'default' : 'ghost'}
            onClick={() => onChangePage(displayedPage)}
          >
            {displayedPage}
          </Button>
        )
      })}

      <Button variant='ghost' size={isMobile ? 'icon' : 'default'} disabled={!isHasNextPage} onClick={onGoToNextPage}>
        {/* <span className='hidden xl:inline-block'>{t('nextPageButton')}</span> */}
        <ChevronRight />
      </Button>
    </div>
  )
}
