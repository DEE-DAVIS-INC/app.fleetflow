'use client'

import { useState } from 'react'
import GoogleMaps from '../components/GoogleMaps'
import StickyNote from '../components/StickyNote'
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard'

export default function RoutesPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'optimizer'>('optimizer')

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-gray-900 mb-2" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            🗺️ Route Management & Optimization
          </h1>
          <p className="text-gray-600">
            AI-powered route planning with Google Maps integration
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.open('http://localhost:3001', '_blank')}
            className="btn btn-secondary"
          >
            🏠 Dashboard
          </button>
          <button className="btn btn-primary">
            + Create Route
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('routes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'routes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Current Routes
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'optimizer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚡ Route Optimizer (NEW!)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'routes' && (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🚛</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Current Routes View
          </h3>
          <p className="text-gray-600 mb-6">
            This section shows your existing routes and active deliveries.
            <br />
            Click "Route Optimizer" above to see the new AI-powered optimization features!
          </p>
          <button
            onClick={() => setActiveTab('optimizer')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Try Route Optimizer →
          </button>
        </div>
      )}

      {activeTab === 'optimizer' && (
        <RouteOptimizerDashboard />
      )}

      {/* Sticky Notes Section */}
      <div className="mt-8">
        <StickyNote section="routes" entityId="route-optimization" />
      </div>
    </div>
  )
}
