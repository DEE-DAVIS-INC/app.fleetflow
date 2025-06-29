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

export default function CarriersPage() {
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'drivers' | 'vehicles' | 'invoices'>('overview')
  
  // FMCSA Integration
  const handleFMCSAUpdate = (fmcsaData: FMCSACarrierInfo | null) => {
    if (!fmcsaData || !selectedCarrier) return

    const updatedCarrier: Carrier = {
      ...selectedCarrier,
      fmcsaData: fmcsaData,
      fmcsaLastUpdated: new Date().toISOString(),
      fmcsaVerified: true,
      carrierName: fmcsaData.legalName || selectedCarrier.carrierName,
      usDotNumber: fmcsaData.dotNumber || selectedCarrier.usDotNumber,
      mcNumber: fmcsaData.mcNumber || selectedCarrier.mcNumber,
      contactPhone: fmcsaData.phone || selectedCarrier.contactPhone
    }

    setCarriers(prevCarriers => 
      prevCarriers.map(carrier => 
        carrier.id === selectedCarrier.id ? updatedCarrier : carrier
      )
    )
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
      equipmentTypes: ['Flatbed'],
      vehicles: [
        {
          id: 'V003',
          make: 'Peterbilt',
          model: '389',
          year: 2020,
          type: 'Flatbed',
          vin: '1XPGDA49X5D123456',
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
          totalMiles: 89000,
          rating: 4.9,
          joinDate: '2021-08-20',
          lastActivity: '15 minutes ago',
          eldDeviceId: 'ELD-002-SJ'
        }
      ],
      joinDate: '2021-08-20',
      status: 'active',
      fmcsaVerified: false
    }
  ])

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
        <p className="text-gray-600">Manage carriers, drivers, and FMCSA compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carriers List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Carriers</h2>
            </div>
            <div className="p-4 space-y-2">
              {carriers.map((carrier) => (
                <div
                  key={carrier.id}
                  onClick={() => setSelectedCarrier(carrier)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedCarrier?.id === carrier.id 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{carrier.carrierName}</h3>
                      <p className="text-sm text-gray-600">{carrier.usDotNumber}</p>
                      <p className="text-sm text-gray-600">{carrier.carrierType}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        carrier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {carrier.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        carrier.fmcsaVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {carrier.fmcsaVerified ? 'FMCSA ✓' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrier Details */}
        {selectedCarrier && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedCarrier.carrierName}</h2>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedCarrier.fmcsaVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedCarrier.fmcsaVerified ? '✅ FMCSA Verified' : '⚠️ Needs Verification'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Carrier Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Carrier Information</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">DOT Number</dt>
                        <dd className="text-sm text-gray-900 font-mono">{selectedCarrier.usDotNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">MC Number</dt>
                        <dd className="text-sm text-gray-900 font-mono">{selectedCarrier.mcNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Carrier Type</dt>
                        <dd className="text-sm text-gray-900">{selectedCarrier.carrierType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
                        <dd className="text-sm text-gray-900">{selectedCarrier.contactPhone}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                        <dd className="text-sm text-gray-900">{selectedCarrier.contactEmail}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* FMCSA Safety Information */}
                  {selectedCarrier.fmcsaData ? (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">FMCSA Safety Data</h3>
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
                          <dd className="text-sm text-gray-900 font-semibold">{selectedCarrier.fmcsaData.powerUnits}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Total Drivers</dt>
                          <dd className="text-sm text-gray-900 font-semibold">{selectedCarrier.fmcsaData.drivers}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Total Crashes</dt>
                          <dd className="text-sm font-semibold text-red-600">{selectedCarrier.fmcsaData.crashTotal}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                          <dd className="text-xs text-gray-500">
                            {selectedCarrier.fmcsaLastUpdated && new Date(selectedCarrier.fmcsaLastUpdated).toLocaleString()}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Verify with FMCSA</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Verify this carrier's safety information and compliance status with FMCSA data.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <SAFERLookup onCarrierUpdate={handleFMCSAUpdate} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Drivers Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Drivers ({selectedCarrier.drivers.length})</h3>
                  <div className="space-y-4">
                    {selectedCarrier.drivers.map((driver) => (
                      <div key={driver.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{driver.name}</h4>
                            <p className="text-sm text-gray-600">{driver.email}</p>
                            <p className="text-sm text-gray-600">{driver.phone}</p>
                            <p className="text-sm text-gray-500">Total Miles: {driver.totalMiles.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              driver.status === 'active' ? 'bg-green-100 text-green-800' :
                              driver.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {driver.status}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Rating: {driver.rating}/5.0</p>
                            <p className="text-xs text-gray-400">{driver.lastActivity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Notes */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Notes</h3>
          <StickyNote section="drivers" entityId="fleet-management" entityName="Fleet Management" />
        </div>
      </div>
    </div>
  )
}
