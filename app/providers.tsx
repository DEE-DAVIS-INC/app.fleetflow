'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { LoadProvider } from './contexts/LoadContext';
import { ShipperProvider } from './contexts/ShipperContext';
import { AuthProvider } from './components/AuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LoadProvider>
          <ShipperProvider>
            {children}
          </ShipperProvider>
        </LoadProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
