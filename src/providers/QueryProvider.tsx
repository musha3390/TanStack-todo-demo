'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react';

const QueryProvider = ({children}:{children: React.ReactNode}) => {
    const [queryClient] = useState(()=>
        new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: 1000 * 30,
              gcTime: 1000 * 60 * 5,
              refetchOnWindowFocus: true,
              retry: 2,
            },
          },
          })
    )
  return <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false}/>
  </QueryClientProvider>;
}

export default QueryProvider
