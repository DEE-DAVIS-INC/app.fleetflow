'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useLoad } from '../contexts/LoadContext';

interface LoadInfo {
  loadId: string;
  carrierName: string;
  carrierMC: string;
  carrierDOT: string;
  driverName: string;
  driverPhone: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  pickupContact: string;
  pickupPhone: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryLocation: string;
  deliveryContact: string;
  deliveryPhone: string;
  commodity: string;
  weight: string;
  pieces: string;
  equipment: string;
  rate: number;
  fuelSurcharge: number;
  additionalCharges: number;
  totalRate: number;
  paymentTerms: string;
  specialInstructions: string;
  brokerName: string;
  brokerMC: string;
  brokerContact: string;
  brokerPhone: string;
  brokerEmail: string;
}

export default function RateConfirmation() {
  const { selectedLoad } = useLoad();
  
  const [loadInfo, setLoadInfo] = useState<LoadInfo>({
    loadId: '',
    carrierName: '',
    carrierMC: '',
    carrierDOT: '',
    driverName: '',
    driverPhone: '',
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    pickupContact: '',
    pickupPhone: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    deliveryContact: '',
    deliveryPhone: '',
    commodity: '',
    weight: '',
    pieces: '',
    equipment: '',
    rate: 0,
    fuelSurcharge: 0,
    additionalCharges: 0,
    totalRate: 0,
    paymentTerms: 'Net 30',
    specialInstructions: '',
    brokerName: 'FleetFlow Logistics',
    brokerMC: 'MC-123456',
    brokerContact: 'Operations Manager',
    brokerPhone: '(555) 123-4567',
    brokerEmail: 'dispatch@fleetflow.com'
  });

  // Auto-populate from selected load
  useEffect(() => {
    if (selectedLoad) {
      setLoadInfo(prev => ({
        ...prev,
        loadId: selectedLoad.id,
        carrierName: selectedLoad.carrierName || '',
        carrierMC: selectedLoad.carrierMC || '',
        carrierDOT: selectedLoad.carrierDOT || '',
        driverName: selectedLoad.driverName || '',
        driverPhone: selectedLoad.driverPhone || '',
        pickupDate: selectedLoad.pickupDate,
        pickupTime: selectedLoad.pickupTime || '',
        pickupLocation: selectedLoad.origin,
        pickupContact: selectedLoad.shipperContact || '',
        pickupPhone: selectedLoad.shipperPhone || '',
        deliveryDate: selectedLoad.deliveryDate,
        deliveryTime: selectedLoad.deliveryTime || '',
        deliveryLocation: selectedLoad.destination,
        deliveryContact: selectedLoad.consigneeContact || '',
        deliveryPhone: selectedLoad.consigneePhone || '',
        commodity: selectedLoad.commodity || '',
        weight: selectedLoad.weight.toString(),
        pieces: selectedLoad.pieces || '',
        equipment: selectedLoad.equipment,
        rate: typeof selectedLoad.rate === 'string' ? parseFloat(selectedLoad.rate.replace(/[$,]/g, '')) || 0 : selectedLoad.rate,
        fuelSurcharge: selectedLoad.fuelSurcharge || 0,
        additionalCharges: selectedLoad.additionalCharges || 0,
        totalRate: selectedLoad.totalRate || 0,
        paymentTerms: selectedLoad.paymentTerms || 'Net 30',
        specialInstructions: selectedLoad.specialInstructions || '',
        brokerName: selectedLoad.brokerAgentCompany || selectedLoad.broker || 'FleetFlow Logistics',
        brokerMC: selectedLoad.brokerAgentMC || 'MC-123456',
        brokerContact: selectedLoad.brokerAgentName || 'Operations Manager',
        brokerPhone: selectedLoad.brokerAgentPhone || '(555) 123-4567',
        brokerEmail: selectedLoad.brokerAgentEmail || 'dispatch@fleetflow.com'
      }));
    }
  }, [selectedLoad]);

  const calculateTotal = () => {
    const total = loadInfo.rate + loadInfo.fuelSurcharge + loadInfo.additionalCharges;
    setLoadInfo(prev => ({ ...prev, totalRate: total }));
  };

  const generateRateConfirmation = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RATE CONFIRMATION', pageWidth / 2, 20, { align: 'center' });
    
    // Company Info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${loadInfo.brokerName}`, 20, 40);
    pdf.text(`MC: ${loadInfo.brokerMC}`, 20, 50);
    pdf.text(`Contact: ${loadInfo.brokerContact}`, 20, 60);
    pdf.text(`Phone: ${loadInfo.brokerPhone}`, 20, 70);
    pdf.text(`Email: ${loadInfo.brokerEmail}`, 20, 80);
    
    // Load Details
    pdf.setFont('helvetica', 'bold');
    pdf.text('LOAD INFORMATION', 20, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Load ID: ${loadInfo.loadId}`, 20, 110);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 120);
    
    // Carrier Info
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARRIER INFORMATION', 20, 140);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Carrier: ${loadInfo.carrierName}`, 20, 150);
    pdf.text(`MC: ${loadInfo.carrierMC}`, 20, 160);
    pdf.text(`DOT: ${loadInfo.carrierDOT}`, 20, 170);
    pdf.text(`Driver: ${loadInfo.driverName}`, 20, 180);
    pdf.text(`Driver Phone: ${loadInfo.driverPhone}`, 20, 190);
    
    // Pickup Info
    pdf.setFont('helvetica', 'bold');
    pdf.text('PICKUP INFORMATION', 20, 210);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${loadInfo.pickupDate} at ${loadInfo.pickupTime}`, 20, 220);
    pdf.text(`Location: ${loadInfo.pickupLocation}`, 20, 230);
    pdf.text(`Contact: ${loadInfo.pickupContact}`, 20, 240);
    pdf.text(`Phone: ${loadInfo.pickupPhone}`, 20, 250);
    
    // Add new page for delivery and rates
    pdf.addPage();
    
    // Delivery Info
    pdf.setFont('helvetica', 'bold');
    pdf.text('DELIVERY INFORMATION', 20, 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Date: ${loadInfo.deliveryDate} at ${loadInfo.deliveryTime}`, 20, 30);
    pdf.text(`Location: ${loadInfo.deliveryLocation}`, 20, 40);
    pdf.text(`Contact: ${loadInfo.deliveryContact}`, 20, 50);
    pdf.text(`Phone: ${loadInfo.deliveryPhone}`, 20, 60);
    
    // Commodity Info
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMMODITY INFORMATION', 20, 80);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Description: ${loadInfo.commodity}`, 20, 90);
    pdf.text(`Weight: ${loadInfo.weight}`, 20, 100);
    pdf.text(`Pieces: ${loadInfo.pieces}`, 20, 110);
    pdf.text(`Equipment: ${loadInfo.equipment}`, 20, 120);
    
    // Rate Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('RATE INFORMATION', 20, 140);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Base Rate: $${loadInfo.rate.toFixed(2)}`, 20, 150);
    pdf.text(`Fuel Surcharge: $${loadInfo.fuelSurcharge.toFixed(2)}`, 20, 160);
    pdf.text(`Additional Charges: $${loadInfo.additionalCharges.toFixed(2)}`, 20, 170);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL RATE: $${loadInfo.totalRate.toFixed(2)}`, 20, 180);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Payment Terms: ${loadInfo.paymentTerms}`, 20, 190);
    
    // Special Instructions
    if (loadInfo.specialInstructions) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('SPECIAL INSTRUCTIONS', 20, 210);
      pdf.setFont('helvetica', 'normal');
      const instructions = pdf.splitTextToSize(loadInfo.specialInstructions, 170);
      pdf.text(instructions, 20, 220);
    }
    
    // Terms and Conditions
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.text('TERMS AND CONDITIONS', 20, 20);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const terms = [
      '1. BINDING AGREEMENT: This rate confirmation constitutes a binding contract between FleetFlow Logistics (Broker) and Carrier for transportation services as specified herein.',
      '',
      '2. CARRIER OBLIGATIONS: Carrier agrees to provide safe, legal, and timely transportation of the described freight using properly licensed, insured, and maintained equipment. Carrier shall comply with all applicable federal, state, and local laws and regulations.',
      '',
      '3. INSURANCE REQUIREMENTS: Carrier must maintain minimum insurance coverage: $1,000,000 general liability, $1,000,000 auto liability, and $100,000 cargo insurance. Certificates of insurance must be on file with Broker.',
      '',
      '4. PAYMENT TERMS: Payment shall be made according to the terms specified. All invoices must include proper documentation including signed delivery receipt, rate confirmation, and any required accessorial documentation.',
      '',
      '5. CARGO RESPONSIBILITY: Carrier assumes full responsibility for freight from pickup to delivery. Carrier shall inspect freight at pickup and note any discrepancies on the bill of lading. Failure to note exceptions constitutes acceptance of freight in good condition.',
      '',
      '6. DELIVERY REQUIREMENTS: Time is of the essence. Carrier must deliver freight within the specified timeframe. Any delays must be immediately communicated to Broker. Failure to deliver on time may result in rate reduction or claim charges.',
      '',
      '7. CLAIMS: All cargo claims must be filed in writing within 9 months of delivery. Carrier liability is limited to the actual value of damaged/lost freight, not to exceed $100,000 per occurrence unless higher coverage is specifically purchased.',
      '',
      '8. FORCE MAJEURE: Neither party shall be liable for delays or failures due to acts of God, government actions, natural disasters, or other circumstances beyond reasonable control.',
      '',
      '9. MODIFICATION: This agreement may only be modified in writing, signed by both parties. No oral modifications are valid.',
      '',
      '10. GOVERNING LAW: This agreement shall be governed by the laws of the state where Broker is domiciled. Any disputes shall be resolved through binding arbitration.',
      '',
      '11. BROKER AUTHORITY: Broker represents that it is properly licensed and bonded as required by federal transportation regulations.',
      '',
      '12. INDEMNIFICATION: Carrier agrees to indemnify and hold harmless Broker from any claims, damages, or expenses arising from Carrier\'s performance under this agreement.',
      '',
      'NOTICE: This is a legal contract. Both parties should review all terms carefully before signing.'
    ];
    
    let yPosition = 30;
    terms.forEach(term => {
      if (term === '') {
        yPosition += 5;
        return;
      }
      
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      const splitTerm = pdf.splitTextToSize(term, 170);
      pdf.text(splitTerm, 20, yPosition);
      yPosition += splitTerm.length * 3.5 + 3;
    });
    
    // Signatures
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIGNATURES', 20, yPosition + 20);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Broker Signature: _________________________ Date: _________', 20, yPosition + 40);
    pdf.text('Carrier Signature: _________________________ Date: _________', 20, yPosition + 60);
    
    // Save the PDF
    pdf.save(`Rate_Confirmation_${loadInfo.loadId || 'Draft'}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-2xl border border-blue-100">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Rate Confirmation Generator</h2>
            <p className="text-gray-600 text-lg">Create professional rate confirmations with ironclad terms</p>
          </div>
        </div>
        
        {/* Load Selection Indicator */}
        {selectedLoad && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-green-800 font-bold text-lg">✅ Load Data Auto-Populated</span>
                <p className="text-green-700 text-sm mt-1">
                  Information from Load #{selectedLoad.id} ({selectedLoad.origin} → {selectedLoad.destination}) has been automatically filled. You can modify any details as needed.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {!selectedLoad && (
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-amber-800 font-bold text-lg">📝 Manual Entry Mode</span>
                <p className="text-amber-700 text-sm mt-1">
                  No load selected. Enter information manually or select a load from Dispatch Central first.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Load Information */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-icon bg-gradient-to-r from-blue-500 to-cyan-500">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="section-title">📋 Load Information</h3>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Load ID</label>
              <input
                type="text"
                placeholder="Enter unique load identifier"
                value={loadInfo.loadId}
                onChange={(e) => setLoadInfo(prev => ({ ...prev, loadId: e.target.value }))}
                className="modern-input"
              />
            </div>
          </div>
        </div>

        {/* Carrier Information */}
        <div className="section-card">
          <div className="section-header">
            <div className="section-icon bg-gradient-to-r from-purple-500 to-pink-500">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <h3 className="section-title">🚛 Carrier Information</h3>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Carrier Name</label>
              <input
                type="text"
                placeholder="Enter carrier company name"
                value={loadInfo.carrierName}
                onChange={(e) => setLoadInfo(prev => ({ ...prev, carrierName: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">MC Number</label>
                <input
                  type="text"
                  placeholder="MC-123456"
                  value={loadInfo.carrierMC}
                  onChange={(e) => setLoadInfo(prev => ({ ...prev, carrierMC: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">DOT Number</label>
                <input
                  type="text"
                  placeholder="DOT-789012"
                  value={loadInfo.carrierDOT}
                  onChange={(e) => setLoadInfo(prev => ({ ...prev, carrierDOT: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Driver Name</label>
              <input
                type="text"
                placeholder="Enter driver's full name"
                value={loadInfo.driverName}
                onChange={(e) => setLoadInfo(prev => ({ ...prev, driverName: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Driver Phone</label>
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={loadInfo.driverPhone}
                onChange={(e) => setLoadInfo(prev => ({ ...prev, driverPhone: e.target.value }))}
                className="modern-input"
              />
            </div>
          </div>
        </div>
      </div>

        {/* Pickup and Delivery */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Pickup Information</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={loadInfo.pickupDate}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, pickupDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="time"
              value={loadInfo.pickupTime}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, pickupTime: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <textarea
            placeholder="Pickup Location"
            value={loadInfo.pickupLocation}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, pickupLocation: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded h-20"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Pickup Contact"
              value={loadInfo.pickupContact}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, pickupContact: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Pickup Phone"
              value={loadInfo.pickupPhone}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, pickupPhone: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-6">Delivery Information</h3>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={loadInfo.deliveryDate}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, deliveryDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="time"
              value={loadInfo.deliveryTime}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, deliveryTime: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <textarea
            placeholder="Delivery Location"
            value={loadInfo.deliveryLocation}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, deliveryLocation: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded h-20"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Delivery Contact"
              value={loadInfo.deliveryContact}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, deliveryContact: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Delivery Phone"
              value={loadInfo.deliveryPhone}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, deliveryPhone: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Commodity and Rate Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Commodity Information</h3>
          <textarea
            placeholder="Commodity Description"
            value={loadInfo.commodity}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, commodity: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded h-20"
          />
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Weight"
              value={loadInfo.weight}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Pieces"
              value={loadInfo.pieces}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, pieces: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Equipment"
              value={loadInfo.equipment}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, equipment: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Rate Information</h3>
          <input
            type="number"
            placeholder="Base Rate"
            value={loadInfo.rate}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
            onBlur={calculateTotal}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Fuel Surcharge"
            value={loadInfo.fuelSurcharge}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, fuelSurcharge: parseFloat(e.target.value) || 0 }))}
            onBlur={calculateTotal}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Additional Charges"
            value={loadInfo.additionalCharges}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, additionalCharges: parseFloat(e.target.value) || 0 }))}
            onBlur={calculateTotal}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="p-3 bg-green-100 rounded border">
            <strong>Total Rate: ${loadInfo.totalRate.toFixed(2)}</strong>
          </div>
          <select
            value={loadInfo.paymentTerms}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, paymentTerms: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Net 30">Net 30</option>
            <option value="Net 15">Net 15</option>
            <option value="Quick Pay">Quick Pay</option>
            <option value="COD">COD</option>
          </select>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Instructions</h3>
        <textarea
          placeholder="Enter any special instructions or requirements..."
          value={loadInfo.specialInstructions}
          onChange={(e) => setLoadInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded h-24"
        />
      </div>

      {/* Generate Button */}
      {/* Generate Button */}
      <div className="mt-8 text-center">
        <button
          onClick={generateRateConfirmation}
          className="modern-button flex items-center space-x-3 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Generate Rate Confirmation PDF</span>
        </button>
      </div>
    </div>
  );
}
