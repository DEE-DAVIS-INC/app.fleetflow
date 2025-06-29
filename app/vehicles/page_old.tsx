'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote'
import GoogleMaps from '../components/GoogleMaps'
import FleetFlowLogo from '../components/Logo'

interface Vehicle {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'maintenance'
  driver: string
  location: string
  fuelLevel: number
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
}

export default function VehiclesPage() {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'V001',
      name: 'Truck-045',
      type: 'Heavy Truck',
      status: 'active',
      driver: 'John Smith',
      location: 'Downtown Route',
      fuelLevel: 85,
      mileage: 125000,
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-08-15'
    },
    {
      id: 'V002',
      name: 'Van-012',
      type: 'Delivery Van',
      status: 'maintenance',
      driver: 'Unassigned',
      location: 'Service Center',
      fuelLevel: 45,
      mileage: 89000,
      lastMaintenance: '2024-06-01',
      nextMaintenance: '2024-07-01'
    },
    {
      id: 'V003',
      name: 'Truck-089',
      type: 'Medium Truck',
      status: 'active',
      driver: 'Sarah Johnson',
      location: 'Highway 101',
      fuelLevel: 20,
      mileage: 156000,
      lastMaintenance: '2024-04-20',
      nextMaintenance: '2024-07-20'
    },
    {
      id: 'V004',
      name: 'Van-023',
      type: 'Delivery Van',
      status: 'active',
      driver: 'Mike Wilson',
      location: 'Industrial District',
      fuelLevel: 67,
      mileage: 67000,
      lastMaintenance: '2024-05-30',
      nextMaintenance: '2024-08-30'
    },
    {
      id: 'V005',
      name: 'Truck-156',
      type: 'Heavy Truck',
      status: 'inactive',
      driver: 'Unassigned',
      location: 'Depot',
      fuelLevel: 100,
      mileage: 203000,
      lastMaintenance: '2024-06-10',
      nextMaintenance: '2024-09-10'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getFuelLevelColor = (level: number) => {
    if (level < 25) return '#ef4444'
    if (level < 50) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="p-6 space-y-8">
        {/* Header with Logo */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl">🚛</span>
                </div>
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">Vehicle Management</h1>
                  <p className="text-green-100 text-lg">Monitor and manage your entire fleet</p>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40">
                + Add Vehicle
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-teal-400/20 rounded-full blur-lg"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🔍</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Vehicles</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by name or driver..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                📊 Export List
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Vehicle Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="metric-card">
          <div className="metric-value">{vehicles.length}</div>
          <div className="metric-label">Total Vehicles</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{vehicles.filter(v => v.status === 'active').length}</div>
          <div className="metric-label">Active</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{vehicles.filter(v => v.status === 'maintenance').length}</div>
          <div className="metric-label">In Maintenance</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{vehicles.filter(v => v.status === 'inactive').length}</div>
          <div className="metric-label">Inactive</div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card">
        <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Fleet Overview ({filteredVehicles.length} vehicles)
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Status</th>
                <th>Driver</th>
                <th>Location</th>
                <th>Fuel Level</th>
                <th>Mileage</th>
                <th>Next Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600' }}>{vehicle.name}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        ID: {vehicle.id}
                      </div>
                    </div>
                  </td>
                  <td>{vehicle.type}</td>
                  <td>
                    <span className={`status status-${vehicle.status}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td>{vehicle.driver}</td>
                  <td>{vehicle.location}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div 
                        style={{ 
                          width: '60px', 
                          height: '8px', 
                          backgroundColor: '#e5e7eb', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          style={{ 
                            width: `${vehicle.fuelLevel}%`, 
                            height: '100%', 
                            backgroundColor: getFuelLevelColor(vehicle.fuelLevel),
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.875rem' }}>{vehicle.fuelLevel}%</span>
                    </div>
                  </td>
                  <td>{vehicle.mileage.toLocaleString()} km</td>
                  <td>{vehicle.nextMaintenance}</td>
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

      {/* Vehicle Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3>Vehicle Tracking & Routes</h3>
          </div>
          <div className="card-content">
            <GoogleMaps />
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3>Vehicle Notes & Maintenance</h3>
          </div>
          <div className="card-content">
            <StickyNote 
              section="vehicles" 
              entityId="vehicles-general" 
              entityName="Vehicle Management"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
