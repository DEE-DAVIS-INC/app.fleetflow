const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'route_completed',
      message: 'Route #234 completed by John Smith',
      vehicle: 'Truck-045',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'maintenance_scheduled',
      message: 'Maintenance scheduled for Van-012',
      vehicle: 'Van-012',
      time: '15 minutes ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'fuel_alert',
      message: 'Low fuel alert for Truck-089',
      vehicle: 'Truck-089',
      time: '32 minutes ago',
      status: 'alert'
    },
    {
      id: 4,
      type: 'driver_assigned',
      message: 'Sarah Johnson assigned to Route #567',
      vehicle: 'Van-023',
      time: '1 hour ago',
      status: 'info'
    },
    {
      id: 5,
      type: 'route_started',
      message: 'Route #890 started by Mike Wilson',
      vehicle: 'Truck-156',
      time: '1 hour ago',
      status: 'success'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'alert': return '🚨'
      case 'info': return 'ℹ️'
      default: return '📝'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'alert': return '#ef4444'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
          Recent Activity
        </h3>
        <button className="btn btn-secondary">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50" style={{ borderRadius: '6px' }}>
            <div style={{ fontSize: '1.25rem' }}>
              {getStatusIcon(activity.status)}
            </div>
            
            <div className="flex-1">
              <p className="text-gray-900 mb-1" style={{ fontWeight: '500' }}>
                {activity.message}
              </p>
              <div className="flex items-center gap-4 text-gray-600" style={{ fontSize: '0.875rem' }}>
                <span>Vehicle: {activity.vehicle}</span>
                <span>{activity.time}</span>
              </div>
            </div>
            
            <div 
              className="status"
              style={{ 
                backgroundColor: `${getStatusColor(activity.status)}20`,
                color: getStatusColor(activity.status),
                fontSize: '0.75rem'
              }}
            >
              {activity.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity
