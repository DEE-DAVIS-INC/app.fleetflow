import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Types for SMS notification system
interface LoadData {
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

interface Recipient {
  id: string;
  name: string;
  phone: string;
  type: 'driver' | 'carrier' | 'broker' | 'customer';
  preferences?: {
    smsEnabled: boolean;
    language?: 'en' | 'es';
    timezone?: string;
  };
}

interface NotificationRequest {
  loadData: LoadData;
  recipients: Recipient[];
  notificationType: 'sms' | 'app' | 'both';
  messageTemplate?: 'new-load' | 'load-update' | 'pickup-reminder' | 'delivery-reminder' | 'custom';
  customMessage?: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
  status?: string;
}

interface NotificationResult {
  recipientId: string;
  type: 'sms' | 'app';
  status: 'sent' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
  timestamp: string;
  cost?: number;
}

// SMS Templates
const SMS_TEMPLATES = {
  'new-load': (load: LoadData) => `🚛 NEW LOAD AVAILABLE
📍 From: ${load.origin}
📍 To: ${load.destination}
💰 Rate: ${load.rate}
📅 Pickup: ${load.pickupDate}
🚚 Equipment: ${load.equipment}
${load.distance ? `📏 Distance: ${load.distance}` : ''}
${load.weight ? `⚖️ Weight: ${load.weight}` : ''}

Load ID: ${load.id}
Reply ACCEPT to claim this load!`,

  'load-update': (load: LoadData) => `📋 LOAD UPDATE - ${load.id}
${load.origin} → ${load.destination}
Rate: ${load.rate}
Pickup: ${load.pickupDate}
Equipment: ${load.equipment}

Check your app for full details.`,

  'pickup-reminder': (load: LoadData) => `⏰ PICKUP REMINDER
Load: ${load.id}
📍 Pickup: ${load.origin}
📅 Today - ${load.pickupDate}
🚚 Equipment: ${load.equipment}

Safe travels! 🛣️`,

  'delivery-reminder': (load: LoadData) => `🎯 DELIVERY REMINDER
Load: ${load.id}
📍 Delivery: ${load.destination}
📅 Expected Today
💰 Rate: ${load.rate}

Almost there! 🏁`,
};

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json();
    
    // Validate request
    if (!body.loadData || !body.recipients || body.recipients.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: loadData and recipients' },
        { status: 400 }
      );
    }

    const results: NotificationResult[] = [];
    
    // Process each recipient
    for (const recipient of body.recipients) {
      if (body.notificationType === 'sms' && recipient.phone) {
        // Send SMS notification
        try {
          const message = generateSMSMessage(body.loadData, body.messageTemplate, body.customMessage);
          
          // Check if Twilio is configured
          if (process.env.TWILIO_ACCOUNT_SID && 
              process.env.TWILIO_AUTH_TOKEN && 
              process.env.TWILIO_PHONE_NUMBER &&
              process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid_here') {
            
            // Send real SMS via Twilio
            const smsResult = await sendTwilioSMS(
              recipient.phone,
              message,
              body.urgency || 'normal'
            );
            
            results.push({
              recipientId: recipient.id,
              type: 'sms',
              status: smsResult.success ? 'sent' : 'failed',
              messageId: smsResult.messageId,
              error: smsResult.error,
              timestamp: new Date().toISOString(),
              cost: smsResult.cost
            });
          } else {
            // Mock SMS for demo/development
            console.log(`[MOCK SMS] To: ${recipient.phone} (${recipient.name})`);
            console.log(`[MOCK SMS] Message: ${message}`);
            console.log(`[MOCK SMS] Urgency: ${body.urgency || 'normal'}`);
            
            // Simulate success with mock data
            results.push({
              recipientId: recipient.id,
              type: 'sms',
              status: 'sent',
              messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              timestamp: new Date().toISOString(),
              cost: 0.01 // Mock cost
            });
          }
        } catch (error) {
          console.error(`SMS Error for ${recipient.id}:`, error);
          results.push({
            recipientId: recipient.id,
            type: 'sms',
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown SMS error',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Handle app notifications (future implementation)
      if (body.notificationType === 'app' || body.notificationType === 'both') {
        // For now, just log app notifications
        console.log(`[APP NOTIFICATION] To: ${recipient.name} (${recipient.id})`);
        results.push({
          recipientId: recipient.id,
          type: 'app',
          status: 'sent',
          messageId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Log summary
    const successCount = results.filter(r => r.status === 'sent').length;
    const failCount = results.filter(r => r.status === 'failed').length;
    
    console.log(`📊 SMS Summary: ${successCount} sent, ${failCount} failed`);
    
    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} notifications, ${failCount} failed`,
      results,
      summary: {
        total: results.length,
        sent: successCount,
        failed: failCount,
        totalCost: results.reduce((sum, r) => sum + (r.cost || 0), 0)
      }
    });

  } catch (error) {
    console.error('Notification API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Generate SMS message based on template
function generateSMSMessage(
  loadData: LoadData, 
  template: string = 'new-load', 
  customMessage?: string
): string {
  if (customMessage) {
    return customMessage;
  }
  
  const templateFunc = SMS_TEMPLATES[template as keyof typeof SMS_TEMPLATES];
  if (templateFunc) {
    return templateFunc(loadData);
  }
  
  // Fallback to new-load template
  return SMS_TEMPLATES['new-load'](loadData);
}

// Send SMS via Twilio
async function sendTwilioSMS(
  to: string,
  message: string,
  urgency: string = 'normal'
): Promise<SMSResult> {
  try {
    // Import Twilio (install if needed)
    const twilio = require('twilio');
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }
    
    const client = twilio(accountSid, authToken);
    
    // Set message options based on urgency
    const messageOptions: any = {
      body: message,
      from: fromNumber,
      to: to
    };
    
    // Add urgency-based features
    if (urgency === 'urgent') {
      messageOptions.statusCallback = `${process.env.NEXT_PUBLIC_APP_URL}/api/sms/status`;
      messageOptions.statusCallbackMethod = 'POST';
    }
    
    const result = await client.messages.create(messageOptions);
    
    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      cost: parseFloat(result.price || '0.01') // Twilio returns price as string
    };
    
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Twilio error'
    };
  }
}

// GET endpoint for health check
export async function GET() {
  const isConfigured = !!(
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.TWILIO_ACCOUNT_SID !== 'your_twilio_account_sid_here'
  );
  
  return NextResponse.json({
    service: 'FleetFlow SMS Notifications',
    status: 'online',
    twilioConfigured: isConfigured,
    availableTemplates: Object.keys(SMS_TEMPLATES),
    timestamp: new Date().toISOString()
  });
}
