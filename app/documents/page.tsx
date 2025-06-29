'use client';

import { useState } from 'react';
import RateConfirmation from '../components/RateConfirmation';
import BillOfLading from '../components/BillOfLading';
import Logo from '../components/Logo';
import { useLoad } from '../contexts/LoadContext';
import Link from 'next/link';

export default function DocumentsPage() {
  const [activeDocument, setActiveDocument] = useState<'rate-confirmation' | 'bill-of-lading'>('rate-confirmation');
  const { selectedLoad, loadHistory, setSelectedLoad } = useLoad();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
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
      
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        marginTop: '-20px',
        paddingTop: '20px'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Logo />
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>📄 Document Generation</h1>
                <p style={{
                  color: 'rgba(255,255,255,0.9)',
                  margin: 0
                }}>Create ironclad freight documents with auto-populated load data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Load Selection Section */}
        {loadHistory.length > 0 && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Loads</h3>
              <span className="text-sm text-gray-500">{loadHistory.length} loads available</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {loadHistory.slice(0, 6).map((load) => (
                <div 
                  key={load.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedLoad?.id === load.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedLoad(load)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-gray-900 text-lg">#{load.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      load.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                      load.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      load.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' :
                      load.status === 'Available' ? 'bg-gray-100 text-gray-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {load.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      {load.origin}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-3 h-3 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {load.destination}
                    </div>
                    
                    {load.carrierName && (
                      <div className="text-xs text-blue-600 font-medium">
                        🚛 {load.carrierName}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">
                        {load.pickupDate}
                      </span>
                      {typeof load.rate === 'string' ? (
                        <span className="text-sm font-semibold text-green-600">
                          {load.rate}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-green-600">
                          ${load.rate?.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedLoad ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-medium">
                    Load #{selectedLoad.id} Selected
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Document forms will be automatically populated with this load's information. You can modify any details as needed.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    Click a load to auto-populate document forms
                  </span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Select a load from above to automatically fill in Rate Confirmation and Bill of Lading forms.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Document Type Tabs */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-2 bg-gradient-to-r from-gray-100 to-gray-50 p-2 rounded-xl shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveDocument('rate-confirmation')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeDocument === 'rate-confirmation'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105 border-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 bg-white/50'
                }`}
              >
                📄 Rate Confirmation
              </button>
              <button
                onClick={() => setActiveDocument('bill-of-lading')}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeDocument === 'bill-of-lading'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105 border-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/70 bg-white/50'
                }`}
              >
                📋 Bill of Lading
              </button>
            </div>
          </div>
        </div>

        {/* Document Generator */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          {activeDocument === 'rate-confirmation' && <RateConfirmation />}
          {activeDocument === 'bill-of-lading' && <BillOfLading />}
        </div>

        {/* Legal Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-yellow-800">Legal Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                These documents are generated for freight transportation purposes and contain legally binding terms. 
                Please ensure all information is accurate and complete before finalizing. FleetFlow recommends 
                consulting with legal counsel for specific freight contract requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
