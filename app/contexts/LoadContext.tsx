'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LoadData {
  id: string;
  
  // Basic Load Information
  origin: string;
  destination: string;
  pickupDate: string;
  pickupTime?: string;
  deliveryDate: string;
  deliveryTime?: string;
  
  // Shipper Information
  shipperName?: string;
  shipperAddress?: string;
  shipperCity?: string;
  shipperState?: string;
  shipperZip?: string;
  shipperPhone?: string;
  shipperContact?: string;
  
  // Consignee Information
  consigneeName?: string;
  consigneeAddress?: string;
  consigneeCity?: string;
  consigneeState?: string;
  consigneeZip?: string;
  consigneePhone?: string;
  consigneeContact?: string;
  
  // Carrier Information
  carrierName?: string;
  carrierMC?: string;
  carrierDOT?: string;
  driverName?: string;
  driverPhone?: string;
  
  // Broker Agent Information
  brokerAgentName?: string;
  brokerAgentEmail?: string;
  brokerAgentPhone?: string;
  brokerAgentCompany?: string;
  brokerAgentLicense?: string;
  brokerAgentMC?: string;
  brokerAgentDOT?: string;
  
  // Load Details
  commodity?: string;
  freightClass?: string; // NMFC freight class
  weight: string;
  pieces?: string;
  equipment: string;
  
  // Rate Information
  rate: string | number;
  fuelSurcharge?: number;
  additionalCharges?: number;
  totalRate?: number;
  paymentTerms?: string;
  
  // Additional Information
  distance?: string;
  broker?: string;
  priority?: 'High' | 'Medium' | 'Low';
  status: 'Available' | 'Pending' | 'Booked' | 'Assigned' | 'In Transit' | 'Delivered' | 'Delayed';
  specialInstructions?: string;
  
  // BOL Specific
  bolNumber?: string;
  proNumber?: string;
  trailerNumber?: string;
  sealNumber?: string;
  hazmat?: boolean;
  hazmatClass?: string;
  value?: string;
}

interface LoadContextType {
  selectedLoad: LoadData | null;
  setSelectedLoad: (load: LoadData | null) => void;
  loadHistory: LoadData[];
  addToHistory: (load: LoadData) => void;
  updateLoad: (loadId: string, updates: Partial<LoadData>) => void;
}

const LoadContext = createContext<LoadContextType | undefined>(undefined);

export function LoadProvider({ children }: { children: ReactNode }) {
  const [selectedLoad, setSelectedLoad] = useState<LoadData | null>(null);
  const [loadHistory, setLoadHistory] = useState<LoadData[]>([]);

  const addToHistory = (load: LoadData) => {
    setLoadHistory(prev => {
      const existing = prev.find(l => l.id === load.id);
      if (existing) {
        return prev.map(l => l.id === load.id ? load : l);
      }
      return [load, ...prev.slice(0, 49)]; // Keep last 50 loads
    });
  };

  const updateLoad = (loadId: string, updates: Partial<LoadData>) => {
    setLoadHistory(prev => 
      prev.map(load => 
        load.id === loadId ? { ...load, ...updates } : load
      )
    );
    
    if (selectedLoad?.id === loadId) {
      setSelectedLoad(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  return (
    <LoadContext.Provider value={{
      selectedLoad,
      setSelectedLoad,
      loadHistory,
      addToHistory,
      updateLoad
    }}>
      {children}
    </LoadContext.Provider>
  );
}

export function useLoad() {
  const context = useContext(LoadContext);
  if (context === undefined) {
    throw new Error('useLoad must be used within a LoadProvider');
  }
  return context;
}
