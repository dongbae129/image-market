'use client';

import { useEffect } from 'react';

export default function MswProvider({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest: 'bypass'
        });
      });
    }
  }, []);

  return children;
}
