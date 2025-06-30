'use client'

import { useState } from 'react'

export default function ClaudeRouteOptimizer() {
  const [vehicles, setVehicles] = useState('')
  const [loads, setLoads] = useState('')
  const [constraints, setConstraints] = useState('')
  const [businessContext, setBusinessContext] = useState('')
  const [optimizationResult, setOptimizationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const optimizeRoutes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'optimize_routes',
          data: {
            vehicles: JSON.parse(vehicles || '[]'),
            loads: JSON.parse(loads || '[]'),
            constraints: JSON.parse(constraints || '{}'),
            businessContext
          }
        }),
      })

      const result = await response.json()
      if (result.success) {
        setOptimizationResult(result.data)
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Route optimization error:', error)
      alert('Failed to optimize routes')
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = () => {
    setVehicles(JSON.stringify([
      {
        id: 'V001',
        type: 'truck',
        capacity: 26000,
        location: 'Atlanta, GA',
        driver: 'Mike Johnson',
        fuelType: 'diesel',
        mpg: 7.2,
        maxDrivingHours: 11,
        specializations: ['refrigerated', 'hazmat']
      },
      {
        id: 'V002',
        type: 'truck',
        capacity: 24000,
        location: 'Jacksonville, FL',
        driver: 'Sarah Wilson',
        fuelType: 'diesel',
        mpg: 6.8,
        maxDrivingHours: 11
      }
    ], null, 2))

    setLoads(JSON.stringify([
      {
        id: 'L001',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        weight: 22000,
        pickupDate: '2024-07-01T08:00:00Z',
        deliveryDate: '2024-07-02T17:00:00Z',
        specialRequirements: ['refrigerated'],
        priority: 'high',
        rate: 2850
      },
      {
        id: 'L002',
        origin: 'Tampa, FL',
        destination: 'Orlando, FL',
        weight: 18000,
        pickupDate: '2024-07-01T10:00:00Z',
        deliveryDate: '2024-07-01T16:00:00Z',
        priority: 'medium',
        rate: 650
      }
    ], null, 2))

    setConstraints(JSON.stringify({
      maxDriveTime: 11,
      fuelEfficiency: true,
      avoidTolls: false,
      preferredCarriers: [],
      prioritizeTime: false,
      allowOvertimeDrivers: false
    }, null, 2))

    setBusinessContext('Peak season shipping with focus on customer satisfaction and on-time delivery. Fuel costs are a major concern.')
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '25px',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '20px'
    }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#fff' }}>
        🗺️ Claude AI Route Optimizer
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Sample Data Button */}
        <button
          onClick={loadSampleData}
          style={{
            padding: '12px',
            background: 'rgba(33, 150, 243, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📋 Load Sample Data
        </button>

        {/* Vehicles Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Available Vehicles (JSON):
          </label>
          <textarea
            value={vehicles}
            onChange={(e) => setVehicles(e.target.value)}
            placeholder="Enter vehicles data as JSON array..."
            style={{
              width: '100%',
              height: '150px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Loads Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Loads to Assign (JSON):
          </label>
          <textarea
            value={loads}
            onChange={(e) => setLoads(e.target.value)}
            placeholder="Enter loads data as JSON array..."
            style={{
              width: '100%',
              height: '150px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Constraints Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Route Constraints (JSON):
          </label>
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Enter constraints as JSON object..."
            style={{
              width: '100%',
              height: '100px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Business Context */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
            Business Context:
          </label>
          <textarea
            value={businessContext}
            onChange={(e) => setBusinessContext(e.target.value)}
            placeholder="Describe current business priorities, market conditions, or special considerations..."
            style={{
              width: '100%',
              height: '80px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Optimize Button */}
        <button
          onClick={optimizeRoutes}
          disabled={loading || !vehicles || !loads}
          style={{
            padding: '15px',
            background: loading ? '#666' : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? '🤖 Optimizing with Claude AI...' : '🗺️ Optimize Routes'}
        </button>

        {/* Optimization Results */}
        {optimizationResult && (
          <div>
            <h4 style={{ margin: '0 0 15px 0', color: '#fff' }}>
              📊 Optimization Results:
            </h4>
            
            {/* AI Explanation */}
            <div style={{
              background: 'rgba(76, 175, 80, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              marginBottom: '15px'
            }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#4CAF50' }}>
                🤖 AI Analysis:
              </h5>
              <p style={{ margin: 0, color: '#fff', lineHeight: '1.6' }}>
                {optimizationResult.explanation}
              </p>
            </div>

            {/* Route Assignments */}
            {optimizationResult.routes && optimizationResult.routes.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '15px'
              }}>
                <h5 style={{ margin: '0 0 15px 0', color: '#fff' }}>
                  🚛 Optimized Route Assignments:
                </h5>
                {optimizationResult.routes.map((route: any, index: number) => (
                  <div key={index} style={{
                    background: 'rgba(33, 150, 243, 0.1)',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    marginBottom: '10px'
                  }}>
                    <div style={{ color: '#2196F3', fontWeight: 'bold', marginBottom: '8px' }}>
                      Vehicle {route.vehicleId}
                    </div>
                    <div style={{ color: '#fff', fontSize: '14px' }}>
                      <div>Distance: {route.totalDistance} miles</div>
                      <div>Time: {route.estimatedTime} hours</div>
                      <div>Fuel Cost: ${route.fuelCost}</div>
                      <div style={{ marginTop: '8px', fontStyle: 'italic' }}>
                        {route.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alternative Options */}
            {optimizationResult.alternativeOptions && optimizationResult.alternativeOptions.length > 0 && (
              <div style={{
                background: 'rgba(255, 152, 0, 0.1)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 152, 0, 0.3)'
              }}>
                <h5 style={{ margin: '0 0 10px 0', color: '#FF9800' }}>
                  💡 Alternative Options:
                </h5>
                <ul style={{ margin: 0, color: '#fff', fontSize: '14px' }}>
                  {optimizationResult.alternativeOptions.map((option: string, index: number) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shareable Report Link */}
            {optimizationResult.shareableReport && (
              <div style={{
                textAlign: 'center',
                marginTop: '15px'
              }}>
                <button
                  onClick={() => window.open('#', '_blank')}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(156, 39, 176, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  🔗 View Shareable Report
                </button>
              </div>
            )}
          </div>
        )}

        {/* Benefits Info */}
        <div style={{
          background: 'rgba(156, 39, 176, 0.1)',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid rgba(156, 39, 176, 0.3)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#9C27B0' }}>
            🚀 Claude AI Route Optimization Benefits:
          </h4>
          <ul style={{ margin: 0, color: '#fff', fontSize: '14px' }}>
            <li>Intelligent route planning considering multiple variables</li>
            <li>Natural language explanations for decision making</li>
            <li>Business context awareness for strategic optimization</li>
            <li>Alternative scenario planning and contingency options</li>
            <li>Detailed cost-benefit analysis and recommendations</li>
            <li>Shareable reports for team collaboration</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
