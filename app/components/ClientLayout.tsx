'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { LoadProvider } from '../contexts/LoadContext';
import { ShipperProvider } from '../contexts/ShipperContext';
import AICoPilotButton from './AICoPilotButton';
import FleetFlowFooter from './FleetFlowFooter';
import Navigation from './Navigation';
import { SimpleErrorBoundary } from './SimpleErrorBoundary';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [coPilotOpen, setCoPilotOpen] = useState(false);
  const pathname = usePathname();

  const handleCoPilotOpen = () => {
    setCoPilotOpen(true);
  };

  const handleCoPilotClose = () => {
    setCoPilotOpen(false);
  };

  // Hide AI co-pilot button on main university pages (but allow on instructors page)
  const shouldShowCoPilot =
    !pathname?.includes('/university') ||
    pathname?.includes('/training/instructor');

  // Debug logging
  console.log('🔍 ClientLayout Debug:', {
    pathname,
    shouldShowCoPilot,
    isUniversity: pathname?.includes('/university'),
    isInstructor: pathname?.includes('/training/instructor'),
  });

  return (
    <SimpleErrorBoundary>
      <ShipperProvider>
        <LoadProvider>
          <Navigation />
          <main
            style={{
              paddingTop: '70px',
              minHeight: '100vh',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flex: 1 }}>{children}</div>
            <FleetFlowFooter variant='transparent' />
          </main>

          {/* AI Co-Pilot Button - appears on all pages except university */}
          {shouldShowCoPilot && (
            <>
              {console.log('🎯 Rendering AI Co-Pilot Button')}
              <AICoPilotButton onOpen={handleCoPilotOpen} />
            </>
          )}

          {/* Simple Co-Pilot Modal */}
          {coPilotOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={handleCoPilotClose}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <h2 style={{ margin: 0, color: '#1f2937' }}>
                    🤖 AI Co-Pilot
                  </h2>
                  <button
                    onClick={handleCoPilotClose}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '24px',
                      cursor: 'pointer',
                      color: '#6b7280',
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                    Hi! I'm your AI Co-Pilot. I can help you navigate FleetFlow,
                    discover features, troubleshoot issues, and optimize your
                    workflow.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>
                    What I can help with:
                  </h3>
                  <ul
                    style={{
                      color: '#4b5563',
                      lineHeight: '1.6',
                      paddingLeft: '20px',
                    }}
                  >
                    <li>📚 Learning FleetFlow features and best practices</li>
                    <li>🔍 Finding hidden features and shortcuts</li>
                    <li>🚛 Driver scheduling and load matching</li>
                    <li>📊 Route optimization and analytics</li>
                    <li>❓ Troubleshooting and support</li>
                  </ul>
                </div>

                <div
                  style={{
                    backgroundColor: '#f3f4f6',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    💡 <strong>Tip:</strong> For advanced AI features and
                    real-time assistance, visit the AI Flow section of FleetFlow
                    where I can take direct actions and provide more interactive
                    help.
                  </p>
                </div>
              </div>
            </div>
          )}
        </LoadProvider>
      </ShipperProvider>
    </SimpleErrorBoundary>
  );
}
