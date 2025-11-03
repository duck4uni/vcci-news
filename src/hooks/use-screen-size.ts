import { useMediaQuery } from '@uidotdev/usehooks'
export default useScreenSize
/**
 * This hook follows the default Tailwind media breakpoints\
 * References here: https://tailwindcss.com/docs/responsive-design
 *
 */
export function useScreenSize(): ScreenSize {

  const is2xl = useMediaQuery('(width >= 96rem)') // 1536px
  const isXl = useMediaQuery('(width >= 80rem)') // 1280px
  const isLg = useMediaQuery('(width >= 64rem)') // 1024px
  const isMd = useMediaQuery('(width >= 48rem)') // 768px
  // sm = 640px
  if (is2xl) return '2xl'
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  return 'sm'
}
export type ScreenSize = '2xl' | 'xl' | 'lg' | 'md' | 'sm'
