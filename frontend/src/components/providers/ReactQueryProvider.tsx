'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useState } from 'react';

// https://www.mintmin.dev/blog/2402/20240202
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {},
    },
  });
}

let clientQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    if (!clientQueryClient) clientQueryClient = makeQueryClient();
    return clientQueryClient;
  }
}

export default function ReactQueryProviders({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => getQueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
