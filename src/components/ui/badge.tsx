import React from 'react'
import cn from './utils'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClass = variant === 'secondary' ? 'badge-secondary' : 'badge'
  return <span className={cn(variantClass, className)} {...props} />
}

export default Badge
