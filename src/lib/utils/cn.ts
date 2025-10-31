// Core
import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

// Cn
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
