import { LayoutProps } from '@/lib/types/layout'
import { ReactQueryProvider } from './react-query'
// import { AOSProvider } from './aos'
import ProgressBarProvider from './progress-bar'

export function Providers({ children }: LayoutProps) {
  return (
    <ReactQueryProvider>
        <ProgressBarProvider>{children}</ProgressBarProvider>
    </ReactQueryProvider>
  )
}
