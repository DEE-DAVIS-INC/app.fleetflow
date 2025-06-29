'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RecentActivity from '../components/RecentActivity';
import LoadUpload from '../components/LoadUpload';
import StickyNote from '../components/StickyNote';
import SAFERLookup from '../components/SAFERLookup';
import RateConfirmation from '../components/RateConfirmation';
import BillOfLading from '../components/BillOfLading';
import { useLoad, LoadData } from '../contexts/LoadContext';

interface BrokerAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  isActive: boolean;
  certifications?: string[];
  performanceRating: number;
  licenseNumber?: string;
  mcNumber?: string;
  dotNumber?: string;
  specialties?: string[];
}

interface LoadBoard {
  id: string;
  origin: string;
  destination: string;
  rate: string;
  distance: string;
  weight: string;
  equipment: string;
  pickupDate: string;
  deliveryDate: string;
  broker: string;
  status: 'Available' | 'Pending' | 'Booked';
  brokerAgent?: BrokerAgent;
  freightClass?: string;
  commodity?: string;
  pieces?: string;
}

interface Bid {
  id: string;
  loadId: string;
  amount: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  submittedAt: string;
}

export default function BrokerBoxPage() {
  const [selectedTab, setSelectedTab] = useState<'loads' | 'bids' | 'contracts' | 'agents' | 'documents'>('loads');
  const [activeDocument, setActiveDocument] = useState<'rate-confirmation' | 'bill-of-lading'>('rate-confirmation');
  const [selectedLoadForDocs, setSelectedLoadForDocs] = useState<LoadBoard | null>(null);
  const [showBrokerAgentModal, setShowBrokerAgentModal] = useState(false);
  const [showBrokerAssignmentModal, setShowBrokerAssignmentModal] = useState(false);
  const [assignmentLoadId, setAssignmentLoadId] = useState<string | null>(null);
  const [tempSelectedBrokerAgent, setTempSelectedBrokerAgent] = useState<string>('');
  const [newBrokerAgentForm, setNewBrokerAgentForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    licenseNumber: '',
    mcNumber: '',
    dotNumber: '',
    certifications: [] as string[],
    specialties: [] as string[]
  });
  
  // Add state for info modals
  const [showLoadInfoModal, setShowLoadInfoModal] = useState(false);
  const [showBrokerInfoModal, setShowBrokerInfoModal] = useState(false);
  const [selectedLoadInfo, setSelectedLoadInfo] = useState<LoadBoard | null>(null);
  const [selectedBrokerInfo, setSelectedBrokerInfo] = useState<BrokerAgent | null>(null);

  const router = useRouter();
  const { setSelectedLoad, addToHistory, selectedLoad, loadHistory } = useLoad();
  
  // Convert broker load to shared LoadData format
  const convertToLoadData = (brokerLoad: LoadBoard): LoadData => {
    return {
      id: brokerLoad.id,
      origin: brokerLoad.origin,
      destination: brokerLoad.destination,
      pickupDate: brokerLoad.pickupDate,
      deliveryDate: brokerLoad.deliveryDate,
      weight: brokerLoad.weight,
      equipment: brokerLoad.equipment,
      rate: brokerLoad.rate,
      broker: brokerLoad.broker,
      status: brokerLoad.status,
      distance: brokerLoad.distance,
      freightClass: brokerLoad.freightClass,
      commodity: brokerLoad.commodity,
      pieces: brokerLoad.pieces,
      brokerAgentName: brokerLoad.brokerAgent?.name,
      brokerAgentEmail: brokerLoad.brokerAgent?.email,
      brokerAgentPhone: brokerLoad.brokerAgent?.phone,
      brokerAgentCompany: brokerLoad.brokerAgent?.company,
      brokerAgentLicense: brokerLoad.brokerAgent?.licenseNumber,
      brokerAgentMC: brokerLoad.brokerAgent?.mcNumber,
      brokerAgentDOT: brokerLoad.brokerAgent?.dotNumber
    };
  };

  const handleGenerateDocuments = (load: LoadBoard) => {
    const loadData = convertToLoadData(load);
    setSelectedLoad(loadData);
    addToHistory(loadData);
    setSelectedLoadForDocs(load);
    setSelectedTab('documents');
  };

  // Sample Broker Agents
  const [brokerAgents, setBrokerAgents] = useState<BrokerAgent[]>([
    {
      id: 'BR001',
      name: 'Alex Morrison',
      email: 'alex@loadlinkpro.com',
      phone: '(555) 234-5679',
      company: 'LoadLink Pro Brokerage',
      isActive: true,
      certifications: ['Transportation Intermediaries License', 'Freight Broker Bond'],
      performanceRating: 4.7,
      licenseNumber: 'TIL-12345',
      mcNumber: 'MC-234567',
      dotNumber: 'DOT-1234567',
      specialties: ['LTL Brokerage', 'Contract Loads', 'Rate Negotiations']
    },
    {
      id: 'BR002',
      name: 'Jessica Parker',
      email: 'jessica@freightmatch.com',
      phone: '(555) 345-6790',
      company: 'FreightMatch Solutions',
      isActive: true,
      certifications: ['Transportation Intermediaries License', 'Load Board Certified'],
      performanceRating: 4.9,
      licenseNumber: 'TIL-12346',
      mcNumber: 'MC-345678',
      dotNumber: 'DOT-2345678',
      specialties: ['Spot Market', 'Dedicated Lanes', 'Cross-docking']
    },
    {
      id: 'BR003',
      name: 'Michael Torres',
      email: 'michael@nationalloadex.com',
      phone: '(555) 456-7891',
      company: 'National Load Exchange',
      isActive: true,
      certifications: ['Transportation Intermediaries License', 'Contract Negotiation'],
      performanceRating: 4.6,
      licenseNumber: 'TIL-23456',
      mcNumber: 'MC-456789',
      dotNumber: 'DOT-3456789',
      specialties: ['Heavy Haul Brokerage', 'Specialized Equipment', 'Permit Loads']
    },
    {
      id: 'BR004',
      name: 'Sarah Williams',
      email: 'sarah@logistics.com',
      phone: '(555) 567-8901',
      company: 'Williams Logistics',
      isActive: true,
      certifications: ['Transportation Intermediaries License', 'Spot Market Specialist'],
      performanceRating: 4.8,
      licenseNumber: 'TIL-23457',
      mcNumber: 'MC-567890',
      dotNumber: 'DOT-4567890',
      specialties: ['Refrigerated Transport', 'Temperature Controlled']
    },
    {
      id: 'BR005',
      name: 'David Chen',
      email: 'david@fastfreight.com',
      phone: '(555) 678-9012',
      company: 'Fast Freight Solutions',
      isActive: true,
      certifications: ['Transportation Intermediaries License', 'Heavy Haul Specialist', 'Permit Coordination'],
      performanceRating: 4.9,
      licenseNumber: 'TIL-34567',
      mcNumber: 'MC-678901',
      dotNumber: 'DOT-5678901',
      specialties: ['Expedited Shipping', 'Time-Critical Loads']
    }
  ]);

  // Mock data
  const [loads, setLoads] = useState<LoadBoard[]>([
    {
      id: 'L001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: '$2,450',
      distance: '647 mi',
      weight: '45,000 lbs',
      equipment: 'Dry Van',
      pickupDate: '2024-12-20',
      deliveryDate: '2024-12-21',
      broker: 'FreightCorp',
      status: 'Available',
      brokerAgent: brokerAgents[0],
      freightClass: '85',
      commodity: 'Electronics',
      pieces: '18 pallets'
    },
    {
      id: 'L002',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      rate: '$3,200',
      distance: '925 mi',
      weight: '38,500 lbs',
      equipment: 'Reefer',
      pickupDate: '2024-12-21',
      deliveryDate: '2024-12-23',
      broker: 'LogiTrans',
      status: 'Available',
      brokerAgent: brokerAgents[1],
      freightClass: '65',
      commodity: 'Food Products',
      pieces: '22 pallets'
    },
    {
      id: 'L003',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      rate: '$1,850',
      distance: '372 mi',
      weight: '42,000 lbs',
      equipment: 'Flatbed',
      pickupDate: '2024-12-22',
      deliveryDate: '2024-12-22',
      broker: 'WestCoast Freight',
      status: 'Pending',
      brokerAgent: brokerAgents[2],
      freightClass: '60',
      commodity: 'Steel Bars',
      pieces: '8 bundles'
    }
  ]);

  const bids: Bid[] = [
    {
      id: 'B001',
      loadId: 'L001',
      amount: '$2,400',
      status: 'Pending',
      submittedAt: '2024-12-19 14:30'
    },
    {
      id: 'B002',
      loadId: 'L004',
      amount: '$2,800',
      status: 'Accepted',
      submittedAt: '2024-12-18 09:15'
    },
    {
      id: 'B003',
      loadId: 'L005',
      amount: '$1,950',
      status: 'Rejected',
      submittedAt: '2024-12-17 16:45'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Booked':
        return 'text-blue-600 bg-blue-100';
      case 'Accepted':
        return 'text-green-600 bg-green-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Handler functions for the info buttons
  const handleShowLoadInfo = (load: LoadBoard) => {
    setSelectedLoadInfo(load);
    setShowLoadInfoModal(true);
  };

  const handleShowBrokerInfo = (load: LoadBoard) => {
    setSelectedBrokerInfo(load.brokerAgent || null);
    setShowBrokerInfoModal(true);
  };

  const handlePlaceBid = (load: LoadBoard) => {
    alert(`Placing bid for load ${load.id}`);
  };

  const handleContact = (load: LoadBoard) => {
    alert(`Contacting broker for load ${load.id}`);
  };

  return (
    <div className="min-h-screen bg-light-blue-theme">
      <div className="container mx-auto px-3 py-4">
        <div className="space-y-4">
          <div className="card-2d bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-4 rounded-xl shadow-xl">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🏢</span>
              <div>
                <h1 className="text-xl font-bold drop-shadow-lg">Broker Command Center</h1>
                <p className="text-emerald-100 nano-text drop-shadow-md">
                  Complete freight management hub - Load boards, bidding, document generation, and carrier verification
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card-2d bg-gradient-to-r from-white to-sky-50 border border-sky-200">
            <nav className="flex space-x-2 p-3">
              {[
                { id: 'loads', label: 'Load Board', count: loads.length, icon: '📦', color: 'blue' },
                { id: 'bids', label: 'My Bids', count: bids.length, icon: '💰', color: 'green' },
                { id: 'contracts', label: 'Contracts', count: 5, icon: '📋', color: 'purple' },
                { id: 'agents', label: 'Broker Agents', count: brokerAgents.length, icon: '👤', color: 'indigo' },
                { id: 'documents', label: 'Documents', count: loadHistory.length, icon: '📄', color: 'orange' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`py-2 px-3 rounded-t-lg font-medium ultra-compact transition-all duration-200 border-b-2 ${
                    selectedTab === tab.id
                      ? tab.color === 'blue' ? 'bg-blue-500 text-white border-blue-500 shadow-lg' :
                        tab.color === 'green' ? 'bg-green-500 text-white border-green-500 shadow-lg' :
                        tab.color === 'purple' ? 'bg-purple-500 text-white border-purple-500 shadow-lg' :
                        tab.color === 'indigo' ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' :
                        'bg-orange-500 text-white border-orange-500 shadow-lg'
                      : `border-transparent text-gray-600 hover:text-gray-800 ${
                        tab.color === 'blue' ? 'hover:bg-blue-100 hover:border-blue-300' :
                        tab.color === 'green' ? 'hover:bg-green-100 hover:border-green-300' :
                        tab.color === 'purple' ? 'hover:bg-purple-100 hover:border-purple-300' :
                        tab.color === 'indigo' ? 'hover:bg-indigo-100 hover:border-indigo-300' :
                        'hover:bg-orange-100 hover:border-orange-300'
                      }`
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="micro-text">{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`nano-button ${
                      selectedTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Load Board Tab */}
          {selectedTab === 'loads' && (
            <div className="load-card-compact bg-gradient-to-r from-white to-sky-50 border border-sky-200">
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="tiny-header text-gray-900">📦 Available Loads</h3>
                  <div className="flex space-x-1">
                    <button className="mini-button bg-blue-600 text-white hover:bg-blue-700">
                      🔍 Filter
                    </button>
                    <button className="mini-button bg-gray-100 text-gray-700 hover:bg-gray-200">
                      🔄 Refresh
                    </button>
                  </div>
                </div>
                
                {/* Compact Load Cards */}
                <div className="space-y-2">
                  {loads.map((load) => (
                    <div key={load.id} className="load-card-compact bg-gradient-to-r from-white to-sky-50 border border-sky-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {/* Load ID */}
                          <div className="flex items-center space-x-1">
                            <span className="nano-text">📋</span>
                            <span className="tiny-header text-blue-700">{load.id}</span>
                          </div>
                          
                          {/* Route */}
                          <div className="flex items-center space-x-1">
                            <span className="nano-text">🗺️</span>
                            <span className="ultra-compact text-gray-700">
                              {load.origin} → {load.destination}
                            </span>
                            <span className="micro-text text-gray-500">({load.distance})</span>
                          </div>
                          
                          {/* Equipment & Weight */}
                          <div className="flex items-center space-x-1">
                            <span className="nano-text">🚚</span>
                            <span className="ultra-compact text-gray-600">{load.equipment}</span>
                            <span className="micro-text text-gray-500">{load.weight}</span>
                          </div>
                          
                          {/* Rate */}
                          <div className="flex items-center space-x-1">
                            <span className="nano-text">💰</span>
                            <span className="tiny-header text-green-700">{load.rate}</span>
                          </div>
                          
                          {/* Dates */}
                          <div className="flex items-center space-x-1">
                            <span className="nano-text">📅</span>
                            <span className="ultra-compact text-gray-600">
                              {new Date(load.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          
                          {/* Status */}
                          <span className={`micro-button ${
                            load.status === 'Available' ? 'bg-green-100 text-green-800 border border-green-300' :
                            load.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                            'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {load.status}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1">
                          <button 
                            className="icon-only-btn bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300"
                            title="Load Information"
                            onClick={() => handleShowLoadInfo(load)}
                          >
                            ℹ️
                          </button>
                          <button 
                            className="icon-only-btn bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
                            title="Broker Agent Info"
                            onClick={() => handleShowBrokerInfo(load)}
                          >
                            👤
                          </button>
                          <button 
                            className="icon-only-btn bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300"
                            title="Place Bid"
                            onClick={() => handlePlaceBid(load)}
                          >
                            💰
                          </button>
                          <button 
                            className="icon-only-btn bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300"
                            title="Contact"
                            onClick={() => handleContact(load)}
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

          {/* Load Info Modal */}
          {showLoadInfoModal && selectedLoadInfo && (
            <div className="info-modal" onClick={() => setShowLoadInfoModal(false)}>
              <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="tiny-header text-gray-900">📦 Load Details</h3>
                  <button 
                    className="icon-only-btn bg-gray-100 text-gray-600 hover:bg-gray-200"
                    onClick={() => setShowLoadInfoModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Load ID:</span>
                    <span className="ultra-compact font-semibold">{selectedLoadInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Origin:</span>
                    <span className="ultra-compact">{selectedLoadInfo.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Destination:</span>
                    <span className="ultra-compact">{selectedLoadInfo.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Equipment:</span>
                    <span className="ultra-compact">{selectedLoadInfo.equipment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Weight:</span>
                    <span className="ultra-compact">{selectedLoadInfo.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Commodity:</span>
                    <span className="ultra-compact">{selectedLoadInfo.commodity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Pieces:</span>
                    <span className="ultra-compact">{selectedLoadInfo.pieces}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Freight Class:</span>
                    <span className="ultra-compact">{selectedLoadInfo.freightClass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Rate:</span>
                    <span className="ultra-compact font-semibold text-green-700">{selectedLoadInfo.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Distance:</span>
                    <span className="ultra-compact">{selectedLoadInfo.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Pickup Date:</span>
                    <span className="ultra-compact">{selectedLoadInfo.pickupDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Delivery Date:</span>
                    <span className="ultra-compact">{selectedLoadInfo.deliveryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Broker Info Modal */}
          {showBrokerInfoModal && selectedBrokerInfo && (
            <div className="info-modal" onClick={() => setShowBrokerInfoModal(false)}>
              <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="tiny-header text-gray-900">👤 Broker Agent</h3>
                  <button 
                    className="icon-only-btn bg-gray-100 text-gray-600 hover:bg-gray-200"
                    onClick={() => setShowBrokerInfoModal(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Name:</span>
                    <span className="ultra-compact font-semibold">{selectedBrokerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Company:</span>
                    <span className="ultra-compact">{selectedBrokerInfo.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Email:</span>
                    <span className="ultra-compact">{selectedBrokerInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Phone:</span>
                    <span className="ultra-compact">{selectedBrokerInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">License:</span>
                    <span className="ultra-compact">{selectedBrokerInfo.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">MC Number:</span>
                    <span className="ultra-compact">{selectedBrokerInfo.mcNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">DOT Number:</span>
                    <span className="ultra-compact">{selectedBrokerInfo.dotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="ultra-compact text-gray-600">Rating:</span>
                    <span className="ultra-compact">⭐ {selectedBrokerInfo.performanceRating}/5</span>
                  </div>
                  <div>
                    <span className="ultra-compact text-gray-600">Specialties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedBrokerInfo.specialties?.map((specialty, idx) => (
                        <span key={idx} className="micro-button bg-blue-100 text-blue-700">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rest of tabs content... */}
          {selectedTab === 'bids' && (
            <div className="card-2d bg-white">
              <div className="p-4">
                <h3 className="tiny-header text-gray-900 mb-4">💰 My Submitted Bids</h3>
                <div className="space-y-2">
                  {bids.map((bid) => (
                    <div key={bid.id} className="load-card-compact bg-gradient-to-r from-white to-green-50 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="tiny-header text-blue-700">{bid.id}</span>
                          <span className="ultra-compact text-gray-600">Load: {bid.loadId}</span>
                          <span className="tiny-header text-green-700">{bid.amount}</span>
                          <span className={`micro-button ${getStatusColor(bid.status)}`}>
                            {bid.status}
                          </span>
                        </div>
                        <span className="ultra-compact text-gray-500">{bid.submittedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs continue with similar compact styling... */}
          {selectedTab === 'contracts' && (
            <div className="card-2d bg-white p-4">
              <h3 className="tiny-header text-gray-900 mb-4">📋 Active Contracts</h3>
              <div className="text-center py-8">
                <div className="text-gray-400 ultra-compact">
                  📄 No active contracts found
                </div>
                <p className="text-gray-500 micro-text mt-2">
                  Accepted bids and signed contracts will appear here
                </p>
              </div>
            </div>
          )}

          {selectedTab === 'agents' && (
            <div className="card-2d bg-white p-4">
              <h3 className="tiny-header text-gray-900 mb-4">👤 Broker Agents</h3>
              <div className="space-y-2">
                {brokerAgents.map((agent) => (
                  <div key={agent.id} className="load-card-compact bg-gradient-to-r from-white to-indigo-50 border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="tiny-header text-indigo-700">{agent.name}</span>
                        <span className="ultra-compact text-gray-600">{agent.company}</span>
                        <span className="ultra-compact text-gray-500">⭐ {agent.performanceRating}</span>
                        <span className={`micro-button ${agent.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {agent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="ultra-compact text-gray-500">{agent.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'documents' && (
            <div className="card-2d bg-white p-4">
              <h3 className="tiny-header text-gray-900 mb-4">📄 Document Generation</h3>
              <div className="space-y-2">
                {loadHistory.map((load, idx) => (
                  <div key={idx} className="load-card-compact bg-gradient-to-r from-white to-orange-50 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="tiny-header text-orange-700">{load.id}</span>
                        <span className="ultra-compact text-gray-600">{load.origin} → {load.destination}</span>
                        <span className="tiny-header text-green-700">{load.rate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="mini-button bg-orange-600 text-white hover:bg-orange-700">
                          📋 Generate Docs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
