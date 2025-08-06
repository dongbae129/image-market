'use client';
import { useEffect } from 'react';

export const MSWComponent = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
        require('@app/mocks/browser');
      }
    }
  }, []);

  return null;
};
