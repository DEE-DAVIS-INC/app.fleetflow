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
      driver: 'Sarah Wilson',
      location: 'Highway 101',
      fuelLevel: 92,
      mileage: 78000,
      lastMaintenance: '2024-04-20',
      nextMaintenance: '2024-07-20'
    },
    {
      id: 'V004',
      name: 'Van-034',
      type: 'Light Van',
      status: 'inactive',
      driver: 'Unassigned',
      location: 'Depot',
      fuelLevel: 30,
      mileage: 156000,
      lastMaintenance: '2024-05-25',
      nextMaintenance: '2024-08-25'
    },
    {
      id: 'V005',
      name: 'Truck-156',
      type: 'Heavy Truck',
      status: 'active',
      driver: 'Mike Johnson',
      location: 'Interstate 95',
      fuelLevel: 68,
      mileage: 201000,
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
    if (level < 25) return 'from-red-500 to-red-600'
    if (level < 50) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-green-600'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800 border border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
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

        {/* Fleet Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{vehicles.length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{vehicles.filter(v => v.status === 'active').length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{vehicles.filter(v => v.status === 'maintenance').length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">In Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{vehicles.filter(v => v.status === 'maintenance').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{Math.round(vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length)}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Fuel Level</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length)}%</p>
              </div>
            </div>
          </div>
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

        {/* Vehicle List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🚛</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Fleet Overview</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {filteredVehicles.length} vehicles
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500">ID: {vehicle.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 mr-2">🚛</span>
                      <span className="font-medium mr-2">Type:</span>
                      <span>{vehicle.type}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 mr-2">👤</span>
                      <span className="font-medium mr-2">Driver:</span>
                      <span>{vehicle.driver}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 mr-2">📍</span>
                      <span className="font-medium mr-2">Location:</span>
                      <span>{vehicle.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 mr-2">📏</span>
                      <span className="font-medium mr-2">Mileage:</span>
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    
                    {/* Fuel Level */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Fuel Level</span>
                        <span className="text-sm font-bold text-gray-900">{vehicle.fuelLevel}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getFuelLevelColor(vehicle.fuelLevel)} transition-all duration-300`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="w-4 mr-2">🔧</span>
                      <span className="font-medium mr-2">Next Service:</span>
                      <span>{vehicle.nextMaintenance}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5">
                      View Details
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-300">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Management Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Vehicle Tracking & Routes</h3>
            </div>
            <GoogleMaps />
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Vehicle Notes & Maintenance</h3>
            </div>
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
