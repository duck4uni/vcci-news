'use client'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { Fragment, startTransition, useEffect, useState } from 'react'
import { cssVar } from '@/lib/utils/css-var'

export const ProgressBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => startTransition(() => setIsClient(true)), [])

  if (!isClient) return children
  return (
    <Fragment>
      {children}
      <ProgressBar
        height='4px'
        color={`hsl(${cssVar('--secondary')})`}
        options={{ showSpinner: false }}
        shallowRouting
      />
    </Fragment>
  )
}

export default ProgressBarProvider
