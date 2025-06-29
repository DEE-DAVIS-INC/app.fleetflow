// Auto Load Distribution Service
// import { loadService, driverService, vehicleService } from '../lib/database';

export interface LoadDistributionConfig {
  autoSendEnabled: boolean;
  maxDriversPerLoad: number;
  radiusMiles: number;
  equipmentMatching: boolean;
  priorityDriversFirst: boolean;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredEquipment: string[];
  preferredRoutes: string[];
  homeLocation: {
    lat: number;
    lng: number;
    city: string;
    state: string;
  };
  availability: 'available' | 'busy' | 'unavailable';
  rating: number; // 1-5 stars
  lastLoadDate?: string;
  acceptanceRate: number; // percentage
}

export interface CarrierProfile {
  id: string;
  name: string;
  contactPhone: string;
  contactEmail: string;
  mcNumber: string;
  dotNumber: string;
  equipmentTypes: string[];
  serviceAreas: string[];
  rating: number;
  preferredRate: number;
  isActive: boolean;
}

export interface LoadDistributionRule {
  id: string;
  name: string;
  enabled: boolean;
  equipmentType?: string;
  minRate?: number;
  maxMiles?: number;
  preferredCarriers?: string[];
  excludedCarriers?: string[];
  autoAssignBestMatch?: boolean;
}

export class LoadDistributionService {
  private config: LoadDistributionConfig;

  constructor(config: LoadDistributionConfig) {
    this.config = config;
  }

  // Main function to distribute a new load
  async distributeLoad(load: any): Promise<{
    success: boolean;
    messagesSent: number;
    recipients: string[];
    errors: string[];
  }> {
    if (!this.config.autoSendEnabled) {
      return {
        success: false,
        messagesSent: 0,
        recipients: [],
        errors: ['Auto-distribution is disabled']
      };
    }

    try {
      // Find eligible drivers and carriers
      const eligibleDrivers = await this.findEligibleDrivers(load);
      const eligibleCarriers = await this.findEligibleCarriers(load);
      
      // Sort by priority (rating, location, availability)
      const sortedDrivers = this.sortByPriority(eligibleDrivers, load);
      const sortedCarriers = this.sortCarriersByPriority(eligibleCarriers, load);

      // Limit to max drivers per config
      const selectedDrivers = sortedDrivers.slice(0, this.config.maxDriversPerLoad);
      const selectedCarriers = sortedCarriers.slice(0, this.config.maxDriversPerLoad);

      // Send SMS notifications
      const results = await this.sendLoadNotifications(load, selectedDrivers, selectedCarriers);

      return results;
    } catch (error: any) {
      console.error('Error distributing load:', error);
      return {
        success: false,
        messagesSent: 0,
        recipients: [],
        errors: [error?.message || 'Unknown error']
      };
    }
  }

  private async findEligibleDrivers(load: any): Promise<DriverProfile[]> {
    // Mock driver data - in production, get from database
    const allDrivers: DriverProfile[] = [
      {
        id: 'D001',
        name: 'John Smith',
        phone: '+1234567890',
        email: 'john@fleetflow.com',
        preferredEquipment: ['Dry Van', 'Refrigerated'],
        preferredRoutes: ['Southeast', 'Northeast'],
        homeLocation: { lat: 33.7490, lng: -84.3880, city: 'Atlanta', state: 'GA' },
        availability: 'available',
        rating: 4.5,
        acceptanceRate: 85
      },
      {
        id: 'D002',
        name: 'Sarah Johnson',
        phone: '+1234567891',
        email: 'sarah@fleetflow.com',
        preferredEquipment: ['Flatbed', 'Step Deck'],
        preferredRoutes: ['Midwest', 'West'],
        homeLocation: { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL' },
        availability: 'available',
        rating: 4.2,
        acceptanceRate: 92
      },
      {
        id: 'D003',
        name: 'Mike Wilson',
        phone: '+1234567892',
        email: 'mike@fleetflow.com',
        preferredEquipment: ['Dry Van'],
        preferredRoutes: ['West Coast', 'Southwest'],
        homeLocation: { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA' },
        availability: 'available',
        rating: 4.8,
        acceptanceRate: 78
      }
    ];
    
    // Filter based on equipment type, location, etc.
    return allDrivers.filter((driver: DriverProfile) => {
      // Equipment matching
      if (this.config.equipmentMatching && driver.preferredEquipment) {
        if (!driver.preferredEquipment.includes(load.equipment)) {
          return false;
        }
      }

      // Location radius check (simplified - in production use proper geo calculations)
      if (this.config.radiusMiles > 0) {
        // Check if driver is within radius of pickup location
        // This is a simplified check - implement proper distance calculation
        return true;
      }

      return driver.availability === 'available';
    });
  }

  private async findEligibleCarriers(load: any): Promise<CarrierProfile[]> {
    // Mock carrier data - in production, fetch from database
    const carriers: CarrierProfile[] = [
      {
        id: 'C001',
        name: 'Fast Freight LLC',
        contactPhone: '+1234567891',
        contactEmail: 'dispatch@fastfreight.com',
        mcNumber: 'MC123456',
        dotNumber: '12345',
        equipmentTypes: ['Dry Van', 'Refrigerated'],
        serviceAreas: ['Southeast', 'Midwest'],
        rating: 4.5,
        preferredRate: 2.50,
        isActive: true
      },
      {
        id: 'C002',
        name: 'Reliable Transport',
        contactPhone: '+1234567892',
        contactEmail: 'loads@reliabletransport.com',
        mcNumber: 'MC789012',
        dotNumber: '67890',
        equipmentTypes: ['Flatbed', 'Step Deck'],
        serviceAreas: ['West Coast', 'Southwest'],
        rating: 4.2,
        preferredRate: 2.25,
        isActive: true
      }
    ];

    return carriers.filter(carrier => {
      return carrier.isActive && 
             carrier.equipmentTypes.includes(load.equipment) &&
             load.rate >= carrier.preferredRate;
    });
  }

  private sortByPriority(drivers: any[], load: any): any[] {
    return drivers.sort((a, b) => {
      // Priority factors: rating, availability, acceptance rate
      const scoreA = (a.rating || 3) * 0.4 + (a.acceptanceRate || 50) * 0.003;
      const scoreB = (b.rating || 3) * 0.4 + (b.acceptanceRate || 50) * 0.003;
      
      return scoreB - scoreA;
    });
  }

  private sortCarriersByPriority(carriers: CarrierProfile[], load: any): CarrierProfile[] {
    return carriers.sort((a, b) => {
      // Sort by rating and rate preference
      const scoreA = a.rating * 0.6 + (load.rate / a.preferredRate) * 0.4;
      const scoreB = b.rating * 0.6 + (load.rate / b.preferredRate) * 0.4;
      
      return scoreB - scoreA;
    });
  }

  private async sendLoadNotifications(
    load: any, 
    drivers: any[], 
    carriers: CarrierProfile[]
  ): Promise<{
    success: boolean;
    messagesSent: number;
    recipients: string[];
    errors: string[];
  }> {
    const recipients: string[] = [];
    const errors: string[] = [];
    let messagesSent = 0;

    // Prepare load message
    const loadMessage = this.formatLoadMessage(load);

    // Send to drivers
    for (const driver of drivers) {
      try {
        const response = await this.sendSMS({
          phone: driver.phone,
          message: `🚛 NEW LOAD AVAILABLE\n${loadMessage}\nReply YES to accept or call dispatch.`,
          recipientName: driver.name,
          recipientType: 'driver'
        });

        if (response.success) {
          recipients.push(`${driver.name} (${driver.phone})`);
          messagesSent++;
        } else {
          errors.push(`Failed to send to ${driver.name}: ${response.error}`);
        }
      } catch (error: any) {
        errors.push(`Error sending to ${driver.name}: ${error?.message || 'Unknown error'}`);
      }
    }

    // Send to carriers
    for (const carrier of carriers) {
      try {
        const response = await this.sendSMS({
          phone: carrier.contactPhone,
          message: `📋 LOAD OPPORTUNITY\n${loadMessage}\nContact: dispatch@fleetflow.com\nLoad ID: ${load.id}`,
          recipientName: carrier.name,
          recipientType: 'carrier'
        });

        if (response.success) {
          recipients.push(`${carrier.name} (${carrier.contactPhone})`);
          messagesSent++;
        } else {
          errors.push(`Failed to send to ${carrier.name}: ${response.error}`);
        }
      } catch (error: any) {
        errors.push(`Error sending to ${carrier.name}: ${error?.message || 'Unknown error'}`);
      }
    }

    return {
      success: messagesSent > 0,
      messagesSent,
      recipients,
      errors
    };
  }

  private formatLoadMessage(load: any): string {
    return [
      `Route: ${load.origin} → ${load.destination}`,
      `Pickup: ${load.pickupDate}`,
      `Equipment: ${load.equipment}`,
      `Rate: $${load.rate?.toLocaleString()}`,
      `Miles: ${load.distance || 'TBD'}`,
      `Weight: ${load.weight || 'TBD'}`
    ].join('\n');
  }

  private async sendSMS(params: {
    phone: string;
    message: string;
    recipientName: string;
    recipientType: 'driver' | 'carrier';
  }): Promise<{ success: boolean; error?: string; messageId?: string }> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadData: {
            id: 'AUTO-' + Date.now(),
            origin: 'Auto Distribution',
            destination: 'System',
            rate: '$0',
            pickupDate: new Date().toLocaleDateString(),
            equipment: 'Various'
          },
          recipients: [{
            id: 'auto-' + Date.now(),
            phone: params.phone,
            name: params.recipientName,
            type: params.recipientType
          }],
          notificationType: 'sms',
          messageTemplate: 'custom',
          customMessage: params.message,
          urgency: 'normal'
        }),
      });

      const result = await response.json();
      
      if (result.success && result.results && result.results.length > 0) {
        const firstResult = result.results[0];
        return {
          success: firstResult.status === 'sent',
          error: firstResult.error,
          messageId: firstResult.messageId
        };
      }
      
      return {
        success: result.success || false,
        error: result.error || 'Unknown error'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}

// Default configuration
export const defaultDistributionConfig: LoadDistributionConfig = {
  autoSendEnabled: true,
  maxDriversPerLoad: 5,
  radiusMiles: 100,
  equipmentMatching: true,
  priorityDriversFirst: true
};
