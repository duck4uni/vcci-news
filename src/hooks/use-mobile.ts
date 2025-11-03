// Core
import { useState, useEffect } from 'react'

// Constants
const MOBILE_BREAKPOINT = 1024

// Hook
export const useIsMobile = () => {
  // States — initialize lazily using window when available to avoid
  // synchronously calling setState inside an effect.
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  // Effects — only register the listener; don't call setState synchronously here.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Result
  return isMobile
}
