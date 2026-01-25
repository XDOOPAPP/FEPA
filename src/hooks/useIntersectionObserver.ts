import { useEffect, useRef } from 'react'

/**
 * Hook để tạo Intersection Observer cho lazy loading hình ảnh/components
 * @param callback - Callback khi element visible
 * @param options - IntersectionObserver options
 * @returns ref để attach vào element
 */
export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(callback)
    }, options)

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return targetRef
}
