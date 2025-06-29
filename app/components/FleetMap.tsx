const FleetMap = () => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '25px',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      color: 'white'
    }}>
      <h3 style={{ 
        fontSize: '1.4rem', 
        fontWeight: '600', 
        marginBottom: '20px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
      }}>
        🗺️ Live Fleet Tracking
      </h3>
      
      <div style={{ 
        height: '280px', 
        borderRadius: '12px',
        border: '2px dashed rgba(255, 255, 255, 0.3)',
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '15px', opacity: 0.8 }}>🗺️</div>
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '8px', 
            fontWeight: '500',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Interactive Fleet Map
          </p>
          <p style={{ 
            fontSize: '0.95rem',
            opacity: 0.8,
            marginBottom: '20px'
          }}>
            Real-time vehicle locations and routes
          </p>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}>
            View Full Map
          </button>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            marginBottom: '5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            67
          </div>
          <div style={{ 
            fontSize: '0.9rem',
            opacity: 0.9,
            fontWeight: '500'
          }}>
            Active Routes
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            marginBottom: '5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            134
          </div>
          <div style={{ 
            fontSize: '0.9rem',
            opacity: 0.9,
            fontWeight: '500'
          }}>
            Vehicles Online
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: '700',
            marginBottom: '5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            98%
          </div>
          <div style={{ 
            fontSize: '0.9rem',
            opacity: 0.9,
            fontWeight: '500'
          }}>
            GPS Coverage
          </div>
        </div>
      </div>
    </div>
  )
}

export default FleetMap
