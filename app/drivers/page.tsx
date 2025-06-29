'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote'
import SAFERLookup from '../components/SAFERLookup'
import FleetFlowLogo from '../components/Logo'
import { FMCSACarrierInfo } from '../services/fmcsa'

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  status: 'active' | 'inactive' | 'on_break'
  totalMiles: number
  rating: number
  joinDate: string
  lastActivity: string
  eldDeviceId: string
  carrierId?: string
  carrierDotNumber?: string
}

interface Carrier {
  id: string
  carrierName: string
  carrierType: 'Owner Operator' | 'Fleet Company'
  mcNumber: string
  usDotNumber: string
  contactEmail: string
  contactPhone: string
  equipmentTypes: string[]
  vehicles: {
    id: string
    make: string
    model: string
    year: number
    type: 'Dry Van' | 'Refrigerated' | 'Flatbed' | 'Step Deck' | 'Box Truck' | 'Straight Truck'
    vin: string
    currentDriverId?: string
  }[]
  eldProvider: string
  drivers: Driver[]
  joinDate: string
  status: 'active' | 'inactive' | 'suspended'
  fmcsaData?: FMCSACarrierInfo
  fmcsaLastUpdated?: string
  fmcsaVerified: boolean
}

export default function DriversPage() {
  const [drivers] = useState<Driver[]>([
    {
      id: 'D001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      licenseNumber: 'CDL-123456',
      status: 'active',
      totalMiles: 125000,
      rating: 4.8,
      joinDate: '2023-01-15',
      lastActivity: '2024-06-24T10:30:00Z',
      eldDeviceId: 'ELD-001',
      carrierId: 'C001',
      carrierDotNumber: '123456'
    },
    {
      id: 'D002',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1 (555) 234-5678',
      licenseNumber: 'CDL-234567',
      status: 'active',
      totalMiles: 89000,
      rating: 4.9,
      joinDate: '2023-03-20',
      lastActivity: '2024-06-24T09:15:00Z',
      eldDeviceId: 'ELD-002',
      carrierId: 'C002'
    },
    {
      id: 'D003',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 345-6789',
      licenseNumber: 'CDL-345678',
      status: 'on_break',
      totalMiles: 156000,
      rating: 4.6,
      joinDate: '2022-11-10',
      lastActivity: '2024-06-23T18:45:00Z',
      eldDeviceId: 'ELD-003',
      carrierId: 'C001'
    },
    {
      id: 'D004',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '+1 (555) 456-7890',
      licenseNumber: 'CDL-456789',
      status: 'active',
      totalMiles: 78000,
      rating: 4.7,
      joinDate: '2023-05-08',
      lastActivity: '2024-06-24T11:20:00Z',
      eldDeviceId: 'ELD-004'
    },
    {
      id: 'D005',
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1 (555) 567-8901',
      licenseNumber: 'CDL-567890',
      status: 'inactive',
      totalMiles: 203000,
      rating: 4.5,
      joinDate: '2022-08-15',
      lastActivity: '2024-06-20T16:30:00Z',
      eldDeviceId: 'ELD-005'
    }
  ])

  const [carriers] = useState<Carrier[]>([
    {
      id: 'C001',
      carrierName: 'Swift Logistics LLC',
      carrierType: 'Fleet Company',
      mcNumber: 'MC-123456',
      usDotNumber: '123456',
      contactEmail: 'fleet@swiftlogistics.com',
      contactPhone: '+1 (555) 100-2000',
      equipmentTypes: ['Dry Van', 'Refrigerated'],
      vehicles: [
        {
          id: 'V001',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2022,
          type: 'Dry Van',
          vin: '1FUJGHDV7NLBX1234',
          currentDriverId: 'D001'
        },
        {
          id: 'V003',
          make: 'Volvo',
          model: 'VNL',
          year: 2021,
          type: 'Dry Van',
          vin: '4V4NC9EH6MN123456',
          currentDriverId: 'D003'
        }
      ],
      eldProvider: 'KeepTruckin',
      drivers: ['D001', 'D003'].map(id => drivers.find(d => d.id === id)!),
      joinDate: '2022-01-15',
      status: 'active',
      fmcsaVerified: true,
      fmcsaData: {
        dotNumber: '123456',
        legalName: 'Swift Logistics LLC',
        dbaName: 'Swift Logistics',
        carrierOperation: 'Interstate',
        hm: 'N',
        pc: 'N',
        address: {
          street: '123 Main St',
          city: 'Dallas',
          state: 'TX',
          zip: '75201'
        },
        phone: '555-100-2000',
        usdotNumber: '123456',
        mcNumber: 'MC-123456',
        powerUnits: 15,
        drivers: 8,
        mcs150Date: '2024-01-15',
        mcs150Mileage: 125000,
        safetyRating: 'Satisfactory',
        safetyRatingDate: '2024-01-15',
        crashTotal: 1,
        crashFatal: 0,
        crashInjury: 0,
        crashTow: 1,
        crashHazmat: 0,
        inspectionTotal: 15,
        inspectionVehicleOos: 2,
        inspectionDriverOos: 1,
        inspectionHazmat: 0,
        inspectionIep: 0
      },
      fmcsaLastUpdated: '2024-06-24T10:00:00Z'
    },
    {
      id: 'C002',
      carrierName: 'Independent Transport',
      carrierType: 'Owner Operator',
      mcNumber: 'MC-234567',
      usDotNumber: '234567',
      contactEmail: 'sarah@independenttransport.com',
      contactPhone: '+1 (555) 200-3000',
      equipmentTypes: ['Flatbed'],
      vehicles: [
        {
          id: 'V002',
          make: 'Peterbilt',
          model: '389',
          year: 2020,
          type: 'Flatbed',
          vin: '1XPBDP9X6LN123456',
          currentDriverId: 'D002'
        }
      ],
      eldProvider: 'ELD Solutions',
      drivers: ['D002'].map(id => drivers.find(d => d.id === id)!),
      joinDate: '2023-03-15',
      status: 'active',
      fmcsaVerified: false
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [showDriverModal, setShowDriverModal] = useState(false)

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || driver.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border border-gray-200'
      case 'on_break':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐')
    }
    if (hasHalfStar) {
      stars.push('⭐')
    }
    return stars.join('')
  }

  const getCarrierInfo = (carrierId?: string) => {
    return carriers.find(c => c.id === carrierId)
  }

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `${diffMins} minutes ago`
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`
    } else {
      return `${diffDays} days ago`
    }
  }

  return (
    <div className="min-h-screen container mx-auto px-3 py-4 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="space-y-4">
        {/* Header */}
        <div className="card-2d bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-700 text-white p-4 rounded-xl shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <h1 className="text-xl font-bold drop-shadow-lg">Driver Management</h1>
                <p className="text-yellow-100 text-xs drop-shadow-md">Manage your drivers and carrier partnerships</p>
              </div>
            </div>
            <button 
              onClick={() => setShowDriverModal(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              ➕ Add Driver
            </button>
          </div>
        </div>

        {/* Driver Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{drivers.length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{drivers.filter(d => d.status === 'active').length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.filter(d => d.status === 'active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">{drivers.filter(d => d.status === 'on_break').length}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">On Break</p>
                <p className="text-2xl font-bold text-gray-900">{drivers.filter(d => d.status === 'on_break').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⭐</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{(drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length).toFixed(1)}</p>
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
            <h2 className="text-xl font-semibold text-gray-900">Driver Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Drivers</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or license..."
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
                <option value="on_break">On Break</option>
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

        {/* Driver List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">👥</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Driver Overview</h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {filteredDrivers.length} drivers
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => {
              const carrier = getCarrierInfo(driver.carrierId)
              return (
                <div key={driver.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{driver.name}</h3>
                          <p className="text-sm text-gray-500">{driver.licenseNumber}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(driver.status)}`}>
                        {driver.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 mr-2">📧</span>
                        <span className="font-medium mr-2">Email:</span>
                        <span className="truncate">{driver.email}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 mr-2">📞</span>
                        <span className="font-medium mr-2">Phone:</span>
                        <span>{driver.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 mr-2">📏</span>
                        <span className="font-medium mr-2">Miles:</span>
                        <span>{driver.totalMiles.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 mr-2">⭐</span>
                        <span className="font-medium mr-2">Rating:</span>
                        <span>{getRatingStars(driver.rating)} ({driver.rating})</span>
                      </div>
                      
                      {carrier && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-4 mr-2">🏢</span>
                          <span className="font-medium mr-2">Carrier:</span>
                          <span className="truncate">{carrier.carrierName}</span>
                          {carrier.fmcsaVerified && (
                            <span className="ml-2 text-green-600">✓</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-4 mr-2">🕐</span>
                        <span className="font-medium mr-2">Last Active:</span>
                        <span>{formatLastActivity(driver.lastActivity)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 mt-6">
                      <button 
                        onClick={() => {
                          setSelectedDriver(driver)
                          setShowDriverModal(true)
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        View Details
                      </button>
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-300">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* FMCSA Lookup and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">FMCSA Safety Lookup</h3>
            </div>
            <SAFERLookup />
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Driver Notes</h3>
            </div>
            <StickyNote 
              section="drivers" 
              entityId="drivers-general" 
              entityName="Driver Management"
            />
          </div>
        </div>

        {/* Carrier Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🏢</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Carrier Partnerships</h2>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {carriers.length} carriers
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {carriers.map((carrier) => (
              <div key={carrier.id} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{carrier.carrierName}</h3>
                    <p className="text-sm text-gray-600">{carrier.carrierType}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {carrier.fmcsaVerified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        ✓ FMCSA Verified
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(carrier.status)}`}>
                      {carrier.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>MC Number:</span>
                    <span className="font-medium">{carrier.mcNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DOT Number:</span>
                    <span className="font-medium">{carrier.usDotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vehicles:</span>
                    <span className="font-medium">{carrier.vehicles.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drivers:</span>
                    <span className="font-medium">{carrier.drivers.length}</span>
                  </div>
                  {carrier.fmcsaData?.safetyRating && (
                    <div className="flex justify-between">
                      <span>Safety Rating:</span>
                      <span className={`font-medium ${
                        carrier.fmcsaData.safetyRating === 'Satisfactory' ? 'text-green-600' :
                        carrier.fmcsaData.safetyRating === 'Conditional' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {carrier.fmcsaData.safetyRating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
