'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote'
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard'
import Link from 'next/link'

export default function RoutesPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'optimizer'>('optimizer')

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        padding: '20px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Back Navigation */}
          <div style={{ marginBottom: '20px' }}>
            <Link href="/" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              textDecoration: 'none',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}>
              ← Back to Dashboard
            </Link>
          </div>

          {/* Main Container */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '3rem',
                  margin: '0 0 10px 0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  🗺️ Route Management
                </h1>
                <p style={{
                  fontSize: '1.2rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  AI-powered route planning with Google Maps integration
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}>
                  + Create Route
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div style={{ marginBottom: '30px' }}>
              <nav style={{ display: 'flex', gap: '20px' }}>
                <button
                  onClick={() => setActiveTab('routes')}
                  style={{
                    background: activeTab === 'routes' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'transparent',
                    border: activeTab === 'routes'
                      ? '1px solid rgba(255, 255, 255, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📋 Current Routes
                </button>
                <button
                  onClick={() => setActiveTab('optimizer')}
                  style={{
                    background: activeTab === 'optimizer' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'transparent',
                    border: activeTab === 'optimizer'
                      ? '1px solid rgba(255, 255, 255, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ⚡ Route Optimizer
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'routes' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '40px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚛</div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: '600',
                  margin: '0 0 15px 0',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                  Current Routes Dashboard
                </h3>
                <p style={{
                  fontSize: '1.1rem',
                  margin: '0 0 30px 0',
                  opacity: 0.9,
                  lineHeight: '1.6'
                }}>
                  This section shows your existing routes and active deliveries.
                  <br />
                  Click "Route Optimizer" to experience the new AI-powered optimization features!
                </p>
                <button
                  onClick={() => setActiveTab('optimizer')}
                  style={{
                    background: 'rgba(76, 175, 80, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Try Route Optimizer →
                </button>
              </div>
            )}

            {activeTab === 'optimizer' && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <RouteOptimizerDashboard />
              </div>
            )}

            {/* Sticky Notes Section */}
            <div style={{
              marginTop: '30px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <StickyNote section="routes" entityId="route-optimization" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
