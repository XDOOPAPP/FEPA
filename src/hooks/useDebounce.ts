import { useState, useEffect } from 'react'

/**
 * Hook để debounce giá trị input, giảm số lần re-render và API calls
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms), default 500ms
 * @returns Giá trị đã debounce
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
