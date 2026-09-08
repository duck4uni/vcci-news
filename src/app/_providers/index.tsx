import { LayoutProps } from '@/lib/types/layout'
import { ReactQueryProvider } from './react-query'
// import { AOSProvider } from './aos'
import ProgressBarProvider from './progress-bar'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: LayoutProps) {
  return (
    <ReactQueryProvider>
        <ProgressBarProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ProgressBarProvider>
    </ReactQueryProvider>
  )
}
