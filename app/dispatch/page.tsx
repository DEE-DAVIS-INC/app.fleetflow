'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FleetMap from '../components/FleetMap';
import GoogleMaps from '../components/GoogleMaps';
import StickyNote from '../components/StickyNote';
import DispatchInvoice from '../components/DispatchInvoice';
import SMSModal from '../components/SMSModal';
import Navigation from '../components/Navigation';
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

interface DispatchInvoiceData {
  id: string;
  loadId: string;
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight: string;
    miles: number;
  };
  paymentTerms: string;
  notes?: string;
}

export default function DispatchCentralPage() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'drivers' | 'dispatch' | 'invoices' | 'monitor'>('active');
  const router = useRouter();
  const { setSelectedLoad, addToHistory } = useLoad();
  const [selectedInvoice, setSelectedInvoice] = useState<DispatchInvoiceData | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [smsModalTitle, setSMSModalTitle] = useState('');
  const [smsModalMessage, setSMSModalMessage] = useState('');

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

  // Sample Invoice Data
  const [invoices] = useState<DispatchInvoiceData[]>([
    {
      id: 'INV-001',
      loadId: 'DL001',
      carrierName: 'Smith Trucking LLC',
      carrierAddress: '123 Transport St.\nAtlanta, GA 30309',
      carrierEmail: 'billing@smithtrucking.com',
      carrierPhone: '(555) 234-5678',
      loadAmount: 2450,
      dispatchFee: 245,
      feePercentage: 10,
      invoiceDate: '2024-12-19',
      dueDate: '2025-01-18',
      status: 'Sent',
      loadDetails: {
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        pickupDate: '2024-12-19',
        deliveryDate: '2024-12-20',
        equipment: 'Dry Van',
        weight: '45,000 lbs',
        miles: 647
      },
      paymentTerms: 'Net 30 days',
      notes: 'Priority delivery - holiday rush'
    },
    {
      id: 'INV-002',
      loadId: 'DL003',
      carrierName: 'Wilson Transport',
      carrierAddress: '456 Freight Ave.\nLos Angeles, CA 90210',
      carrierEmail: 'finance@wilsontransport.com',
      carrierPhone: '(555) 987-6543',
      loadAmount: 1850,
      dispatchFee: 185,
      feePercentage: 10,
      invoiceDate: '2024-12-19',
      dueDate: '2025-01-18',
      status: 'Paid',
      loadDetails: {
        origin: 'Los Angeles, CA',
        destination: 'Phoenix, AZ',
        pickupDate: '2024-12-19',
        deliveryDate: '2024-12-19',
        equipment: 'Flatbed',
        weight: '38,500 lbs',
        miles: 372
      },
      paymentTerms: 'Net 30 days'
    }
  ]);

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

  // SMS Modal functions
  const openSMSModal = (type: 'load_assigned' | 'load_update' | 'emergency', loadData?: DispatchLoad) => {
    let title = '';
    let message = '';
    
    switch (type) {
      case 'load_assigned':
        title = 'Send Load Assignment SMS';
        message = loadData 
          ? `Load ${loadData.id} assigned: ${loadData.origin} → ${loadData.destination}. Pickup: ${loadData.pickupTime}. Rate: $${loadData.loadAmount?.toLocaleString()}`
          : 'Your load has been assigned. Please check FleetFlow for details.';
        break;
      case 'load_update':
        title = 'Send Load Update SMS';
        message = 'Load status updated. Please check FleetFlow for current information.';
        break;
      case 'emergency':
        title = 'Send Emergency Alert SMS';
        message = 'URGENT: Please contact dispatch immediately regarding your current load.';
        break;
    }
    
    setSMSModalTitle(title);
    setSMSModalMessage(message);
    setShowSMSModal(true);
  };

  const sendSMS = async (phone: string, message: string) => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'custom',
          recipients: [{
            id: 'temp-id',
            phone: phone,
            name: 'Recipient',
            type: 'driver'
          }],
          customMessage: message
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('SMS sent successfully!');
      } else {
        alert('Failed to send SMS: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      alert('Error sending SMS');
    }
  };

  return (
    <ProtectedRoute requiredPermission="dispatch_access">
      <div style={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
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
        
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4" style={{ marginTop: '-20px', paddingTop: '20px' }}>
          <div className="space-y-4">
            {/* Header */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '20px',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '20px'
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>🚛 Dispatch Central</h1>
              <p style={{
                fontSize: '1.1rem',
                margin: '0 0 20px 0',
                opacity: 0.9
              }}>Real-time fleet coordination and load management</p>
              
              {/* Action Buttons */}
              <div className="flex space-x-3 mt-4">
                <button 
                  onClick={() => router.push('/dispatch-board')}
                  style={{
                    background: 'rgba(33, 150, 243, 0.8)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📋 Load Board
                </button>
                <button 
                  onClick={() => setShowSMSModal(true)}
                  style={{
                    background: 'rgba(76, 175, 80, 0.8)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📱 Send SMS
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Loads</dt>
                    <dd className="text-lg font-bold text-gray-900">{activeLoads.length}</dd>
                  </div>
                </div>
              </div>

              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Available Drivers</dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {drivers.filter(d => d.status === 'Available').length}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">In Transit</dt>
                    <dd className="text-lg font-bold text-gray-900">
                      {activeLoads.filter(l => l.status === 'In Transit').length}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="stat-card-2d">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Alerts</dt>
                    <dd className="text-lg font-bold text-gray-900">
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
                  { id: 'dispatch', label: 'Dispatch Board', count: 0, icon: '📋', color: 'purple' },
                  { id: 'invoices', label: 'Dispatch Invoices', count: invoices.length, icon: '📄', color: 'orange' },
                  { id: 'monitor', label: 'Live Monitor', count: 0, icon: '📺', color: 'indigo' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold compact transition-all duration-300 border-2 ${
                      selectedTab === tab.id
                        ? tab.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg transform scale-105' :
                          tab.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg transform scale-105' :
                          tab.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg transform scale-105' :
                          tab.color === 'orange' ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600 shadow-lg transform scale-105' :
                          'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform scale-105'
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
                                  <button 
                                    onClick={() => openSMSModal('load_assigned', load)}
                                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-purple-600 transform hover:scale-105 duration-200"
                                    title="Send SMS Notification"
                                  >
                                    📱
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
                    <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Dispatch Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg compact font-medium transition-colors shadow-sm hover:shadow-md flex items-center justify-center space-x-2">
                        <span>⚡</span>
                        <span>Auto-Assign Routes</span>
                      </button>
                      <button 
                        onClick={() => openSMSModal('emergency')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg compact font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>🚨</span>
                        <span>Emergency Alert</span>
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg compact font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2">
                        <span>🗺️</span>
                        <span>Route Optimization</span>
                      </button>
                      <button 
                        onClick={() => openSMSModal('load_update')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg compact font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
                      >
                        <span>�</span>
                        <span>Send SMS Update</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dispatch Invoices Tab */}
            {selectedTab === 'invoices' && (
              <div className="space-y-6">
                <div className="card-2d">
                  <div className="px-4 py-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Dispatch Invoices</h3>
                      <div className="flex space-x-2">
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-blue-600">
                          ➕ Generate Invoice
                        </button>
                        <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl compact font-semibold transition-all shadow-md hover:shadow-lg border border-gray-300 hover:border-gray-400">
                          📊 Export All
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-4">
                                <h4 className="font-bold text-gray-900">{invoice.id}</h4>
                                <span className="text-gray-600">Load: {invoice.loadId}</span>
                                <span className={`inline-flex px-2 py-1 ultra-compact font-semibold rounded-full ${
                                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                  invoice.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                                  invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {invoice.status}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => setSelectedInvoice(invoice)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded compact font-medium transition-colors"
                                >
                                  👁️ Preview
                                </button>
                                <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded compact font-medium transition-colors">
                                  📧 Send
                                </button>
                                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded compact font-medium transition-colors">
                                  💾 Download
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h5 className="font-semibold text-gray-700 mb-2">Carrier Information</h5>
                                <div className="space-y-1 compact">
                                  <div className="font-medium">{invoice.carrierName}</div>
                                  {invoice.carrierAddress && (
                                    <div className="text-gray-600 whitespace-pre-line">{invoice.carrierAddress}</div>
                                  )}
                                  {invoice.carrierEmail && (
                                    <div className="text-blue-600">{invoice.carrierEmail}</div>
                                  )}
                                  {invoice.carrierPhone && (
                                    <div className="text-gray-600">{invoice.carrierPhone}</div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-700 mb-2">Load Details</h5>
                                <div className="space-y-1 compact">
                                  {invoice.loadDetails && (
                                    <>
                                      <div><span className="text-gray-500">Route:</span> {invoice.loadDetails.origin} → {invoice.loadDetails.destination}</div>
                                      <div><span className="text-gray-500">Pickup:</span> {invoice.loadDetails.pickupDate}</div>
                                      <div><span className="text-gray-500">Delivery:</span> {invoice.loadDetails.deliveryDate}</div>
                                      <div><span className="text-gray-500">Equipment:</span> {invoice.loadDetails.equipment}</div>
                                      <div><span className="text-gray-500">Weight:</span> {invoice.loadDetails.weight}</div>
                                      <div><span className="text-gray-500">Miles:</span> {invoice.loadDetails.miles}</div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-700 mb-2">Financial Details</h5>
                                <div className="space-y-1 compact">
                                  <div className="flex justify-between">
                                    <span>Load Amount:</span>
                                    <span className="font-semibold">${invoice.loadAmount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Dispatch Fee ({invoice.feePercentage}%):</span>
                                    <span className="font-semibold text-green-600">${invoice.dispatchFee.toLocaleString()}</span>
                                  </div>
                                  <div className="border-t pt-1 mt-1">
                                    <div className="flex justify-between font-bold">
                                      <span>Invoice Date:</span>
                                      <span>{invoice.invoiceDate}</span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                      <span>Due Date:</span>
                                      <span>{invoice.dueDate}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {invoice.notes && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <div className="font-semibold text-yellow-800 compact">Notes:</div>
                                <div className="text-yellow-700 compact">{invoice.notes}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invoice Preview Modal */}
                {selectedInvoice && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold">Invoice Preview - {selectedInvoice.id}</h3>
                          <button 
                            onClick={() => setSelectedInvoice(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                          >
                            ✕ Close
                          </button>
                        </div>
                        <DispatchInvoice invoice={selectedInvoice} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Live Monitor Tab */}
            {selectedTab === 'monitor' && (
              <div className="card-2d">
                <div className="px-4 py-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">📺 Live Dispatch Monitor</h3>
                    <div className="flex space-x-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Live Feed
                      </span>
                    </div>
                  </div>
                  
                  {/* Live Stats Display */}
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">4</div>
                        <div className="text-sm text-gray-600">Active Cameras</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">12</div>
                        <div className="text-sm text-gray-600">Vehicles Online</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">8</div>
                        <div className="text-sm text-gray-600">Active Routes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">24/7</div>
                        <div className="text-sm text-gray-600">Monitoring</div>
                      </div>
                    </div>
                  </div>

                  {/* Video Info Panel */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center mb-2">
                        <span className="text-blue-600 text-lg mr-2">📊</span>
                        <h4 className="font-semibold text-blue-900">Performance Metrics</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Active Streams:</span>
                          <span className="font-medium text-blue-900">4</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Resolution:</span>
                          <span className="font-medium text-blue-900">1080p</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Bitrate:</span>
                          <span className="font-medium text-blue-900">2.5 Mbps</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center mb-2">
                        <span className="text-green-600 text-lg mr-2">🎯</span>
                        <h4 className="font-semibold text-green-900">Live Status</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Connection:</span>
                          <span className="font-medium text-green-900">Stable</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Uptime:</span>
                          <span className="font-medium text-green-900">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Latency:</span>
                          <span className="font-medium text-green-900">&lt; 100ms</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center mb-2">
                        <span className="text-purple-600 text-lg mr-2">🎬</span>
                        <h4 className="font-semibold text-purple-900">Video Controls</h4>
                      </div>
                      <div className="space-y-2">
                        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          📹 Switch Camera
                        </button>
                        <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                          📱 Mobile View
                        </button>
                      </div>
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

      {/* SMS Modal */}
      <SMSModal
        isOpen={showSMSModal}
        onClose={() => setShowSMSModal(false)}
        onSend={sendSMS}
        title={smsModalTitle}
        defaultMessage={smsModalMessage}
      />
    </ProtectedRoute>
  );
}
