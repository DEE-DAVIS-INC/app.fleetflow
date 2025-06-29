'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote'

interface MaintenanceRecord {
  id: string
  vehicleId: string
  vehicleName: string
  type: 'scheduled' | 'emergency' | 'inspection' | 'repair'
  status: 'pending' | 'in_progress' | 'completed' | 'overdue'
  description: string
  scheduledDate: string
  completedDate?: string
  cost: number
  mileage: number
  technician: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedDuration: string
  actualDuration?: string
}

export default function MaintenancePage() {
  const [maintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: 'M001',
      vehicleId: 'V001',
      vehicleName: 'Truck-045',
      type: 'scheduled',
      status: 'pending',
      description: 'Oil change and filter replacement',
      scheduledDate: '2024-06-25',
      cost: 150,
      mileage: 125000,
      technician: 'Mike Thompson',
      priority: 'medium',
      estimatedDuration: '2h'
    },
    {
      id: 'M002',
      vehicleId: 'V002',
      vehicleName: 'Van-012',
      type: 'repair',
      status: 'in_progress',
      description: 'Brake system repair',
      scheduledDate: '2024-06-24',
      cost: 450,
      mileage: 89000,
      technician: 'Sarah Wilson',
      priority: 'high',
      estimatedDuration: '4h',
      actualDuration: '2h 30m'
    },
    {
      id: 'M003',
      vehicleId: 'V003',
      vehicleName: 'Truck-089',
      type: 'inspection',
      status: 'completed',
      description: 'Annual safety inspection',
      scheduledDate: '2024-06-20',
      completedDate: '2024-06-20',
      cost: 200,
      mileage: 156000,
      technician: 'James Rodriguez',
      priority: 'medium',
      estimatedDuration: '3h',
      actualDuration: '2h 45m'
    },
    {
      id: 'M004',
      vehicleId: 'V004',
      vehicleName: 'Van-023',
      type: 'emergency',
      status: 'overdue',
      description: 'Engine diagnostic and repair',
      scheduledDate: '2024-06-22',
      cost: 800,
      mileage: 67000,
      technician: 'Lisa Chen',
      priority: 'critical',
      estimatedDuration: '6h'
    },
    {
      id: 'M005',
      vehicleId: 'V005',
      vehicleName: 'Truck-156',
      type: 'scheduled',
      status: 'completed',
      description: 'Tire rotation and alignment',
      scheduledDate: '2024-06-18',
      completedDate: '2024-06-18',
      cost: 300,
      mileage: 203000,
      technician: 'Mike Thompson',
      priority: 'low',
      estimatedDuration: '2h 30m',
      actualDuration: '2h 15m'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesSearch = record.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.technician.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    const matchesType = typeFilter === 'all' || record.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626'
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scheduled': return '📅'
      case 'emergency': return '🚨'
      case 'inspection': return '🔍'
      case 'repair': return '🔧'
      default: return '⚙️'
    }
  }

  const totalCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0)
  const avgCost = totalCost / maintenanceRecords.length

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Maintenance Management
          </h1>
          <p className="text-gray-600">
            Schedule, track, and manage vehicle maintenance
          </p>
        </div>
        <button className="btn btn-primary">
          + Schedule Maintenance
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">Search</label>
            <input
              type="text"
              placeholder="Search by vehicle, description, or technician..."
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Type Filter</label>
            <select 
              className="form-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="scheduled">Scheduled</option>
              <option value="emergency">Emergency</option>
              <option value="inspection">Inspection</option>
              <option value="repair">Repair</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quick Actions</label>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              Maintenance Report
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="metric-card">
          <div className="metric-value">{maintenanceRecords.length}</div>
          <div className="metric-label">Total Records</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{maintenanceRecords.filter(r => r.status === 'pending').length}</div>
          <div className="metric-label">Pending</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{maintenanceRecords.filter(r => r.status === 'overdue').length}</div>
          <div className="metric-label">Overdue</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">${totalCost.toLocaleString()}</div>
          <div className="metric-label">Total Costs</div>
        </div>
      </div>

      {/* Maintenance Overview */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Upcoming Maintenance
          </h3>
          <div className="space-y-3">
            {maintenanceRecords
              .filter(record => record.status === 'pending' || record.status === 'overdue')
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 4)
              .map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50" style={{ borderRadius: '6px' }}>
                  <div className="flex items-center gap-3">
                    <div style={{ fontSize: '1.5rem' }}>{getTypeIcon(record.type)}</div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{record.vehicleName}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        {record.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div 
                      style={{ 
                        color: record.status === 'overdue' ? '#ef4444' : '#6b7280',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}
                    >
                      {record.scheduledDate}
                    </div>
                    <div 
                      className="status"
                      style={{ 
                        backgroundColor: record.status === 'overdue' ? '#fef2f2' : '#fef3c7',
                        color: record.status === 'overdue' ? '#dc2626' : '#d97706',
                        fontSize: '0.75rem'
                      }}
                    >
                      {record.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Maintenance Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Cost per Service</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                ${avgCost.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">On-Time Completion</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Emergency Repairs</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                {maintenanceRecords.filter(r => r.type === 'emergency').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Maintenance Budget</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>$12,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="card">
        <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Maintenance Records ({filteredRecords.length} records)
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Status</th>
                <th>Description</th>
                <th>Scheduled Date</th>
                <th>Technician</th>
                <th>Cost</th>
                <th>Duration</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600' }}>{record.vehicleName}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        {record.mileage.toLocaleString()} km
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span>{getTypeIcon(record.type)}</span>
                      <span style={{ textTransform: 'capitalize' }}>{record.type}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${
                      record.status === 'completed' ? 'status-active' : 
                      record.status === 'overdue' ? 'status-inactive' : 
                      record.status === 'in_progress' ? 'status-maintenance' : 'status-available'
                    }`}>
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{record.description}</td>
                  <td>
                    <div>
                      <div>{record.scheduledDate}</div>
                      {record.completedDate && (
                        <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                          Completed: {record.completedDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{record.technician}</td>
                  <td>${record.cost}</td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>Est: {record.estimatedDuration}</div>
                      {record.actualDuration && (
                        <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                          Act: {record.actualDuration}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div 
                        style={{ 
                          width: '8px', 
                          height: '8px', 
                          backgroundColor: getPriorityColor(record.priority),
                          borderRadius: '50%'
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{record.priority}</span>
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

      {/* Maintenance Notes Section */}
      <div className="card">
        <div className="card-header">
          <h3>Maintenance Notes & Documentation</h3>
        </div>
        <div className="card-content">
          <StickyNote 
            section="maintenance" 
            entityId="maintenance-general" 
            entityName="Maintenance Operations"
          />
        </div>
      </div>
    </div>
  )
}
