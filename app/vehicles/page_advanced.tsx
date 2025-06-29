'use client'

import { useState, useEffect } from 'react'
import StickyNote from '../components/StickyNote'
import GoogleMaps from '../components/GoogleMaps'
import FleetFlowLogo from '../components/Logo'

interface Vehicle {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'maintenance' | 'warning' | 'critical'
  driver: string
  location: string
  fuelLevel: number
  mileage: number
  lastMaintenance: string
  nextMaintenance: string
  speed: number
  engineTemp: number
  tirePressure: number[]
  gpsCoords: { lat: number; lng: number }
  loadCapacity: number
  currentLoad: number
  efficiency: number
  alerts: string[]
}

export default function VehiclesPage() {
  const [realTimeData, setRealTimeData] = useState<{ [key: string]: any }>({});
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'map'>('grid');
  
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'TRK-045',
      name: 'Freightliner Cascadia',
      type: 'Heavy Truck',
      status: 'active',
      driver: 'John Smith',
      location: 'I-95 North, Mile 247',
      fuelLevel: 85,
      mileage: 125000,
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-08-15',
      speed: 65,
      engineTemp: 195,
      tirePressure: [110, 108, 112, 109],
      gpsCoords: { lat: 40.7128, lng: -74.0060 },
      loadCapacity: 80000,
      currentLoad: 72000,
      efficiency: 6.8,
      alerts: []
    },
    {
      id: 'VAN-012',
      name: 'Mercedes Sprinter',
      type: 'Delivery Van',
      status: 'warning',
      driver: 'Sarah Wilson',
      location: 'Downtown Delivery Zone',
      fuelLevel: 45,
      mileage: 89000,
      lastMaintenance: '2024-06-01',
      nextMaintenance: '2024-07-01',
      speed: 35,
      engineTemp: 210,
      tirePressure: [85, 82, 88, 85],
      gpsCoords: { lat: 40.7589, lng: -73.9851 },
      loadCapacity: 10000,
      currentLoad: 8500,
      efficiency: 12.3,
      alerts: ['Low Fuel', 'High Engine Temp']
    },
    {
      id: 'TRK-089',
      name: 'Volvo VNL',
      type: 'Medium Truck',
      status: 'critical',
      driver: 'Mike Johnson',
      location: 'Service Center',
      fuelLevel: 20,
      mileage: 156000,
      lastMaintenance: '2024-04-10',
      nextMaintenance: '2024-07-10',
      speed: 0,
      engineTemp: 240,
      tirePressure: [95, 70, 98, 94],
      gpsCoords: { lat: 40.6892, lng: -74.0445 },
      loadCapacity: 60000,
      currentLoad: 0,
      efficiency: 5.9,
      alerts: ['Critical Engine Temp', 'Low Tire Pressure', 'Maintenance Required']
    },
    {
      id: 'TRK-156',
      name: 'Peterbilt 579',
      type: 'Heavy Truck',
      status: 'active',
      driver: 'Emily Davis',
      location: 'I-10 West, Mile 89',
      fuelLevel: 92,
      mileage: 78000,
      lastMaintenance: '2024-05-20',
      nextMaintenance: '2024-08-20',
      speed: 70,
      engineTemp: 185,
      tirePressure: [115, 114, 116, 113],
      gpsCoords: { lat: 34.0522, lng: -118.2437 },
      loadCapacity: 80000,
      currentLoad: 75000,
      efficiency: 7.2,
      alerts: []
    },
    {
      id: 'VAN-034',
      name: 'Ford Transit',
      type: 'Delivery Van',
      status: 'maintenance',
      driver: 'Unassigned',
      location: 'Maintenance Bay 3',
      fuelLevel: 30,
      mileage: 203000,
      lastMaintenance: '2024-06-20',
      nextMaintenance: '2024-09-20',
      speed: 0,
      engineTemp: 70,
      tirePressure: [90, 91, 89, 92],
      gpsCoords: { lat: 40.7831, lng: -73.9712 },
      loadCapacity: 8000,
      currentLoad: 0,
      efficiency: 14.1,
      alerts: ['Scheduled Maintenance']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
        totalRevenue: Math.floor(Math.random() * 100000) + 400000,
        activeVehicles: vehicles.filter(v => v.status === 'active').length
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicles]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-500';
      case 'inactive': return 'from-gray-500 to-gray-600';
      case 'maintenance': return 'from-blue-500 to-blue-600';
      case 'warning': return 'from-yellow-500 to-orange-500';
      case 'critical': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '⚪';
      case 'maintenance': return '🔧';
      case 'warning': return '🟡';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  }

  const getFuelLevelColor = (level: number) => {
    if (level < 25) return 'from-red-500 to-red-600'
    if (level < 50) return 'from-yellow-500 to-orange-500'
    return 'from-green-500 to-emerald-500'
  }

  const getEfficiencyColor = (efficiency: number, type: string) => {
    const threshold = type === 'Delivery Van' ? 12 : 6.5;
    if (efficiency >= threshold) return 'text-green-400';
    if (efficiency >= threshold * 0.8) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        {/* Moving Data Points */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-500/30 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-8 space-y-8">
        {/* Advanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-teal-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-2xl">
                    <div className="w-16 h-16 flex items-center justify-center text-4xl">
                      🚛
                    </div>
                  </div>
                </div>
                <div className="text-white">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-green-100 to-teal-100 bg-clip-text text-transparent mb-3">
                    Fleet Vehicle Command
                  </h1>
                  <p className="text-xl text-gray-300">Advanced vehicle monitoring and control system</p>
                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-400">
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>{vehicles.filter(v => v.status === 'active').length} Active</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span>{vehicles.filter(v => v.status === 'warning').length} Warnings</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>{vehicles.filter(v => v.status === 'critical').length} Critical</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right mr-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                    {vehicles.length}
                  </div>
                  <div className="text-gray-300">Total Vehicles</div>
                </div>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20 hover:border-white/40">
                  + Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { 
              title: 'Active Fleet', 
              value: vehicles.filter(v => v.status === 'active').length, 
              total: vehicles.length,
              icon: '🟢',
              gradient: 'from-green-500 to-emerald-500'
            },
            { 
              title: 'Average Fuel', 
              value: `${Math.round(vehicles.reduce((acc, v) => acc + v.fuelLevel, 0) / vehicles.length)}%`, 
              icon: '⛽',
              gradient: 'from-blue-500 to-cyan-500'
            },
            { 
              title: 'Efficiency', 
              value: `${(vehicles.reduce((acc, v) => acc + v.efficiency, 0) / vehicles.length).toFixed(1)} MPG`, 
              icon: '📊',
              gradient: 'from-purple-500 to-pink-500'
            },
            { 
              title: 'Alerts', 
              value: vehicles.reduce((acc, v) => acc + v.alerts.length, 0), 
              icon: '⚠️',
              gradient: 'from-yellow-500 to-orange-500'
            },
            { 
              title: 'Maintenance', 
              value: vehicles.filter(v => v.status === 'maintenance').length, 
              icon: '🔧',
              gradient: 'from-indigo-500 to-purple-500'
            }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300`}></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Search and View Controls */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">
                  🔍
                </div>
                <h2 className="text-xl font-semibold text-white">Vehicle Control Center</h2>
              </div>
              <div className="flex items-center space-x-2">
                {['grid', 'table', 'map'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as 'grid' | 'table' | 'map')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      viewMode === mode 
                        ? 'bg-white/20 text-white border border-white/30' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {mode === 'grid' ? '⚏' : mode === 'table' ? '☰' : '🗺️'} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search Vehicles</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by ID, name, or driver..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
                <select 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white backdrop-blur-sm transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all" className="bg-gray-800">All Status</option>
                  <option value="active" className="bg-gray-800">Active</option>
                  <option value="inactive" className="bg-gray-800">Inactive</option>
                  <option value="maintenance" className="bg-gray-800">Maintenance</option>
                  <option value="warning" className="bg-gray-800">Warning</option>
                  <option value="critical" className="bg-gray-800">Critical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quick Actions</label>
                <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  📊 Export Fleet Data
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Vehicle Display */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(vehicle.status)} rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  {/* Vehicle Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getStatusColor(vehicle.status)} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                        {getStatusIcon(vehicle.status)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{vehicle.id}</h3>
                        <p className="text-sm text-gray-400">{vehicle.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{vehicle.speed} mph</div>
                      <div className="text-xs text-gray-400">Current Speed</div>
                    </div>
                  </div>

                  {/* Driver and Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="w-4 mr-2">👤</span>
                      <span className="font-medium mr-2">Driver:</span>
                      <span>{vehicle.driver}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="w-4 mr-2">📍</span>
                      <span className="font-medium mr-2">Location:</span>
                      <span className="truncate">{vehicle.location}</span>
                    </div>
                  </div>

                  {/* Real-time Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Fuel Level */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Fuel</span>
                        <span className="text-xs text-white font-medium">{vehicle.fuelLevel}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getFuelLevelColor(vehicle.fuelLevel)} transition-all duration-500`}
                          style={{ width: `${vehicle.fuelLevel}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Load Capacity */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Load</span>
                        <span className="text-xs text-white font-medium">{Math.round((vehicle.currentLoad / vehicle.loadCapacity) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                          style={{ width: `${(vehicle.currentLoad / vehicle.loadCapacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Engine Temperature and Efficiency */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-xl font-bold ${vehicle.engineTemp > 220 ? 'text-red-400' : vehicle.engineTemp > 200 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {vehicle.engineTemp}°F
                      </div>
                      <div className="text-xs text-gray-400">Engine Temp</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${getEfficiencyColor(vehicle.efficiency, vehicle.type)}`}>
                        {vehicle.efficiency}
                      </div>
                      <div className="text-xs text-gray-400">MPG</div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {vehicle.alerts.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-red-400 text-sm">⚠️</span>
                        <span className="text-red-400 text-sm font-medium">Active Alerts</span>
                      </div>
                      <div className="space-y-1">
                        {vehicle.alerts.map((alert, index) => (
                          <div key={index} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-lg border border-red-500/30">
                            {alert}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      🔍 Details
                    </button>
                    <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300">
                      📍 Track
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle Maps and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-time Fleet Map */}
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-xl">
                    🗺️
                  </div>
                  <h3 className="text-xl font-semibold text-white">Live Fleet Tracking</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500/20 text-green-300 text-sm font-medium px-3 py-1 rounded-full border border-green-500/30">
                    {vehicles.filter(v => v.status === 'active').length} Active
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-300 text-sm font-medium px-3 py-1 rounded-full border border-yellow-500/30">
                    {vehicles.filter(v => v.alerts.length > 0).length} Alerts
                  </span>
                </div>
              </div>
              <GoogleMaps />
            </div>
          </div>

          {/* Command Notes */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl">
                  📝
                </div>
                <h3 className="text-xl font-semibold text-white">Fleet Command Notes</h3>
              </div>
              <StickyNote 
                section="vehicles" 
                entityId="vehicles-command" 
                entityName="Vehicle Command Center"
              />
            </div>
          </div>
        </div>

        {/* Fleet Performance Analytics */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                📊
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Fleet Performance Analytics</h2>
                <p className="text-gray-300">Real-time operational metrics and insights</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Mileage',
                  value: `${(vehicles.reduce((acc, v) => acc + v.mileage, 0) / 1000).toFixed(0)}K`,
                  subtitle: 'miles driven',
                  gradient: 'from-blue-500 to-cyan-500',
                  icon: '📏'
                },
                {
                  title: 'Fleet Efficiency',
                  value: `${(vehicles.reduce((acc, v) => acc + v.efficiency, 0) / vehicles.length).toFixed(1)}`,
                  subtitle: 'average MPG',
                  gradient: 'from-green-500 to-emerald-500',
                  icon: '⚡'
                },
                {
                  title: 'Load Utilization',
                  value: `${Math.round((vehicles.reduce((acc, v) => acc + (v.currentLoad / v.loadCapacity), 0) / vehicles.length) * 100)}%`,
                  subtitle: 'capacity used',
                  gradient: 'from-purple-500 to-pink-500',
                  icon: '📦'
                },
                {
                  title: 'Maintenance Due',
                  value: vehicles.filter(v => new Date(v.nextMaintenance) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
                  subtitle: 'vehicles (30 days)',
                  gradient: 'from-yellow-500 to-orange-500',
                  icon: '🔧'
                }
              ].map((metric, index) => (
                <div key={index} className="text-center group">
                  <div className={`bg-gradient-to-r ${metric.gradient} w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{metric.icon}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="font-semibold text-gray-300">{metric.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{metric.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
