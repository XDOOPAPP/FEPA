import { QueryClient } from '@tanstack/react-query'

/**
 * React Query Client Configuration
 * Cấu hình cho data fetching, caching, và synchronization
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Thời gian cache data (5 phút)
      staleTime: 5 * 60 * 1000,
      
      // Thời gian giữ cache khi component unmount (10 phút)
      gcTime: 10 * 60 * 1000,
      
      // Tự động refetch khi window focus
      refetchOnWindowFocus: true,
      
      // Tự động refetch khi reconnect
      refetchOnReconnect: true,
      
      // Retry 1 lần khi fetch fail
      retry: 1,
      
      // Delay giữa các retry (1 giây)
      retryDelay: 1000,
    },
    mutations: {
      // Retry 0 lần cho mutations (POST/PUT/DELETE)
      retry: 0,
    },
  },
})
