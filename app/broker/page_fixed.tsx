'use client';

import React, { useState } from 'react';

export default function BrokerPage() {
  const [selectedTab, setSelectedTab] = useState('loads');

  // Sample load data
  const loads = [
    {
      id: 'L001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: '$2,450',
      distance: '647 mi',
      weight: '45,000 lbs',
      equipment: 'Dry Van',
      status: 'Available'
    },
    {
      id: 'L002',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      rate: '$3,200',
      distance: '925 mi',
      weight: '38,500 lbs',
      equipment: 'Reefer',
      status: 'Available'
    },
    {
      id: 'L003',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      rate: '$1,850',
      distance: '372 mi',
      weight: '42,000 lbs',
      equipment: 'Flatbed',
      status: 'Pending'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">🏢 Broker Command Center</h1>
        <p className="text-emerald-100">Complete freight management hub - Load boards, bidding, and document generation</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <nav className="flex space-x-1 p-4 border-b">
          {[
            { id: 'loads', label: 'Load Board', icon: '📦' },
            { id: 'bids', label: 'My Bids', icon: '💰' },
            { id: 'contracts', label: 'Contracts', icon: '📋' },
            { id: 'agents', label: 'Broker Agents', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Load Board Tab */}
      {selectedTab === 'loads' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">📦 Available Loads</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                  🔍 Filter
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                  🔄 Refresh
                </button>
              </div>
            </div>
            
            {/* Compact Load Cards */}
            <div className="space-y-3">
              {loads.map((load) => (
                <div key={load.id} className="border border-blue-200 rounded-lg p-4 bg-gradient-to-r from-white to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Load ID */}
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">📋</span>
                        <span className="text-sm font-bold text-blue-700">{load.id}</span>
                      </div>
                      
                      {/* Route */}
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">🗺️</span>
                        <span className="text-sm text-gray-700">
                          {load.origin} → {load.destination}
                        </span>
                        <span className="text-xs text-gray-500">({load.distance})</span>
                      </div>
                      
                      {/* Equipment & Weight */}
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">🚚</span>
                        <span className="text-sm text-gray-600">{load.equipment}</span>
                        <span className="text-xs text-gray-500">{load.weight}</span>
                      </div>
                      
                      {/* Rate */}
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">💰</span>
                        <span className="text-sm font-bold text-green-700">{load.rate}</span>
                      </div>
                      
                      {/* Status */}
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        load.status === 'Available' ? 'bg-green-100 text-green-800' :
                        load.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {load.status}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button 
                        className="w-8 h-8 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded border text-xs flex items-center justify-center"
                        title="Load Information"
                      >
                        ℹ️
                      </button>
                      <button 
                        className="w-8 h-8 bg-green-100 text-green-700 hover:bg-green-200 rounded border text-xs flex items-center justify-center"
                        title="Broker Agent Info"
                      >
                        👤
                      </button>
                      <button 
                        className="w-8 h-8 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded border text-xs flex items-center justify-center"
                        title="Place Bid"
                      >
                        💰
                      </button>
                      <button 
                        className="w-8 h-8 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded border text-xs flex items-center justify-center"
                        title="Contact"
                      >
                        📞
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {selectedTab === 'bids' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 My Submitted Bids</h3>
          <p className="text-gray-600">No bids submitted yet.</p>
        </div>
      )}

      {selectedTab === 'contracts' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Active Contracts</h3>
          <p className="text-gray-600">No active contracts found.</p>
        </div>
      )}

      {selectedTab === 'agents' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Broker Agents</h3>
          <p className="text-gray-600">Manage broker agent assignments and performance.</p>
        </div>
      )}
    </div>
  );
}
