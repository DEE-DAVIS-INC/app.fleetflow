/**
 * FleetFlow Email Service
 * Handles automated email notifications for invoice management
 */

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
}

export interface InvoiceEmailData {
  invoiceId: string;
  loadId: string;
  carrierName: string;
  carrierEmail: string;
  dispatchFee: number;
  loadAmount: number;
  dueDate: string;
  invoiceDate: string;
}

/**
 * Generate professional invoice email templates
 */
export const generateInvoiceEmailTemplate = (data: InvoiceEmailData): EmailTemplate => {
  const subject = `FleetFlow Dispatch Invoice ${data.invoiceId} - Load ${data.loadId}`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .invoice-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
            .amount { font-size: 24px; font-weight: bold; color: #059669; }
            .button { 
                display: inline-block; 
                background: #2563eb; 
                color: white; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚛 FleetFlow Dispatch Services</h1>
            <p>Professional Fleet Management Solutions</p>
        </div>
        
        <div class="content">
            <h2>Dear ${data.carrierName},</h2>
            
            <p>We hope this email finds you well. Please find attached your dispatch service invoice for the recently completed load.</p>
            
            <div class="invoice-details">
                <h3>Invoice Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td><strong>Invoice Number:</strong></td>
                        <td>${data.invoiceId}</td>
                    </tr>
                    <tr>
                        <td><strong>Load ID:</strong></td>
                        <td>${data.loadId}</td>
                    </tr>
                    <tr>
                        <td><strong>Invoice Date:</strong></td>
                        <td>${new Date(data.invoiceDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Due Date:</strong></td>
                        <td>${new Date(data.dueDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Load Amount:</strong></td>
                        <td>$${data.loadAmount.toLocaleString()}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; color: #64748b;">Dispatch Fee (10%)</p>
                    <div class="amount">$${data.dispatchFee.toFixed(2)}</div>
                </div>
            </div>
            
            <h3>Payment Information</h3>
            <p>Payment is due within 30 days of the invoice date. We accept the following payment methods:</p>
            <ul>
                <li><strong>ACH Transfer</strong> - Our preferred method for faster processing</li>
                <li><strong>Wire Transfer</strong> - For immediate payments</li>
                <li><strong>Check</strong> - Mail to our business address</li>
            </ul>
            
            <p>For ACH or wire transfer details, please contact our billing department.</p>
            
            <a href="mailto:billing@fleetflow.com" class="button">Contact Billing Department</a>
            
            <h3>Service Summary</h3>
            <p>This invoice covers our comprehensive dispatch services including:</p>
            <ul>
                <li>Load coordination and carrier communication</li>
                <li>Real-time tracking and status updates</li>
                <li>Route optimization and planning</li>
                <li>Documentation and compliance management</li>
                <li>24/7 dispatch support</li>
            </ul>
            
            <p>We appreciate your continued partnership and look forward to serving your transportation needs.</p>
            
            <p>Best regards,<br>
            <strong>FleetFlow Billing Department</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>FleetFlow Dispatch Services</strong><br>
            1234 Logistics Way, Suite 100<br>
            Atlanta, GA 30309<br>
            Phone: (555) 123-4567 | Email: billing@fleetflow.com<br>
            Website: www.fleetflow.com</p>
            
            <p style="margin-top: 15px;">
                <em>This email was sent automatically by our billing system. 
                For questions about this invoice, please contact our billing department.</em>
            </p>
        </div>
    </body>
    </html>
  `;

  const textBody = `
Dear ${data.carrierName},

Thank you for your continued partnership with FleetFlow Dispatch Services.

INVOICE DETAILS
Invoice Number: ${data.invoiceId}
Load ID: ${data.loadId}
Invoice Date: ${new Date(data.invoiceDate).toLocaleDateString()}
Due Date: ${new Date(data.dueDate).toLocaleDateString()}

FINANCIAL SUMMARY
Load Amount: $${data.loadAmount.toLocaleString()}
Dispatch Fee (10%): $${data.dispatchFee.toFixed(2)}

This invoice covers our comprehensive dispatch services including load coordination, carrier communication, real-time tracking, route optimization, documentation management, and 24/7 dispatch support.

PAYMENT INFORMATION
Payment is due within 30 days of the invoice date. We accept:
- ACH Transfer (preferred method)
- Wire Transfer
- Check (mail to business address below)

For payment details or questions, please contact:
billing@fleetflow.com
(555) 123-4567

Thank you for your business!

FleetFlow Dispatch Services
1234 Logistics Way, Suite 100
Atlanta, GA 30309
www.fleetflow.com

This is an automated message from our billing system.
  `;

  return { subject, htmlBody, textBody };
};

/**
 * Generate overdue notice email template
 */
export const generateOverdueNoticeTemplate = (data: InvoiceEmailData, daysPastDue: number): EmailTemplate => {
  const subject = `OVERDUE: FleetFlow Invoice ${data.invoiceId} - ${daysPastDue} Days Past Due`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .overdue-notice { background: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
            .amount { font-size: 24px; font-weight: bold; color: #dc2626; }
            .urgent { color: #dc2626; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>⚠️ OVERDUE PAYMENT NOTICE</h1>
            <p>FleetFlow Dispatch Services</p>
        </div>
        
        <div class="content">
            <h2>Dear ${data.carrierName},</h2>
            
            <div class="overdue-notice">
                <h3 class="urgent">URGENT: Payment Required</h3>
                <p>Our records indicate that invoice ${data.invoiceId} is now <strong>${daysPastDue} days past due</strong>.</p>
                
                <div style="text-align: center; margin: 20px 0;">
                    <p style="margin: 0; color: #64748b;">Outstanding Amount</p>
                    <div class="amount">$${data.dispatchFee.toFixed(2)}</div>
                    <p style="margin: 5px 0 0 0; color: #dc2626;"><strong>Due Date: ${new Date(data.dueDate).toLocaleDateString()}</strong></p>
                </div>
            </div>
            
            <p>To maintain our business relationship and avoid any service interruptions, please remit payment immediately.</p>
            
            <h3>Immediate Action Required</h3>
            <p>Please contact our billing department within 48 hours to:</p>
            <ul>
                <li>Arrange immediate payment</li>
                <li>Discuss payment plan options</li>
                <li>Resolve any billing questions</li>
            </ul>
            
            <p><strong>Contact Information:</strong><br>
            Phone: (555) 123-4567<br>
            Email: billing@fleetflow.com</p>
            
            <p>We value our partnership and want to resolve this matter promptly.</p>
            
            <p>Sincerely,<br>
            <strong>FleetFlow Accounts Receivable</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>FleetFlow Dispatch Services</strong><br>
            1234 Logistics Way, Suite 100, Atlanta, GA 30309<br>
            Phone: (555) 123-4567 | Email: billing@fleetflow.com</p>
        </div>
    </body>
    </html>
  `;

  const textBody = `
OVERDUE PAYMENT NOTICE

Dear ${data.carrierName},

URGENT: Payment Required

Our records indicate that invoice ${data.invoiceId} is now ${daysPastDue} days past due.

Invoice Details:
- Invoice Number: ${data.invoiceId}
- Load ID: ${data.loadId}
- Due Date: ${new Date(data.dueDate).toLocaleDateString()}
- Outstanding Amount: $${data.dispatchFee.toFixed(2)}

To maintain our business relationship and avoid service interruptions, please remit payment immediately.

Please contact our billing department within 48 hours:
Phone: (555) 123-4567
Email: billing@fleetflow.com

We value our partnership and want to resolve this matter promptly.

FleetFlow Accounts Receivable
FleetFlow Dispatch Services
1234 Logistics Way, Suite 100
Atlanta, GA 30309
  `;

  return { subject, htmlBody, textBody };
};

/**
 * Send automated email via the SMS/notification API
 */
export const sendInvoiceEmail = async (
  recipientEmail: string,
  template: EmailTemplate,
  attachments?: EmailAttachment[]
): Promise<boolean> => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'email',
        to: recipientEmail,
        subject: template.subject,
        message: template.textBody,
        htmlMessage: template.htmlBody,
        attachments: attachments?.map(att => att.filename) || []
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API responded with status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return false;
  }
};

/**
 * Schedule automated follow-up emails
 */
export interface FollowUpSchedule {
  invoiceId: string;
  carrierEmail: string;
  invoiceData: InvoiceEmailData;
  reminderDays: number[]; // Days after due date to send reminders
}

export const scheduleFollowUpEmails = (schedule: FollowUpSchedule): void => {
  const dueDate = new Date(schedule.invoiceData.dueDate);
  
  schedule.reminderDays.forEach(days => {
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() + days);
    
    // In a real application, this would schedule the email via a job queue
    // For now, we'll use setTimeout for demonstration
    const delay = reminderDate.getTime() - Date.now();
    
    if (delay > 0) {
      setTimeout(async () => {
        console.log(`Sending ${days}-day overdue notice for invoice ${schedule.invoiceId}`);
        
        const template = generateOverdueNoticeTemplate(schedule.invoiceData, days);
        const success = await sendInvoiceEmail(schedule.carrierEmail, template);
        
        if (success) {
          console.log(`Overdue notice sent successfully for invoice ${schedule.invoiceId}`);
        } else {
          console.error(`Failed to send overdue notice for invoice ${schedule.invoiceId}`);
        }
      }, delay);
    }
  });
};

/**
 * Utility function to check and send overdue notices
 */
export const checkAndSendOverdueNotices = async (invoices: any[]): Promise<void> => {
  const today = new Date();
  
  for (const invoice of invoices) {
    if (invoice.status === 'Sent' || invoice.status === 'Overdue') {
      const dueDate = new Date(invoice.dueDate);
      const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPastDue > 0) {
        const emailData: InvoiceEmailData = {
          invoiceId: invoice.id,
          loadId: invoice.loadId,
          carrierName: invoice.carrierName,
          carrierEmail: invoice.carrierEmail,
          dispatchFee: invoice.dispatchFee,
          loadAmount: invoice.loadAmount,
          dueDate: invoice.dueDate,
          invoiceDate: invoice.invoiceDate
        };
        
        // Send overdue notice for invoices 1, 7, 14, and 30 days past due
        if ([1, 7, 14, 30].includes(daysPastDue)) {
          const template = generateOverdueNoticeTemplate(emailData, daysPastDue);
          const success = await sendInvoiceEmail(invoice.carrierEmail, template);
          
          if (success) {
            console.log(`Overdue notice sent for invoice ${invoice.id} (${daysPastDue} days past due)`);
          }
        }
      }
    }
  }
};

export default {
  generateInvoiceEmailTemplate,
  generateOverdueNoticeTemplate,
  sendInvoiceEmail,
  scheduleFollowUpEmails,
  checkAndSendOverdueNotices
};
