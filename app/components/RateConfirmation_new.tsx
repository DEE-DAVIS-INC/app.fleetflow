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
  rate: number;
  totalRate: number;
  paymentTerms: string;
  specialInstructions: string;
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
    rate: 0,
    totalRate: 0,
    paymentTerms: 'Net 30',
    specialInstructions: ''
  });

  useEffect(() => {
    if (selectedLoad) {
      setLoadInfo(prev => ({
        ...prev,
        loadId: selectedLoad.id,
        carrierName: selectedLoad.carrierName || '',
        driverName: selectedLoad.driverName || '',
        rate: typeof selectedLoad.rate === 'string' ? parseFloat(selectedLoad.rate.replace(/[$,]/g, '')) || 0 : selectedLoad.rate,
        totalRate: typeof selectedLoad.rate === 'string' ? parseFloat(selectedLoad.rate.replace(/[$,]/g, '')) || 0 : selectedLoad.rate,
      }));
    }
  }, [selectedLoad]);

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
    pdf.text('FleetFlow Logistics', 20, 40);
    pdf.text('MC: MC-123456', 20, 50);
    
    // Load Details
    pdf.setFont('helvetica', 'bold');
    pdf.text('LOAD INFORMATION', 20, 80);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Load ID: ${loadInfo.loadId}`, 20, 90);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 100);
    
    // Carrier Info
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARRIER INFORMATION', 20, 120);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Carrier: ${loadInfo.carrierName}`, 20, 130);
    pdf.text(`MC: ${loadInfo.carrierMC}`, 20, 140);
    pdf.text(`DOT: ${loadInfo.carrierDOT}`, 20, 150);
    pdf.text(`Driver: ${loadInfo.driverName}`, 20, 160);
    pdf.text(`Phone: ${loadInfo.driverPhone}`, 20, 170);
    
    // Rate Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('RATE INFORMATION', 20, 190);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Rate: $${loadInfo.totalRate.toFixed(2)}`, 20, 200);
    pdf.text(`Payment Terms: ${loadInfo.paymentTerms}`, 20, 210);
    
    // Special Instructions
    if (loadInfo.specialInstructions) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('SPECIAL INSTRUCTIONS', 20, 230);
      pdf.setFont('helvetica', 'normal');
      const instructions = pdf.splitTextToSize(loadInfo.specialInstructions, 170);
      pdf.text(instructions, 20, 240);
    }
    
    // Save the PDF
    pdf.save(`Rate_Confirmation_${loadInfo.loadId || 'Draft'}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
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
                  Information from Load #{selectedLoad.id} ({selectedLoad.origin} → {selectedLoad.destination}) has been automatically filled.
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

      {/* Rate Information */}
      <div className="section-card mt-8">
        <div className="section-header">
          <div className="section-icon bg-gradient-to-r from-green-500 to-emerald-500">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="section-title">💰 Rate Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="form-label">Base Rate</label>
            <input
              type="number"
              placeholder="0.00"
              value={loadInfo.rate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value) || 0;
                setLoadInfo(prev => ({ ...prev, rate, totalRate: rate }));
              }}
              className="modern-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Payment Terms</label>
            <select
              value={loadInfo.paymentTerms}
              onChange={(e) => setLoadInfo(prev => ({ ...prev, paymentTerms: e.target.value }))}
              className="modern-select"
            >
              <option value="Net 30">Net 30 Days</option>
              <option value="Net 15">Net 15 Days</option>
              <option value="Quick Pay">Quick Pay</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
          <div className="total-display">
            <div className="text-center">
              <div className="text-sm text-green-700 font-medium">Total Amount</div>
              <div className="total-amount">${loadInfo.totalRate.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="section-card mt-8">
        <div className="section-header">
          <div className="section-icon bg-gradient-to-r from-orange-500 to-red-500">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="section-title">📝 Special Instructions</h3>
        </div>
        <div className="form-group">
          <textarea
            placeholder="Enter any special instructions, requirements, or additional terms..."
            value={loadInfo.specialInstructions}
            onChange={(e) => setLoadInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
            className="modern-textarea h-24"
          />
        </div>
      </div>

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
