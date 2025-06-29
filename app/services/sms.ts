// SMS Service for FleetFlow
// Centralized SMS functionality for the application

interface SMSRecipient {
  id: string;
  name: string;
  phone: string;
  type: 'driver' | 'carrier' | 'broker' | 'customer';
}

interface SMSLoadData {
  id: string;
  origin: string;
  destination: string;
  rate: string;
  distance?: string;
  pickupDate: string;
  equipment: string;
  weight?: string;
  specialInstructions?: string;
}

interface SMSResponse {
  success: boolean;
  results: Array<{
    recipientId: string;
    status: 'sent' | 'failed';
    messageId?: string;
    error?: string;
  }>;
  summary: {
    total: number;
    sent: number;
    failed: number;
    totalCost: number;
  };
}

class SMSService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  /**
   * Send SMS notifications for new loads
   */
  async sendNewLoadNotification(
    loadData: SMSLoadData,
    recipients: SMSRecipient[],
    urgency: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<SMSResponse> {
    return this.sendNotification({
      loadData,
      recipients,
      notificationType: 'sms',
      messageTemplate: 'new-load',
      urgency
    });
  }

  /**
   * Send SMS pickup reminders
   */
  async sendPickupReminder(
    loadData: SMSLoadData,
    recipients: SMSRecipient[]
  ): Promise<SMSResponse> {
    return this.sendNotification({
      loadData,
      recipients,
      notificationType: 'sms',
      messageTemplate: 'pickup-reminder',
      urgency: 'high'
    });
  }

  /**
   * Send SMS delivery reminders
   */
  async sendDeliveryReminder(
    loadData: SMSLoadData,
    recipients: SMSRecipient[]
  ): Promise<SMSResponse> {
    return this.sendNotification({
      loadData,
      recipients,
      notificationType: 'sms',
      messageTemplate: 'delivery-reminder',
      urgency: 'high'
    });
  }

  /**
   * Send custom SMS messages
   */
  async sendCustomMessage(
    loadData: SMSLoadData,
    recipients: SMSRecipient[],
    customMessage: string,
    urgency: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<SMSResponse> {
    return this.sendNotification({
      loadData,
      recipients,
      notificationType: 'sms',
      messageTemplate: 'custom',
      customMessage,
      urgency
    });
  }

  /**
   * Send load update notifications
   */
  async sendLoadUpdate(
    loadData: SMSLoadData,
    recipients: SMSRecipient[],
    urgency: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): Promise<SMSResponse> {
    return this.sendNotification({
      loadData,
      recipients,
      notificationType: 'sms',
      messageTemplate: 'load-update',
      urgency
    });
  }

  /**
   * Check SMS service status
   */
  async getServiceStatus(): Promise<{
    status: string;
    twilioConfigured: boolean;
    availableTemplates: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/send`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SMS Service Status Error:', error);
      return {
        status: 'error',
        twilioConfigured: false,
        availableTemplates: []
      };
    }
  }

  /**
   * Format phone number for SMS
   */
  formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Add country code if not present
    if (digits.length === 10) {
      return `+1${digits}`;
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return `+${digits}`;
    }
    
    return phone; // Return as-is if already formatted
  }

  /**
   * Validate phone number
   */
  isValidPhoneNumber(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }

  /**
   * Get mock recipients for testing
   */
  getMockRecipients(): SMSRecipient[] {
    return [
      {
        id: 'driver-001',
        name: 'John Smith',
        phone: '+15551234567',
        type: 'driver'
      },
      {
        id: 'carrier-001',
        name: 'ABC Logistics',
        phone: '+15559876543',
        type: 'carrier'
      }
    ];
  }

  /**
   * Create mock load data for testing
   */
  getMockLoadData(): SMSLoadData {
    return {
      id: `LOAD-${Date.now()}`,
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: '$2,500',
      distance: '650 miles',
      pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
      equipment: 'Dry Van',
      weight: '25,000 lbs'
    };
  }

  /**
   * Send test SMS
   */
  async sendTestSMS(): Promise<SMSResponse> {
    const mockLoad = this.getMockLoadData();
    const mockRecipients = this.getMockRecipients();
    
    return this.sendNewLoadNotification(mockLoad, mockRecipients, 'normal');
  }

  /**
   * Core notification sending method
   */
  private async sendNotification(payload: {
    loadData: SMSLoadData;
    recipients: SMSRecipient[];
    notificationType: 'sms' | 'app' | 'both';
    messageTemplate: string;
    customMessage?: string;
    urgency?: string;
  }): Promise<SMSResponse> {
    try {
      // Format phone numbers
      const formattedRecipients = payload.recipients.map(recipient => ({
        ...recipient,
        phone: this.formatPhoneNumber(recipient.phone)
      }));

      const response = await fetch(`${this.baseUrl}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          recipients: formattedRecipients
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'SMS sending failed');
      }

      return {
        success: true,
        results: result.results || [],
        summary: result.summary || { total: 0, sent: 0, failed: 0, totalCost: 0 }
      };

    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        results: [],
        summary: { total: 0, sent: 0, failed: 1, totalCost: 0 }
      };
    }
  }
}

// Export singleton instance
export const smsService = new SMSService();

// Export types for use in other files
export type { SMSRecipient, SMSLoadData, SMSResponse };

// Export class for advanced usage
export { SMSService };
