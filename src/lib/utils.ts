import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

let id = 0
export function useId() {
  return `form-${++id}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
