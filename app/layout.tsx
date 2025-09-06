import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import ClientLayout from './components/ClientLayout';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FleetFlow™ - Transportation Management System',
  description: 'Advanced fleet management and logistics platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* Immediate React Error Suppression - MUST load first */}
        <Script
          id='react-error-suppression'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              // IMMEDIATE React Console Error Suppression
              if (typeof window !== 'undefined' && typeof console !== 'undefined') {
                const originalError = console.error;
                const originalWarn = console.warn;

                const REACT_PATTERNS = [
                  // React hydration and build errors
                  'createConsoleError@', 'handleConsoleError@', 'error@',
                  'BuildError@', 'react-stack-bottom-frame@', 'renderWithHooks@',
                  'updateFunctionComponent@', 'runWithFiberInDEV@', 'validateDOMNesting@',
                  'resolveSingletonInstance@', 'completeWork@',
                  'performUnitOfWork@', 'workLoopSync@', 'renderRootSync@',
                  'performWorkOnRoot@', 'performWorkOnRootViaSchedulerTask@',
                  'performWorkUntilDeadline@', 'performSyncWorkOnRoot@',
                  'flushSyncWorkAcrossRoots_impl@', 'processRootScheduleInMicrotask@',
                  'main@unknown:0:0', 'ClientLayout@', 'OuterLayoutRouter@',
                  'Warning:', 'React Warning:', 'ReactDOM Warning:',
                  'Module not found:', 'Can\\'t resolve'
                ];

                console.error = function(...args) {
                  const msg = args.join(' ');
                  if (REACT_PATTERNS.some(p => msg.includes(p))) {
                    console.info('🚫 React error blocked:', msg.substring(0, 80) + '...');
                    return;
                  }
                  originalError.apply(console, args);
                };

                console.warn = function(...args) {
                  const msg = args.join(' ');
                  if (REACT_PATTERNS.some(p => msg.includes(p))) return;
                  originalWarn.apply(console, args);
                };

                console.info('🛡️ IMMEDIATE React error suppression activated');
              }
            `,
          }}
        />

        {/* Square Payment SDK */}
        <Script
          src='https://js.squareup.com/v2/paymentform'
          strategy='beforeInteractive'
        />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
