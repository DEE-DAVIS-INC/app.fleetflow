'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useLoad } from '../contexts/LoadContext';

interface BOLInfo {
  bolNumber: string;
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperState: string;
  shipperZip: string;
  shipperPhone: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeZip: string;
  consigneePhone: string;
  carrierName: string;
  carrierMC: string;
  carrierDOT: string;
  trailerNumber: string;
  sealNumber: string;
  proNumber: string;
  freightChargeTerms: string;
  shipDate: string;
  deliveryDate: string;
  commodityDescription: string;
  totalWeight: string;
  totalPieces: string;
  packageType: string;
  specialInstructions: string;
  hazmat: boolean;
  prepaid: boolean;
}

export default function BillOfLading() {
  const { selectedLoad } = useLoad();
  
  const [bolInfo, setBolInfo] = useState<BOLInfo>({
    bolNumber: '',
    shipperName: '',
    shipperAddress: '',
    shipperCity: '',
    shipperState: '',
    shipperZip: '',
    shipperPhone: '',
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeState: '',
    consigneeZip: '',
    consigneePhone: '',
    carrierName: '',
    carrierMC: '',
    carrierDOT: '',
    trailerNumber: '',
    sealNumber: '',
    proNumber: '',
    freightChargeTerms: 'Prepaid',
    shipDate: '',
    deliveryDate: '',
    commodityDescription: '',
    totalWeight: '',
    totalPieces: '',
    packageType: 'Pallets',
    specialInstructions: '',
    hazmat: false,
    prepaid: true
  });

  useEffect(() => {
    if (selectedLoad) {
      setBolInfo(prev => ({
        ...prev,
        bolNumber: `BOL-${selectedLoad.id}`,
        shipperName: selectedLoad.origin || '',
        consigneeName: selectedLoad.destination || '',
        carrierName: selectedLoad.carrierName || '',
        shipDate: selectedLoad.pickupDate || '',
        deliveryDate: selectedLoad.deliveryDate || '',
        totalWeight: selectedLoad.weight || '',
        commodityDescription: selectedLoad.equipment || 'General Freight',
      }));
    }
  }, [selectedLoad]);

  const generateBillOfLading = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('BILL OF LADING', pageWidth / 2, 20, { align: 'center' });
    
    // BOL Number and Date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`BOL Number: ${bolInfo.bolNumber}`, 20, 40);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    pdf.text(`PRO Number: ${bolInfo.proNumber}`, 120, 40);
    pdf.text(`Ship Date: ${bolInfo.shipDate}`, 120, 50);
    
    // Shipper Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('SHIPPER INFORMATION', 20, 80);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${bolInfo.shipperName}`, 20, 90);
    pdf.text(`Address: ${bolInfo.shipperAddress}`, 20, 100);
    pdf.text(`City: ${bolInfo.shipperCity}, ${bolInfo.shipperState} ${bolInfo.shipperZip}`, 20, 110);
    pdf.text(`Phone: ${bolInfo.shipperPhone}`, 20, 120);
    
    // Consignee Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONSIGNEE INFORMATION', 120, 80);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${bolInfo.consigneeName}`, 120, 90);
    pdf.text(`Address: ${bolInfo.consigneeAddress}`, 120, 100);
    pdf.text(`City: ${bolInfo.consigneeCity}, ${bolInfo.consigneeState} ${bolInfo.consigneeZip}`, 120, 110);
    pdf.text(`Phone: ${bolInfo.consigneePhone}`, 120, 120);
    
    // Carrier Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARRIER INFORMATION', 20, 150);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Carrier: ${bolInfo.carrierName}`, 20, 160);
    pdf.text(`MC: ${bolInfo.carrierMC}`, 20, 170);
    pdf.text(`DOT: ${bolInfo.carrierDOT}`, 20, 180);
    pdf.text(`Trailer: ${bolInfo.trailerNumber}`, 120, 160);
    pdf.text(`Seal: ${bolInfo.sealNumber}`, 120, 170);
    
    // Commodity Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMMODITY INFORMATION', 20, 210);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Description: ${bolInfo.commodityDescription}`, 20, 220);
    pdf.text(`Weight: ${bolInfo.totalWeight}`, 20, 230);
    pdf.text(`Pieces: ${bolInfo.totalPieces}`, 20, 240);
    pdf.text(`Package Type: ${bolInfo.packageType}`, 120, 220);
    pdf.text(`Hazmat: ${bolInfo.hazmat ? 'Yes' : 'No'}`, 120, 230);
    
    // Special Instructions
    if (bolInfo.specialInstructions) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('SPECIAL INSTRUCTIONS', 20, 270);
      pdf.setFont('helvetica', 'normal');
      const instructions = pdf.splitTextToSize(bolInfo.specialInstructions, 170);
      pdf.text(instructions, 20, 280);
    }
    
    // Save the PDF
    pdf.save(`Bill_of_Lading_${bolInfo.bolNumber || 'Draft'}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Bill of Lading Generator</h2>
            <p className="text-gray-600 text-lg">Create professional bills of lading for freight shipments</p>
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

      {/* BOL Header Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="section-card">
          <div className="section-header">
            <div className="section-icon bg-gradient-to-r from-blue-500 to-cyan-500">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m3 0v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4h16z" />
              </svg>
            </div>
            <h3 className="section-title">📋 BOL Information</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">BOL Number</label>
                <input
                  type="text"
                  placeholder="BOL-001234"
                  value={bolInfo.bolNumber}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, bolNumber: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">PRO Number</label>
                <input
                  type="text"
                  placeholder="PRO-567890"
                  value={bolInfo.proNumber}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, proNumber: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Ship Date</label>
                <input
                  type="date"
                  value={bolInfo.shipDate}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, shipDate: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Date</label>
                <input
                  type="date"
                  value={bolInfo.deliveryDate}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, deliveryDate: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <div className="section-icon bg-gradient-to-r from-purple-500 to-pink-500">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <h3 className="section-title">🚛 Carrier Details</h3>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Carrier Name</label>
              <input
                type="text"
                placeholder="Enter carrier company name"
                value={bolInfo.carrierName}
                onChange={(e) => setBolInfo(prev => ({ ...prev, carrierName: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">MC Number</label>
                <input
                  type="text"
                  placeholder="MC-123456"
                  value={bolInfo.carrierMC}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, carrierMC: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">DOT Number</label>
                <input
                  type="text"
                  placeholder="DOT-789012"
                  value={bolInfo.carrierDOT}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, carrierDOT: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Trailer Number</label>
                <input
                  type="text"
                  placeholder="TRL-001"
                  value={bolInfo.trailerNumber}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, trailerNumber: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Seal Number</label>
                <input
                  type="text"
                  placeholder="SEAL-001"
                  value={bolInfo.sealNumber}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, sealNumber: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipper and Consignee Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="section-card">
          <div className="section-header">
            <div className="section-icon bg-gradient-to-r from-green-500 to-emerald-500">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="section-title">📦 Shipper Information</h3>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                placeholder="Shipper company name"
                value={bolInfo.shipperName}
                onChange={(e) => setBolInfo(prev => ({ ...prev, shipperName: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                placeholder="Street address"
                value={bolInfo.shipperAddress}
                onChange={(e) => setBolInfo(prev => ({ ...prev, shipperAddress: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={bolInfo.shipperCity}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, shipperCity: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  placeholder="ST"
                  value={bolInfo.shipperState}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, shipperState: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP</label>
                <input
                  type="text"
                  placeholder="12345"
                  value={bolInfo.shipperZip}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, shipperZip: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={bolInfo.shipperPhone}
                onChange={(e) => setBolInfo(prev => ({ ...prev, shipperPhone: e.target.value }))}
                className="modern-input"
              />
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <div className="section-icon bg-gradient-to-r from-orange-500 to-red-500">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="section-title">🏢 Consignee Information</h3>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                placeholder="Consignee company name"
                value={bolInfo.consigneeName}
                onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeName: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                placeholder="Street address"
                value={bolInfo.consigneeAddress}
                onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeAddress: e.target.value }))}
                className="modern-input"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={bolInfo.consigneeCity}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeCity: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  placeholder="ST"
                  value={bolInfo.consigneeState}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeState: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">ZIP</label>
                <input
                  type="text"
                  placeholder="12345"
                  value={bolInfo.consigneeZip}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeZip: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="text"
                placeholder="(555) 123-4567"
                value={bolInfo.consigneePhone}
                onChange={(e) => setBolInfo(prev => ({ ...prev, consigneePhone: e.target.value }))}
                className="modern-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Information */}
      <div className="section-card mb-8">
        <div className="section-header">
          <div className="section-icon bg-gradient-to-r from-indigo-500 to-purple-500">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="section-title">📦 Commodity Information</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Commodity Description</label>
              <textarea
                placeholder="Describe the freight being shipped..."
                value={bolInfo.commodityDescription}
                onChange={(e) => setBolInfo(prev => ({ ...prev, commodityDescription: e.target.value }))}
                className="modern-textarea h-20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Total Weight</label>
                <input
                  type="text"
                  placeholder="45,000 lbs"
                  value={bolInfo.totalWeight}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, totalWeight: e.target.value }))}
                  className="modern-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Pieces</label>
                <input
                  type="text"
                  placeholder="26"
                  value={bolInfo.totalPieces}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, totalPieces: e.target.value }))}
                  className="modern-input"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Package Type</label>
              <select
                value={bolInfo.packageType}
                onChange={(e) => setBolInfo(prev => ({ ...prev, packageType: e.target.value }))}
                className="modern-select"
              >
                <option value="Pallets">Pallets</option>
                <option value="Cartons">Cartons</option>
                <option value="Crates">Crates</option>
                <option value="Drums">Drums</option>
                <option value="Bags">Bags</option>
                <option value="Loose">Loose</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Freight Terms</label>
                <select
                  value={bolInfo.freightChargeTerms}
                  onChange={(e) => setBolInfo(prev => ({ ...prev, freightChargeTerms: e.target.value }))}
                  className="modern-select"
                >
                  <option value="Prepaid">Prepaid</option>
                  <option value="Collect">Collect</option>
                  <option value="Third Party">Third Party</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={bolInfo.hazmat}
                    onChange={(e) => setBolInfo(prev => ({ ...prev, hazmat: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span>Hazardous Materials</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="section-card mb-8">
        <div className="section-header">
          <div className="section-icon bg-gradient-to-r from-amber-500 to-orange-500">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="section-title">📝 Special Instructions</h3>
        </div>
        <div className="form-group">
          <textarea
            placeholder="Enter any special handling instructions, delivery requirements, or additional notes..."
            value={bolInfo.specialInstructions}
            onChange={(e) => setBolInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
            className="modern-textarea h-24"
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateBillOfLading}
          className="modern-button flex items-center space-x-3 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Generate Bill of Lading PDF</span>
        </button>
      </div>
    </div>
  );
}
