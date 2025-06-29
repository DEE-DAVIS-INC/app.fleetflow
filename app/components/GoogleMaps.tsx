'use client'

import { useState, useEffect } from 'react'

interface MapProps {
  addresses?: string[]
  height?: string
  zoom?: number
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
}

export default function GoogleMapsEmbed({ 
  addresses = [], 
  height = '400px', 
  zoom = 10,
  mapType = 'roadmap' 
}: MapProps) {
  const [mapUrl, setMapUrl] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    generateMapUrl()
  }, [addresses, zoom, mapType])

  const generateMapUrl = () => {
    try {
      if (addresses.length === 0) {
        setMapUrl('')
        return
      }

      // Google Maps Embed API URL
      const baseUrl = 'https://www.google.com/maps/embed/v1/'
      
      // You'll need to get a Google Maps API key and add it here
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key'
      
      let url = ''
      
      if (addresses.length === 1) {
        // Single location - use place mode
        url = `${baseUrl}place?key=${apiKey}&q=${encodeURIComponent(addresses[0])}&zoom=${zoom}&maptype=${mapType}`
      } else if (addresses.length === 2) {
        // Two locations - use directions mode
        url = `${baseUrl}directions?key=${apiKey}&origin=${encodeURIComponent(addresses[0])}&destination=${encodeURIComponent(addresses[1])}&mode=driving&maptype=${mapType}`
      } else {
        // Multiple locations - use search mode with waypoints
        const origin = addresses[0]
        const destination = addresses[addresses.length - 1]
        const waypoints = addresses.slice(1, -1).join('|')
        
        url = `${baseUrl}directions?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&mode=driving&maptype=${mapType}`
      }
      
      // Store both URL and API key for component use
      if (!apiKey || apiKey === 'demo-key') {
        setMapUrl('')
      } else {
        setMapUrl(url)
      }
      setError('')
    } catch (err) {
      setError('Failed to generate map URL')
      console.error('Map URL generation error:', err)
    }
  }

  const openInGoogleMaps = () => {
    if (addresses.length === 0) return
    
    let url = 'https://www.google.com/maps/dir/'
    
    if (addresses.length === 1) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(addresses[0])}`
    } else {
      url += addresses.map(addr => encodeURIComponent(addr)).join('/')
    }
    
    window.open(url, '_blank')
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <span className="text-4xl">🗺️</span>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!mapUrl) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <span className="text-4xl">🗺️</span>
            <h3 className="font-medium text-blue-900 mt-2 mb-2">Google Maps Integration</h3>
            <p className="text-blue-700 text-sm mb-4">
              {addresses.length === 0
                ? 'Add addresses to view route map'
                : 'Google Maps API key required for live maps'
              }
            </p>
            {addresses.length > 0 && (
              <button
                onClick={openInGoogleMaps}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex items-center gap-2 mx-auto"
              >
                <span>🔗</span>
                Open in Google Maps
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden" style={{ height }}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
      
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={openInGoogleMaps}
          className="bg-white shadow-md border border-gray-200 px-3 py-1 rounded text-xs hover:bg-gray-50 flex items-center gap-1"
          title="Open in Google Maps"
        >
          <span>🔗</span>
          Open
        </button>
      </div>
    </div>
  )
}

// Route Planning Component
interface RoutePlannerProps {
  onRouteCalculated?: (route: RouteInfo) => void
}

interface RouteInfo {
  distance: string
  duration: string
  fuelCost: string
  tollCost: string
  optimizedRoute: string[]
}

export function RoutePlanner({ onRouteCalculated }: RoutePlannerProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [waypoints, setWaypoints] = useState<string[]>([''])
  const [vehicleType, setVehicleType] = useState('truck')
  const [fuelPrice, setFuelPrice] = useState('3.50')
  const [mpg, setMpg] = useState('6.5')
  const [calculating, setCalculating] = useState(false)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)

  const addWaypoint = () => {
    setWaypoints([...waypoints, ''])
  }

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index))
  }

  const updateWaypoint = (index: number, value: string) => {
    const updated = [...waypoints]
    updated[index] = value
    setWaypoints(updated)
  }

  const calculateRoute = async () => {
    if (!origin || !destination) {
      alert('Please enter origin and destination')
      return
    }

    setCalculating(true)

    try {
      // Mock route calculation - in production, use Google Maps Directions API
      await new Promise(resolve => setTimeout(resolve, 2000))

      const mockRoute: RouteInfo = {
        distance: '1,247 miles',
        duration: '19h 32m',
        fuelCost: `$${(1247 / parseFloat(mpg) * parseFloat(fuelPrice)).toFixed(2)}`,
        tollCost: '$87.50',
        optimizedRoute: [origin, ...waypoints.filter(w => w.trim()), destination]
      }

      setRouteInfo(mockRoute)
      onRouteCalculated?.(mockRoute)
    } catch (error) {
      alert('Failed to calculate route. Please try again.')
    } finally {
      setCalculating(false)
    }
  }

  return (
    <div className="route-planner bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🗺️</span>
        <h3 className="font-semibold text-gray-900">Route Planner</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Starting location"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Final destination"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {waypoints.map((waypoint, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={waypoint}
              onChange={(e) => updateWaypoint(index, e.target.value)}
              placeholder={`Waypoint ${index + 1}`}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              onClick={() => removeWaypoint(index)}
              className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addWaypoint}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
        >
          + Add Waypoint
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="car">Car</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Price ($/gal)</label>
            <input
              type="number"
              step="0.01"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">MPG</label>
            <input
              type="number"
              step="0.1"
              value={mpg}
              onChange={(e) => setMpg(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={calculateRoute}
              disabled={calculating}
              className="w-full bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
            >
              {calculating ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </div>

        {routeInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Route Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-green-700 font-medium">Distance:</span>
                <p className="text-green-900">{routeInfo.distance}</p>
              </div>
              <div>
                <span className="text-green-700 font-medium">Duration:</span>
                <p className="text-green-900">{routeInfo.duration}</p>
              </div>
              <div>
                <span className="text-green-700 font-medium">Fuel Cost:</span>
                <p className="text-green-900">{routeInfo.fuelCost}</p>
              </div>
              <div>
                <span className="text-green-700 font-medium">Toll Cost:</span>
                <p className="text-green-900">{routeInfo.tollCost}</p>
              </div>
            </div>
          </div>
        )}

        {(origin || destination) && (
          <div className="mt-4">
            <GoogleMapsEmbed addresses={[origin, destination].filter(Boolean)} />
          </div>
        )}
      </div>
    </div>
  )
}
