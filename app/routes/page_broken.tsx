'use client'

import { useState } from 'react'
import GoogleMaps from '../components/GoogleMaps'
import StickyNote from '../components/StickyNote'
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard'

interface Route {
  id: string
  name: string
  status: 'active' | 'completed' | 'planned' | 'cancelled'
  driver: string
  vehicle: string
  startLocation: string
  endLocation: string
  distance: number
  estimatedTime: string
  actualTime?: string
  startTime: string
  endTime?: string
  stops: number
  priority: 'low' | 'medium' | 'high'
}

export default function RoutesPage() {
  const [routes] = useState<Route[]>([
    {
      id: 'R001',
      name: 'Downtown Delivery',
      status: 'active',
      driver: 'John Smith',
      vehicle: 'Truck-045',
      startLocation: 'Warehouse A',
      endLocation: 'Downtown District',
      distance: 45,
      estimatedTime: '2h 30m',
      startTime: '08:00 AM',
      stops: 8,
      priority: 'high'
    },
    {
      id: 'R002',
      name: 'Industrial Zone',
      status: 'completed',
      driver: 'Sarah Johnson',
      vehicle: 'Truck-089',
      startLocation: 'Warehouse B',
      endLocation: 'Industrial Park',
      distance: 67,
      estimatedTime: '3h 15m',
      actualTime: '3h 8m',
      startTime: '06:00 AM',
      endTime: '09:08 AM',
      stops: 12,
      priority: 'medium'
    },
    {
      id: 'R003',
      name: 'Suburban Route',
      status: 'planned',
      driver: 'Mike Wilson',
      vehicle: 'Van-023',
      startLocation: 'Depot',
      endLocation: 'Suburban Area',
      distance: 32,
      estimatedTime: '2h 0m',
      startTime: '02:00 PM',
      stops: 6,
      priority: 'low'
    },
    {
      id: 'R004',
      name: 'Express Delivery',
      status: 'active',
      driver: 'Lisa Anderson',
      vehicle: 'Van-034',
      startLocation: 'Warehouse A',
      endLocation: 'City Center',
      distance: 28,
      estimatedTime: '1h 45m',
      startTime: '10:30 AM',
      stops: 3,
      priority: 'high'
    },
    {
      id: 'R005',
      name: 'Night Shift Route',
      status: 'cancelled',
      driver: 'David Brown',
      vehicle: 'Truck-156',
      startLocation: 'Warehouse C',
      endLocation: 'Airport District',
      distance: 89,
      estimatedTime: '4h 20m',
      startTime: '11:00 PM',
      stops: 15,
      priority: 'medium'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [activeTab, setActiveTab] = useState<'routes' | 'optimizer'>('routes')

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || route.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Route Management
          </h1>
          <p className="text-gray-600">
            Plan, monitor, and optimize delivery routes
          </p>
        </div>
        <button className="btn btn-primary">
          + Create Route
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('routes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'routes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Current Routes
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'optimizer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚡ Route Optimizer
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'routes' && (
        <div className="routes-tab">
          {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">Search Routes</label>
            <input
              type="text"
              placeholder="Search by name, driver, or vehicle..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Status Filter</label>
            <select 
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="planned">Planned</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Priority Filter</label>
            <select 
              className="form-input"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quick Actions</label>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              Route Optimizer
            </button>
          </div>
        </div>
      </div>

      {/* Route Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="metric-card">
          <div className="metric-value">{routes.length}</div>
          <div className="metric-label">Total Routes</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{routes.filter(r => r.status === 'active').length}</div>
          <div className="metric-label">Active Routes</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{routes.filter(r => r.status === 'planned').length}</div>
          <div className="metric-label">Planned Routes</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">
            {routes.reduce((sum, r) => sum + r.distance, 0).toLocaleString()}km
          </div>
          <div className="metric-label">Total Distance</div>
        </div>
      </div>

      {/* Route Overview Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Today's Active Routes
          </h3>
          <div className="space-y-3">
            {routes
              .filter(route => route.status === 'active')
              .map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50" style={{ borderRadius: '6px' }}>
                  <div className="flex items-center gap-3">
                    <div 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: getPriorityColor(route.priority),
                        borderRadius: '50%'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{route.name}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        {route.driver} • {route.vehicle}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ fontWeight: '600' }}>{route.stops} stops</div>
                    <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>{route.distance}km</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Route Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">On-Time Completion</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Delivery Time</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>2h 45m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fuel Efficiency</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>8.2 L/100km</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Satisfaction</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>4.7/5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="card">
        <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Route Schedule ({filteredRoutes.length} routes)
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Route Details</th>
                <th>Distance</th>
                <th>Time</th>
                <th>Stops</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => (
                <tr key={route.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600' }}>{route.name}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        ID: {route.id}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status status-${route.status === 'completed' ? 'active' : route.status === 'cancelled' ? 'inactive' : route.status === 'planned' ? 'maintenance' : 'active'}`}>
                      {route.status}
                    </span>
                  </td>
                  <td>{route.driver}</td>
                  <td>{route.vehicle}</td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>{route.startLocation}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        to {route.endLocation}
                      </div>
                    </div>
                  </td>
                  <td>{route.distance}km</td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>Est: {route.estimatedTime}</div>
                      {route.actualTime && (
                        <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                          Act: {route.actualTime}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{route.stops}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div 
                        style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: getPriorityColor(route.priority),
                          borderRadius: '50%'
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{route.priority}</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}>
                        View
                      </button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}>
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Planning and Maps Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h3>Route Planning & Visualization</h3>
          </div>
          <div className="card-content">
            <GoogleMaps />
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3>Route Notes & Planning</h3>
          </div>
          <div className="card-content">
            <StickyNote 
              section="routes" 
              entityId="routes-general" 
              entityName="Route Planning"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
