'use client'

import { useState } from 'react'
import { useShipper } from '../contexts/ShipperContext'
import { getCurrentUser } from '../config/access'
import { Shipper, BrokerAgent, ShipperContact, ShipperLocation, CommodityInfo } from '../types/shipper'
import { PlusIcon, XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function AddShipperForm({ onClose }: { onClose: () => void }) {
  const { shippers, setShippers, brokerAgents } = useShipper()
  const currentUser = getCurrentUser()
  
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    mcNumber: '',
    paymentTerms: 'Net 30',
    creditLimit: '',
    creditRating: 'B' as 'A' | 'B' | 'C' | 'D',
    assignedBrokerId: currentUser.role === 'broker' ? currentUser.brokerId || '' : '',
    notes: ''
  })

  const [contacts, setContacts] = useState<Omit<ShipperContact, 'id'>[]>([
    {
      name: '',
      email: '',
      phone: '',
      title: '',
      isPrimary: true
    }
  ])

  const [locations, setLocations] = useState<Omit<ShipperLocation, 'id'>[]>([
    {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contactName: '',
      contactPhone: '',
      operatingHours: '',
      specialInstructions: ''
    }
  ])

  const [commodities, setCommodities] = useState<CommodityInfo[]>([
    {
      name: '',
      freightClass: '',
      description: '',
      hazmat: false,
      temperature: 'ambient'
    }
  ])

  const addContact = () => {
    setContacts([...contacts, {
      name: '',
      email: '',
      phone: '',
      title: '',
      isPrimary: false
    }])
  }

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index))
    }
  }

  const updateContact = (index: number, field: string, value: any) => {
    const updated = [...contacts]
    updated[index] = { ...updated[index], [field]: value }
    setContacts(updated)
  }

  const addLocation = () => {
    setLocations([...locations, {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contactName: '',
      contactPhone: '',
      operatingHours: '',
      specialInstructions: ''
    }])
  }

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index))
    }
  }

  const updateLocation = (index: number, field: string, value: any) => {
    const updated = [...locations]
    updated[index] = { ...updated[index], [field]: value }
    setLocations(updated)
  }

  const addCommodity = () => {
    setCommodities([...commodities, {
      name: '',
      freightClass: '',
      description: '',
      hazmat: false,
      temperature: 'ambient'
    }])
  }

  const removeCommodity = (index: number) => {
    if (commodities.length > 1) {
      setCommodities(commodities.filter((_, i) => i !== index))
    }
  }

  const updateCommodity = (index: number, field: string, value: any) => {
    const updated = [...commodities]
    updated[index] = { ...updated[index], [field]: value }
    setCommodities(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const assignedBroker = brokerAgents.find(broker => broker.id === formData.assignedBrokerId)
    
    const newShipper: Shipper = {
      id: `shipper-${Date.now()}`,
      companyName: formData.companyName,
      taxId: formData.taxId,
      mcNumber: formData.mcNumber || undefined,
      contacts: contacts.map((contact, index) => ({
        ...contact,
        id: `contact-${Date.now()}-${index}`
      })),
      locations: locations.map((location, index) => ({
        ...location,
        id: `location-${Date.now()}-${index}`
      })),
      commodities: commodities,
      paymentTerms: formData.paymentTerms,
      creditLimit: parseInt(formData.creditLimit) || 0,
      creditRating: formData.creditRating,
      preferredLanes: [],
      loadRequests: [],
      assignedBrokerId: formData.assignedBrokerId,
      assignedBrokerName: assignedBroker?.name || 'Unknown',
      status: 'active',
      joinDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalLoads: 0,
      totalRevenue: 0,
      averageRate: 0,
      notes: formData.notes
    }

    setShippers([...shippers, newShipper])
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Add New Shipper</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Company Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID *</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">MC Number (Optional)</label>
                  <input
                    type="text"
                    value={formData.mcNumber}
                    onChange={(e) => setFormData({...formData, mcNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Broker *</label>
                  <select
                    value={formData.assignedBrokerId}
                    onChange={(e) => setFormData({...formData, assignedBrokerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={currentUser.role === 'broker'}
                  >
                    <option value="">Select a broker</option>
                    {brokerAgents.map((broker) => (
                      <option key={broker.id} value={broker.id}>
                        {broker.name} ({broker.email})
                      </option>
                    ))}
                  </select>
                  {currentUser.role === 'broker' && (
                    <p className="text-sm text-gray-500 mt-1">You are automatically assigned as the broker for this shipper.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                    <option value="Net 60">Net 60</option>
                    <option value="Quick Pay">Quick Pay</option>
                    <option value="COD">COD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit</label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Rating</label>
                  <select
                    value={formData.creditRating}
                    onChange={(e) => setFormData({...formData, creditRating: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="A">A - Excellent</option>
                    <option value="B">B - Good</option>
                    <option value="C">C - Fair</option>
                    <option value="D">D - Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Contacts</h4>
                <button
                  type="button"
                  onClick={addContact}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Contact
                </button>
              </div>
              {contacts.map((contact, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-medium text-gray-900">Contact {index + 1}</h5>
                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => updateContact(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={contact.title}
                        onChange={(e) => updateContact(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => updateContact(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => updateContact(index, 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={contact.isPrimary}
                        onChange={(e) => updateContact(index, 'isPrimary', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Primary Contact</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Locations</h4>
                <button
                  type="button"
                  onClick={addLocation}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Location
                </button>
              </div>
              {locations.map((location, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-medium text-gray-900">Location {index + 1}</h5>
                    {locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
                      <input
                        type="text"
                        value={location.name}
                        onChange={(e) => updateLocation(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        value={location.address}
                        onChange={(e) => updateLocation(index, 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={location.city}
                        onChange={(e) => updateLocation(index, 'city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        value={location.state}
                        onChange={(e) => updateLocation(index, 'state', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        value={location.zip}
                        onChange={(e) => updateLocation(index, 'zip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                      <input
                        type="text"
                        value={location.operatingHours}
                        onChange={(e) => updateLocation(index, 'operatingHours', e.target.value)}
                        placeholder="e.g., Mon-Fri 8AM-5PM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                    <textarea
                      value={location.specialInstructions}
                      onChange={(e) => updateLocation(index, 'specialInstructions', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Commodities */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Commodities</h4>
                <button
                  type="button"
                  onClick={addCommodity}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Commodity
                </button>
              </div>
              {commodities.map((commodity, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-medium text-gray-900">Commodity {index + 1}</h5>
                    {commodities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCommodity(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commodity Name *</label>
                      <input
                        type="text"
                        value={commodity.name}
                        onChange={(e) => updateCommodity(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Freight Class *</label>
                      <select
                        value={commodity.freightClass}
                        onChange={(e) => updateCommodity(index, 'freightClass', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select freight class</option>
                        <option value="50">50</option>
                        <option value="55">55</option>
                        <option value="60">60</option>
                        <option value="65">65</option>
                        <option value="70">70</option>
                        <option value="77.5">77.5</option>
                        <option value="85">85</option>
                        <option value="92.5">92.5</option>
                        <option value="100">100</option>
                        <option value="110">110</option>
                        <option value="125">125</option>
                        <option value="150">150</option>
                        <option value="175">175</option>
                        <option value="200">200</option>
                        <option value="250">250</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Temperature Requirements</label>
                      <select
                        value={commodity.temperature}
                        onChange={(e) => updateCommodity(index, 'temperature', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ambient">Ambient</option>
                        <option value="refrigerated">Refrigerated</option>
                        <option value="frozen">Frozen</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={commodity.hazmat}
                          onChange={(e) => updateCommodity(index, 'hazmat', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Hazmat</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={commodity.description}
                      onChange={(e) => updateCommodity(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional notes about this shipper..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Shipper
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
