import Navigation from './components/Navigation'
import Link from 'next/link'

// Cache Buster: June 29, 2025 - Force Fresh Deploy
export default function Page() {
  return (
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
            <Link href="/dispatch" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(76, 175, 80, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>🚛 Dispatch Central</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Manage loads, assign drivers, track shipments</p>
              </div>
            </Link>
            
            <Link href="/dispatch-board" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(33, 150, 243, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>� Load Board</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>View and manage available loads</p>
              </div>
            </Link>
            
            <Link href="/broker" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 152, 0, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>📊 Broker Box</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Freight brokerage operations</p>
              </div>
            </Link>
            
            <Link href="/quoting" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(156, 39, 176, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>💰 Freight Quoting</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Generate competitive quotes</p>
              </div>
            </Link>
          </div>

          {/* Documents & Resources */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <Link href="/documents" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 152, 0, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>📄 Document Generation</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Create rate confirmations, bills of lading, and freight documents</p>
              </div>
            </Link>
            
            <Link href="/reports" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(156, 39, 176, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>📊 Fleet Reports</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Performance analytics, financial reports, and insights</p>
              </div>
            </Link>
            
            <Link href="/training" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(76, 175, 80, 0.8)',
                padding: '25px',
                borderRadius: '15px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                color: 'white'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>🎓 Training Center</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Professional development and certification programs</p>
              </div>
            </Link>
          </div>

          {/* Fleet Management */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
            <Link href="/drivers" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(76, 175, 80, 0.6)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>� Drivers</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Driver management</p>
              </div>
            </Link>
            
            <Link href="/vehicles" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(33, 150, 243, 0.6)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>🚗 Vehicles</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Fleet tracking</p>
              </div>
            </Link>
            
            <Link href="/shippers" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(255, 152, 0, 0.6)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>🏢 Shippers</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Client management</p>
              </div>
            </Link>
            
            <Link href="/maintenance" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(156, 39, 176, 0.6)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>� Maintenance</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Vehicle service</p>
              </div>
            </Link>
            
            <Link href="/analytics" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(76, 175, 80, 0.6)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>📊 Analytics</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Performance data</p>
              </div>
            </Link>
            
            <Link href="/ai" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'rgba(33, 150, 243, 0.6)',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white'
              }}>
                <h4 style={{ margin: '0 0 8px 0' }}>🤖 AI Dashboard</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Smart insights</p>
              </div>
            </Link>
          </div>

          {/* Quick Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ marginTop: 0, textAlign: 'center' }}>📈 Live Fleet Stats</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '20px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4CAF50' }}>23</div>
                <div style={{ opacity: 0.8 }}>Active Loads</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2196F3' }}>8</div>
                <div style={{ opacity: 0.8 }}>Available Drivers</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#FF9800' }}>45</div>
                <div style={{ opacity: 0.8 }}>Total Vehicles</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#9C27B0' }}>94%</div>
                <div style={{ opacity: 0.8 }}>Fleet Efficiency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
