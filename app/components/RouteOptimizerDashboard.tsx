'use client'

import { useState, useEffect } from 'react'
import { 
  RouteOptimizationService, 
  Vehicle, 
  Stop, 
  OptimizedRoute,
  RouteOptimizationRequest,
  routeOptimizer 
} from '../services/route-optimization'
import GoogleMapsEmbed from './GoogleMaps'

interface RouteOptimizerProps {
  onOptimizationComplete?: (routes: OptimizedRoute[]) => void
}

export default function RouteOptimizerDashboard({ onOptimizationComplete }: RouteOptimizerProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [stops, setStops] = useState<Stop[]>([])
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [showAddStop, setShowAddStop] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<OptimizedRoute | null>(null)

  // Initialize with sample data
  useEffect(() => {
    const sampleVehicles: Vehicle[] = [
      {
        id: 'V001',
        type: 'truck',
        capacity: 40000,
        location: '1600 Amphitheatre Pkwy, Mountain View, CA',
        driver: 'John Smith',
        fuelType: 'diesel',
        mpg: 6.5,
        maxDrivingHours: 11,
        specializations: ['hazmat', 'refrigerated']
      },
      {
        id: 'V002',
        type: 'van',
        capacity: 10000,
        location: '350 Fifth Avenue, New York, NY',
        driver: 'Sarah Johnson',
        fuelType: 'gas',
        mpg: 12.0,
        maxDrivingHours: 10
      }
    ]

    const sampleStops: Stop[] = [
      {
        id: 'S001',
        address: '1 Microsoft Way, Redmond, WA',
        type: 'pickup',
        timeWindow: { start: '09:00', end: '11:00' },
        serviceTime: 30,
        weight: 5000,
        priority: 'high'
      },
      {
        id: 'S002',
        address: '410 Terry Ave N, Seattle, WA',
        type: 'delivery',
        timeWindow: { start: '14:00', end: '16:00' },
        serviceTime: 20,
        weight: 3000,
        priority: 'urgent'
      },
      {
        id: 'S003',
        address: '1 Hacker Way, Menlo Park, CA',
        type: 'pickup',
        serviceTime: 25,
        weight: 8000,
        priority: 'medium'
      }
    ]

    setVehicles(sampleVehicles)
    setStops(sampleStops)
  }, [])

  const runOptimization = async () => {
    if (vehicles.length === 0 || stops.length === 0) {
      alert('Please add at least one vehicle and one stop before optimizing.')
      return
    }

    setIsOptimizing(true)
    
    try {
      const request: RouteOptimizationRequest = {
        vehicles,
        stops,
        constraints: {
          maxRouteTime: 10,
          prioritizeTime: true,
          avoidTolls: false,
          allowOvertimeDrivers: false
        }
      }

      const routes = await routeOptimizer.optimizeRoutes(request)
      setOptimizedRoutes(routes)
      onOptimizationComplete?.(routes)
      
      // Show success notification
      console.log('✅ Route optimization completed successfully!')
      
    } catch (error) {
      console.error('❌ Route optimization failed:', error)
      alert('Route optimization failed. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const addVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `V${String(vehicles.length + 1).padStart(3, '0')}`
    }
    setVehicles([...vehicles, newVehicle])
    setShowAddVehicle(false)
  }

  const addStop = (stop: Omit<Stop, 'id'>) => {
    const newStop: Stop = {
      ...stop,
      id: `S${String(stops.length + 1).padStart(3, '0')}`
    }
    setStops([...stops, newStop])
    setShowAddStop(false)
  }

  const getRouteMetrics = () => {
    if (optimizedRoutes.length === 0) return null
    return routeOptimizer.calculateRouteMetrics(optimizedRoutes)
  }

  const metrics = getRouteMetrics()

  return (
    <div style={{ color: 'white' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ⚡ AI Route Optimizer
          </h2>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            opacity: 0.9
          }}>
            Smart routing with real-time traffic optimization
          </p>
        </div>
        <button
          onClick={runOptimization}
          disabled={isOptimizing || vehicles.length === 0 || stops.length === 0}
          style={{
            background: isOptimizing 
              ? 'rgba(156, 163, 175, 0.8)' 
              : 'rgba(76, 175, 80, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '12px',
            cursor: isOptimizing ? 'not-allowed' : 'pointer',
            fontSize: '1.1rem',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {isOptimizing ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Optimizing...
            </>
          ) : (
            <>⚡ Optimize Routes</>
          )}
        </button>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(33, 150, 243, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              {metrics.totalDistance}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Miles</div>
          </div>
          <div style={{
            background: 'rgba(76, 175, 80, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              ${metrics.totalCost}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Cost</div>
          </div>
          <div style={{
            background: 'rgba(156, 39, 176, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              {metrics.avgEfficiency}%
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Efficiency Score</div>
          </div>
          <div style={{
            background: 'rgba(255, 152, 0, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 5px 0' }}>
              {metrics.timeSavings}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Time Saved</div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        
        {/* Vehicles Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              🚛 Vehicles ({vehicles.length})
            </h3>
            <button
              onClick={() => setShowAddVehicle(true)}
              style={{
                background: 'rgba(33, 150, 243, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              + Add Vehicle
            </button>
          </div>
          
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '1rem',
                      margin: '0 0 5px 0'
                    }}>
                      {vehicle.id}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      margin: '0 0 5px 0'
                    }}>
                      {vehicle.driver}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      opacity: 0.8
                    }}>
                      {vehicle.type.toUpperCase()} • {vehicle.capacity.toLocaleString()} lbs • {vehicle.mpg} MPG
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem'
                  }}>
                    {vehicle.fuelType}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  marginTop: '8px'
                }}>
                  📍 {vehicle.location.substring(0, 35)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stops Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              margin: 0,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              📍 Stops ({stops.length})
            </h3>
            <button
              onClick={() => setShowAddStop(true)}
              style={{
                background: 'rgba(76, 175, 80, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              + Add Stop
            </button>
          </div>
          
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {stops.map((stop) => (
              <div key={stop.id} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                padding: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '1rem',
                      margin: '0 0 5px 0'
                    }}>
                      {stop.id}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      opacity: 0.9,
                      margin: '0 0 5px 0'
                    }}>
                      {stop.type === 'pickup' ? '📦' : '🚚'} {stop.type}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      opacity: 0.8
                    }}>
                      {stop.serviceTime}min • {stop.weight?.toLocaleString() || 0} lbs
                    </div>
                  </div>
                  <div style={{
                    background: stop.priority === 'urgent' ? 'rgba(244, 67, 54, 0.8)' :
                              stop.priority === 'high' ? 'rgba(255, 152, 0, 0.8)' :
                              stop.priority === 'medium' ? 'rgba(255, 193, 7, 0.8)' :
                              'rgba(158, 158, 158, 0.8)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {stop.priority}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  opacity: 0.7,
                  marginTop: '8px'
                }}>
                  📍 {stop.address.substring(0, 30)}...
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized Routes Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '25px',
          borderRadius: '15px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: '600',
            margin: '0 0 20px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            ⚡ Optimized Routes ({optimizedRoutes.length})
          </h3>
          
          {optimizedRoutes.length === 0 ? (
            <div style={{
              textAlign: 'center',
              opacity: 0.8,
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🗺️</div>
              <p style={{ margin: 0, fontSize: '1rem' }}>
                Run optimization to see optimized routes
              </p>
            </div>
          ) : (
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {optimizedRoutes.map((route) => (
                <div 
                  key={route.vehicleId} 
                  style={{
                    background: selectedRoute?.vehicleId === route.vehicleId 
                      ? 'rgba(33, 150, 243, 0.3)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    border: selectedRoute?.vehicleId === route.vehicleId
                      ? '1px solid rgba(33, 150, 243, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    padding: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedRoute(route)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div>
                      <div style={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        margin: '0 0 5px 0'
                      }}>
                        {route.vehicleId}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        opacity: 0.9,
                        margin: '0 0 5px 0'
                      }}>
                        {route.stops.length} stops • {route.totalDistance.toFixed(0)} mi
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        opacity: 0.8
                      }}>
                        {Math.round(route.totalDuration)}min • ${route.estimatedCost.toFixed(0)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        margin: '0 0 5px 0'
                      }}>
                        {route.efficiency}%
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        opacity: 0.7
                      }}>
                        efficiency
                      </div>
                    </div>
                  </div>
                  
                  {route.warnings.length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      {route.warnings.map((warning, idx) => (
                        <div key={idx} style={{
                          fontSize: '0.8rem',
                          background: 'rgba(255, 152, 0, 0.3)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 152, 0, 0.5)',
                          marginBottom: '4px'
                        }}>
                          ⚠️ {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Route Details and Map */}
      {selectedRoute && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Route Details - {selectedRoute.vehicleId}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Distance</div>
                  <div className="text-lg font-medium">{selectedRoute.totalDistance.toFixed(1)} miles</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-lg font-medium">{Math.round(selectedRoute.totalDuration)} min</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Fuel Cost</div>
                  <div className="text-lg font-medium">${selectedRoute.fuelCost.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Cost</div>
                  <div className="text-lg font-medium">${selectedRoute.estimatedCost.toFixed(2)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Stop Sequence</div>
                <div className="space-y-2">
                  {selectedRoute.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{stop.address}</div>
                        <div className="text-xs text-gray-500">
                          {stop.type === 'pickup' ? '📦' : '🚚'} {stop.type} • {stop.serviceTime}min
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        stop.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        stop.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {stop.priority}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Visualization</h3>
            <div className="h-96">
              <GoogleMapsEmbed 
                addresses={selectedRoute.stops.map(stop => stop.address)}
                height="100%"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <VehicleForm 
          onSubmit={addVehicle}
          onCancel={() => setShowAddVehicle(false)}
        />
      )}

      {/* Add Stop Modal */}
      {showAddStop && (
        <StopForm 
          onSubmit={addStop}
          onCancel={() => setShowAddStop(false)}
        />
      )}
    </div>
  )
}

// Vehicle Form Component
function VehicleForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    type: 'truck' as Vehicle['type'],
    capacity: 40000,
    location: '',
    driver: '',
    fuelType: 'diesel' as Vehicle['fuelType'],
    mpg: 6.5,
    maxDrivingHours: 11,
    specializations: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.location || !formData.driver) {
      alert('Please fill in all required fields')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name *</label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData({...formData, driver: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="123 Main St, City, State"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Vehicle['type']})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="car">Car</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({...formData, fuelType: e.target.value as Vehicle['fuelType']})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="diesel">Diesel</option>
                <option value="gas">Gasoline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (lbs)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MPG</label>
              <input
                type="number"
                step="0.1"
                value={formData.mpg}
                onChange={(e) => setFormData({...formData, mpg: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Hours</label>
              <input
                type="number"
                value={formData.maxDrivingHours}
                onChange={(e) => setFormData({...formData, maxDrivingHours: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Stop Form Component
function StopForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (stop: Omit<Stop, 'id'>) => void
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    address: '',
    type: 'pickup' as Stop['type'],
    serviceTime: 30,
    weight: 1000,
    priority: 'medium' as Stop['priority'],
    timeWindow: { start: '', end: '' }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.address) {
      alert('Please enter an address')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add New Stop</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="123 Main St, City, State"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as Stop['type']})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as Stop['priority']})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Time (min)</label>
              <input
                type="number"
                value={formData.serviceTime}
                onChange={(e) => setFormData({...formData, serviceTime: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: parseInt(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Stop
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
