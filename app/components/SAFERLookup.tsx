'use client'

import { useState } from 'react'
import { FMCSAService, FMCSACarrierInfo } from '../services/fmcsa'

interface SAFERLookupProps {
  onCarrierUpdate?: (carrier: FMCSACarrierInfo | null) => void
}

export default function SAFERLookup({ onCarrierUpdate }: SAFERLookupProps) {
  const [dotNumber, setDotNumber] = useState('')
  const [mcNumber, setMcNumber] = useState('')
  const [carrierName, setCarrierName] = useState('')
  const [searchType, setSearchType] = useState<'dot' | 'mc' | 'name'>('dot')
  const [loading, setLoading] = useState(false)
  const [carrierInfo, setCarrierInfo] = useState<FMCSACarrierInfo | null>(null)
  const [error, setError] = useState('')

  const lookupCarrier = async () => {
    if (searchType === 'dot' && !dotNumber.trim()) {
      setError('Please enter a DOT number')
      return
    }
    
    if (searchType === 'mc' && !mcNumber.trim()) {
      setError('Please enter an MC number')
      return
    }
    
    if (searchType === 'name' && !carrierName.trim()) {
      setError('Please enter a carrier name')
      return
    }

    setLoading(true)
    setError('')
    setCarrierInfo(null)

    try {
      let result;
      
      if (searchType === 'dot') {
        result = await FMCSAService.lookupByDOTNumber(dotNumber)
      } else if (searchType === 'mc') {
        result = await FMCSAService.lookupByMCNumber(mcNumber)
      } else {
        result = await FMCSAService.searchByName(carrierName)
      }

      if (result.success && result.data) {
        setCarrierInfo(result.data)
        onCarrierUpdate?.(result.data)
      } else {
        setError(result.error || 'Failed to fetch carrier information')
        
        // Fallback to demo data for testing
        if ((searchType === 'dot' && dotNumber) || (searchType === 'mc' && mcNumber)) {
          const demoData = FMCSAService.generateDemoData(searchType === 'dot' ? dotNumber : mcNumber)
          setCarrierInfo(demoData)
          onCarrierUpdate?.(demoData)
          setError('Using demo data - API may be unavailable')
        }
      }
    } catch (err) {
      console.error('Lookup error:', err)
      setError('Failed to connect to FMCSA database')
      
      // Fallback to demo data
      if ((searchType === 'dot' && dotNumber) || (searchType === 'mc' && mcNumber)) {
        const demoData = FMCSAService.generateDemoData(searchType === 'dot' ? dotNumber : mcNumber)
        setCarrierInfo(demoData)
        onCarrierUpdate?.(demoData)
        setError('Using demo data - API may be unavailable')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    
    const lowerStatus = status.toLowerCase()
    if (lowerStatus.includes('satisfactory') || lowerStatus.includes('active')) {
      return 'bg-green-100 text-green-800'
    }
    if (lowerStatus.includes('conditional') || lowerStatus.includes('warning')) {
      return 'bg-yellow-100 text-yellow-800'
    }
    if (lowerStatus.includes('unsatisfactory') || lowerStatus.includes('out of service')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const formatAddress = (address: any) => {
    if (!address) return 'Not Available'
    const parts = [address.street, address.city, address.state, address.zip].filter(Boolean)
    return parts.join(', ') || 'Not Available'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      lookupCarrier()
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">FMCSA SAFER Lookup</h3>
        <p className="text-sm text-gray-600">Search for carrier safety information by DOT, MC, or company name</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Type Selector */}
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="dot"
              checked={searchType === 'dot'}
              onChange={(e) => setSearchType(e.target.value as 'dot' | 'mc' | 'name')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">DOT Number</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="mc"
              checked={searchType === 'mc'}
              onChange={(e) => setSearchType(e.target.value as 'dot' | 'mc' | 'name')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">MC Number</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="name"
              checked={searchType === 'name'}
              onChange={(e) => setSearchType(e.target.value as 'dot' | 'mc' | 'name')}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Carrier Name</span>
          </label>
        </div>

        {/* Search Input */}
        <div className="flex space-x-2">
          {searchType === 'dot' ? (
            <input
              type="text"
              value={dotNumber}
              onChange={(e) => setDotNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter DOT number (e.g., 123456)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : searchType === 'mc' ? (
            <input
              type="text"
              value={mcNumber}
              onChange={(e) => setMcNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter MC number (e.g., MC-123456 or 123456)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <input
              type="text"
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter carrier name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          <button
            onClick={lookupCarrier}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <strong>Search Tips:</strong> 
                {searchType === 'dot' && ' Enter just the numbers (e.g., 123456)'}
                {searchType === 'mc' && ' MC numbers can be entered with or without "MC-" prefix (e.g., MC-123456 or 123456)'}
                {searchType === 'name' && ' Enter the legal business name or DBA name of the carrier'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Searching FMCSA database...</span>
          </div>
        )}

        {/* Carrier Information Display */}
        {carrierInfo && !loading && (
          <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">Carrier Information</h4>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Legal Name</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.legalName || 'Not Available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">DBA Name</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.dbaName || 'Not Available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">DOT Number</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.dotNumber || 'Not Available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">MC Number</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.mcNumber || 'Not Available'}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <p className="mt-1 text-sm text-gray-900">{formatAddress(carrierInfo.address)}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{carrierInfo.phone || 'Not Available'}</p>
              </div>

              {/* Safety Rating */}
              {carrierInfo.safetyRating && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Safety Rating</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(carrierInfo.safetyRating)}`}>
                      {carrierInfo.safetyRating}
                    </span>
                    {carrierInfo.safetyRatingDate && (
                      <span className="ml-2 text-xs text-gray-500">
                        Date: {carrierInfo.safetyRatingDate}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Fleet Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Power Units</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.powerUnits}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Drivers</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.drivers}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Operation Type</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.carrierOperation || 'Not Available'}</p>
                </div>
              </div>

              {/* Crash Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Crash Summary (24 months)</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-lg font-semibold text-gray-900">{carrierInfo.crashTotal}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-lg font-semibold text-red-600">{carrierInfo.crashFatal}</div>
                    <div className="text-xs text-red-500">Fatal</div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <div className="text-lg font-semibold text-orange-600">{carrierInfo.crashInjury}</div>
                    <div className="text-xs text-orange-500">Injury</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-lg font-semibold text-blue-600">{carrierInfo.crashTow}</div>
                    <div className="text-xs text-blue-500">Tow</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-lg font-semibold text-purple-600">{carrierInfo.crashHazmat}</div>
                    <div className="text-xs text-purple-500">Hazmat</div>
                  </div>
                </div>
              </div>

              {/* Inspection Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Inspection Summary (24 months)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-lg font-semibold text-gray-900">{carrierInfo.inspectionTotal}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <div className="text-lg font-semibold text-yellow-600">{carrierInfo.inspectionVehicleOos}</div>
                    <div className="text-xs text-yellow-500">Vehicle OOS</div>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <div className="text-lg font-semibold text-red-600">{carrierInfo.inspectionDriverOos}</div>
                    <div className="text-xs text-red-500">Driver OOS</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <div className="text-lg font-semibold text-purple-600">{carrierInfo.inspectionHazmat}</div>
                    <div className="text-xs text-purple-500">Hazmat</div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500">MCS-150 Date</label>
                  <p className="mt-1 text-sm text-gray-900">{carrierInfo.mcs150Date || 'Not Available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">MCS-150 Mileage</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {carrierInfo.mcs150Mileage ? carrierInfo.mcs150Mileage.toLocaleString() : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
