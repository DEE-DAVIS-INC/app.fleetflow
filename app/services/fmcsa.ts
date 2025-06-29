// FMCSA API Integration
// Since we're using static export, this will be a client-side utility

interface FMCSACarrierInfo {
  dotNumber: string;
  legalName: string;
  dbaName?: string;
  carrierOperation: string;
  hm: string; // Hazmat
  pc: string; // Passenger Carrier
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  usdotNumber: string;
  mcNumber?: string;
  powerUnits: number;
  drivers: number;
  mcs150Date: string;
  mcs150Mileage: number;
  safetyRating?: string;
  safetyRatingDate?: string;
  reviewDate?: string;
  reviewType?: string;
  crashTotal: number;
  crashFatal: number;
  crashInjury: number;
  crashTow: number;
  crashHazmat: number;
  inspectionTotal: number;
  inspectionVehicleOos: number;
  inspectionDriverOos: number;
  inspectionHazmat: number;
  inspectionIep: number;
}

interface FMCSASearchResult {
  success: boolean;
  data?: FMCSACarrierInfo;
  error?: string;
}

export class FMCSAService {
  private static readonly API_KEY = '7de24c4a0eade12f34685829289e0446daf7880e';
  private static readonly BASE_URL = 'https://mobile.fmcsa.dot.gov/qc';

  static async lookupByDOTNumber(dotNumber: string): Promise<FMCSASearchResult> {
    try {
      if (!dotNumber || dotNumber.trim() === '') {
        return {
          success: false,
          error: 'DOT number is required'
        };
      }

      // Clean DOT number (remove any non-numeric characters)
      const cleanDotNumber = dotNumber.replace(/\D/g, '');
      
      if (cleanDotNumber.length === 0) {
        return {
          success: false,
          error: 'Invalid DOT number format'
        };
      }

      const url = `${this.BASE_URL}/id/${cleanDotNumber}?webKey=${this.API_KEY}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Carrier not found with the provided DOT number'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response indicates no resource found
      if (data.content && data.content.includes('no resource')) {
        return {
          success: false,
          error: 'Carrier not found with the provided DOT number'
        };
      }
      
      // Parse the FMCSA response format
      const carrierInfo = this.parseCarrierData(data);
      
      return {
        success: true,
        data: carrierInfo
      };

    } catch (error) {
      console.error('FMCSA API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch carrier information'
      };
    }
  }

  static async searchByName(carrierName: string): Promise<FMCSASearchResult> {
    try {
      if (!carrierName || carrierName.trim() === '') {
        return {
          success: false,
          error: 'Carrier name is required'
        };
      }

      const encodedName = encodeURIComponent(carrierName.trim());
      const url = `${this.BASE_URL}/name/${encodedName}?webKey=${this.API_KEY}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'No carriers found with the provided name'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response indicates no resource found
      if (data.content && data.content.includes('no resource')) {
        return {
          success: false,
          error: 'No carriers found with the provided name'
        };
      }
      
      // If multiple results, return the first one
      const carrierInfo = Array.isArray(data) ? this.parseCarrierData(data[0]) : this.parseCarrierData(data);
      
      return {
        success: true,
        data: carrierInfo
      };

    } catch (error) {
      console.error('FMCSA API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search carrier information'
      };
    }
  }

  static async lookupByMCNumber(mcNumber: string): Promise<FMCSASearchResult> {
    try {
      if (!mcNumber || mcNumber.trim() === '') {
        return {
          success: false,
          error: 'MC number is required'
        };
      }

      // Clean MC number (remove any non-numeric characters and MC prefix)
      const cleanMcNumber = mcNumber.replace(/[^\d]/g, '');
      
      if (cleanMcNumber.length === 0) {
        return {
          success: false,
          error: 'Invalid MC number format'
        };
      }

      const url = `${this.BASE_URL}/mc/${cleanMcNumber}?webKey=${this.API_KEY}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Carrier not found with the provided MC number'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response indicates no resource found
      if (data.content && data.content.includes('no resource')) {
        return {
          success: false,
          error: 'Carrier not found with the provided MC number'
        };
      }
      
      // Parse the FMCSA response format
      const carrierInfo = this.parseCarrierData(data);
      
      return {
        success: true,
        data: carrierInfo
      };

    } catch (error) {
      console.error('FMCSA API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch carrier information'
      };
    }
  }

  private static parseCarrierData(data: any): FMCSACarrierInfo {
    return {
      dotNumber: data.dotNumber || data.usdotNumber || '',
      legalName: data.legalName || data.name || '',
      dbaName: data.dbaName || data.dba || '',
      carrierOperation: data.carrierOperation || '',
      hm: data.hm || 'N',
      pc: data.pc || 'N',
      address: {
        street: data.phyStreet || data.address?.street || '',
        city: data.phyCity || data.address?.city || '',
        state: data.phyState || data.address?.state || '',
        zip: data.phyZipcode || data.address?.zip || ''
      },
      phone: data.telephone || data.phone || '',
      usdotNumber: data.usdotNumber || data.dotNumber || '',
      mcNumber: data.mcNumber || '',
      powerUnits: parseInt(data.powerUnits) || 0,
      drivers: parseInt(data.drivers) || 0,
      mcs150Date: data.mcs150Date || '',
      mcs150Mileage: parseInt(data.mcs150Mileage) || 0,
      safetyRating: data.safetyRating || '',
      safetyRatingDate: data.safetyRatingDate || '',
      reviewDate: data.reviewDate || '',
      reviewType: data.reviewType || '',
      crashTotal: parseInt(data.crashTotal) || 0,
      crashFatal: parseInt(data.crashFatal) || 0,
      crashInjury: parseInt(data.crashInjury) || 0,
      crashTow: parseInt(data.crashTow) || 0,
      crashHazmat: parseInt(data.crashHazmat) || 0,
      inspectionTotal: parseInt(data.inspectionTotal) || 0,
      inspectionVehicleOos: parseInt(data.inspectionVehicleOos) || 0,
      inspectionDriverOos: parseInt(data.inspectionDriverOos) || 0,
      inspectionHazmat: parseInt(data.inspectionHazmat) || 0,
      inspectionIep: parseInt(data.inspectionIep) || 0
    };
  }

  // Generate demo data for testing/fallback
  static generateDemoData(searchValue: string): FMCSACarrierInfo {
    const isNumeric = /^\d+$/.test(searchValue.replace(/[^\d]/g, ''));
    const displayNumber = isNumeric ? searchValue.replace(/[^\d]/g, '') : '123456';
    
    return {
      dotNumber: displayNumber,
      legalName: `Demo Carrier ${displayNumber}`,
      dbaName: `Demo Transport LLC`,
      carrierOperation: 'Interstate',
      hm: 'N',
      pc: 'N',
      address: {
        street: '123 Demo Street',
        city: 'Demo City',
        state: 'TX',
        zip: '75001'
      },
      phone: '(555) 123-4567',
      usdotNumber: displayNumber,
      mcNumber: `MC-${displayNumber}`,
      powerUnits: 25,
      drivers: 30,
      mcs150Date: '2024-01-15',
      mcs150Mileage: 125000,
      safetyRating: 'Satisfactory',
      safetyRatingDate: '2023-06-15',
      reviewDate: '2023-06-15',
      reviewType: 'Compliance Review',
      crashTotal: 2,
      crashFatal: 0,
      crashInjury: 1,
      crashTow: 1,
      crashHazmat: 0,
      inspectionTotal: 45,
      inspectionVehicleOos: 3,
      inspectionDriverOos: 2,
      inspectionHazmat: 0,
      inspectionIep: 0
    };
  }
}

export type { FMCSACarrierInfo, FMCSASearchResult };
