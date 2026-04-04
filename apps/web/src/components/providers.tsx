'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { LangProvider } from '@/lib/i18n/lang-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
  }));
  return (
    <LangProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </LangProvider>
  );
}
