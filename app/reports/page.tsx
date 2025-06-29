'use client'

import { useState, useEffect, useRef } from 'react'
import StickyNote from '../components/StickyNote'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('last_30_days')
  const chartRef = useRef<HTMLCanvasElement>(null)
  const fuelChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Draw performance chart
    const canvas = chartRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a simple line chart
    const data = [65, 75, 80, 85, 82, 88, 92, 89, 95, 90, 87, 91]
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    
    const maxValue = Math.max(...data)
    const minValue = Math.min(...data)
    const range = maxValue - minValue

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight / 5)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = '#667eea'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    data.forEach((value, index) => {
      const x = padding + (index * chartWidth / (data.length - 1))
      const y = padding + chartHeight - ((value - minValue) / range * chartHeight)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()

    // Draw points
    ctx.fillStyle = '#667eea'
    data.forEach((value, index) => {
      const x = padding + (index * chartWidth / (data.length - 1))
      const y = padding + chartHeight - ((value - minValue) / range * chartHeight)
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }, [selectedReport])

  useEffect(() => {
    // Draw fuel efficiency chart
    const canvas = fuelChartRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const vehicles = ['Truck-045', 'Van-012', 'Truck-089', 'Van-023', 'Truck-156']
    const efficiency = [8.2, 7.5, 9.1, 6.8, 8.7]
    
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2
    const barWidth = chartWidth / vehicles.length - 20
    const maxValue = Math.max(...efficiency)

    vehicles.forEach((vehicle, index) => {
      const barHeight = (efficiency[index] / maxValue) * chartHeight
      const x = padding + index * (chartWidth / vehicles.length) + 10
      const y = padding + chartHeight - barHeight

      // Draw bar
      ctx.fillStyle = index % 2 === 0 ? '#667eea' : '#764ba2'
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw value on top
      ctx.fillStyle = '#374151'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(efficiency[index].toString(), x + barWidth / 2, y - 5)
    })
  }, [selectedReport])

  const reportTypes = [
    { id: 'overview', label: 'Fleet Overview', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'fuel', label: 'Fuel Usage', icon: '⛽' },
    { id: 'drivers', label: 'Driver Reports', icon: '👥' },
    { id: 'routes', label: 'Route Analysis', icon: '🗺️' }
  ]

  const kpis = [
    { label: 'Fleet Utilization', value: '87%', change: '+3.2%', trend: 'up' },
    { label: 'Average Fuel Efficiency', value: '8.2 L/100km', change: '-2.1%', trend: 'up' },
    { label: 'On-Time Delivery', value: '94%', change: '+1.8%', trend: 'up' },
    { label: 'Maintenance Costs', value: '$23,450', change: '-8.5%', trend: 'up' },
    { label: 'Driver Performance', value: '4.7/5', change: '+0.2', trend: 'up' },
    { label: 'Vehicle Downtime', value: '3.2%', change: '-1.1%', trend: 'up' }
  ]

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your fleet performance
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">Export PDF</button>
          <button className="btn btn-primary">Schedule Report</button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Report Type</h3>
          <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
            <select 
              className="form-input"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="last_year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              className={`p-4 text-left border-2 rounded-lg transition-all ${
                selectedReport === report.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-center gap-3">
                <span style={{ fontSize: '1.5rem' }}>{report.icon}</span>
                <div>
                  <div style={{ fontWeight: '600' }}>{report.label}</div>
                  <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                    Detailed analytics and insights
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="metric-card">
            <div className="flex justify-between items-start mb-2">
              <div className="metric-label">{kpi.label}</div>
              <span className={`metric-change ${kpi.trend === 'up' ? 'metric-up' : 'metric-down'}`}>
                {kpi.change}
              </span>
            </div>
            <div className="metric-value" style={{ fontSize: '1.75rem' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Fleet Performance Trend
          </h3>
          <canvas 
            ref={chartRef} 
            width={400} 
            height={250}
            style={{ width: '100%', maxHeight: '250px' }}
          />
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div style={{ width: '12px', height: '12px', backgroundColor: '#667eea', borderRadius: '50%' }}></div>
              <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>Performance Score</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Fuel Efficiency by Vehicle
          </h3>
          <canvas 
            ref={fuelChartRef} 
            width={400} 
            height={250}
            style={{ width: '100%', maxHeight: '250px' }}
          />
          <div className="mt-4 text-center">
            <span className="text-gray-600" style={{ fontSize: '0.875rem' }}>
              Fuel consumption (L/100km) - Lower is better
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Reports Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Top Performing Vehicles
          </h3>
          <div className="space-y-3">
            {[
              { vehicle: 'Van-023', score: 95, efficiency: 6.8, uptime: '99.2%' },
              { vehicle: 'Truck-045', score: 92, efficiency: 8.2, uptime: '97.8%' },
              { vehicle: 'Van-012', score: 89, efficiency: 7.5, uptime: '95.5%' },
              { vehicle: 'Truck-156', score: 87, efficiency: 8.7, uptime: '94.1%' }
            ].map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50" style={{ borderRadius: '6px' }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center justify-center"
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#6b7280',
                      borderRadius: '50%',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{vehicle.vehicle}</div>
                    <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                      Score: {vehicle.score}/100
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{vehicle.efficiency} L/100km</div>
                  <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>{vehicle.uptime} uptime</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Monthly Breakdown
          </h3>
          <div className="space-y-4">
            {[
              { category: 'Total Distance', value: '45,892 km', budget: '50,000 km', percentage: 92 },
              { category: 'Fuel Costs', value: '$12,450', budget: '$15,000', percentage: 83 },
              { category: 'Maintenance', value: '$8,230', budget: '$10,000', percentage: 82 },
              { category: 'Driver Hours', value: '2,340 hrs', budget: '2,500 hrs', percentage: 94 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{item.category}</span>
                  <span style={{ fontWeight: '600' }}>{item.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '8px', 
                      backgroundColor: '#e5e7eb', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div 
                      style={{ 
                        width: `${item.percentage}%`, 
                        height: '100%', 
                        backgroundColor: item.percentage > 90 ? '#10b981' : item.percentage > 75 ? '#f59e0b' : '#ef4444',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280', minWidth: '40px' }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="text-gray-500" style={{ fontSize: '0.75rem' }}>
                  Budget: {item.budget}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="card">
        <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Fleet Summary Report
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Total Distance</th>
                <th>Fuel Used</th>
                <th>Efficiency</th>
                <th>Uptime</th>
                <th>Maintenance Cost</th>
                <th>Performance Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { vehicle: 'Truck-045', distance: '12,450 km', fuel: '1,021 L', efficiency: '8.2 L/100km', uptime: '97.8%', maintenance: '$2,340', score: 92 },
                { vehicle: 'Van-012', distance: '8,920 km', fuel: '669 L', efficiency: '7.5 L/100km', uptime: '95.5%', maintenance: '$1,890', score: 89 },
                { vehicle: 'Truck-089', distance: '15,670 km', fuel: '1,426 L', efficiency: '9.1 L/100km', uptime: '92.3%', maintenance: '$3,120', score: 85 },
                { vehicle: 'Van-023', distance: '6,780 km', fuel: '461 L', efficiency: '6.8 L/100km', uptime: '99.2%', maintenance: '$980', score: 95 },
                { vehicle: 'Truck-156', distance: '11,230 km', fuel: '977 L', efficiency: '8.7 L/100km', uptime: '94.1%', maintenance: '$2,560', score: 87 }
              ].map((row, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{row.vehicle}</td>
                  <td>{row.distance}</td>
                  <td>{row.fuel}</td>
                  <td>{row.efficiency}</td>
                  <td>{row.uptime}</td>
                  <td>{row.maintenance}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: '600' }}>{row.score}</span>
                      <div 
                        style={{ 
                          width: '40px', 
                          height: '6px', 
                          backgroundColor: '#e5e7eb', 
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{ 
                            width: `${row.score}%`, 
                            height: '100%', 
                            backgroundColor: row.score > 90 ? '#10b981' : row.score > 80 ? '#3b82f6' : '#f59e0b',
                            borderRadius: '3px'
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Notes Section */}
      <div className="card">
        <div className="card-header">
          <h3>Report Analysis & Notes</h3>
        </div>
        <div className="card-content">
          <StickyNote 
            section="reports" 
            entityId="reports-general" 
            entityName="Fleet Reports"
          />
        </div>
      </div>
    </div>
  )
}
