'use client';

import { Provider } from 'jotai';
import { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>;
}
