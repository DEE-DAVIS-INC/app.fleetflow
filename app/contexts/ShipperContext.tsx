'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Shipper, LoadRequest, BrokerAgent } from '../types/shipper';

interface ShipperContextType {
  shippers: Shipper[];
  setShippers: React.Dispatch<React.SetStateAction<Shipper[]>>;
  selectedShipper: Shipper | null;
  setSelectedShipper: React.Dispatch<React.SetStateAction<Shipper | null>>;
  loadRequests: LoadRequest[];
  setLoadRequests: React.Dispatch<React.SetStateAction<LoadRequest[]>>;
  brokerAgents: BrokerAgent[];
  setBrokerAgents: React.Dispatch<React.SetStateAction<BrokerAgent[]>>;
}

const ShipperContext = createContext<ShipperContextType | undefined>(undefined);

// Mock data
const mockBrokerAgents: BrokerAgent[] = [
  {
    id: 'broker-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@fleetflow.com',
    phone: '(555) 123-4567',
    hireDate: '2023-01-15',
    status: 'active',
    shippers: ['shipper-001', 'shipper-002'],
    totalRevenue: 2500000,
    activeLoads: 12
  },
  {
    id: 'broker-002',
    name: 'Mike Chen',
    email: 'mike.c@fleetflow.com',
    phone: '(555) 234-5678',
    hireDate: '2023-03-20',
    status: 'active',
    shippers: ['shipper-003'],
    totalRevenue: 1800000,
    activeLoads: 8
  }
];

const mockShippers: Shipper[] = [
  {
    id: 'shipper-001',
    companyName: 'Global Manufacturing Corp',
    taxId: '12-3456789',
    contacts: [
      {
        id: 'contact-001',
        name: 'John Smith',
        email: 'john.smith@globalmanuf.com',
        phone: '(555) 987-6543',
        title: 'Logistics Manager',
        isPrimary: true
      }
    ],
    locations: [
      {
        id: 'loc-001',
        name: 'Main Warehouse',
        address: '123 Industrial Blvd',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        contactName: 'John Smith',
        contactPhone: '(555) 987-6543',
        operatingHours: 'Mon-Fri 8AM-5PM',
        specialInstructions: 'Dock 5 for LTL, Dock 10 for FTL'
      }
    ],
    commodities: [
      {
        name: 'Steel Components',
        freightClass: '125',
        description: 'Fabricated steel parts and components',
        hazmat: false,
        temperature: 'ambient'
      },
      {
        name: 'Machinery Parts',
        freightClass: '85',
        description: 'Heavy machinery components',
        hazmat: false,
        temperature: 'ambient'
      }
    ],
    paymentTerms: 'Net 30',
    creditLimit: 500000,
    creditRating: 'A',
    preferredLanes: ['Chicago-Atlanta', 'Chicago-Dallas', 'Chicago-Los Angeles'],
    loadRequests: [],
    assignedBrokerId: 'broker-001',
    assignedBrokerName: 'Sarah Johnson',
    status: 'active',
    joinDate: '2023-06-15',
    lastActivity: '2024-12-25',
    totalLoads: 145,
    totalRevenue: 2100000,
    averageRate: 14482,
    notes: 'Preferred customer - always pays on time'
  },
  {
    id: 'shipper-002',
    companyName: 'FreshProduce Distributors',
    taxId: '98-7654321',
    contacts: [
      {
        id: 'contact-002',
        name: 'Maria Rodriguez',
        email: 'maria.r@freshproduce.com',
        phone: '(555) 456-7890',
        title: 'Supply Chain Director',
        isPrimary: true
      }
    ],
    locations: [
      {
        id: 'loc-002',
        name: 'Cold Storage Facility',
        address: '456 Refrigeration Way',
        city: 'Fresno',
        state: 'CA',
        zip: '93701',
        contactName: 'Maria Rodriguez',
        contactPhone: '(555) 456-7890',
        operatingHours: '24/7',
        specialInstructions: 'Temperature monitoring required - maintain 34-38°F'
      }
    ],
    commodities: [
      {
        name: 'Fresh Vegetables',
        freightClass: '55',
        description: 'Fresh produce - vegetables',
        hazmat: false,
        temperature: 'refrigerated',
        specialHandling: ['temperature_controlled', 'time_sensitive']
      }
    ],
    paymentTerms: 'Net 15',
    creditLimit: 300000,
    creditRating: 'A',
    preferredLanes: ['Fresno-Phoenix', 'Fresno-Denver', 'Fresno-Seattle'],
    loadRequests: [],
    assignedBrokerId: 'broker-001',
    assignedBrokerName: 'Sarah Johnson',
    status: 'active',
    joinDate: '2023-08-20',
    lastActivity: '2024-12-24',
    totalLoads: 89,
    totalRevenue: 890000,
    averageRate: 10000,
    notes: 'Requires reefer equipment only'
  },
  {
    id: 'shipper-003',
    companyName: 'TechEquipment Solutions',
    taxId: '55-9876543',
    contacts: [
      {
        id: 'contact-003',
        name: 'David Kim',
        email: 'david.kim@techequip.com',
        phone: '(555) 321-0987',
        title: 'Operations Manager',
        isPrimary: true
      }
    ],
    locations: [
      {
        id: 'loc-003',
        name: 'Distribution Center',
        address: '789 Technology Drive',
        city: 'Austin',
        state: 'TX',
        zip: '73301',
        contactName: 'David Kim',
        contactPhone: '(555) 321-0987',
        operatingHours: 'Mon-Fri 7AM-6PM',
        specialInstructions: 'White glove service required for electronics'
      }
    ],
    commodities: [
      {
        name: 'Electronic Equipment',
        freightClass: '92.5',
        description: 'Computer and electronic equipment',
        hazmat: false,
        temperature: 'ambient',
        specialHandling: ['fragile', 'high_value']
      }
    ],
    paymentTerms: 'Net 30',
    creditLimit: 750000,
    creditRating: 'B',
    preferredLanes: ['Austin-Miami', 'Austin-New York', 'Austin-Los Angeles'],
    loadRequests: [],
    assignedBrokerId: 'broker-002',
    assignedBrokerName: 'Mike Chen',
    status: 'active',
    joinDate: '2023-11-10',
    lastActivity: '2024-12-23',
    totalLoads: 67,
    totalRevenue: 1340000,
    averageRate: 20000,
    notes: 'High-value loads require additional insurance'
  }
];

export function ShipperProvider({ children }: { children: ReactNode }) {
  const [shippers, setShippers] = useState<Shipper[]>(mockShippers);
  const [selectedShipper, setSelectedShipper] = useState<Shipper | null>(null);
  const [loadRequests, setLoadRequests] = useState<LoadRequest[]>([]);
  const [brokerAgents, setBrokerAgents] = useState<BrokerAgent[]>(mockBrokerAgents);

  return (
    <ShipperContext.Provider
      value={{
        shippers,
        setShippers,
        selectedShipper,
        setSelectedShipper,
        loadRequests,
        setLoadRequests,
        brokerAgents,
        setBrokerAgents,
      }}
    >
      {children}
    </ShipperContext.Provider>
  );
}

export function useShipper() {
  const context = useContext(ShipperContext);
  if (context === undefined) {
    throw new Error('useShipper must be used within a ShipperProvider');
  }
  return context;
}
