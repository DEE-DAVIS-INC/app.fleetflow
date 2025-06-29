'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import FleetMap from '../components/FleetMap';
import GoogleMaps from '../components/GoogleMaps';
import StickyNote from '../components/StickyNote';
import DispatchInvoice, { InvoiceData, generateInvoicePDF } from '../components/DispatchInvoice';
import { ProtectedRoute } from '../components/AuthProvider';
import { useLoad, LoadData } from '../contexts/LoadContext';
import { useReactToPrint } from 'react-to-print';

interface DispatchLoad {
  id: string;
  driver: string;
  vehicle: string;
  origin: string;
  destination: string;
  status: 'Assigned' | 'In Transit' | 'Delivered' | 'Delayed';
  pickupTime: string;
  deliveryTime: string;
  distance: string;
  priority: 'High' | 'Medium' | 'Low';
  loadAmount?: number; // Total load value for calculating dispatch fees
  carrierName?: string; // Assigned carrier
  invoiceGenerated?: boolean; // Track if invoice was created
  dispatchAgency?: DispatchAgency; // Assigned dispatch agency
  dispatchAgent?: DispatchAgent; // Assigned dispatch agent
}

interface DispatchAgency {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  commissionRate: number; // Percentage rate for the agency
  isActive: boolean;
  specialties?: string[]; // e.g., ['Heavy Haul', 'Refrigerated', 'Flatbed']
}

interface DispatchAgent {
  id: string;
  name: string;
  agencyId: string;
  email: string;
  phone: string;
  isActive: boolean;
  certifications?: string[];
  performanceRating: number; // 1-5 stars
}

interface DriverStatus {
  id: string;
  name: string;
  vehicle: string;
  status: 'Available' | 'On Route' | 'Loading' | 'Unloading' | 'Off Duty';
  location: string;
  lastUpdate: string;
  hoursOfService: string;
}

interface DispatchInvoice {
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

export default function DispatchCentralPage() {
  const [selectedTab, setSelectedTab] = useState<'active' | 'drivers' | 'dispatch' | 'agencies' | 'invoices'>('active');
  const [invoices, setInvoices] = useState<DispatchInvoice[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<DispatchInvoice | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<DispatchAgency | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<DispatchAgent | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentLoadId, setAssignmentLoadId] = useState<string | null>(null);
  const [tempSelectedAgency, setTempSelectedAgency] = useState<string>('');
  const [tempSelectedAgent, setTempSelectedAgent] = useState<string>('');
  const [newAgencyForm, setNewAgencyForm] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    commissionRate: 10,
    specialties: [] as string[]
  });
  const [newAgentForm, setNewAgentForm] = useState({
    name: '',
    agencyId: '',
    email: '',
    phone: '',
    certifications: [] as string[]
  });
  const invoiceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setSelectedLoad, addToHistory } = useLoad();
  
  // Convert dispatch load to shared LoadData format
  const convertToLoadData = (dispatchLoad: DispatchLoad): LoadData => {
    return {
      id: dispatchLoad.id,
      origin: dispatchLoad.origin,
      destination: dispatchLoad.destination,
      pickupDate: dispatchLoad.pickupTime.split(' ')[0],
      pickupTime: dispatchLoad.pickupTime.split(' ')[1],
      deliveryDate: dispatchLoad.deliveryTime.split(' ')[0],
      deliveryTime: dispatchLoad.deliveryTime.split(' ')[1],
      weight: '45,000 lbs', // Default weight
      equipment: 'Dry Van', // Default equipment
      rate: dispatchLoad.loadAmount || 0,
      status: dispatchLoad.status,
      distance: dispatchLoad.distance,
      carrierName: dispatchLoad.carrierName,
      driverName: dispatchLoad.driver,
      priority: dispatchLoad.priority
    };
  };

  const handleGenerateDocuments = (load: DispatchLoad) => {
    const loadData = convertToLoadData(load);
    setSelectedLoad(loadData);
    addToHistory(loadData);
    router.push('/documents');
  };

  // Sample Dispatch Agencies
  const [dispatchAgencies, setDispatchAgencies] = useState<DispatchAgency[]>([
    {
      id: 'DA001',
      name: 'Premium Dispatch Solutions',
      contactEmail: 'operations@premiumdispatch.com',
      contactPhone: '(555) 123-4567',
      address: '100 Transport Plaza, Suite 200\nAtlanta, GA 30309',
      commissionRate: 10.0,
      isActive: true,
      specialties: ['Heavy Haul', 'Oversized Loads', 'Flatbed']
    },
    {
      id: 'DA002',
      name: 'Swift Load Logistics',
      contactEmail: 'dispatch@swiftload.com',
      contactPhone: '(555) 987-6543',
      address: '75 Freight Center Dr.\nChicago, IL 60601',
      commissionRate: 10.0,
      isActive: true,
      specialties: ['Refrigerated', 'Dry Van', 'LTL']
    },
    {
      id: 'DA003',
      name: 'Elite Cargo Dispatch',
      contactEmail: 'elite@cargodispatch.net',
      contactPhone: '(555) 456-7890',
      address: '225 Commerce Blvd.\nLos Angeles, CA 90210',
      commissionRate: 10.0,
      isActive: true,
      specialties: ['Expedited', 'White Glove', 'High Value']
    }
  ]);

  // Sample Dispatch Agents
  const [dispatchAgents, setDispatchAgents] = useState<DispatchAgent[]>([
    {
      id: 'AG001',
      name: 'Marcus Rodriguez',
      agencyId: 'DA001',
      email: 'marcus@premiumdispatch.com',
      phone: '(555) 123-4568',
      isActive: true,
      certifications: ['CDL-A', 'HazMat', 'Heavy Haul Certified'],
      performanceRating: 4.8
    },
    {
      id: 'AG002',
      name: 'Jennifer Chen',
      agencyId: 'DA001',
      email: 'jchen@premiumdispatch.com',
      phone: '(555) 123-4569',
      isActive: true,
      certifications: ['CDL-A', 'Oversized Load Specialist'],
      performanceRating: 4.9
    },
    {
      id: 'AG003',
      name: 'David Thompson',
      agencyId: 'DA002',
      email: 'dthompson@swiftload.com',
      phone: '(555) 987-6544',
      isActive: true,
      certifications: ['CDL-A', 'Refrigerated Transport'],
      performanceRating: 4.6
    },
    {
      id: 'AG004',
      name: 'Sarah Martinez',
      agencyId: 'DA002',
      email: 'smartinez@swiftload.com',
      phone: '(555) 987-6545',
      isActive: true,
      certifications: ['CDL-A', 'LTL Coordinator'],
      performanceRating: 4.7
    },
    {
      id: 'AG005',
      name: 'Robert Kim',
      agencyId: 'DA003',
      email: 'rkim@cargodispatch.net',
      phone: '(555) 456-7891',
      isActive: true,
      certifications: ['CDL-A', 'High Value Cargo', 'White Glove'],
      performanceRating: 4.9
    }
  ]);

  // Mock data
  const [activeLoads, setActiveLoads] = useState<DispatchLoad[]>([
    {
      id: 'DL001',
      driver: 'John Smith',
      vehicle: 'TRK-101',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      status: 'In Transit',
      pickupTime: '2024-12-19 08:00',
      deliveryTime: '2024-12-20 14:00',
      distance: '647 mi',
      priority: 'High',
      loadAmount: 2450,
      carrierName: 'Smith Trucking LLC',
      invoiceGenerated: true,
      dispatchAgency: dispatchAgencies[0],
      dispatchAgent: dispatchAgents[0]
    },
    {
      id: 'DL002',
      driver: 'Sarah Johnson',
      vehicle: 'TRK-205',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      status: 'Assigned',
      pickupTime: '2024-12-20 06:00',
      deliveryTime: '2024-12-21 18:00',
      distance: '925 mi',
      priority: 'Medium',
      loadAmount: 3200,
      carrierName: 'Johnson Logistics',
      invoiceGenerated: false,
      dispatchAgency: dispatchAgencies[1],
      dispatchAgent: dispatchAgents[1]
    },
    {
      id: 'DL003',
      driver: 'Mike Wilson',
      vehicle: 'TRK-150',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      status: 'Delayed',
      pickupTime: '2024-12-19 12:00',
      deliveryTime: '2024-12-19 20:00',
      distance: '372 mi',
      priority: 'High',
      loadAmount: 1850,
      carrierName: 'Wilson Transport',
      invoiceGenerated: true,
      dispatchAgency: dispatchAgencies[2],
      dispatchAgent: dispatchAgents[3]
    }
  ]);

  const drivers: DriverStatus[] = [
    {
      id: 'DR001',
      name: 'John Smith',
      vehicle: 'TRK-101',
      status: 'On Route',
      location: 'I-75, Gainesville, FL',
      lastUpdate: '10 min ago',
      hoursOfService: '6h 30m remaining'
    },
    {
      id: 'DR002',
      name: 'Sarah Johnson',
      vehicle: 'TRK-205',
      status: 'Available',
      location: 'Chicago Terminal',
      lastUpdate: '2 min ago',
      hoursOfService: '10h 45m remaining'
    },
    {
      id: 'DR003',
      name: 'Mike Wilson',
      vehicle: 'TRK-150',
      status: 'Loading',
      location: 'LA Distribution Center',
      lastUpdate: '15 min ago',
      hoursOfService: '8h 15m remaining'
    },
    {
      id: 'DR004',
      name: 'Lisa Brown',
      vehicle: 'TRK-087',
      status: 'Off Duty',
      location: 'Dallas Rest Area',
      lastUpdate: '1h ago',
      hoursOfService: 'On Break - 8h restart'
    }
  ];

  // Initialize with some sample invoices
  useState(() => {
    const sampleInvoices: DispatchInvoice[] = [
      {
        id: 'INV-001',
        loadId: 'DL001',
        carrierName: 'Smith Trucking LLC',
        carrierAddress: '123 Transport St.\nAtlanta, GA 30309',
        carrierEmail: 'billing@smithtrucking.com',
        carrierPhone: '(555) 234-5678',
        loadAmount: 2450,
        dispatchFee: 245,
        feePercentage: 10,
        invoiceDate: '2024-12-19',
        dueDate: '2025-01-18',
        status: 'Sent',
        loadDetails: {
          origin: 'Atlanta, GA',
          destination: 'Miami, FL',
          pickupDate: '2024-12-19',
          deliveryDate: '2024-12-20',
          equipment: 'Dry Van',
          weight: '45,000 lbs',
          miles: 647
        },
        paymentTerms: 'Net 30 days',
        notes: 'Priority delivery - holiday rush'
      },
      {
        id: 'INV-003',
        loadId: 'DL003',
        carrierName: 'Wilson Transport',
        carrierAddress: '456 Freight Ave.\nLos Angeles, CA 90210',
        carrierEmail: 'finance@wilsontransport.com',
        carrierPhone: '(555) 987-6543',
        loadAmount: 1850,
        dispatchFee: 185,
        feePercentage: 10,
        invoiceDate: '2024-12-19',
        dueDate: '2025-01-18',
        status: 'Paid',
        loadDetails: {
          origin: 'Los Angeles, CA',
          destination: 'Phoenix, AZ',
          pickupDate: '2024-12-19',
          deliveryDate: '2024-12-19',
          equipment: 'Flatbed',
          weight: '38,500 lbs',
          miles: 372
        },
        paymentTerms: 'Net 30 days'
      }
    ];
    setInvoices(sampleInvoices);
  });

  const generateInvoice = (load: DispatchLoad) => {
    if (!load.loadAmount || !load.carrierName) {
      alert('Load amount and carrier information required to generate invoice.');
      return;
    }

    const invoiceDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms

    const dispatchFee = load.loadAmount * 0.10; // 10% dispatch fee
    const newInvoice: DispatchInvoice = {
      id: `INV-${Date.now()}`,
      loadId: load.id,
      carrierName: load.carrierName,
      loadAmount: load.loadAmount,
      dispatchFee: dispatchFee,
      feePercentage: 10,
      invoiceDate: invoiceDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'Pending',
      loadDetails: {
        origin: load.origin,
        destination: load.destination,
        pickupDate: load.pickupTime.split(' ')[0],
        deliveryDate: load.deliveryTime.split(' ')[0],
        equipment: 'Dry Van', // Default equipment
        weight: '45,000 lbs', // Default weight
        miles: parseInt(load.distance.replace(' mi', ''))
      },
      paymentTerms: 'Net 30 days'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    // Update the load to mark invoice as generated
    setActiveLoads(prev => prev.map(l => 
      l.id === load.id ? { ...l, invoiceGenerated: true } : l
    ));

    alert(`Invoice ${newInvoice.id} created for $${dispatchFee.toFixed(2)} dispatch fee`);
  };

  const updateInvoiceStatus = (invoiceId: string, newStatus: 'Pending' | 'Sent' | 'Paid' | 'Overdue') => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: newStatus } : inv
    ));
  };

  // Enhanced invoice handling functions
  const handleViewInvoice = (invoice: DispatchInvoice) => {
    setSelectedInvoice(invoice);
    setShowInvoicePreview(true);
  };

  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${selectedInvoice?.id}`,
  });

  const handleGeneratePDF = async (invoice: DispatchInvoice) => {
    setIsGeneratingPDF(true);
    try {
      const invoiceData: InvoiceData = {
        id: invoice.id,
        loadId: invoice.loadId,
        carrierName: invoice.carrierName,
        carrierAddress: invoice.carrierAddress,
        carrierEmail: invoice.carrierEmail,
        carrierPhone: invoice.carrierPhone,
        loadAmount: invoice.loadAmount,
        dispatchFee: invoice.dispatchFee,
        feePercentage: invoice.feePercentage,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        status: invoice.status,
        loadDetails: invoice.loadDetails,
        paymentTerms: invoice.paymentTerms,
        notes: invoice.notes
      };

      const pdf = await generateInvoicePDF(invoiceData);
      pdf.save(`FleetFlow-Invoice-${invoice.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendInvoiceEmail = async (invoice: DispatchInvoice) => {
    if (!invoice.carrierEmail) {
      alert('Carrier email address is required to send invoice.');
      return;
    }

    setIsSendingEmail(true);
    try {
      // Generate professional invoice email content
      const emailSubject = `FleetFlow Dispatch Invoice ${invoice.id} - Load ${invoice.loadId}`;
      
      const emailMessage = `Dear ${invoice.carrierName},

Thank you for your continued partnership with FleetFlow Dispatch Services.

INVOICE DETAILS
Invoice Number: ${invoice.id}
Load ID: ${invoice.loadId}
Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

FINANCIAL SUMMARY
Load Amount: $${invoice.loadAmount.toLocaleString()}
Dispatch Fee (10%): $${invoice.dispatchFee.toFixed(2)}

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

This is an automated message from our billing system.`;

      const htmlMessage = `
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
                <h2>Dear ${invoice.carrierName},</h2>
                
                <p>We hope this email finds you well. Please find attached your dispatch service invoice for the recently completed load.</p>
                
                <div class="invoice-details">
                    <h3>Invoice Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr><td><strong>Invoice Number:</strong></td><td>${invoice.id}</td></tr>
                        <tr><td><strong>Load ID:</strong></td><td>${invoice.loadId}</td></tr>
                        <tr><td><strong>Invoice Date:</strong></td><td>${new Date(invoice.invoiceDate).toLocaleDateString()}</td></tr>
                        <tr><td><strong>Due Date:</strong></td><td>${new Date(invoice.dueDate).toLocaleDateString()}</td></tr>
                        <tr><td><strong>Load Amount:</strong></td><td>$${invoice.loadAmount.toLocaleString()}</td></tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px; text-align: center;">
                        <p style="margin: 0; color: #64748b;">Dispatch Fee (10%)</p>
                        <div class="amount">$${invoice.dispatchFee.toFixed(2)}</div>
                    </div>
                </div>
                
                <h3>Payment Information</h3>
                <p>Payment is due within 30 days of the invoice date. We accept:</p>
                <ul>
                    <li><strong>ACH Transfer</strong> - Our preferred method for faster processing</li>
                    <li><strong>Wire Transfer</strong> - For immediate payments</li>
                    <li><strong>Check</strong> - Mail to our business address</li>
                </ul>
                
                <a href="mailto:billing@fleetflow.com" class="button">Contact Billing Department</a>
                
                <p>We appreciate your continued partnership and look forward to serving your transportation needs.</p>
                
                <p>Best regards,<br><strong>FleetFlow Billing Department</strong></p>
            </div>
            
            <div class="footer">
                <p><strong>FleetFlow Dispatch Services</strong><br>
                1234 Logistics Way, Suite 100, Atlanta, GA 30309<br>
                Phone: (555) 123-4567 | Email: billing@fleetflow.com<br>
                Website: www.fleetflow.com</p>
            </div>
        </body>
        </html>
      `;

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          to: invoice.carrierEmail,
          subject: emailSubject,
          message: emailMessage,
          htmlMessage: htmlMessage,
          attachments: [`Invoice-${invoice.id}.pdf`],
          priority: 'normal'
        })
      });

      if (response.ok) {
        updateInvoiceStatus(invoice.id, 'Sent');
        alert(`✅ Invoice ${invoice.id} sent successfully to ${invoice.carrierEmail}`);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending invoice email:', error);
      alert('❌ Failed to send invoice email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Agency and Agent Management Functions
  const assignAgencyToLoad = (loadId: string, agencyId: string, agentId?: string) => {
    const agency = dispatchAgencies.find(a => a.id === agencyId);
    const agent = agentId ? dispatchAgents.find(a => a.id === agentId) : undefined;
    
    if (!agency) {
      alert('Invalid agency selected');
      return;
    }

    if (agentId && !agent) {
      alert('Invalid agent selected');
      return;
    }

    setActiveLoads(prev => prev.map(load => 
      load.id === loadId 
        ? { ...load, dispatchAgency: agency, dispatchAgent: agent }
        : load
    ));

    alert(`Load ${loadId} assigned to ${agency.name}${agent ? ` (Agent: ${agent.name})` : ''}`);
  };

  const getAgentsByAgency = (agencyId: string) => {
    return dispatchAgents.filter(agent => agent.agencyId === agencyId && agent.isActive);
  };

  const openAssignmentModal = (loadId: string) => {
    setAssignmentLoadId(loadId);
    setTempSelectedAgency('');
    setTempSelectedAgent('');
    setShowAssignmentModal(true);
  };

  const handleAssignmentSubmit = () => {
    if (!assignmentLoadId || !tempSelectedAgency) {
      alert('Please select an agency');
      return;
    }

    assignAgencyToLoad(assignmentLoadId, tempSelectedAgency, tempSelectedAgent || undefined);
    setShowAssignmentModal(false);
    setAssignmentLoadId(null);
    setTempSelectedAgency('');
    setTempSelectedAgent('');
  };

  // Add New Agency
  const handleAddAgency = () => {
    if (!newAgencyForm.name || !newAgencyForm.contactEmail || !newAgencyForm.contactPhone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    const newAgency: DispatchAgency = {
      id: `DA${String(dispatchAgencies.length + 1).padStart(3, '0')}`,
      name: newAgencyForm.name,
      contactEmail: newAgencyForm.contactEmail,
      contactPhone: newAgencyForm.contactPhone,
      address: newAgencyForm.address || undefined,
      commissionRate: newAgencyForm.commissionRate,
      isActive: true,
      specialties: newAgencyForm.specialties.length > 0 ? newAgencyForm.specialties : undefined
    };

    setDispatchAgencies(prev => [...prev, newAgency]);
    setNewAgencyForm({
      name: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      commissionRate: 10,
      specialties: []
    });
    setShowAgencyModal(false);
    alert(`✅ Agency "${newAgency.name}" added successfully!`);
  };

  // Add New Agent
  const handleAddAgent = () => {
    if (!newAgentForm.name || !newAgentForm.agencyId || !newAgentForm.email || !newAgentForm.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const newAgent: DispatchAgent = {
      id: `AG${String(dispatchAgents.length + 1).padStart(3, '0')}`,
      name: newAgentForm.name,
      agencyId: newAgentForm.agencyId,
      email: newAgentForm.email,
      phone: newAgentForm.phone,
      isActive: true,
      certifications: newAgentForm.certifications.length > 0 ? newAgentForm.certifications : undefined,
      performanceRating: 4.0 // Default rating for new agents
    };

    setDispatchAgents(prev => [...prev, newAgent]);
    setNewAgentForm({
      name: '',
      agencyId: '',
      email: '',
      phone: '',
      certifications: []
    });
    setShowAgentModal(false);
    alert(`✅ Agent "${newAgent.name}" added successfully!`);
  };

  // Helper functions for form management
  const addSpecialty = (specialty: string) => {
    if (specialty && !newAgencyForm.specialties.includes(specialty)) {
      setNewAgencyForm(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setNewAgencyForm(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addCertification = (certification: string) => {
    if (certification && !newAgentForm.certifications.includes(certification)) {
      setNewAgentForm(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification]
      }));
    }
  };

  const removeCertification = (certification: string) => {
    setNewAgentForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleEditLoad = (load: DispatchLoad) => {
    // This would open a modal or form to edit load details including agency/agent assignment
    console.log('Edit load:', load);
    // For now, we'll just show an alert
    alert(`Edit functionality for load ${load.id} - this would open a modal to edit load details including agency/agent assignment`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'In Transit':
      case 'On Route':
        return 'text-blue-600 bg-blue-100';
      case 'Assigned':
        return 'text-yellow-600 bg-yellow-100';
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Delayed':
        return 'text-red-600 bg-red-100';
      case 'Loading':
      case 'Unloading':
        return 'text-orange-600 bg-orange-100';
      case 'Off Duty':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <ProtectedRoute requiredPermission="dispatch_access">
      <div className="min-h-screen bg-light-blue-theme">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 py-4">
          <div className="space-y-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dispatch Central</h1>
              <p className="text-gray-600 mt-1 ultra-compact">
                Real-time fleet coordination and load management
              </p>
            </div>
            
            {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card-2d">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Loads</dt>
                  <dd className="text-2xl font-bold text-gray-900">{activeLoads.length}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="stat-card-2d">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Drivers</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {drivers.filter(d => d.status === 'Available').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="stat-card-2d">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Transit</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {activeLoads.filter(l => l.status === 'In Transit').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="stat-card-2d">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Alerts</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {activeLoads.filter(l => l.status === 'Delayed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>        {/* Tabs */}
        <div className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 rounded-2xl p-2 shadow-lg border border-gray-200">
          <nav className="flex space-x-2">
            {[
              { id: 'active', label: 'Active Loads', count: activeLoads.length, icon: '⚡', color: 'blue' },
              { id: 'drivers', label: 'Driver Status', count: drivers.length, icon: '👥', color: 'green' },
              { id: 'dispatch', label: 'Dispatch Board', count: 0, icon: '📋', color: 'purple' },
              { id: 'agencies', label: 'Dispatch Agencies', count: dispatchAgencies.length, icon: '🏢', color: 'indigo' },
              { id: 'invoices', label: 'Dispatch Invoices', count: invoices.length, icon: '📄', color: 'orange' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'active' | 'drivers' | 'dispatch' | 'agencies' | 'invoices')}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 border-2 ${
                  selectedTab === tab.id
                    ? tab.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg transform scale-105' :
                      tab.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-lg transform scale-105' :
                      tab.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg transform scale-105' :
                      tab.color === 'indigo' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-indigo-600 shadow-lg transform scale-105' :
                      'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600 shadow-lg transform scale-105'
                    : `border-transparent text-gray-600 hover:text-gray-800 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-md ${
                      tab.color === 'blue' ? 'hover:border-blue-300' :
                      tab.color === 'green' ? 'hover:border-green-300' :
                      tab.color === 'purple' ? 'hover:border-purple-300' :
                      tab.color === 'indigo' ? 'hover:border-indigo-300' :
                      'hover:border-orange-300'
                    }`
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="flex flex-col items-center">
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`mt-1 py-1 px-3 rounded-full text-xs font-bold ${
                        selectedTab === tab.id
                          ? 'bg-white/30 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </nav>
        </div>        {/* Active Loads Tab */}
        {selectedTab === 'active' && (
          <div className="card-2d">
            <div className="px-6 py-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Active Load Assignments</h3>
                <div className="flex space-x-3">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-blue-600">
                    ➕ New Assignment
                  </button>
                  <button className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg border border-gray-300 hover:border-gray-400">
                    🔍 Filter
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <div className="table-2d">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Load ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver / Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dispatch Agency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Load Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeLoads.map((load) => (
                    <tr key={load.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {load.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{load.driver}</div>
                          <div className="text-gray-500">{load.vehicle}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{load.origin}</div>
                          <div className="text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="#D97706" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            {load.destination}
                          </div>
                          <div className="text-xs text-gray-400">{load.distance}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {load.dispatchAgency ? (
                            <>
                              <div className="font-medium text-indigo-600">{load.dispatchAgency.name}</div>
                              {load.dispatchAgent && (
                                <div className="text-xs text-gray-600">Agent: {load.dispatchAgent.name}</div>
                              )}
                              <div className="text-xs text-gray-500">{load.dispatchAgency.commissionRate}% rate</div>
                              <button 
                                onClick={() => openAssignmentModal(load.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                              >
                                Change Assignment
                              </button>
                            </>
                          ) : (
                            <div className="text-gray-400 italic">
                              <div>Not assigned</div>
                              <button 
                                onClick={() => openAssignmentModal(load.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                              >
                                Assign Agency
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-semibold text-green-600">${load.loadAmount?.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{load.carrierName}</div>
                          {load.invoiceGenerated && (
                            <div className="text-xs text-blue-600">✓ Invoice Created</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>Pick: {new Date(load.pickupTime).toLocaleDateString()}</div>
                          <div>Del: {new Date(load.deliveryTime).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(load.priority)}`}>
                          {load.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(load.status)}`}>
                          {load.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col space-y-1">
                          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-blue-600 transform hover:scale-105 duration-200">
                            📍 Track
                          </button>
                          <button 
                            onClick={() => handleGenerateDocuments(load)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-green-600 transform hover:scale-105 duration-200"
                          >
                            📄 Docs
                          </button>
                          <button 
                            onClick={() => handleEditLoad(load)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-orange-600 transform hover:scale-105 duration-200"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => openAssignmentModal(load.id)}
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-indigo-600 transform hover:scale-105 duration-200"
                          >
                            🏢 {load.dispatchAgency ? 'Reassign' : 'Assign'}
                          </button>
                          {!load.invoiceGenerated && load.loadAmount && (
                            <button 
                              onClick={() => generateInvoice(load)}
                              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-purple-600 transform hover:scale-105 duration-200"
                            >
                              💰 Invoice
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver Status Tab */}
        {selectedTab === 'drivers' && (
        <div className="card-2d">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Real-time Driver Status</h3>
              <div className="flex space-x-3">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                    <span className="text-gray-600">On Duty</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                    <span className="text-gray-600">Off Duty</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="table-2d">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        Driver
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        Vehicle
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        HOS Remaining
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        Last Update
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {drivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {driver.name.charAt(0)}
                            </div>
                            <div className="font-medium text-gray-900">{driver.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">🚛</span>
                            <span className="font-medium text-gray-900">{driver.vehicle}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full shadow-lg ${
                              driver.status === 'Available' ? 'bg-green-500 shadow-green-200' :
                              driver.status === 'On Route' || driver.status === 'Loading' || driver.status === 'Unloading' ? 'bg-yellow-500 shadow-yellow-200' :
                              'bg-red-500 shadow-red-200'
                            }`}></div>
                            <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-xl shadow-md ${
                              driver.status === 'Available' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' :
                              driver.status === 'On Route' || driver.status === 'Loading' || driver.status === 'Unloading' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300' :
                              'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                            }`}>
                              {driver.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📍</span>
                            <span className="text-gray-900">{driver.location}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">⏱️</span>
                            <span className="font-medium text-gray-900">{driver.hoursOfService}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🕒</span>
                            <span>{driver.lastUpdate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-cyan-600 transform hover:scale-105 duration-200">
                              📞 Call
                            </button>
                            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white mini-button transition-all shadow-md hover:shadow-lg border border-emerald-600 transform hover:scale-105 duration-200">
                              📦 Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Board Tab */}
      {selectedTab === 'dispatch' && (
        <div className="space-y-6">
          {/* Fleet Map Integration */}
          <FleetMap />
          
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dispatch Coordination Board</h3>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">ℹ️</span>
                  <div className="text-sm text-blue-800">
                    <strong>Note:</strong> Loads are posted by broker agents and assigned to dispatch agencies. 
                    Use this board to coordinate driver assignments for loads assigned to your dispatch agency.
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Loads Assigned from Brokers */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">📋 Loads from Broker Agents</h4>
                  <div className="space-y-3">
                    {/* Sample loads assigned to dispatch */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-medium text-blue-900">LOAD-001234</div>
                      <div className="text-sm text-blue-700">Atlanta → Miami</div>
                      <div className="text-xs text-blue-600">Broker: FreightCorp</div>
                      <div className="text-xs text-green-600 font-medium">$2,450 (10% = $245)</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-medium text-blue-900">LOAD-001235</div>
                      <div className="text-sm text-blue-700">Chicago → Houston</div>
                      <div className="text-xs text-blue-600">Broker: LogiTrans</div>
                      <div className="text-xs text-green-600 font-medium">$3,200 (10% = $320)</div>
                    </div>
                    <div className="border border-dashed border-blue-300 rounded-lg p-4 text-center text-blue-500">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Loads assigned by brokers appear here
                    </div>
                  </div>
                </div>

                {/* Available Drivers */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Available Drivers</h4>
                  <div className="space-y-2">
                    {drivers.filter(d => d.status === 'Available').map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{driver.name}</div>
                          <div className="text-sm text-gray-500">{driver.vehicle} • {driver.location}</div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {driver.hoursOfService}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md">
                  ⚡ Auto-Assign Optimal Routes
                </button>
                <button className="bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-red-300 hover:border-red-400">
                  🚨 Emergency Dispatch
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-green-300 hover:border-green-400">
                  🗺️ Route Optimization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Agencies Tab */}
      {selectedTab === 'agencies' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dispatch Agencies & Agents</h3>
                <p className="text-sm text-gray-600 mt-1">Manage dispatch agency partnerships and agent assignments</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAgencyModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <span>🏢</span>
                  <span>Add Agency</span>
                </button>
                <button
                  onClick={() => setShowAgentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <span>👤</span>
                  <span>Add Agent</span>
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-600">{dispatchAgencies.filter(a => a.isActive).length}</div>
                <div className="text-sm text-indigo-700">Active Agencies</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{dispatchAgents.filter(a => a.isActive).length}</div>
                <div className="text-sm text-blue-700">Active Agents</div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {activeLoads.filter(l => l.dispatchAgency).length}
                </div>
                <div className="text-sm text-green-700">Loads Assigned</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-2xl font-bold text-orange-600">
                  {(dispatchAgencies.reduce((sum, agency) => sum + agency.commissionRate, 0) / dispatchAgencies.length).toFixed(1)}%
                </div>
                <div className="text-sm text-orange-700">Avg Commission</div>
              </div>
            </div>

            {/* Agencies Grid */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Dispatch Agencies</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dispatchAgencies.map((agency) => (
                  <div key={agency.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xl">🏢</span>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{agency.name}</h5>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agency.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {agency.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>📧</span>
                        <span>{agency.contactEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>📞</span>
                        <span>{agency.contactPhone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>💰</span>
                        <span>{agency.commissionRate}% commission</span>
                      </div>
                    </div>

                    {agency.specialties && agency.specialties.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs font-medium text-gray-700 mb-2">Specialties:</div>
                        <div className="flex flex-wrap gap-1">
                          {agency.specialties.map((specialty, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {dispatchAgents.filter(agent => agent.agencyId === agency.id).length} agents
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedAgency(agency)}
                          className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                        >
                          View Details
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 text-xs font-medium">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agents List */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Dispatch Agents</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Agent
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Agency
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Certifications
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dispatchAgents.map((agent) => {
                      const agency = dispatchAgencies.find(a => a.id === agent.agencyId);
                      return (
                        <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {agent.name
                                    .split(' ')
                                    .filter(n => n.length > 0)
                                    .map(n => n[0].toUpperCase())
                                    .join('')
                                    .substring(0, 2)
                                  }
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                <div className="text-sm text-gray-500">ID: {agent.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{agency?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{agency?.contactPhone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{agent.email}</div>
                            <div className="text-sm text-gray-500">{agent.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={i < Math.floor(agent.performanceRating) ? 'text-yellow-400' : 'text-gray-300'}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600">{agent.performanceRating}/5</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {agent.certifications && agent.certifications.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {agent.certifications.slice(0, 2).map((cert, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {cert}
                                  </span>
                                ))}
                                {agent.certifications.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{agent.certifications.length - 2} more
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">No certifications</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setSelectedAgent(agent)}
                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                              >
                                View
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 font-medium">
                                Edit
                              </button>
                              <button className="text-green-600 hover:text-green-900 font-medium">
                                Assign
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Load Assignment by Agency/Agent */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Active Load Assignments by Agency & Agent</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dispatchAgencies.map((agency) => {
                  const agencyLoads = activeLoads.filter(load => load.dispatchAgency?.id === agency.id);
                  return (
                    <div key={agency.id} className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">{agency.name}</h5>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {agencyLoads.length} loads
                        </span>
                      </div>
                      
                      {/* Group loads by agent */}
                      {getAgentsByAgency(agency.id).map((agent) => {
                        const agentLoads = agencyLoads.filter(load => load.dispatchAgent?.id === agent.id);
                        if (agentLoads.length === 0) return null;
                        
                        return (
                          <div key={agent.id} className="mb-3 bg-gray-50 rounded p-2">
                            <div className="text-xs font-medium text-gray-700 mb-1">
                              👤 {agent.name} ({agentLoads.length} loads)
                            </div>
                            <div className="space-y-1">
                              {agentLoads.map((load) => (
                                <div key={load.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-600">{load.id}</span>
                                  <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(load.status)}`}>
                                    {load.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Loads without specific agents */}
                      {(() => {
                        const unassignedLoads = agencyLoads.filter(load => !load.dispatchAgent);
                        if (unassignedLoads.length === 0) return null;
                        
                        return (
                          <div className="mb-3 bg-yellow-50 rounded p-2 border border-yellow-200">
                            <div className="text-xs font-medium text-yellow-700 mb-1">
                              ⚠️ No Specific Agent ({unassignedLoads.length} loads)
                            </div>
                            <div className="space-y-1">
                              {unassignedLoads.map((load) => (
                                <div key={load.id} className="flex justify-between items-center text-xs">
                                  <span className="text-gray-600">{load.id}</span>
                                  <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(load.status)}`}>
                                    {load.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      
                      {agencyLoads.length === 0 && (
                        <div className="text-xs text-gray-500 italic">No active loads</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Invoices Tab */}
      {selectedTab === 'invoices' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Dispatch Fee Invoices</h3>
                <p className="text-sm text-gray-600 mt-1">Manage carrier dispatch fee invoices and payments</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm font-medium text-blue-900">Total Outstanding</div>
                <div className="text-2xl font-bold text-blue-600">
                  $
                  {invoices
                    .filter(inv => inv.status !== 'Paid')
                    .reduce((sum, inv) => sum + inv.dispatchFee, 0)
                    .toFixed(2)
                  }
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {invoices.filter(inv => inv.status !== 'Paid').length} unpaid invoices
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invoice Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Carrier Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Financial Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status & Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">{invoice.id}</div>
                          <div className="text-sm text-gray-600">Load: {invoice.loadId}</div>
                          {invoice.loadDetails && (
                            <div className="text-xs text-gray-500">
                              {invoice.loadDetails.origin} → {invoice.loadDetails.destination}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{invoice.carrierName}</div>
                          {invoice.carrierEmail && (
                            <div className="text-sm text-gray-600">{invoice.carrierEmail}</div>
                          )}
                          {invoice.carrierPhone && (
                            <div className="text-xs text-gray-500">{invoice.carrierPhone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            Load: <span className="font-medium">${invoice.loadAmount.toLocaleString()}</span>
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            ${invoice.dispatchFee.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">({invoice.feePercentage}% fee)</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <select
                            value={invoice.status}
                            onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value as any)}
                            className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer transition-all ${
                              invoice.status === 'Paid' 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : invoice.status === 'Sent'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : invoice.status === 'Overdue'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Sent">Sent</option>
                            <option value="Paid">Paid</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                          <div className="text-xs text-gray-500">
                            <div>Created: {new Date(invoice.invoiceDate).toLocaleDateString()}</div>
                            <div>Due: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewInvoice(invoice)}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-blue-300 hover:border-blue-400 flex items-center space-x-1"
                            >
                              <span>👁️</span>
                              <span>View</span>
                            </button>
                            <button 
                              onClick={() => handleGeneratePDF(invoice)}
                              disabled={isGeneratingPDF}
                              className="bg-purple-100 hover:bg-purple-200 text-purple-700 hover:text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-purple-300 hover:border-purple-400 flex items-center space-x-1 disabled:opacity-50"
                            >
                              <span>📄</span>
                              <span>{isGeneratingPDF ? 'PDF...' : 'PDF'}</span>
                            </button>
                          </div>
                          {invoice.status !== 'Paid' && (
                            <button 
                              onClick={() => handleSendInvoiceEmail(invoice)}
                              disabled={isSendingEmail || !invoice.carrierEmail}
                              className="bg-green-100 hover:bg-green-200 text-green-700 hover:text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md border border-green-300 hover:border-green-400 flex items-center space-x-1 disabled:opacity-50"
                            >
                              <span>📤</span>
                              <span>{isSendingEmail ? 'Sending...' : 'Send'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {invoices.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-lg font-medium text-gray-900 mb-2">No invoices generated yet</div>
                    <p className="text-gray-500">
                      Invoices will appear here when loads are assigned to carriers and dispatch fees are calculated
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Load Assignment and Route Planning Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Assigned Loads from Brokers</h3>
            
            <div className="space-y-4">
              {/* Available loads assigned to this dispatch agency */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">🎯 Loads Awaiting Dispatch</h4>
                
                {/* Sample assigned loads */}
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">LOAD-001234</div>
                        <div className="text-sm text-gray-600">Atlanta, GA → Miami, FL</div>
                        <div className="text-xs text-blue-600">Broker: FreightCorp | Agent: Sarah Johnson</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">$2,450</div>
                        <div className="text-xs text-gray-500">10% dispatch fee: $245</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>📦 Electronics | 45,000 lbs | Class 85</span>
                      <span>Pick: Dec 20 | Del: Dec 21</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                        👤 Assign Driver
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                        📄 Generate Invoice
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">LOAD-001235</div>
                        <div className="text-sm text-gray-600">Chicago, IL → Houston, TX</div>
                        <div className="text-xs text-blue-600">Broker: LogiTrans | Agent: Mike Chen</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">$3,200</div>
                        <div className="text-xs text-gray-500">10% dispatch fee: $320</div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>🧊 Food Products | 38,500 lbs | Class 65</span>
                      <span>Pick: Dec 21 | Del: Dec 23</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">
                        👤 Assign Driver
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                        📄 Generate Invoice
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Empty state */}
                <div className="mt-4 text-center text-blue-600 text-sm">
                  <div className="text-blue-400 mb-2">📋</div>
                  <p>Loads assigned by broker agents will appear here for dispatch coordination</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Route Visualization</h3>
            <GoogleMaps />
          </div>
        </div>
      </div>

      {/* Dispatch Notes Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Dispatch Notes</h3>
          <StickyNote 
            section="dispatch" 
            entityId="dispatch-central" 
            entityName="Dispatch Central"
          />
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {showInvoicePreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                Invoice Preview - {selectedInvoice.id}
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={handlePrintInvoice}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>🖨️</span>
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleGeneratePDF(selectedInvoice)}
                  disabled={isGeneratingPDF}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>📄</span>
                  <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
                </button>
                {selectedInvoice.status !== 'Paid' && selectedInvoice.carrierEmail && (
                  <button
                    onClick={() => handleSendInvoiceEmail(selectedInvoice)}
                    disabled={isSendingEmail}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <span>📤</span>
                    <span>{isSendingEmail ? 'Sending...' : 'Send Email'}</span>
                  </button>
                )}
                <button
                  onClick={() => setShowInvoicePreview(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <DispatchInvoice
                ref={invoiceRef}
                invoice={{
                  id: selectedInvoice.id,
                  loadId: selectedInvoice.loadId,
                  carrierName: selectedInvoice.carrierName,
                  carrierAddress: selectedInvoice.carrierAddress,
                  carrierEmail: selectedInvoice.carrierEmail,
                  carrierPhone: selectedInvoice.carrierPhone,
                  loadAmount: selectedInvoice.loadAmount,
                  dispatchFee: selectedInvoice.dispatchFee,
                  feePercentage: selectedInvoice.feePercentage,
                  invoiceDate: selectedInvoice.invoiceDate,
                  dueDate: selectedInvoice.dueDate,
                  status: selectedInvoice.status,
                  loadDetails: selectedInvoice.loadDetails,
                  paymentTerms: selectedInvoice.paymentTerms,
                  notes: selectedInvoice.notes
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Agency/Agent Assignment Modal */}
      {showAssignmentModal && assignmentLoadId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assign Dispatch Agency & Agent
                </h3>
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Assigning to Load: <span className="font-medium text-gray-900">{assignmentLoadId}</span>
                </div>

                {/* Agency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Dispatch Agency *
                  </label>
                  <select
                    value={tempSelectedAgency}
                    onChange={(e) => {
                      setTempSelectedAgency(e.target.value);
                      setTempSelectedAgent(''); // Reset agent selection when agency changes
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Choose an agency...</option>
                    {dispatchAgencies
                      .filter(agency => agency.isActive)
                      .map(agency => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} ({agency.commissionRate}% commission)
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Agent Selection */}
                {tempSelectedAgency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Agent (Optional)
                    </label>
                    <select
                      value={tempSelectedAgent}
                      onChange={(e) => setTempSelectedAgent(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">No specific agent</option>
                      {getAgentsByAgency(tempSelectedAgency).map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} (⭐ {agent.performanceRating}/5)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Agency/Agent Details */}
                {tempSelectedAgency && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const selectedAgencyData = dispatchAgencies.find(a => a.id === tempSelectedAgency);
                      const selectedAgentData = tempSelectedAgent ? dispatchAgents.find(a => a.id === tempSelectedAgent) : null;
                      
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="font-medium text-gray-900">Assignment Summary:</div>
                          <div>Agency: <span className="text-indigo-600">{selectedAgencyData?.name}</span></div>
                          <div>Commission: <span className="text-green-600">{selectedAgencyData?.commissionRate}%</span></div>
                          {selectedAgentData && (
                            <>
                              <div>Agent: <span className="text-blue-600">{selectedAgentData.name}</span></div>
                              <div>Rating: <span className="text-yellow-600">⭐ {selectedAgentData.performanceRating}/5</span></div>
                            </>
                          )}
                          {selectedAgencyData?.specialties && selectedAgencyData.specialties.length > 0 && (
                            <div>
                              Specialties: 
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedAgencyData.specialties.map((specialty, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignmentSubmit}
                  disabled={!tempSelectedAgency}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Agency Modal */}
      {showAgencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Dispatch Agency</h3>
                <button
                  onClick={() => setShowAgencyModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Agency Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agency Name *
                  </label>
                  <input
                    type="text"
                    value={newAgencyForm.name}
                    onChange={(e) => setNewAgencyForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Dispatch Solutions"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={newAgencyForm.contactEmail}
                    onChange={(e) => setNewAgencyForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="operations@agency.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={newAgencyForm.contactPhone}
                    onChange={(e) => setNewAgencyForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                  </label>
                  <textarea
                    value={newAgencyForm.address}
                    onChange={(e) => setNewAgencyForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Transport St.&#10;City, State 12345"
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Commission Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={newAgencyForm.commissionRate}
                    onChange={(e) => setNewAgencyForm(prev => ({ ...prev, commissionRate: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialties
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newAgencyForm.specialties.map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {specialty}
                        <button
                          onClick={() => removeSpecialty(specialty)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Heavy Haul', 'Refrigerated', 'Dry Van', 'Flatbed', 'Oversized Loads', 'Expedited', 'White Glove', 'High Value', 'LTL'].map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => addSpecialty(specialty)}
                        disabled={newAgencyForm.specialties.includes(specialty)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAgencyModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAgency}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Add Agency
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New Dispatch Agent</h3>
                <button
                  onClick={() => setShowAgentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    value={newAgentForm.name}
                    onChange={(e) => setNewAgentForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., John Smith"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Agency Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dispatch Agency *
                  </label>
                  <select
                    value={newAgentForm.agencyId}
                    onChange={(e) => setNewAgentForm(prev => ({ ...prev, agencyId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an agency...</option>
                    {dispatchAgencies
                      .filter(agency => agency.isActive)
                      .map(agency => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name}
                        </option>
                      ))
                    }
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newAgentForm.email}
                    onChange={(e) => setNewAgentForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="agent@agency.com"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={newAgentForm.phone}
                    onChange={(e) => setNewAgentForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newAgentForm.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {cert}
                        <button
                          onClick={() => removeCertification(cert)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['CDL-A', 'CDL-B', 'HazMat', 'Heavy Haul Certified', 'Oversized Load Specialist', 'Refrigerated Transport', 'LTL Coordinator', 'High Value Cargo', 'White Glove'].map((cert) => (
                      <button
                        key={cert}
                        onClick={() => addCertification(cert)}
                        disabled={newAgentForm.certifications.includes(cert)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        + {cert}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAgentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAgent}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Add Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
