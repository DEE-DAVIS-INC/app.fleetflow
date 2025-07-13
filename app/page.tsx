import Navigation from './components/Navigation'
import AuthWrapper from './components/AuthWrapper'
import Link from 'next/link'

// Cache Buster: June 29, 2025 - 8:53 PM EST - LOCAL BUILD VERIFIED 35 PAGES
export default function Page() {
  return (
    <AuthWrapper>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        <Navigation />
        
        <div style={{
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <h1 style={{
              fontSize: '3.5rem',
              textAlign: 'center',
              marginBottom: '10px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              🚛 FleetFlow Dashboard
            </h1>
            
            <div style={{
              textAlign: 'center',
              fontSize: '1.2rem',
              marginBottom: '30px',
              opacity: 0.9
            }}>
              ✅ Full System Restored | {new Date().toLocaleString()}
            </div>

            {/* Core Operations */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Dispatch Management */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>� Dispatch Management</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/dispatch" style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    🚚 Active Dispatch Board
                  </Link>
                  <Link href="/dispatch-board" style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    📊 Load Distribution
                  </Link>
                </div>
              </div>

              {/* AI & Automation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>🤖 AI & Automation</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/ai" style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    🧠 AI Dashboard
                  </Link>
                  <Link href="/routes" style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    �️ Route Optimization
                  </Link>
                </div>
              </div>

              {/* Fleet Management */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '25px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>� Fleet Management</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/drivers" style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    👨‍💼 Driver Management
                  </Link>
                  <Link href="/vehicles" style={{
                    display: 'block',
                    padding: '12px 20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}>
                    🚚 Vehicle Tracking
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {/* Business Operations */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>💼 Business Operations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="/shippers" style={{
                    display: 'block',
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    🏢 Shipper Management
                  </Link>
                  <Link href="/quoting" style={{
                    display: 'block',
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    💰 Quote Management
                  </Link>
                </div>
              </div>

              {/* Analytics */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>📊 Analytics</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="/analytics" style={{
                    display: 'block',
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    📈 Performance Analytics
                  </Link>
                  <Link href="/reports" style={{
                    display: 'block',
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    📋 Custom Reports
                  </Link>
                </div>
              </div>

              {/* System Management */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)'
              }}>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '15px' }}>⚙️ System Management</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link href="/settings" style={{
                    display: 'block',
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    🔧 System Settings
                  </Link>
                  <Link href="/maintenance" style={{
                    display: 'block',
                    padding: '10px 15px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    🔧 Maintenance Schedule
                  </Link>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '25px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>� System Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>✅</div>
                  <div style={{ fontSize: '0.9rem' }}>All Systems Operational</div>
                </div>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🔄</div>
                  <div style={{ fontSize: '0.9rem' }}>Real-time Updates Active</div>
                </div>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>🛡️</div>
                  <div style={{ fontSize: '0.9rem' }}>Security: Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
