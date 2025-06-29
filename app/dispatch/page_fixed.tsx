'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FleetMap from '../components/FleetMap';
import GoogleMaps from '../components/GoogleMaps';
import StickyNote from '../components/StickyNote';
import { ProtectedRoute } from '../components/AuthProvider';
import { useLoad, LoadData } from '../contexts/LoadContext';

interface DispatchLoad {
  id: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  status: 'Assigned' | 'In Transit' | 'Delivered' | 'Delayed';
  pickupTime: string;
  deliveryTime: string;
  distance: string;
  priority: 'High' | 'Medium' | 'Low';
  loadAmount?: number;
  carrierName?: string;
  invoiceGenerated?: boolean;
}

interface DriverStatus {
  id: string;
  name: string;
  vehicle: string;
  status: 'Available' | 'On Route' | 'Loading' | 'Unloading' | 'Off Duty';
  location: string;
  lastUpdate: string;
  hoursOfService: string;
}

export default function DispatchCentralPage() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'drivers' | 'dispatch'>('active');
  const router = useRouter();
  const { setSelectedLoad, addToHistory } = useLoad();

  // Sample data
  const [activeLoads] = useState<DispatchLoad[]>([
    {
      id: 'DL001',
      driver: 'John Smith',
      vehicle: 'TRK-101',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      status: 'In Transit',
      pickupTime: '2024-12-19 08:00',
      deliveryTime: '2024-12-20 14:00',
      distance: '647 mi',
      priority: 'High',
      loadAmount: 2450,
      carrierName: 'Smith Trucking LLC',
      invoiceGenerated: true
    },
    {
      id: 'DL002',
      driver: 'Sarah Johnson',
      vehicle: 'TRK-205',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      status: 'Assigned',
      pickupTime: '2024-12-20 06:00',
      deliveryTime: '2024-12-21 18:00',
      distance: '925 mi',
      priority: 'Medium',
      loadAmount: 3200,
      carrierName: 'Johnson Logistics',
      invoiceGenerated: false
    },
    {
      id: 'DL003',
      driver: 'Mike Wilson',
      vehicle: 'TRK-150',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      status: 'Delayed',
      pickupTime: '2024-12-19 12:00',
      deliveryTime: '2024-12-19 20:00',
      distance: '372 mi',
      priority: 'High',
      loadAmount: 1850,
      carrierName: 'Wilson Transport',
      invoiceGenerated: true
    }
  ]);

  const drivers: DriverStatus[] = [
    {
      id: 'DR001',
      name: 'John Smith',
      vehicle: 'TRK-101',
      status: 'On Route',
      location: 'I-75, Gainesville, FL',
      lastUpdate: '10 min ago',
      hoursOfService: '6h 30m remaining'
    },
    {
      id: 'DR002',
      name: 'Sarah Johnson',
      vehicle: 'TRK-205',
      status: 'Available',
      location: 'Chicago Terminal',
      lastUpdate: '2 min ago',
      hoursOfService: '10h 45m remaining'
    },
    {
      id: 'DR003',
      name: 'Mike Wilson',
      vehicle: 'TRK-150',
      status: 'Loading',
      location: 'LA Distribution Center',
      lastUpdate: '15 min ago',
      hoursOfService: '8h 15m remaining'
    },
    {
      id: 'DR004',
      name: 'Lisa Brown',
      vehicle: 'TRK-087',
      status: 'Off Duty',
      location: 'Dallas Rest Area',
      lastUpdate: '1h ago',
      hoursOfService: 'On Break - 8h restart'
    }
  ];

  const convertToLoadData = (dispatchLoad: DispatchLoad): LoadData => {
    return {
      id: dispatchLoad.id,
      origin: dispatchLoad.origin,
      destination: dispatchLoad.destination,
      pickupDate: dispatchLoad.pickupTime.split(' ')[0],
      pickupTime: dispatchLoad.pickupTime.split(' ')[1],
      deliveryDate: dispatchLoad.deliveryTime.split(' ')[0],
      deliveryTime: dispatchLoad.deliveryTime.split(' ')[1],
      weight: '45,000 lbs',
      equipment: 'Dry Van',
      rate: dispatchLoad.loadAmount || 0,
      status: dispatchLoad.status,
      distance: dispatchLoad.distance,
      carrierName: dispatchLoad.carrierName,
      driverName: dispatchLoad.driver,
      priority: dispatchLoad.priority
    };
  };

  const handleGenerateDocuments = (load: DispatchLoad) => {
    const loadData = convertToLoadData(load);
    setSelectedLoad(loadData);
    addToHistory(loadData);
    router.push('/documents');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'In Transit':
      case 'On Route':
        return 'text-blue-600 bg-blue-100';
      case 'Assigned':
        return 'text-yellow-600 bg-yellow-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Delayed':
        return 'text-red-600 bg-red-100';
      case 'Loading':
      case 'Unloading':
        return 'text-orange-600 bg-orange-100';
      case 'Off Duty':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <ProtectedRoute requiredPermission="dispatch_access">
      <div className="min-h-screen bg-light-blue-theme">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
          <div className="space-y-4">
            {/* Header */}
            <div>
              <h1 className="text-lg font-bold text-gray-900">🚛 Dispatch Central</h1>
              <p className="text-gray-600 mt-1 ultra-compact">
                Real-time fleet coordination and load management
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="compact font-medium text-gray-500 truncate">Active Loads</dt>
                    <dd className="text-xl font-bold text-gray-900">{activeLoads.length}</dd>
                  </div>
                </div>
              </div>

              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="compact font-medium text-gray-500 truncate">Available Drivers</dt>
                    <dd className="text-xl font-bold text-gray-900">
                      {drivers.filter(d => d.status === 'Available').length}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="compact font-medium text-gray-500 truncate">In Transit</dt>
                    <dd className="text-xl font-bold text-gray-900">
                      {activeLoads.filter(l => l.status === 'In Transit').length}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dt className="compact font-medium text-gray-500 truncate">Alerts</dt>
                    <dd className="text-xl font-bold text-gray-900">
                      {activeLoads.filter(l => l.status === 'Delayed').length}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 rounded-2xl p-2 shadow-lg border border-gray-200">
              <nav className="flex space-x-2">
                {[
                  { id: 'active', label: 'Active Loads', count: activeLoads.length, icon: '⚡', color: 'blue' },
                  { id: 'drivers', label: 'Driver Status', count: drivers.length, icon: '👥', color: 'green' },
                  { id: 'dispatch', label: 'Dispatch Board', count: 0, icon: '📋', color: 'purple' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold compact transition-all duration-300 border-2 ${
                      selectedTab === tab.id
                        ? tab.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg transform scale-105' :
                          tab.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg transform scale-105' :
                          'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg transform scale-105'
                        : `border-transparent text-gray-600 hover:text-gray-800 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg">{tab.icon}</span>
                      <div className="flex flex-col items-center">
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span className={`mt-1 py-0.5 px-2 rounded-full ultra-compact font-bold ${
                            selectedTab === tab.id
                              ? 'bg-white/30 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Active Loads Tab */}
            {selectedTab === 'active' && (
              <div className="card-2d">
                <div className="px-4 py-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Active Load Assignments</h3>
                    <div className="flex space-x-2">
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-blue-600">
                        ➕ New Assignment
                      </button>
                      <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl compact font-semibold transition-all shadow-md hover:shadow-lg border border-gray-300 hover:border-gray-400">
                        🔍 Filter
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="table-2d">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Load ID</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Driver / Vehicle</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Route</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Load Value</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left ultra-compact font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {activeLoads.map((load) => (
                            <tr key={load.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap compact font-medium text-gray-900">
                                {load.id}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap compact text-gray-900">
                                <div className="font-medium">{load.driver}</div>
                                <div className="text-gray-500">{load.vehicle}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap compact text-gray-900">
                                <div className="font-medium">{load.origin}</div>
                                <div className="text-gray-500 flex items-center">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="#D97706" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                  {load.destination}
                                </div>
                                <div className="ultra-compact text-gray-400">{load.distance}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap compact text-gray-900">
                                <div className="font-semibold text-green-600">${load.loadAmount?.toLocaleString()}</div>
                                <div className="ultra-compact text-gray-500">{load.carrierName}</div>
                                {load.invoiceGenerated && (
                                  <div className="ultra-compact text-blue-600">✓ Invoice Created</div>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap compact text-gray-900">
                                <div>Pick: {new Date(load.pickupTime).toLocaleDateString()}</div>
                                <div>Del: {new Date(load.deliveryTime).toLocaleDateString()}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 ultra-compact font-semibold rounded-full ${getPriorityColor(load.priority)}`}>
                                  {load.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 ultra-compact font-semibold rounded-full ${getStatusColor(load.status)}`}>
                                  {load.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap compact font-medium">
                                <div className="flex space-x-1">
                                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-blue-600 transform hover:scale-105 duration-200">
                                    📍
                                  </button>
                                  <button 
                                    onClick={() => handleGenerateDocuments(load)}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-green-600 transform hover:scale-105 duration-200"
                                  >
                                    📄
                                  </button>
                                  <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-orange-600 transform hover:scale-105 duration-200">
                                    ✏️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Status Tab */}
            {selectedTab === 'drivers' && (
              <div className="card-2d">
                <div className="px-4 py-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Real-time Driver Status</h3>
                    <div className="flex items-center space-x-4 compact">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                        <span className="text-gray-600">On Duty</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                        <span className="text-gray-600">Off Duty</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="table-2d">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Driver</th>
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Vehicle</th>
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Status</th>
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Location</th>
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">HOS Remaining</th>
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Last Update</th>
                            <th className="px-4 py-3 text-left compact font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {drivers.map((driver) => (
                            <tr key={driver.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    {driver.name.charAt(0)}
                                  </div>
                                  <div className="font-medium text-gray-900">{driver.name}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">🚛</span>
                                  <span className="font-medium text-gray-900">{driver.vehicle}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full shadow-lg ${
                                    driver.status === 'Available' ? 'bg-green-500 shadow-green-200' :
                                    driver.status === 'On Route' || driver.status === 'Loading' || driver.status === 'Unloading' ? 'bg-yellow-500 shadow-yellow-200' :
                                    'bg-red-500 shadow-red-200'
                                  }`}></div>
                                  <span className={`inline-flex px-2 py-1 compact font-bold rounded-xl shadow-md ${
                                    driver.status === 'Available' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' :
                                    driver.status === 'On Route' || driver.status === 'Loading' || driver.status === 'Unloading' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300' :
                                    'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                                  }`}>
                                    {driver.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">📍</span>
                                  <span className="text-gray-900">{driver.location}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">⏱️</span>
                                  <span className="font-medium text-gray-900">{driver.hoursOfService}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap compact text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm">🕒</span>
                                  <span>{driver.lastUpdate}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex space-x-1">
                                  <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-cyan-600 transform hover:scale-105 duration-200">
                                    📞
                                  </button>
                                  <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-emerald-600 transform hover:scale-105 duration-200">
                                    📦
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dispatch Board Tab */}
            {selectedTab === 'dispatch' && (
              <div className="space-y-4">
                {/* Fleet Map */}
                <div className="card-2d">
                  <div className="px-4 py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Fleet Map Overview</h3>
                    <FleetMap />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Available Loads */}
                  <div className="card-2d">
                    <div className="px-4 py-6">
                      <h4 className="font-medium text-gray-900 mb-3">📋 Available Loads</h4>
                      <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="font-medium text-blue-900">LOAD-001234</div>
                          <div className="compact text-blue-700">Atlanta → Miami</div>
                          <div className="ultra-compact text-green-600 font-medium">$2,450</div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="font-medium text-blue-900">LOAD-001235</div>
                          <div className="compact text-blue-700">Chicago → Houston</div>
                          <div className="ultra-compact text-green-600 font-medium">$3,200</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Available Drivers */}
                  <div className="card-2d">
                    <div className="px-4 py-6">
                      <h4 className="font-medium text-gray-900 mb-3">👥 Available Drivers</h4>
                      <div className="space-y-2">
                        {drivers.filter(d => d.status === 'Available').map((driver) => (
                          <div key={driver.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{driver.name}</div>
                              <div className="compact text-gray-500">{driver.vehicle} • {driver.location}</div>
                            </div>
                            <div className="ultra-compact text-green-600 font-medium">
                              {driver.hoursOfService}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card-2d">
                  <div className="px-4 py-6">
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg compact font-medium transition-colors shadow-sm hover:shadow-md">
                        ⚡ Auto-Assign Routes
                      </button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 px-4 py-2 rounded-lg compact font-medium transition-all shadow-sm hover:shadow-md border border-red-300 hover:border-red-400">
                        🚨 Emergency Dispatch
                      </button>
                      <button className="bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 px-4 py-2 rounded-lg compact font-medium transition-all shadow-sm hover:shadow-md border border-green-300 hover:border-green-400">
                        🗺️ Route Optimization
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dispatch Notes */}
            <div className="card-2d">
              <div className="px-4 py-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📝 Dispatch Notes</h3>
                <StickyNote 
                  section="dispatch" 
                  entityId="dispatch-central" 
                  entityName="Dispatch Central"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
