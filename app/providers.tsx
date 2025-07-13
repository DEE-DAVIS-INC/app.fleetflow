'use client';

import { ReactNode } from 'react';
import { LoadProvider } from './contexts/LoadContext';
import { ShipperProvider } from './contexts/ShipperContext';
import { SupabaseAuthProvider } from './components/SupabaseAuthProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SupabaseAuthProvider>
      <LoadProvider>
        <ShipperProvider>
          {children}
        </ShipperProvider>
      </LoadProvider>
    </SupabaseAuthProvider>
  );
}
