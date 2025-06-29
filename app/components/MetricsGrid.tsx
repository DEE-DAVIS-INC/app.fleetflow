interface MetricsGridProps {
  metrics: {
    totalVehicles: number
    activeVehicles: number
    maintenanceVehicles: number
    totalDrivers: number
    activeRoutes: number
    fuelEfficiency: number
    monthlyMileage: number
    maintenanceCosts: number
  }
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const metricCards = [
    {
      title: 'Total Vehicles',
      value: metrics.totalVehicles,
      change: '+5.2%',
      changeType: 'up',
      icon: '🚛'
    },
    {
      title: 'Active Vehicles',
      value: metrics.activeVehicles,
      change: '+2.1%',
      changeType: 'up',
      icon: '✅'
    },
    {
      title: 'In Maintenance',
      value: metrics.maintenanceVehicles,
      change: '-12.5%',
      changeType: 'down',
      icon: '🔧'
    },
    {
      title: 'Total Drivers',
      value: metrics.totalDrivers,
      change: '+8.3%',
      changeType: 'up',
      icon: '👥'
    },
    {
      title: 'Active Routes',
      value: metrics.activeRoutes,
      change: '+15.2%',
      changeType: 'up',
      icon: '🗺️'
    },
    {
      title: 'Fuel Efficiency',
      value: `${metrics.fuelEfficiency}L/100km`,
      change: '-3.2%',
      changeType: 'up',
      icon: '⛽'
    },
    {
      title: 'Monthly Mileage',
      value: `${metrics.monthlyMileage.toLocaleString()}km`,
      change: '+7.8%',
      changeType: 'up',
      icon: '📊'
    },
    {
      title: 'Maintenance Costs',
      value: `$${metrics.maintenanceCosts.toLocaleString()}`,
      change: '-5.1%',
      changeType: 'down',
      icon: '💰'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {metricCards.map((card, index) => (
        <div key={index} style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          color: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}>
            <span style={{ fontSize: '1.8rem' }}>{card.icon}</span>
            <span style={{
              fontSize: '0.9rem',
              padding: '4px 8px',
              borderRadius: '8px',
              background: card.changeType === 'up' 
                ? 'rgba(76, 175, 80, 0.3)' 
                : 'rgba(244, 67, 54, 0.3)',
              border: `1px solid ${card.changeType === 'up' 
                ? 'rgba(76, 175, 80, 0.5)' 
                : 'rgba(244, 67, 54, 0.5)'}`,
              color: card.changeType === 'up' ? '#4CAF50' : '#F44336'
            }}>
              {card.change}
            </span>
          </div>
          <div style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            marginBottom: '8px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            {card.value}
          </div>
          <div style={{
            fontSize: '0.95rem',
            opacity: 0.9,
            fontWeight: '500'
          }}>
            {card.title}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MetricsGrid
