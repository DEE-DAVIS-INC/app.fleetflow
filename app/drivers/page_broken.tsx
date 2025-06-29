'use client'

import { useState } from 'react'
import StickyNote from '../components/StickyNote'
import SAFERLookup from '../components/SAFERLookup'
import { FMCSACarrierInfo } from '../services/fmcsa'

interface Driver {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string // Hidden from UI
  status: 'active' | 'inactive' | 'on_break'
  totalMiles: number
  rating: number
  joinDate: string
  lastActivity: string
  // ELD Information (driver-specific)
  eldDeviceId: string
  // FMCSA Carrier Information
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
  // Equipment/Vehicle Information
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
  // ELD Company Information
  eldProvider: string
  // Drivers under this carrier
  drivers: Driver[]
  joinDate: string
  status: 'active' | 'inactive' | 'suspended'
  // FMCSA Integration Data
  fmcsaData?: FMCSACarrierInfo
  fmcsaLastUpdated?: string
  fmcsaVerified: boolean
}

interface DriverInvoice {
  id: string
  driverId: string
  driverName: string
  loadId: string
  carrierName: string
  loadAmount: number
  dispatchFee: number
  invoiceDate: string
  dueDate: string
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue'
  weekEnding: string
}

export default function CarriersPage() {
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'drivers' | 'vehicles' | 'invoices'>('overview')
  const [invoiceTimeFrame, setInvoiceTimeFrame] = useState<'week' | 'month' | 'quarter'>('month')
  
  // Invoice reminder system
  const getNextInvoiceDate = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysUntilMonday = currentDay === 0 ? 1 : currentDay === 1 ? 7 : 8 - currentDay
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + daysUntilMonday)
    return nextMonday.toLocaleDateString()
  }

  const getNextDueDate = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const daysUntilWednesday = currentDay <= 3 ? 3 - currentDay : 10 - currentDay
    const nextWednesday = new Date(today)
    nextWednesday.setDate(today.getDate() + daysUntilWednesday)
    return nextWednesday.toLocaleDateString()
  }

  // FMCSA Integration
  const handleFMCSAUpdate = (fmcsaData: FMCSACarrierInfo | null) => {
    if (!fmcsaData || !selectedCarrier) return

    // Update the selected carrier with FMCSA data
    const updatedCarrier: Carrier = {
      ...selectedCarrier,
      fmcsaData: fmcsaData,
      fmcsaLastUpdated: new Date().toISOString(),
      fmcsaVerified: true,
      // Update carrier details with FMCSA data
      carrierName: fmcsaData.legalName || selectedCarrier.carrierName,
      usDotNumber: fmcsaData.dotNumber || selectedCarrier.usDotNumber,
      mcNumber: fmcsaData.mcNumber || selectedCarrier.mcNumber,
      contactPhone: fmcsaData.phone || selectedCarrier.contactPhone
    }

    // Update the carriers list
    setCarriers(prevCarriers => 
      prevCarriers.map(carrier => 
        carrier.id === selectedCarrier.id ? updatedCarrier : carrier
      )
    )

    // Update selected carrier
    setSelectedCarrier(updatedCarrier)
  }

  const [carriers, setCarriers] = useState<Carrier[]>([
    {
      id: 'C001',
      carrierName: 'Smith Trucking LLC',
      carrierType: 'Owner Operator',
      mcNumber: 'MC-123456',
      usDotNumber: 'DOT-654321',
      contactEmail: 'contact@smithtrucking.com',
      contactPhone: '+1 (555) 123-4567',
      equipmentTypes: ['Dry Van', 'Refrigerated'],
      vehicles: [
        {
          id: 'V001',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2021,
          type: 'Dry Van',
          vin: '1FUJGHDV0MLBX1234',
          currentDriverId: 'D001'
        },
        {
          id: 'V002', 
          make: 'Utility',
          model: 'Reefer Trailer',
          year: 2020,
          type: 'Refrigerated',
          vin: '1UYVS2532LM123456'
        }
      ],
      eldProvider: 'ELD Solutions Pro',
      drivers: [
        {
          id: 'D001',
          name: 'John Smith',
          email: 'john.smith@smithtrucking.com',
          phone: '+1 (555) 123-4567',
          licenseNumber: 'DL-123456789',
          status: 'active',
          totalMiles: 125000,
          rating: 4.8,
          joinDate: '2022-01-15',
          lastActivity: '2 minutes ago',
          eldDeviceId: 'ELD-001-JS'
        }
      ],
      joinDate: '2022-01-15',
      status: 'active',
      fmcsaVerified: false
    },
    {
      id: 'C002',
      carrierName: 'Johnson Logistics',
      carrierType: 'Owner Operator',
      mcNumber: 'MC-234567',
      usDotNumber: 'DOT-765432',
      contactEmail: 'dispatch@johnsonlogistics.com',
      contactPhone: '+1 (555) 234-5678',
      equipmentTypes: ['Refrigerated'],
      vehicles: [
        {
          id: 'V003',
          make: 'Peterbilt',
          model: '579',
          year: 2020,
          type: 'Refrigerated',
          vin: '1XPWD40X1ED123456',
          currentDriverId: 'D002'
        }
      ],
      eldProvider: 'KeepTruckin',
      drivers: [
        {
          id: 'D002',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@johnsonlogistics.com',
          phone: '+1 (555) 234-5678',
          licenseNumber: 'DL-234567890',
          status: 'active',
          totalMiles: 98000,
          rating: 4.9,
          joinDate: '2021-08-20',
          lastActivity: '15 minutes ago',
          eldDeviceId: 'ELD-002-SJ'
        }
      ],
      joinDate: '2021-08-20',
      status: 'active',
      fmcsaVerified: false
    },
    {
      id: 'C003',
      carrierName: 'Wilson Transport',
      carrierType: 'Fleet Company',
      mcNumber: 'MC-345678',
      usDotNumber: 'DOT-876543',
      contactEmail: 'operations@wilsontransport.com',
      contactPhone: '+1 (555) 345-6789',
      equipmentTypes: ['Box Truck', 'Dry Van'],
      vehicles: [
        {
          id: 'V004',
          make: 'Isuzu',
          model: 'NPR-HD',
          year: 2022,
          type: 'Box Truck',
          vin: 'JALC4B16301234567',
          currentDriverId: 'D003'
        },
        {
          id: 'V005',
          make: 'Freightliner',
          model: 'Cascadia',
          year: 2021,
          type: 'Dry Van',
          vin: '1FUJGHDV0MLBX5678'
        }
      ],
      eldProvider: 'Samsara',
      drivers: [
        {
          id: 'D003',
          name: 'Mike Wilson',
          email: 'mike.wilson@wilsontransport.com',
          phone: '+1 (555) 345-6789',
          licenseNumber: 'DL-345678901',
          status: 'active',
          totalMiles: 87000,
          rating: 4.7,
          joinDate: '2022-03-10',
          lastActivity: '1 hour ago',
          eldDeviceId: 'ELD-003-MW'
        },
        {
          id: 'D006',
          name: 'Jennifer Davis',
          email: 'jennifer.davis@wilsontransport.com',
          phone: '+1 (555) 345-7890',
          licenseNumber: 'DL-678901234',
          status: 'active',
          totalMiles: 75000,
          rating: 4.6,
          joinDate: '2022-06-15',
          lastActivity: '30 minutes ago',
          eldDeviceId: 'ELD-006-JD'
        }
      ],
      joinDate: '2020-03-10',
      status: 'active',
      fmcsaVerified: false
    },
    {
      id: 'C004',
      carrierName: 'Anderson Freight',
      carrierType: 'Owner Operator',
      mcNumber: 'MC-456789',
      usDotNumber: 'DOT-987654',
      contactEmail: 'lisa@andersonfreight.com',
      contactPhone: '+1 (555) 456-7890',
      equipmentTypes: ['Flatbed'],
      vehicles: [
        {
          id: 'V006',
          make: 'Kenworth',
          model: 'T680',
          year: 2019,
          type: 'Flatbed',
          vin: '1XKWDB0X6KJ123456'
        }
      ],
      eldProvider: 'Omnitracs',
      drivers: [
        {
          id: 'D004',
          name: 'Lisa Anderson',
          email: 'lisa@andersonfreight.com',
          phone: '+1 (555) 456-7890',
          licenseNumber: 'DL-456789012',
          status: 'on_break',
          totalMiles: 156000,
          rating: 4.6,
          joinDate: '2020-11-05',
          lastActivity: '3 hours ago',
          eldDeviceId: 'ELD-004-LA'
        }
      ],
      joinDate: '2020-11-05',
      status: 'active',
      fmcsaVerified: false
    },
    {
      id: 'C005',
      carrierName: 'Brown Express',
      carrierType: 'Owner Operator',
      mcNumber: 'MC-567890',
      usDotNumber: 'DOT-098765',
      contactEmail: 'david@brownexpress.com',
      contactPhone: '+1 (555) 567-8901',
      equipmentTypes: ['Step Deck'],
      vehicles: [
        {
          id: 'V007',
          make: 'Volvo',
          model: 'VNL860',
          year: 2018,
          type: 'Step Deck',
          vin: '4V4NC9EJ4JN123456'
        }
      ],
      eldProvider: 'Fleet Complete',
      drivers: [
        {
          id: 'D005',
          name: 'David Brown',
          email: 'david@brownexpress.com',
          phone: '+1 (555) 567-8901',
          licenseNumber: 'DL-567890123',
          status: 'inactive',
          totalMiles: 201000,
          rating: 4.5,
          joinDate: '2019-06-12',
          lastActivity: '2 days ago',
          eldDeviceId: 'ELD-005-DB'
        }
      ],
      joinDate: '2019-06-12',
      status: 'active',
      fmcsaVerified: false
    }
  ])

  // Mock invoice data for carriers/drivers
  const [driverInvoices] = useState<DriverInvoice[]>([
    {
      id: 'INV-001',
      driverId: 'D001',
      driverName: 'John Smith',
      loadId: 'DL001',
      carrierName: 'Smith Trucking LLC',
      loadAmount: 2450,
      dispatchFee: 245,
      invoiceDate: '2024-12-16',
      dueDate: '2024-12-18',
      status: 'Sent',
      weekEnding: '2024-12-15'
    },
    {
      id: 'INV-002',
      driverId: 'D001',
      driverName: 'John Smith',
      loadId: 'DL004',
      carrierName: 'Smith Trucking LLC',
      loadAmount: 1800,
      dispatchFee: 180,
      invoiceDate: '2024-12-09',
      dueDate: '2024-12-11',
      status: 'Paid',
      weekEnding: '2024-12-08'
    },
    {
      id: 'INV-003',
      driverId: 'D002',
      driverName: 'Sarah Johnson',
      loadId: 'DL002',
      carrierName: 'Johnson Logistics',
      loadAmount: 3200,
      dispatchFee: 320,
      invoiceDate: '2024-12-16',
      dueDate: '2024-12-18',
      status: 'Pending',
      weekEnding: '2024-12-15'
    },
    {
      id: 'INV-004',
      driverId: 'D003',
      driverName: 'Mike Wilson',
      loadId: 'DL003',
      carrierName: 'Wilson Transport',
      loadAmount: 1850,
      dispatchFee: 185,
      invoiceDate: '2024-12-02',
      dueDate: '2024-12-04',
      status: 'Overdue',
      weekEnding: '2024-12-01'
    }
  ])

  const getCarrierInvoices = (carrierId: string) => {
    const carrier = carriers.find(c => c.id === carrierId)
    if (!carrier) return []
    
    const now = new Date()
    const timeFrameMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000
    }
    
    return driverInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.invoiceDate)
      const timeDiff = now.getTime() - invoiceDate.getTime()
      const isCarrierDriver = carrier.drivers.some(driver => driver.id === invoice.driverId)
      return isCarrierDriver && timeDiff <= timeFrameMs[invoiceTimeFrame]
    })
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [carrierTypeFilter, setCarrierTypeFilter] = useState('all')
  const [equipmentTypeFilter, setEquipmentTypeFilter] = useState('all')

  const filteredCarriers = carriers.filter(carrier => {
    const matchesSearch = carrier.carrierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         carrier.mcNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || carrier.status === statusFilter
    const matchesCarrierType = carrierTypeFilter === 'all' || carrier.carrierType === carrierTypeFilter
    const matchesEquipmentType = equipmentTypeFilter === 'all' || 
                                carrier.equipmentTypes.some(type => type === equipmentTypeFilter)
    return matchesSearch && matchesStatus && matchesCarrierType && matchesEquipmentType
  })

  // Helper functions for carrier stats
  const getTotalDrivers = () => carriers.reduce((sum, carrier) => sum + carrier.drivers.length, 0)
  const getActiveDrivers = () => carriers.reduce((sum, carrier) => 
    sum + carrier.drivers.filter(driver => driver.status === 'active').length, 0)
  const getOwnerOperators = () => carriers.filter(c => c.carrierType === 'Owner Operator').length
  const getFleetCompanies = () => carriers.filter(c => c.carrierType === 'Fleet Company').length
  const getDryVanCarriers = () => carriers.filter(c => c.equipmentTypes.includes('Dry Van')).length
  const getAverageRating = () => {
    const allDrivers = carriers.flatMap(c => c.drivers)
    return allDrivers.length > 0 ? 
      (allDrivers.reduce((sum, d) => sum + d.rating, 0) / allDrivers.length).toFixed(1) : '0.0'
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

  return (
    <div className="container py-6">
      {/* Invoice Reminder Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              📋 Invoice Schedule Reminder
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• All dispatch invoices are sent out on <strong>Mondays</strong></p>
              <p>• Payment is due by <strong>Wednesday</strong> (2-day payment terms)</p>
              <p>• Next invoice date: <strong>{getNextInvoiceDate()}</strong> | Next due date: <strong>{getNextDueDate()}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Carrier Directory
          </h1>
          <p className="text-gray-600">
            Manage carriers, their drivers, and equipment fleet
          </p>
        </div>
        <button className="btn btn-primary">
          + Add Carrier
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="form-group">
            <label className="form-label">Search Carriers</label>
            <input
              type="text"
              placeholder="Search by name, email, or MC#..."
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
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Carrier Type</label>
            <select 
              className="form-input"
              value={carrierTypeFilter}
              onChange={(e) => setCarrierTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Owner Operator">Owner Operator</option>
              <option value="Fleet Company">Fleet Company</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Equipment Type</label>
            <select 
              className="form-input"
              value={equipmentTypeFilter}
              onChange={(e) => setEquipmentTypeFilter(e.target.value)}
            >
              <option value="all">All Equipment</option>
              <option value="Dry Van">Dry Van</option>
              <option value="Refrigerated">Refrigerated</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Step Deck">Step Deck</option>
              <option value="Box Truck">Box Truck</option>
              <option value="Straight Truck">Straight Truck</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Quick Actions</label>
            <button className="btn btn-secondary" style={{ width: '100%' }}>
              Performance Report
            </button>
          </div>
        </div>
      </div>

      {/* Carrier Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 mb-6">
        <div className="metric-card">
          <div className="metric-value">{carriers.length}</div>
          <div className="metric-label">Total Carriers</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{getTotalDrivers()}</div>
          <div className="metric-label">Total Drivers</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{getOwnerOperators()}</div>
          <div className="metric-label">Owner Operators</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{getFleetCompanies()}</div>
          <div className="metric-label">Fleet Companies</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{getDryVanCarriers()}</div>
          <div className="metric-label">Dry Van Carriers</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{getAverageRating()}</div>
          <div className="metric-label">Avg Driver Rating</div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Top Performing Carriers
          </h3>
          <div className="space-y-3">
            {carriers
              .sort((a, b) => {
                const aAvgRating = a.drivers.length > 0 ? 
                  a.drivers.reduce((sum, d) => sum + d.rating, 0) / a.drivers.length : 0
                const bAvgRating = b.drivers.length > 0 ? 
                  b.drivers.reduce((sum, d) => sum + d.rating, 0) / b.drivers.length : 0
                return bAvgRating - aAvgRating
              })
              .slice(0, 3)
              .map((carrier, index) => {
                const avgRating = carrier.drivers.length > 0 ? 
                  carrier.drivers.reduce((sum, d) => sum + d.rating, 0) / carrier.drivers.length : 0
                return (
                  <div key={carrier.id} className="flex items-center justify-between p-3 bg-gray-50" style={{ borderRadius: '6px' }}>
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex items-center justify-center"
                        style={{ 
                          width: '32px', 
                          height: '32px', 
                          backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                          borderRadius: '50%',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{carrier.carrierName}</div>
                        <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                          {carrier.drivers.length} driver{carrier.drivers.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div style={{ fontSize: '1.125rem' }}>{getRatingStars(avgRating)}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>{avgRating.toFixed(1)}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Fleet Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Carriers</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                {carriers.filter(c => c.status === 'active').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available Drivers</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                {getActiveDrivers()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Vehicles</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                {carriers.reduce((sum, c) => sum + c.vehicles.length, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Equipment Types</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                {Array.from(new Set(carriers.flatMap(c => c.equipmentTypes))).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Carriers Table */}
      <div className="card">
        <h3 className="mb-4" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
          Carrier Directory ({filteredCarriers.length} carriers)
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Carrier Information</th>
                <th>Authority Numbers</th>
                <th>Contact Details</th>
                <th>Equipment Types</th>
                <th>Fleet Size</th>
                <th>ELD Provider</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCarriers.map((carrier) => (
                <tr key={carrier.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600' }}>{carrier.carrierName}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        {carrier.carrierType}
                      </div>
                      <div className="text-gray-600" style={{ fontSize: '0.75rem' }}>
                        ID: {carrier.id}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>MC: {carrier.mcNumber}</div>
                      <div style={{ fontSize: '0.875rem' }}>DOT: {carrier.usDotNumber}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.875rem' }}>{carrier.contactEmail}</div>
                      <div className="text-gray-600" style={{ fontSize: '0.875rem' }}>
                        {carrier.contactPhone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      {carrier.equipmentTypes.map((type, index) => (
                        <div key={index} style={{ fontSize: '0.75rem' }}>{type}</div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                        {carrier.drivers.length} driver{carrier.drivers.length !== 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: '0.75rem' }}>
                        {carrier.vehicles.length} vehicle{carrier.vehicles.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-gray-600" style={{ fontSize: '0.75rem' }}>
                        Avg: {carrier.drivers.length > 0 ? 
                          getRatingStars(carrier.drivers.reduce((sum, d) => sum + d.rating, 0) / carrier.drivers.length) : 'N/A'
                        }
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{carrier.eldProvider}</div>
                  </td>
                  <td>
                    <span className={`status status-${carrier.status}`}>
                      {carrier.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => setSelectedCarrier(carrier)}
                      >
                        View Profile
                      </button>
                      <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => {
                          setSelectedCarrier(carrier)
                          setSelectedTab('invoices')
                        }}
                      >
                        View Invoices
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Carrier Profile Modal */}
      {selectedCarrier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCarrier.carrierName} - Carrier Profile
                </h2>
                <button
                  onClick={() => setSelectedCarrier(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Tab Navigation */}
              <div className="mt-4 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setSelectedTab('overview')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setSelectedTab('drivers')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'drivers'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Drivers ({selectedCarrier.drivers.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('vehicles')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'vehicles'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Vehicles ({selectedCarrier.vehicles.length})
                  </button>
                  <button
                    onClick={() => setSelectedTab('invoices')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'invoices'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Dispatch Invoices ({getCarrierInvoices(selectedCarrier.id).length})
                  </button>
                </nav>
              </div>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Carrier Information</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Carrier Type</dt>
                          <dd className="text-sm text-gray-900 font-semibold">{selectedCarrier.carrierType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                          <dd className="text-sm text-gray-900">{selectedCarrier.contactEmail}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
                          <dd className="text-sm text-gray-900">{selectedCarrier.contactPhone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Join Date</dt>
                          <dd className="text-sm text-gray-900">{selectedCarrier.joinDate}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Status</dt>
                          <dd>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedCarrier.status === 'active' ? 'bg-green-100 text-green-800' :
                              selectedCarrier.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedCarrier.status.charAt(0).toUpperCase() + selectedCarrier.status.slice(1)}
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">FMCSA Verification</dt>
                          <dd className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedCarrier.fmcsaVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedCarrier.fmcsaVerified ? '✅ Verified' : '⚠️ Not Verified'}
                            </span>
                            {selectedCarrier.fmcsaLastUpdated && (
                              <span className="text-xs text-gray-500">
                                Updated: {new Date(selectedCarrier.fmcsaLastUpdated).toLocaleDateString()}
                              </span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {/* FMCSA Safety Information */}
                    {selectedCarrier.fmcsaData && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">FMCSA Safety Information</h3>
                        <dl className="space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Safety Rating</dt>
                            <dd>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                selectedCarrier.fmcsaData.safetyRating?.toLowerCase().includes('satisfactory') ? 'bg-green-100 text-green-800' :
                                selectedCarrier.fmcsaData.safetyRating?.toLowerCase().includes('conditional') ? 'bg-yellow-100 text-yellow-800' :
                                selectedCarrier.fmcsaData.safetyRating?.toLowerCase().includes('unsatisfactory') ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {selectedCarrier.fmcsaData.safetyRating || 'Not Rated'}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Operation Type</dt>
                            <dd className="text-sm text-gray-900">{selectedCarrier.fmcsaData.carrierOperation}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Power Units</dt>
                            <dd className="text-sm text-gray-900">{selectedCarrier.fmcsaData.powerUnits}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Drivers</dt>
                            <dd className="text-sm text-gray-900">{selectedCarrier.fmcsaData.drivers}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Hazmat Authorized</dt>
                            <dd className="text-sm text-gray-900">{selectedCarrier.fmcsaData.hm === 'Y' ? 'Yes' : 'No'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Total Crashes</dt>
                            <dd className="text-sm text-gray-900 font-semibold text-red-600">{selectedCarrier.fmcsaData.crashTotal}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* If no FMCSA data, show lookup option */}
                    {!selectedCarrier.fmcsaData && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Carrier Safety</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Verify this carrier's safety information and compliance status with FMCSA data.
                        </p>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <SAFERLookup onCarrierUpdate={handleFMCSAUpdate} />
                        </div>
                      </div>
                    )}
                  </div>
                              selectedCarrier.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedCarrier.status}
                            </span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Authority & Equipment</h3>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">MC Number</dt>
                          <dd className="text-sm text-gray-900 font-mono">{selectedCarrier.mcNumber}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">US DOT Number</dt>
                          <dd className="text-sm text-gray-900 font-mono">{selectedCarrier.usDotNumber}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Equipment Types</dt>
                          <dd className="text-sm text-gray-900">
                            {selectedCarrier.equipmentTypes.join(', ')}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">ELD Provider</dt>
                          <dd className="text-sm text-gray-900">{selectedCarrier.eldProvider}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Fleet Size</dt>
                          <dd className="text-sm text-gray-900">
                            {selectedCarrier.drivers.length} drivers, {selectedCarrier.vehicles.length} vehicles
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              )}

              {/* Drivers Tab */}
              {selectedTab === 'drivers' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Drivers</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Miles
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ELD Device
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Activity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedCarrier.drivers.map((driver) => (
                          <tr key={driver.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                              <div className="text-sm text-gray-500">ID: {driver.id}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{driver.email}</div>
                              <div className="text-sm text-gray-500">{driver.phone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                driver.status === 'active' ? 'bg-green-100 text-green-800' :
                                driver.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {driver.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {driver.totalMiles.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {getRatingStars(driver.rating)} ({driver.rating})
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {driver.eldDeviceId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {driver.lastActivity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Vehicles Tab */}
              {selectedTab === 'vehicles' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Fleet Vehicles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCarrier.vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600">Vehicle ID: {vehicle.id}</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.currentDriverId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {vehicle.currentDriverId ? 'In Use' : 'Available'}
                          </span>
                        </div>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Equipment Type</dt>
                            <dd className="text-sm text-gray-900">{vehicle.type}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">VIN</dt>
                            <dd className="text-sm text-gray-900 font-mono">{vehicle.vin}</dd>
                          </div>
                          {vehicle.currentDriverId && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Current Driver</dt>
                              <dd className="text-sm text-gray-900">
                                {selectedCarrier.drivers.find(d => d.id === vehicle.currentDriverId)?.name || 'Unknown'}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Tab */}
              {selectedTab === 'invoices' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Dispatch Fee Invoices</h3>
                    <select
                      value={invoiceTimeFrame}
                      onChange={(e) => setInvoiceTimeFrame(e.target.value as any)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                      <option value="quarter">Last Quarter</option>
                    </select>
                  </div>

                  {/* Invoice Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {['Pending', 'Sent', 'Paid', 'Overdue'].map((status) => {
                      const statusInvoices = getCarrierInvoices(selectedCarrier.id).filter(inv => inv.status === status)
                      const totalAmount = statusInvoices.reduce((sum, inv) => sum + inv.dispatchFee, 0)
                      return (
                        <div key={status} className="bg-gray-50 rounded-lg p-4">
                          <div className="text-sm font-medium text-gray-500">{status} Invoices</div>
                          <div className="mt-1">
                            <div className="text-2xl font-semibold text-gray-900">${totalAmount.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">{statusInvoices.length} invoices</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Invoice Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Driver
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Load ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Load Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dispatch Fee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Week Ending
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getCarrierInvoices(selectedCarrier.id).map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {invoice.driverName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {invoice.loadId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${invoice.loadAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ${invoice.dispatchFee.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice.weekEnding}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice.dueDate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {invoice.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {getCarrierInvoices(selectedCarrier.id).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-sm">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        No invoices found for the selected time frame
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        Invoices will appear here when loads are assigned to this carrier's drivers
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Carrier Verification and Notes Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3>SAFER Carrier Verification</h3>
          </div>
          <div className="card-content">
            <SAFERLookup />
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3>Driver & Carrier Notes</h3>
          </div>
          <div className="card-content">
            <StickyNote 
              section="drivers" 
              entityId={selectedCarrier ? `carrier-${selectedCarrier.id}` : "drivers-general"} 
              entityName={selectedCarrier ? selectedCarrier.carrierName : "Driver Management"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
