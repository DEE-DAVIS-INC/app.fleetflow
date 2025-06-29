'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
    <div style={{
      background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Simple Back to Dashboard Button */}
      <div style={{ padding: '20px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>
      
      <div className="container mx-auto p-8" style={{ marginTop: '-20px', paddingTop: '20px' }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '30px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>📊 Broker Load Board</h1>
        <p style={{
          fontSize: '1.1rem',
          margin: 0,
          opacity: 0.9
        }}>Find and manage freight loads</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex space-x-4">
          {[
            { id: 'loads', label: 'Available Loads' },
            { id: 'bids', label: 'My Bids' },
            { id: 'contracts', label: 'Contracts' },
            { id: 'agents', label: 'Agents' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedTab === 'loads' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Available Loads</h2>
            
            <div className="space-y-3">
              {loads.map((load) => (
                <div key={load.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-16">
                        <div className="font-semibold text-blue-600">{load.id}</div>
                      </div>
                      
                      <div className="w-48">
                        <div className="font-medium">{load.origin}</div>
                        <div className="text-sm text-gray-500">to {load.destination}</div>
                      </div>
                      
                      <div className="w-24">
                        <div className="font-medium">{load.equipment}</div>
                        <div className="text-sm text-gray-500">{load.weight}</div>
                      </div>
                      
                      <div className="w-20">
                        <div className="text-lg font-bold text-green-600">{load.rate}</div>
                        <div className="text-sm text-gray-500">{load.distance}</div>
                      </div>
                      
                      <div className="w-20">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          load.status === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {load.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors duration-200">
                        View
                      </button>
                      <button className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors duration-200">
                        Bid
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'bids' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My Bids</h2>
          <p className="text-gray-600">No bids submitted yet.</p>
        </div>
      )}

      {selectedTab === 'contracts' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contracts</h2>
          <p className="text-gray-600">No active contracts.</p>
        </div>
      )}

      {selectedTab === 'agents' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Broker Agents</h2>
          <p className="text-gray-600">Manage your broker agents here.</p>
        </div>
      )}
      </div>
    </div>
  );
}
