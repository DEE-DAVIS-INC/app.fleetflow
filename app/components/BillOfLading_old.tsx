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
  billToName: string;
  billToAddress: string;
  billToCity: string;
  billToState: string;
  billToZip: string;
  carrierName: string;
  carrierMC: string;
  carrierDOT: string;
  trailerNumber: string;
  sealNumber: string;
  proNumber: string;
  freightChargeTerms: string;
  shipDate: string;
  deliveryDate: string;
  commodities: Array<{
    description: string;
    weight: string;
    pieces: string;
    packageType: string;
    hazmat: boolean;
    hazmatClass: string;
    value: string;
  }>;
  totalWeight: string;
  totalPieces: string;
  totalValue: string;
  specialInstructions: string;
  cod: boolean;
  codAmount: string;
  prepaid: boolean;
  collect: boolean;
  thirdParty: boolean;
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
    billToName: '',
    billToAddress: '',
    billToCity: '',
    billToState: '',
    billToZip: '',
    carrierName: '',
    carrierMC: '',
    carrierDOT: '',
    trailerNumber: '',
    sealNumber: '',
    proNumber: '',
    freightChargeTerms: 'Prepaid',
    shipDate: '',
    deliveryDate: '',
    commodities: [{
      description: '',
      weight: '',
      pieces: '',
      packageType: 'Pallets',
      hazmat: false,
      hazmatClass: '',
      value: ''
    }],
    totalWeight: '',
    totalPieces: '',
    totalValue: '',
    specialInstructions: '',
    cod: false,
    codAmount: '',
    prepaid: true,
    collect: false,
    thirdParty: false
  });

  // Auto-populate from selected load
  useEffect(() => {
    if (selectedLoad) {
      setBolInfo(prev => ({
        ...prev,
        bolNumber: selectedLoad.bolNumber || '',
        shipperName: selectedLoad.shipperName || '',
        shipperAddress: selectedLoad.shipperAddress || '',
        shipperCity: selectedLoad.shipperCity || '',
        shipperState: selectedLoad.shipperState || '',
        shipperZip: selectedLoad.shipperZip || '',
        shipperPhone: selectedLoad.shipperPhone || '',
        consigneeName: selectedLoad.consigneeName || '',
        consigneeAddress: selectedLoad.consigneeAddress || '',
        consigneeCity: selectedLoad.consigneeCity || '',
        consigneeState: selectedLoad.consigneeState || '',
        consigneeZip: selectedLoad.consigneeZip || '',
        consigneePhone: selectedLoad.consigneePhone || '',
        // Populate "Bill To" section with broker agent information
        billToName: selectedLoad.brokerAgentCompany || selectedLoad.broker || 'FleetFlow Logistics',
        billToAddress: selectedLoad.brokerAgentName ? `c/o ${selectedLoad.brokerAgentName}` : '',
        billToCity: '',
        billToState: '',
        billToZip: '',
        carrierName: selectedLoad.carrierName || '',
        carrierMC: selectedLoad.carrierMC || '',
        carrierDOT: selectedLoad.carrierDOT || '',
        trailerNumber: selectedLoad.trailerNumber || '',
        sealNumber: selectedLoad.sealNumber || '',
        proNumber: selectedLoad.proNumber || selectedLoad.id,
        shipDate: selectedLoad.pickupDate,
        deliveryDate: selectedLoad.deliveryDate,
        commodities: [{
          description: selectedLoad.commodity || '',
          weight: selectedLoad.weight.toString(),
          pieces: selectedLoad.pieces || '1',
          packageType: 'Pallets',
          hazmat: selectedLoad.hazmat || false,
          hazmatClass: selectedLoad.hazmatClass || '',
          value: selectedLoad.value || ''
        }],
        totalWeight: selectedLoad.weight.toString(),
        totalPieces: selectedLoad.pieces || '1',
        totalValue: selectedLoad.value || '',
        specialInstructions: selectedLoad.specialInstructions || ''
      }));
    }
  }, [selectedLoad]);

  const addCommodity = () => {
    setBolInfo(prev => ({
      ...prev,
      commodities: [
        ...prev.commodities,
        {
          description: '',
          weight: '',
          pieces: '',
          packageType: 'Pallets',
          hazmat: false,
          hazmatClass: '',
          value: ''
        }
      ]
    }));
  };

  const removeCommodity = (index: number) => {
    setBolInfo(prev => ({
      ...prev,
      commodities: prev.commodities.filter((_, i) => i !== index)
    }));
  };

  const updateCommodity = (index: number, field: string, value: any) => {
    setBolInfo(prev => ({
      ...prev,
      commodities: prev.commodities.map((commodity, i) => 
        i === index ? { ...commodity, [field]: value } : commodity
      )
    }));
  };

  const calculateTotals = () => {
    const totalWeight = bolInfo.commodities.reduce((sum, commodity) => 
      sum + (parseFloat(commodity.weight) || 0), 0
    );
    const totalPieces = bolInfo.commodities.reduce((sum, commodity) => 
      sum + (parseInt(commodity.pieces) || 0), 0
    );
    const totalValue = bolInfo.commodities.reduce((sum, commodity) => 
      sum + (parseFloat(commodity.value) || 0), 0
    );

    setBolInfo(prev => ({
      ...prev,
      totalWeight: totalWeight.toString(),
      totalPieces: totalPieces.toString(),
      totalValue: totalValue.toFixed(2)
    }));
  };

  const generateBillOfLading = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('UNIFORM STRAIGHT BILL OF LADING', pageWidth / 2, 15, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Original - Not Negotiable', pageWidth / 2, 22, { align: 'center' });
    
    // BOL Number and Date
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`BOL #: ${bolInfo.bolNumber}`, 150, 35);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 150, 45);
    pdf.text(`PRO #: ${bolInfo.proNumber}`, 150, 55);
    
    // Shipper Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('SHIPPER:', 15, 35);
    pdf.setFont('helvetica', 'normal');
    pdf.text(bolInfo.shipperName, 15, 45);
    pdf.text(bolInfo.shipperAddress, 15, 52);
    pdf.text(`${bolInfo.shipperCity}, ${bolInfo.shipperState} ${bolInfo.shipperZip}`, 15, 59);
    pdf.text(`Phone: ${bolInfo.shipperPhone}`, 15, 66);
    
    // Consignee Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONSIGNEE:', 15, 80);
    pdf.setFont('helvetica', 'normal');
    pdf.text(bolInfo.consigneeName, 15, 90);
    pdf.text(bolInfo.consigneeAddress, 15, 97);
    pdf.text(`${bolInfo.consigneeCity}, ${bolInfo.consigneeState} ${bolInfo.consigneeZip}`, 15, 104);
    pdf.text(`Phone: ${bolInfo.consigneePhone}`, 15, 111);
    
    // Bill To Information
    if (bolInfo.billToName) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO:', 110, 80);
      pdf.setFont('helvetica', 'normal');
      pdf.text(bolInfo.billToName, 110, 90);
      pdf.text(bolInfo.billToAddress, 110, 97);
      pdf.text(`${bolInfo.billToCity}, ${bolInfo.billToState} ${bolInfo.billToZip}`, 110, 104);
    }
    
    // Carrier Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARRIER:', 15, 125);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${bolInfo.carrierName} (MC: ${bolInfo.carrierMC}, DOT: ${bolInfo.carrierDOT})`, 15, 135);
    pdf.text(`Trailer: ${bolInfo.trailerNumber} | Seal: ${bolInfo.sealNumber}`, 15, 142);
    
    // Freight Terms
    pdf.setFont('helvetica', 'bold');
    pdf.text('FREIGHT CHARGES:', 110, 125);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`☐ Prepaid  ☐ Collect  ☐ 3rd Party`, 110, 135);
    if (bolInfo.cod) {
      pdf.text(`COD Amount: $${bolInfo.codAmount}`, 110, 142);
    }
    
    // Shipping Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('SHIPPING INFORMATION:', 15, 155);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Ship Date: ${bolInfo.shipDate}`, 15, 165);
    pdf.text(`Delivery Date: ${bolInfo.deliveryDate}`, 110, 165);
    
    // Commodities Table Header
    let yPos = 180;
    pdf.setFont('helvetica', 'bold');
    pdf.text('QTY', 15, yPos);
    pdf.text('TYPE', 35, yPos);
    pdf.text('DESCRIPTION', 65, yPos);
    pdf.text('WEIGHT', 130, yPos);
    pdf.text('HAZMAT', 155, yPos);
    pdf.text('VALUE', 175, yPos);
    
    // Draw line under header
    pdf.line(15, yPos + 3, 195, yPos + 3);
    yPos += 10;
    
    // Commodities
    pdf.setFont('helvetica', 'normal');
    bolInfo.commodities.forEach((commodity, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.text(commodity.pieces, 15, yPos);
      pdf.text(commodity.packageType, 35, yPos);
      
      // Handle long descriptions
      const descLines = pdf.splitTextToSize(commodity.description, 60);
      pdf.text(descLines, 65, yPos);
      
      pdf.text(commodity.weight, 130, yPos);
      pdf.text(commodity.hazmat ? `Yes (${commodity.hazmatClass})` : 'No', 155, yPos);
      pdf.text(`$${commodity.value}`, 175, yPos);
      
      yPos += Math.max(10, descLines.length * 5 + 5);
    });
    
    // Totals
    yPos += 10;
    pdf.line(15, yPos, 195, yPos);
    yPos += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL PIECES: ${bolInfo.totalPieces}`, 15, yPos);
    pdf.text(`TOTAL WEIGHT: ${bolInfo.totalWeight} lbs`, 65, yPos);
    pdf.text(`TOTAL VALUE: $${bolInfo.totalValue}`, 130, yPos);
    
    // Special Instructions
    if (bolInfo.specialInstructions) {
      yPos += 15;
      pdf.setFont('helvetica', 'bold');
      pdf.text('SPECIAL INSTRUCTIONS:', 15, yPos);
      yPos += 7;
      pdf.setFont('helvetica', 'normal');
      const instructions = pdf.splitTextToSize(bolInfo.specialInstructions, 170);
      pdf.text(instructions, 15, yPos);
      yPos += instructions.length * 5 + 10;
    }
    
    // Terms and Conditions
    if (yPos > 220) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 15;
    pdf.setFont('helvetica', 'bold');
    pdf.text('TERMS AND CONDITIONS:', 15, yPos);
    yPos += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    
    const terms = [
      'The carrier or party in possession of any of the property herein described shall be liable as at common law for any loss thereof or damage thereto, except as hereinafter provided.',
      'No carrier or party in possession of all or any of the property herein described shall be liable for any loss thereof or damage thereto or delay caused by the Act of God, the public enemy, the authority of law, or the act or default of the shipper or owner.',
      'The amount of any loss or damage for which any carrier becomes liable shall be computed on the basis of the value of the property at the place and time of shipment under this bill of lading.',
      'Claims must be filed in writing with the delivering carrier within nine months after delivery of the property, or in case of failure to make delivery, then within nine months after a reasonable time for delivery has elapsed.',
      'Suits shall be instituted against any carrier only within two years and one day from the day when notice in writing is given by the carrier that the carrier has disallowed the claim or any part or parts thereof specified in the notice.'
    ];
    
    terms.forEach(term => {
      const termLines = pdf.splitTextToSize(term, 170);
      if (yPos + termLines.length * 3 > 280) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(termLines, 15, yPos);
      yPos += termLines.length * 3 + 3;
    });
    
    // Signatures
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 15;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIGNATURES:', 15, yPos);
    yPos += 15;
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Shipper Signature: _________________________ Date: _________', 15, yPos);
    yPos += 15;
    pdf.text('Driver Signature: _________________________ Date: _________', 15, yPos);
    yPos += 15;
    pdf.text('Consignee Signature: _________________________ Date: _________', 15, yPos);
    
    // Save the PDF
    pdf.save(`Bill_of_Lading_${bolInfo.bolNumber || 'Draft'}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bill of Lading Generator</h2>
        <p className="text-gray-600">Create professional bills of lading for freight shipments</p>
        
        {/* Load Selection Indicator */}
        {selectedLoad && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">Load Data Auto-Populated</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Information from Load #{selectedLoad.id} ({selectedLoad.origin} - {selectedLoad.destination}) has been automatically filled in. You can modify any details as needed.
            </p>
          </div>
        )}
        
        {!selectedLoad && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-blue-800 font-medium">Manual Entry Mode</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              No load selected. You can manually enter all information or select a load from the Broker Box or Dispatch Central first.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BOL Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">BOL Information</h3>
          <input
            type="text"
            placeholder="BOL Number"
            value={bolInfo.bolNumber}
            onChange={(e) => setBolInfo(prev => ({ ...prev, bolNumber: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="PRO Number"
            value={bolInfo.proNumber}
            onChange={(e) => setBolInfo(prev => ({ ...prev, proNumber: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              placeholder="Ship Date"
              value={bolInfo.shipDate}
              onChange={(e) => setBolInfo(prev => ({ ...prev, shipDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              placeholder="Delivery Date"
              value={bolInfo.deliveryDate}
              onChange={(e) => setBolInfo(prev => ({ ...prev, deliveryDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Shipper Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Shipper Information</h3>
          <input
            type="text"
            placeholder="Shipper Name"
            value={bolInfo.shipperName}
            onChange={(e) => setBolInfo(prev => ({ ...prev, shipperName: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={bolInfo.shipperAddress}
            onChange={(e) => setBolInfo(prev => ({ ...prev, shipperAddress: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={bolInfo.shipperCity}
              onChange={(e) => setBolInfo(prev => ({ ...prev, shipperCity: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={bolInfo.shipperState}
              onChange={(e) => setBolInfo(prev => ({ ...prev, shipperState: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="ZIP Code"
              value={bolInfo.shipperZip}
              onChange={(e) => setBolInfo(prev => ({ ...prev, shipperZip: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={bolInfo.shipperPhone}
              onChange={(e) => setBolInfo(prev => ({ ...prev, shipperPhone: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Consignee Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Consignee Information</h3>
          <input
            type="text"
            placeholder="Consignee Name"
            value={bolInfo.consigneeName}
            onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeName: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={bolInfo.consigneeAddress}
            onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeAddress: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="City"
              value={bolInfo.consigneeCity}
              onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeCity: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="State"
              value={bolInfo.consigneeState}
              onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeState: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="ZIP Code"
              value={bolInfo.consigneeZip}
              onChange={(e) => setBolInfo(prev => ({ ...prev, consigneeZip: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Phone"
              value={bolInfo.consigneePhone}
              onChange={(e) => setBolInfo(prev => ({ ...prev, consigneePhone: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Carrier Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Carrier Information</h3>
          <input
            type="text"
            placeholder="Carrier Name"
            value={bolInfo.carrierName}
            onChange={(e) => setBolInfo(prev => ({ ...prev, carrierName: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="MC Number"
              value={bolInfo.carrierMC}
              onChange={(e) => setBolInfo(prev => ({ ...prev, carrierMC: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="DOT Number"
              value={bolInfo.carrierDOT}
              onChange={(e) => setBolInfo(prev => ({ ...prev, carrierDOT: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Trailer Number"
              value={bolInfo.trailerNumber}
              onChange={(e) => setBolInfo(prev => ({ ...prev, trailerNumber: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Seal Number"
              value={bolInfo.sealNumber}
              onChange={(e) => setBolInfo(prev => ({ ...prev, sealNumber: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Freight Terms</h3>
          <select
            value={bolInfo.freightChargeTerms}
            onChange={(e) => setBolInfo(prev => ({ ...prev, freightChargeTerms: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Prepaid">Prepaid</option>
            <option value="Collect">Collect</option>
            <option value="Third Party">Third Party</option>
          </select>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={bolInfo.cod}
                onChange={(e) => setBolInfo(prev => ({ ...prev, cod: e.target.checked }))}
                className="mr-2"
              />
              COD
            </label>
            {bolInfo.cod && (
              <input
                type="number"
                placeholder="COD Amount"
                value={bolInfo.codAmount}
                onChange={(e) => setBolInfo(prev => ({ ...prev, codAmount: e.target.value }))}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
            )}
          </div>
        </div>
      </div>

      {/* Commodities */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Commodities</h3>
          <button
            onClick={addCommodity}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Commodity
          </button>
        </div>

        {bolInfo.commodities.map((commodity, index) => (
          <div key={index} className="border border-gray-300 rounded p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold">Commodity {index + 1}</h4>
              {bolInfo.commodities.length > 1 && (
                <button
                  onClick={() => removeCommodity(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <textarea
                placeholder="Description"
                value={commodity.description}
                onChange={(e) => updateCommodity(index, 'description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded h-20"
              />
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Weight (lbs)"
                  value={commodity.weight}
                  onChange={(e) => updateCommodity(index, 'weight', e.target.value)}
                  onBlur={calculateTotals}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="Pieces"
                  value={commodity.pieces}
                  onChange={(e) => updateCommodity(index, 'pieces', e.target.value)}
                  onBlur={calculateTotals}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <select
                  value={commodity.packageType}
                  onChange={(e) => updateCommodity(index, 'packageType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Pallets">Pallets</option>
                  <option value="Boxes">Boxes</option>
                  <option value="Crates">Crates</option>
                  <option value="Drums">Drums</option>
                  <option value="Bags">Bags</option>
                  <option value="Loose">Loose</option>
                </select>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Value ($)"
                  value={commodity.value}
                  onChange={(e) => updateCommodity(index, 'value', e.target.value)}
                  onBlur={calculateTotals}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={commodity.hazmat}
                      onChange={(e) => updateCommodity(index, 'hazmat', e.target.checked)}
                      className="mr-2"
                    />
                    Hazmat
                  </label>
                </div>
                {commodity.hazmat && (
                  <input
                    type="text"
                    placeholder="Hazmat Class"
                    value={commodity.hazmatClass}
                    onChange={(e) => updateCommodity(index, 'hazmatClass', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Totals */}
        <div className="bg-gray-100 p-4 rounded">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <strong>Total Pieces: {bolInfo.totalPieces}</strong>
            </div>
            <div>
              <strong>Total Weight: {bolInfo.totalWeight} lbs</strong>
            </div>
            <div>
              <strong>Total Value: ${bolInfo.totalValue}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Instructions</h3>
        <textarea
          placeholder="Enter any special handling instructions, delivery requirements, or other notes..."
          value={bolInfo.specialInstructions}
          onChange={(e) => setBolInfo(prev => ({ ...prev, specialInstructions: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded h-24"
        />
      </div>

      {/* Generate Button */}
      <div className="mt-6 text-center">
        <button
          onClick={generateBillOfLading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Generate Bill of Lading PDF
        </button>
      </div>
    </div>
  );
}
