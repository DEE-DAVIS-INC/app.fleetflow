'use client';

import React, { forwardRef, useState } from 'react';
import { jsPDF } from 'jspdf';

interface InvoiceData {
  id: string;
  loadId: string;
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails?: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight?: string;
    miles?: number;
  };
  paymentTerms?: string;
  notes?: string;
}

interface DispatchInvoiceProps {
  invoice: InvoiceData;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

const DispatchInvoice = forwardRef<HTMLDivElement, DispatchInvoiceProps>(
  ({ invoice, companyInfo }, ref) => {
    const defaultCompanyInfo = {
      name: 'FleetFlow Dispatch Services',
      address: '1234 Logistics Way, Suite 100\nAtlanta, GA 30309',
      phone: '(555) 123-4567',
      email: 'billing@fleetflow.com',
      website: 'www.fleetflow.com',
      logo: '🚛'
    };

    const company = companyInfo || defaultCompanyInfo;

    return (
      <div ref={ref} className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{company.logo}</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <div className="text-sm text-gray-600 whitespace-pre-line">{company.address}</div>
              <div className="text-sm text-gray-600">
                Phone: {company.phone} | Email: {company.email}
              </div>
              {company.website && (
                <div className="text-sm text-gray-600">Website: {company.website}</div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
              <h2 className="text-lg font-bold">DISPATCH INVOICE</h2>
            </div>
            <div className="text-sm text-gray-600">
              <div><strong>Invoice #:</strong> {invoice.id}</div>
              <div><strong>Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                  invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold text-lg">{invoice.carrierName}</div>
              {invoice.carrierAddress && (
                <div className="text-gray-600 mt-1 whitespace-pre-line">{invoice.carrierAddress}</div>
              )}
              {invoice.carrierEmail && (
                <div className="text-gray-600 mt-1">Email: {invoice.carrierEmail}</div>
              )}
              {invoice.carrierPhone && (
                <div className="text-gray-600">Phone: {invoice.carrierPhone}</div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Load Information:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div><strong>Load ID:</strong> {invoice.loadId}</div>
              {invoice.loadDetails && (
                <>
                  <div className="mt-2">
                    <strong>Route:</strong> {invoice.loadDetails.origin} → {invoice.loadDetails.destination}
                  </div>
                  <div><strong>Pickup:</strong> {invoice.loadDetails.pickupDate}</div>
                  <div><strong>Delivery:</strong> {invoice.loadDetails.deliveryDate}</div>
                  <div><strong>Equipment:</strong> {invoice.loadDetails.equipment}</div>
                  {invoice.loadDetails.weight && (
                    <div><strong>Weight:</strong> {invoice.loadDetails.weight}</div>
                  )}
                  {invoice.loadDetails.miles && (
                    <div><strong>Miles:</strong> {invoice.loadDetails.miles} miles</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Load Amount</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Fee %</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Dispatch Fee</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    <div className="font-medium">Dispatch Services</div>
                    <div className="text-sm text-gray-600">
                      Load coordination, carrier communication, and dispatch management
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    ${invoice.loadAmount.toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right">
                    {invoice.feePercentage}%
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold text-lg">
                    ${invoice.dispatchFee.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>${invoice.dispatchFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span className="font-bold text-lg">Total Due:</span>
                <span className="font-bold text-lg text-blue-600">
                  ${invoice.dispatchFee.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms:</h3>
            <div className="text-sm text-gray-600">
              {invoice.paymentTerms || 'Net 30 days from invoice date'}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Methods:</h3>
            <div className="text-sm text-gray-600">
              <div>• ACH Transfer</div>
              <div>• Wire Transfer</div>
              <div>• Check (Mail to address above)</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
            <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-700">
              {invoice.notes}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 text-center text-sm text-gray-500">
          <div>Thank you for your business!</div>
          <div className="mt-2">
            For questions about this invoice, please contact us at {company.phone} or {company.email}
          </div>
        </div>
      </div>
    );
  }
);

DispatchInvoice.displayName = 'DispatchInvoice';

// PDF Generation Helper
export const generateInvoicePDF = async (invoice: InvoiceData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FleetFlow Dispatch Services', 20, 25);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('1234 Logistics Way, Suite 100', 20, 35);
  pdf.text('Atlanta, GA 30309', 20, 42);
  pdf.text('Phone: (555) 123-4567 | Email: billing@fleetflow.com', 20, 49);
  
  // Invoice Info
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DISPATCH INVOICE', pageWidth - 60, 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice #: ${invoice.id}`, pageWidth - 60, 35);
  pdf.text(`Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`, pageWidth - 60, 42);
  pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, pageWidth - 60, 49);
  
  // Bill To
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', 20, 70);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(invoice.carrierName, 20, 80);
  if (invoice.carrierAddress) {
    const addressLines = invoice.carrierAddress.split('\n');
    addressLines.forEach((line, index) => {
      pdf.text(line, 20, 87 + (index * 7));
    });
  }
  
  // Load Info
  pdf.setFont('helvetica', 'bold');
  pdf.text('Load Information:', 120, 70);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Load ID: ${invoice.loadId}`, 120, 80);
  if (invoice.loadDetails) {
    pdf.text(`Route: ${invoice.loadDetails.origin} → ${invoice.loadDetails.destination}`, 120, 87);
    pdf.text(`Equipment: ${invoice.loadDetails.equipment}`, 120, 94);
  }
  
  // Service Table
  const tableStartY = 120;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', 20, tableStartY);
  pdf.text('Load Amount', 100, tableStartY);
  pdf.text('Fee %', 140, tableStartY);
  pdf.text('Dispatch Fee', 170, tableStartY);
  
  // Table line
  pdf.line(20, tableStartY + 3, pageWidth - 20, tableStartY + 3);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Dispatch Services', 20, tableStartY + 15);
  pdf.text(`$${invoice.loadAmount.toLocaleString()}`, 100, tableStartY + 15);
  pdf.text(`${invoice.feePercentage}%`, 140, tableStartY + 15);
  pdf.text(`$${invoice.dispatchFee.toFixed(2)}`, 170, tableStartY + 15);
  
  // Total
  pdf.line(140, tableStartY + 25, pageWidth - 20, tableStartY + 25);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Due:', 140, tableStartY + 35);
  pdf.text(`$${invoice.dispatchFee.toFixed(2)}`, 170, tableStartY + 35);
  
  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Payment Terms: Net 30 days from invoice date', 20, pageHeight - 30);
  pdf.text('Thank you for your business!', 20, pageHeight - 20);
  
  return pdf;
};

export default DispatchInvoice;
export type { InvoiceData };
