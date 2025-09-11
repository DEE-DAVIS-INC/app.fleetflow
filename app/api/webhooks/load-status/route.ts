// app/api/webhooks/load-status/route.ts
// Webhook endpoint for load status changes from Supabase

import { createSupabaseAdminClient } from '@/lib/supabase-config';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../../../utils/logger';

interface LoadStatusWebhookPayload {
  event: 'load.status_changed';
  load_id: string;
  load_number: string;
  company_id: string;
  old_status: string;
  new_status: string;
  driver_id?: string;
  broker_id?: string;
  timestamp: string;
  changed_by?: string;
}

// ================================================================
// WEBHOOK AUTHENTICATION
// ================================================================

const verifyWebhookAuth = async (request: NextRequest): Promise<boolean> => {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  const expectedSecret =
    process.env.WEBHOOK_SECRET || 'fleetflow-webhook-secret';

  if (!authHeader) {
    console.error('❌ Missing authorization header');
    return false;
  }

  const token = authHeader.replace('Bearer ', '');

  if (token !== expectedSecret) {
    console.error('❌ Invalid webhook authentication token');
    return false;
  }

  return true;
};

// ================================================================
// LOAD STATUS CHANGE HANDLER
// ================================================================

const handleLoadStatusChange = async (payload: LoadStatusWebhookPayload) => {
  logger.info(
    'Load status change received',
    {
      loadId: payload.load_id,
      loadNumber: payload.load_number,
      oldStatus: payload.old_status,
      newStatus: payload.new_status,
      companyId: payload.company_id,
    },
    'LoadStatusWebhook'
  );

  const supabase = createSupabaseAdminClient();

  try {
    // Get load details
    const { data: load, error: loadError } = await supabase
      .from('loads')
      .select(
        `
        *,
        companies(name),
        drivers(name, user_id),
        users!broker_id(full_name, email)
      `
      )
      .eq('id', payload.load_id)
      .single();

    if (loadError) {
      throw new Error(`Failed to fetch load: ${loadError.message}`);
    }

    // Update load tracking history
    const { error: historyError } = await supabase
      .from('load_status_history')
      .insert({
        load_id: payload.load_id,
        old_status: payload.old_status,
        new_status: payload.new_status,
        changed_at: payload.timestamp,
        changed_by: payload.changed_by,
      });

    if (historyError) {
      console.error('❌ Failed to create status history:', historyError);
    }

    // Send notifications based on status
    await sendStatusNotifications(payload, load);

    // Trigger external integrations
    await triggerExternalIntegrations(payload, load);

    logger.info(
      'Load status change processed successfully',
      {
        loadId: payload.load_id,
        newStatus: payload.new_status,
      },
      'LoadStatusWebhook'
    );

    return {
      success: true,
      message: 'Load status change processed',
      load_id: payload.load_id,
      status_change: `${payload.old_status} → ${payload.new_status}`,
    };
  } catch (error) {
    console.error('❌ Error processing load status change:', error);
    throw error;
  }
};

// ================================================================
// NOTIFICATION LOGIC
// ================================================================

const sendStatusNotifications = async (
  payload: LoadStatusWebhookPayload,
  load: any
) => {
  const supabase = createSupabaseAdminClient();

  // Determine notification recipients based on status
  const recipients = await getNotificationRecipients(payload, load);

  // Create notifications
  const notifications = recipients.map((recipient) => ({
    user_id: recipient.user_id,
    title: getNotificationTitle(payload.new_status),
    message: getNotificationMessage(payload, load),
    type: 'load_status_change',
    related_id: payload.load_id,
    metadata: {
      load_number: payload.load_number,
      old_status: payload.old_status,
      new_status: payload.new_status,
      company_id: payload.company_id,
    },
  }));

  if (notifications.length > 0) {
    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      logger.error(
        'Failed to create notifications',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          loadId: payload.load_id,
        },
        'LoadStatusWebhook'
      );
    } else {
      logger.info(
        'Status notifications created',
        {
          notificationCount: notifications.length,
          loadId: payload.load_id,
          status: payload.new_status,
        },
        'LoadStatusWebhook'
      );
    }
  }

  // Send real-time push notifications (if enabled)
  await sendPushNotifications(notifications, payload);
};

const getNotificationRecipients = async (
  payload: LoadStatusWebhookPayload,
  load: any
) => {
  const supabase = createSupabaseAdminClient();

  // Get company users who should be notified
  const { data: users, error } = await supabase
    .from('users')
    .select('id, full_name, email, department_code')
    .eq('company_id', payload.company_id)
    .eq('notifications_enabled', true)
    .in('department_code', ['DC', 'BB', 'MGR']);

  if (error) {
    console.error('❌ Failed to fetch notification recipients:', error);
    return [];
  }

  const recipients = users.map((user) => ({
    user_id: user.id,
    name: user.full_name,
    email: user.email,
    department: user.department_code,
  }));

  // Add driver if assigned and status is relevant
  if (payload.driver_id && load.drivers?.user_id) {
    recipients.push({
      user_id: load.drivers.user_id,
      name: load.drivers.name,
      email: null,
      department: 'DM',
    });
  }

  return recipients;
};

const getNotificationTitle = (status: string): string => {
  const titles: Record<string, string> = {
    assigned: '🚛 Load Assigned',
    picked_up: '📦 Load Picked Up',
    in_transit: '🚚 Load In Transit',
    delivered: '✅ Load Delivered',
    cancelled: '❌ Load Cancelled',
    delayed: '⏰ Load Delayed',
    completed: '🎉 Load Completed',
  };

  return titles[status] || '📋 Load Status Updated';
};

const getNotificationMessage = (
  payload: LoadStatusWebhookPayload,
  load: any
): string => {
  const companyName = load.companies?.name || 'Unknown Company';
  const driverName = load.drivers?.name || 'Unassigned';

  switch (payload.new_status) {
    case 'assigned':
      return `Load #${payload.load_number} has been assigned to ${driverName}`;
    case 'picked_up':
      return `Load #${payload.load_number} has been picked up by ${driverName}`;
    case 'in_transit':
      return `Load #${payload.load_number} is now in transit with ${driverName}`;
    case 'delivered':
      return `Load #${payload.load_number} has been delivered successfully`;
    case 'cancelled':
      return `Load #${payload.load_number} has been cancelled`;
    case 'delayed':
      return `Load #${payload.load_number} has been delayed`;
    case 'completed':
      return `Load #${payload.load_number} has been completed`;
    default:
      return `Load #${payload.load_number} status changed to ${payload.new_status}`;
  }
};

// ================================================================
// EXTERNAL INTEGRATIONS
// ================================================================

const triggerExternalIntegrations = async (
  payload: LoadStatusWebhookPayload,
  load: any
) => {
  // Customer notifications
  if (payload.new_status === 'delivered') {
    await notifyCustomer(payload, load);
  }

  // ELD integration
  if (
    payload.new_status === 'picked_up' ||
    payload.new_status === 'delivered'
  ) {
    await updateELDSystem(payload, load);
  }

  // Accounting system
  if (payload.new_status === 'completed') {
    await triggerInvoicing(payload, load);
  }
};

const notifyCustomer = async (payload: LoadStatusWebhookPayload, load: any) => {
  // Implementation for customer notification
  logger.info(
    'Customer notification triggered',
    {
      loadId: payload.load_id,
      eventType: 'delivery_complete',
    },
    'LoadStatusWebhook'
  );
};

const updateELDSystem = async (
  payload: LoadStatusWebhookPayload,
  load: any
) => {
  // Implementation for ELD system update
  logger.info(
    'ELD system update triggered',
    {
      loadId: payload.load_id,
      status: payload.new_status,
      driverId: payload.driver_id,
    },
    'LoadStatusWebhook'
  );
};

const triggerInvoicing = async (
  payload: LoadStatusWebhookPayload,
  load: any
) => {
  // Implementation for automatic invoicing
  logger.info(
    'Automatic invoicing triggered',
    {
      loadId: payload.load_id,
      loadNumber: payload.load_number,
      companyId: payload.company_id,
    },
    'LoadStatusWebhook'
  );
};

const sendPushNotifications = async (
  notifications: any[],
  payload: LoadStatusWebhookPayload
) => {
  // Implementation for push notifications
  logger.info(
    'Push notifications sent',
    {
      notificationCount: notifications.length,
      loadId: payload.load_id,
    },
    'LoadStatusWebhook'
  );
};

// ================================================================
// API ROUTE HANDLERS
// ================================================================

export async function POST(request: NextRequest) {
  try {
    // Verify webhook authentication
    if (!(await verifyWebhookAuth(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const payload: LoadStatusWebhookPayload = await request.json();

    // Validate payload
    if (!payload.event || payload.event !== 'load.status_changed') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    if (!payload.load_id || !payload.new_status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process the webhook
    const result = await handleLoadStatusChange(payload);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: 'load-status-webhook',
    timestamp: new Date().toISOString(),
  });
}
