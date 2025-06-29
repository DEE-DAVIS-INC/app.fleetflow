'use client'

import { useState } from 'react'
import { useShipper } from '../contexts/ShipperContext'
import Logo from '../components/Logo'
import { 
  PlusIcon, 
  DocumentTextIcon,
  TruckIcon,
  CalendarIcon,
  MapPinIcon,
  ScaleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { LoadRequest, CommodityInfo, ShipperLocation } from '../types/shipper'

// This would be passed via authentication/session in a real app
const MOCK_SHIPPER_ID = 'shipper-001'

export default function ShipperPortalPage() {
  const { shippers, loadRequests, setLoadRequests } = useShipper()
  const [selectedTab, setSelectedTab] = useState<'requests' | 'submit' | 'quotes'>('requests')
  const [showSubmitForm, setShowSubmitForm] = useState(false)

  // Find the current shipper (in real app, this would come from auth)
  const currentShipper = shippers.find(s => s.id === MOCK_SHIPPER_ID)
  
  // Filter load requests for current shipper
  const shipperRequests = loadRequests.filter(req => req.shipperId === MOCK_SHIPPER_ID)

  const [formData, setFormData] = useState({
    requestType: 'load' as 'load' | 'rfp' | 'quote_request',
    pickupDate: '',
    deliveryDate: '',
    pickupLocationId: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    commodityName: '',
    freightClass: '',
    weight: '',
    pieces: '',
    length: '',
    width: '',
    height: '',
    specialInstructions: '',
    isHazmat: false,
    temperature: 'ambient' as 'ambient' | 'refrigerated' | 'frozen'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentShipper) return

    const newRequest: LoadRequest = {
      id: `req-${Date.now()}`,
      shipperId: MOCK_SHIPPER_ID,
      requestType: formData.requestType,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      pickupDate: formData.pickupDate,
      deliveryDate: formData.deliveryDate,
      pickupLocation: currentShipper.locations.find(loc => loc.id === formData.pickupLocationId) || currentShipper.locations[0],
      deliveryLocation: {
        id: `del-${Date.now()}`,
        name: 'Delivery Location',
        address: formData.deliveryAddress,
        city: formData.deliveryCity,
        state: formData.deliveryState,
        zip: formData.deliveryZip
      },
      commodity: {
        name: formData.commodityName,
        freightClass: formData.freightClass,
        description: formData.commodityName,
        hazmat: formData.isHazmat,
        temperature: formData.temperature
      },
      weight: parseInt(formData.weight),
      dimensions: formData.length && formData.width && formData.height ? {
        length: parseInt(formData.length),
        width: parseInt(formData.width),
        height: parseInt(formData.height)
      } : undefined,
      pieces: parseInt(formData.pieces),
      specialInstructions: formData.specialInstructions,
      submittedBy: currentShipper.contacts[0]?.name || 'Unknown'
    }

    setLoadRequests([...loadRequests, newRequest])
    setShowSubmitForm(false)
    setSelectedTab('requests')
    
    // Reset form
    setFormData({
      requestType: 'load',
      pickupDate: '',
      deliveryDate: '',
      pickupLocationId: '',
      deliveryAddress: '',
      deliveryCity: '',
      deliveryState: '',
      deliveryZip: '',
      commodityName: '',
      freightClass: '',
      weight: '',
      pieces: '',
      length: '',
      width: '',
      height: '',
      specialInstructions: '',
      isHazmat: false,
      temperature: 'ambient'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'quoted': return <DocumentTextIcon className="h-5 w-5 text-blue-500" />
      case 'accepted': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rejected': return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'completed': return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      default: return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'quoted': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!currentShipper) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Unable to verify shipper credentials.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Logo />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Shipper Portal</h1>
                <p className="text-indigo-100">
                  Welcome, {currentShipper.companyName}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSubmitForm(true)}
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-medium rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-200 transform hover:scale-105 border border-white/20"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Submit Load Request
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <DocumentTextIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold text-gray-900">{shipperRequests.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Requests</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-lg border border-yellow-100 p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <ClockIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold text-gray-900">
                  {shipperRequests.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold text-gray-900">
                  {shipperRequests.filter(r => r.status === 'accepted').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Accepted</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <TruckIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <div className="text-3xl font-bold text-gray-900">
                  {shipperRequests.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setSelectedTab('requests')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  selectedTab === 'requests'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                My Requests ({shipperRequests.length})
              </button>
              <button
                onClick={() => setSelectedTab('quotes')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  selectedTab === 'quotes'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                Quotes & Proposals
              </button>
            </nav>
          </div>
        </div>

        {/* Load Requests Tab */}
        {selectedTab === 'requests' && (
          <div className="space-y-6">
            {shipperRequests.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No load requests yet</h3>
                <p className="text-gray-500 mb-6">Get started by submitting your first load request.</p>
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Submit Load Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {shipperRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {request.requestType.replace('_', ' ').toUpperCase()} - {request.commodity.name}
                          </h3>
                          {getStatusIcon(request.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2" />
                            {request.pickupLocation.city}, {request.pickupLocation.state} → {request.deliveryLocation.city}, {request.deliveryLocation.state}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            Pickup: {new Date(request.pickupDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <ScaleIcon className="h-4 w-4 mr-2" />
                            {request.weight.toLocaleString()} lbs, {request.pieces} pieces
                          </div>
                        </div>

                        {request.rate && (
                          <div className="mb-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Quoted Rate: ${request.rate.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="text-sm text-gray-500">
                          Submitted on {new Date(request.submittedDate).toLocaleDateString()} by {request.submittedBy}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotes Tab */}
        {selectedTab === 'quotes' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quotes & Proposals</h3>
            <p className="text-gray-500">Your quotes and proposals will appear here.</p>
          </div>
        )}
      </div>

      {/* Submit Form Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Load Request</h3>
                <p className="text-sm text-gray-600">Fill out the details for your load request</p>
              </div>

              <div className="space-y-6">
                {/* Request Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <select
                    value={formData.requestType}
                    onChange={(e) => setFormData({...formData, requestType: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="load">Load Request</option>
                    <option value="rfp">RFP (Request for Proposal)</option>
                    <option value="quote_request">Quote Request</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                    <input
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                    <input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                  <select
                    value={formData.pickupLocationId}
                    onChange={(e) => setFormData({...formData, pickupLocationId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select pickup location</option>
                    {currentShipper.locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.city}, {location.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Delivery Address</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.deliveryCity}
                        onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.deliveryState}
                        onChange={(e) => setFormData({...formData, deliveryState: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={formData.deliveryZip}
                        onChange={(e) => setFormData({...formData, deliveryZip: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Commodity Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Commodity Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commodity Name</label>
                      <input
                        type="text"
                        value={formData.commodityName}
                        onChange={(e) => setFormData({...formData, commodityName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Freight Class</label>
                      <select
                        value={formData.freightClass}
                        onChange={(e) => setFormData({...formData, freightClass: e.target.value})}
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
                  </div>
                </div>

                {/* Weight and Pieces */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (lbs)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pieces</label>
                    <input
                      type="number"
                      value={formData.pieces}
                      onChange={(e) => setFormData({...formData, pieces: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
