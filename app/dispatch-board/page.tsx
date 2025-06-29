'use client';

import React, { useState } from 'react';
import { LoadDistributionService, defaultDistributionConfig, LoadDistributionConfig } from '../services/load-distribution';
import { ProtectedRoute } from '../components/AuthProvider';

interface LoadPosting {
  id: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  equipment: string;
  weight: string;
  rate: number;
  distance: string;
  specialInstructions?: string;
  status: 'posted' | 'assigned' | 'in_transit' | 'delivered';
  postedAt: string;
  distributedTo: string[];
  responses: LoadResponse[];
}

interface LoadResponse {
  id: string;
  respondentName: string;
  respondentPhone: string;
  respondentType: 'driver' | 'carrier';
  responseTime: string;
  accepted: boolean;
  proposedRate?: number;
  message?: string;
}

export default function DispatchLoadBoard() {
  const [loads, setLoads] = useState<LoadPosting[]>([]);
  const [showNewLoadForm, setShowNewLoadForm] = useState(false);
  const [distributionConfig, setDistributionConfig] = useState<LoadDistributionConfig>(defaultDistributionConfig);
  const [isDistributing, setIsDistributing] = useState(false);
  const [distributionResults, setDistributionResults] = useState<any>(null);

  const [newLoad, setNewLoad] = useState({
    origin: '',
    destination: '',
    pickupDate: '',
    deliveryDate: '',
    equipment: 'Dry Van',
    weight: '',
    rate: '',
    distance: '',
    specialInstructions: ''
  });

  const distributionService = new LoadDistributionService(distributionConfig);

  const handleSubmitLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const loadPosting: LoadPosting = {
      id: 'LD' + Date.now(),
      ...newLoad,
      rate: parseFloat(newLoad.rate),
      status: 'posted',
      postedAt: new Date().toISOString(),
      distributedTo: [],
      responses: []
    };

    // Add load to board
    setLoads(prev => [loadPosting, ...prev]);

    // Auto-distribute if enabled
    if (distributionConfig.autoSendEnabled) {
      setIsDistributing(true);
      try {
        const results = await distributionService.distributeLoad(loadPosting);
        setDistributionResults(results);
        
        // Update load with distribution info
        setLoads(prev => prev.map(load => 
          load.id === loadPosting.id 
            ? { ...load, distributedTo: results.recipients }
            : load
        ));
      } catch (error) {
        console.error('Distribution error:', error);
      } finally {
        setIsDistributing(false);
      }
    }

    // Reset form
    setNewLoad({
      origin: '',
      destination: '',
      pickupDate: '',
      deliveryDate: '',
      equipment: 'Dry Van',
      weight: '',
      rate: '',
      distance: '',
      specialInstructions: ''
    });
    setShowNewLoadForm(false);
  };

  const handleManualDistribute = async (load: LoadPosting) => {
    setIsDistributing(true);
    try {
      const results = await distributionService.distributeLoad(load);
      setDistributionResults(results);
      
      setLoads(prev => prev.map(l => 
        l.id === load.id 
          ? { ...l, distributedTo: results.recipients }
          : l
      ));
    } catch (error) {
      console.error('Distribution error:', error);
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{
        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        minHeight: '100vh',
        color: 'white'
      }}>
        <div className="max-w-7xl mx-auto p-4">
          {/* Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '20px'
          }}>
            <div className="flex justify-between items-start">
              <div>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: '0 0 10px 0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  📋 Dispatch Load Board
                </h1>
                <p style={{
                  fontSize: '1.1rem',
                  margin: 0,
                  opacity: 0.9
                }}>Post loads and automatically notify drivers/carriers via SMS</p>
              </div>
              <button
                onClick={() => setShowNewLoadForm(true)}
                style={{
                  background: 'rgba(76, 175, 80, 0.8)',
                  color: 'white',
                  padding: '15px 25px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ➕ Post New Load
              </button>
            </div>
          </div>

          {/* Distribution Config Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '20px'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(76, 175, 80, 0.3)',
              borderRadius: '15px 15px 0 0'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>⚙️</span>
                Auto-Distribution Settings
              </h3>
            </div>
            <div style={{ padding: '20px' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={distributionConfig.autoSendEnabled}
                    onChange={(e) => setDistributionConfig(prev => ({ ...prev, autoSendEnabled: e.target.checked }))}
                    className="rounded text-blue-600"
                  />
                  <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'white' }}>Auto-Send SMS</label>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', display: 'block' }}>Max Recipients</label>
                  <input
                    type="number"
                    value={distributionConfig.maxDriversPerLoad}
                    onChange={(e) => setDistributionConfig(prev => ({ ...prev, maxDriversPerLoad: parseInt(e.target.value) }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px', display: 'block' }}>Radius (miles)</label>
                  <input
                    type="number"
                    value={distributionConfig.radiusMiles}
                    onChange={(e) => setDistributionConfig(prev => ({ ...prev, radiusMiles: parseInt(e.target.value) }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    min="0"
                    max="1000"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={distributionConfig.equipmentMatching}
                    onChange={(e) => setDistributionConfig(prev => ({ ...prev, equipmentMatching: e.target.checked }))}
                    className="rounded text-blue-600"
                  />
                  <label style={{ fontSize: '0.9rem', fontWeight: '500', color: 'white' }}>Equipment Match</label>
                </div>
              </div>
            </div>
          </div>

          {/* Distribution Results */}
          {distributionResults && (
            <div className="card-2d mb-6">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="mr-2">📊</span>
                  Distribution Results
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{distributionResults.messagesSent}</div>
                    <div className="text-sm text-gray-600">Messages Sent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{distributionResults.recipients.length}</div>
                    <div className="text-sm text-gray-600">Recipients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{distributionResults.errors.length}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>
                
                {distributionResults.recipients.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">📱 SMS Sent To:</h4>
                    <div className="flex flex-wrap gap-2">
                      {distributionResults.recipients.map((recipient: string, index: number) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {distributionResults.errors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">❌ Errors:</h4>
                    <div className="space-y-1">
                      {distributionResults.errors.map((error: string, index: number) => (
                        <div key={index} className="bg-red-100 text-red-800 px-3 py-2 rounded text-sm">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Load Board */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px 15px 0 0'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>Active Load Postings</h3>
            </div>
            <div className="overflow-x-auto">
              {loads.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.6 }}>📋</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '500', color: 'white', marginBottom: '8px' }}>No loads posted yet</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Click "Post New Load" to get started</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <tr>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Load ID</th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route</th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equipment</th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rate</th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distributed To</th>
                      <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                    {loads.map((load) => (
                      <tr key={load.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: '500', color: 'white' }}>
                          {load.id}
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'white' }}>
                          <div style={{ fontWeight: '500' }}>{load.origin}</div>
                          <div style={{ color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center' }}>
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="#FFB74D" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            {load.destination}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{load.distance}</div>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'white' }}>
                          <div>{load.equipment}</div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>{load.weight}</div>
                        </td>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem', fontWeight: 'bold', color: '#4CAF50' }}>
                          ${load.rate.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            load.status === 'posted' ? 'bg-blue-100 text-blue-800' :
                            load.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                            load.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {load.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="text-xs text-gray-600 mb-1">{load.distributedTo.length} recipients</div>
                          {load.distributedTo.slice(0, 2).map((recipient, index) => (
                            <div key={index} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1">
                              {recipient}
                            </div>
                          ))}
                          {load.distributedTo.length > 2 && (
                            <div className="text-xs text-gray-500">+{load.distributedTo.length - 2} more</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleManualDistribute(load)}
                              disabled={isDistributing}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                            >
                              📱 Redistribute
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                              📝 Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Load Form Modal */}
      {showNewLoadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">📋 Post New Load</h3>
                <button
                  onClick={() => setShowNewLoadForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitLoad} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    required
                    value={newLoad.origin}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, origin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Atlanta, GA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    required
                    value={newLoad.destination}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, destination: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Miami, FL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
                  <input
                    type="date"
                    required
                    value={newLoad.pickupDate}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, pickupDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={newLoad.deliveryDate}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                  <select
                    value={newLoad.equipment}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, equipment: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Dry Van">Dry Van</option>
                    <option value="Refrigerated">Refrigerated</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Step Deck">Step Deck</option>
                    <option value="Lowboy">Lowboy</option>
                    <option value="Tanker">Tanker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={newLoad.weight}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="45,000 lbs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($)</label>
                  <input
                    type="number"
                    required
                    value={newLoad.rate}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, rate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <input
                    type="text"
                    value={newLoad.distance}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, distance: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="647 miles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <input
                    type="text"
                    value={newLoad.specialInstructions}
                    onChange={(e) => setNewLoad(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Priority delivery"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">
                    {distributionConfig.autoSendEnabled 
                      ? `Auto SMS enabled: Will send to up to ${distributionConfig.maxDriversPerLoad} drivers/carriers`
                      : 'Auto SMS disabled: Load will be posted without notifications'
                    }
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewLoadForm(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDistributing}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isDistributing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Posting & Sending SMS...</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>Post Load {distributionConfig.autoSendEnabled ? '& Send SMS' : ''}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
