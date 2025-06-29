'use client'

import { useState } from 'react'
import Link from 'next/link'
import MetricsGrid from '../components/MetricsGrid'

export default function PerformancePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Sample performance metrics
  const performanceMetrics = {
    totalVehicles: 45,
    activeVehicles: 38,
    maintenanceVehicles: 7,
    totalDrivers: 52,
    activeRoutes: 23,
    fuelEfficiency: 8.2,
    monthlyMileage: 125400,
    maintenanceCosts: 18500
  }

  const kpiData = [
    {
      title: 'Fleet Utilization',
      value: '84.4%',
      change: '+2.3%',
      changeType: 'up' as const,
      icon: '📊',
      description: 'Percentage of fleet actively generating revenue'
    },
    {
      title: 'On-Time Delivery',
      value: '96.8%',
      change: '+1.2%',
      changeType: 'up' as const,
      icon: '⏰',
      description: 'Deliveries completed within scheduled time'
    },
    {
      title: 'Driver Satisfaction',
      value: '4.7/5',
      change: '+0.1',
      changeType: 'up' as const,
      icon: '😊',
      description: 'Average driver satisfaction rating'
    },
    {
      title: 'Cost Per Mile',
      value: '$1.84',
      change: '-$0.12',
      changeType: 'up' as const,
      icon: '💰',
      description: 'Average operational cost per mile'
    },
    {
      title: 'Safety Score',
      value: '98.2%',
      change: '+0.5%',
      changeType: 'up' as const,
      icon: '🛡️',
      description: 'Overall fleet safety performance'
    },
    {
      title: 'Customer Rating',
      value: '4.9/5',
      change: '+0.2',
      changeType: 'up' as const,
      icon: '⭐',
      description: 'Average customer satisfaction rating'
    }
  ]

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
                  🎯 Performance Metrics
                </h1>
                <p style={{
                  fontSize: '1.2rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  Real-time fleet performance analytics and KPIs
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['7d', '30d', '90d', '1y'] as const).map((timeframe) => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    style={{
                      background: selectedTimeframe === timeframe 
                        ? 'rgba(255, 255, 255, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {timeframe === '7d' ? '7 Days' : 
                     timeframe === '30d' ? '30 Days' : 
                     timeframe === '90d' ? '90 Days' : '1 Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Fleet Overview Metrics */}
            <div style={{
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '20px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                📊 Fleet Overview
              </h2>
              <MetricsGrid metrics={performanceMetrics} />
            </div>

            {/* Key Performance Indicators */}
            <div style={{
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '20px',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                🏆 Key Performance Indicators
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {kpiData.map((kpi, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <span style={{ fontSize: '2rem' }}>{kpi.icon}</span>
                      <span style={{
                        fontSize: '0.9rem',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: kpi.changeType === 'up' 
                          ? 'rgba(76, 175, 80, 0.3)' 
                          : 'rgba(244, 67, 54, 0.3)',
                        border: `1px solid ${kpi.changeType === 'up' 
                          ? 'rgba(76, 175, 80, 0.5)' 
                          : 'rgba(244, 67, 54, 0.5)'}`,
                        color: kpi.changeType === 'up' ? '#4CAF50' : '#F44336'
                      }}>
                        {kpi.change}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '2.2rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                    }}>
                      {kpi.value}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      {kpi.title}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      opacity: 0.8,
                      lineHeight: '1.4'
                    }}>
                      {kpi.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trends */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '30px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📈</div>
              <h3 style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                margin: '0 0 15px 0',
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
              }}>
                Performance Trends & Analytics
              </h3>
              <p style={{
                fontSize: '1.1rem',
                margin: '0 0 30px 0',
                opacity: 0.9,
                lineHeight: '1.6'
              }}>
                Detailed performance charts and trend analysis coming soon.
                <br />
                Monitor your fleet's efficiency, costs, and operational metrics over time.
              </p>
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  background: 'rgba(33, 150, 243, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  📊 View Charts
                </button>
                <button style={{
                  background: 'rgba(76, 175, 80, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  📄 Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
