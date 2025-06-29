// Shipper Management Types

export interface ShipperContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  isPrimary: boolean;
}

export interface ShipperLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  contactName?: string;
  contactPhone?: string;
  operatingHours?: string;
  specialInstructions?: string;
}

export interface CommodityInfo {
  name: string;
  freightClass: string; // NMFC freight class (50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500)
  description: string;
  hazmat: boolean;
  temperature?: 'ambient' | 'refrigerated' | 'frozen';
  specialHandling?: string[];
}

export interface LoadRequest {
  id: string;
  shipperId: string;
  requestType: 'load' | 'rfp' | 'quote_request';
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'completed';
  submittedDate: string;
  pickupDate: string;
  deliveryDate: string;
  pickupLocation: ShipperLocation;
  deliveryLocation: ShipperLocation;
  commodity: CommodityInfo;
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  pieces: number;
  specialInstructions?: string;
  rate?: number;
  assignedBrokerId?: string;
  assignedBrokerName?: string;
  submittedBy: string; // Contact who submitted the request
}

export interface Shipper {
  id: string;
  companyName: string;
  mcNumber?: string;
  taxId: string;
  contacts: ShipperContact[];
  locations: ShipperLocation[];
  commodities: CommodityInfo[];
  paymentTerms: string; // e.g., "Net 30", "Quick Pay", etc.
  creditLimit: number;
  creditRating: 'A' | 'B' | 'C' | 'D';
  preferredLanes: string[];
  loadRequests: LoadRequest[];
  assignedBrokerId: string; // The broker who manages this shipper
  assignedBrokerName: string;
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActivity: string;
  totalLoads: number;
  totalRevenue: number;
  averageRate: number;
  notes?: string;
}

export interface BrokerAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  hireDate: string;
  status: 'active' | 'inactive';
  shippers: string[]; // Array of shipper IDs assigned to this broker
  totalRevenue: number;
  activeLoads: number;
}
