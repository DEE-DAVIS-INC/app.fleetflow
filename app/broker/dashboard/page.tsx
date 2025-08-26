'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddShipperForm from '../../components/AddShipperForm';
import BOLReviewPanel from '../../components/BOLReviewPanel';
import BrokerAIIntelligenceHub from '../../components/BrokerAIIntelligenceHub';
import BrokerCarrierNetworkManager from '../../components/BrokerCarrierNetworkManager';
import BrokerFinancialDashboard from '../../components/BrokerFinancialDashboard';
import BrokerMarketIntelligence from '../../components/BrokerMarketIntelligence';
import BrokerShipperAcquisition from '../../components/BrokerShipperAcquisition';
import BrokerTaskPrioritizationPanel from '../../components/BrokerTaskPrioritizationPanel';
import CreateLoadForm from '../../components/CreateLoadForm';
import DocumentsPortalButton from '../../components/DocumentsPortalButton';
import InvitationQuickManager from '../../components/InvitationQuickManager';
import PhoneMonitoringDashboard from '../../components/PhoneMonitoringDashboard';
// import CustomizableDashboard from '../../components/CustomizableDashboard'; // Temporarily disabled due to Grid3x3 import issue
import EnhancedLoadBoard from '../../components/EnhancedLoadBoard';
import ProfessionalTemplateManager from '../../components/ProfessionalTemplateManager';

import SpotRateOptimizationWidget from '../../components/SpotRateOptimizationWidget';
import WarehouseShipmentFlow from '../../components/WarehouseShipmentFlow';
// import { getAvailableDispatchers } from '../../config/access';
import { businessWorkflowManager } from '../../services/businessWorkflowManager';
// import { useShipper } from '../../contexts/ShipperContext';
import {
  BrokerMarginTracking,
  BrokerPerformanceMetrics,
  LoadBidding,
  brokerAnalyticsService,
} from '../../services/BrokerAnalyticsService';
// Removed old CRM imports - now using Enhanced CRM system
import {
  BrokerContract,
  brokerContractService,
} from '../../services/BrokerContractService';
import { Load } from '../../services/loadService';

interface BrokerSession {
  id: string;
  brokerCode: string;
  brokerName: string;
  email: string;
  role: string;
  loginTime: string;
  isNewRegistration?: boolean;
  mcNumber?: string;
}

export default function BrokerDashboard() {
  const [selectedTab, setSelectedTab] = useState('quotes-workflow');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [brokerSession, setBrokerSession] = useState<BrokerSession | null>(
    null
  );
  const router = useRouter();
  // const availableDispatchers = getAvailableDispatchers();

  // Temporary shipper state until context is fixed
  const [shippers] = useState([]);
  const setShippers = () => {};

  // Load enhanced broker data
  useEffect(() => {
    const loadBrokerData = async () => {
      try {
        // Load performance metrics
        const metrics = brokerAnalyticsService.getBrokerPerformanceMetrics();
        setPerformanceMetrics(metrics);

        // Load margin tracking
        const margins = brokerAnalyticsService.getMarginTracking();
        setMarginTracking(margins);

        // Load bidding history
        const bidding = brokerAnalyticsService.getBiddingHistory();
        setBiddingHistory(bidding);

        // Load contracts
        const contracts = brokerContractService.getBrokerContracts();
        setBrokerContracts(contracts);

        // CRM data now handled by Enhanced CRM system
      } catch (error) {
        console.error('Error loading broker data:', error);
      }
    };

    loadBrokerData();

    // Refresh data every 30 seconds
    const interval = setInterval(loadBrokerData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Freight Quotes state variables
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingQuote, setPendingQuote] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [activeQuoteTab, setActiveQuoteTab] = useState<
    | 'LTL'
    | 'FTL'
    | 'Specialized'
    | 'Warehousing'
    | 'Multi-Service'
    | 'History'
    | 'SpotRates'
  >('LTL');

  // LTL State
  const [ltlData, setLtlData] = useState({
    weight: '',
    pallets: '',
    freightClass: '50',
    liftgate: false,
    residential: false,
    origin: '',
    destination: '',
    commodity: '',
  });

  // FTL State
  const [ftlData, setFtlData] = useState({
    miles: '',
    equipmentType: 'Van',
    weight: '',
    origin: '',
    destination: '',
    commodity: '',
    hazmat: false,
    teamDriver: false,
  });

  // Specialized State
  const [specializedData, setSpecializedData] = useState({
    serviceType: 'White Glove',
    weight: '',
    dimensions: '',
    value: '',
    origin: '',
    destination: '',
    specialRequirements: [] as string[],
  });

  // Warehousing State
  const [warehousingData, setWarehousingData] = useState({
    serviceType: 'Storage',
    palletCount: '',
    duration: '',
    location: '',
    temperature: 'Ambient',
  });

  // Multi-Service State
  const [multiServiceData, setMultiServiceData] = useState({
    selectedServices: [] as string[],
    commonOrigin: '',
    commonDestination: '',
    totalWeight: '',
    notes: '',
  });

  // Quote Acceptance Workflow state variables
  const [acceptedQuotes, setAcceptedQuotes] = useState<any[]>([]);
  const [showQuoteAcceptance, setShowQuoteAcceptance] = useState(false);
  const [selectedAcceptedQuote, setSelectedAcceptedQuote] = useState<any>(null);
  const [contractGenerationStatus, setContractGenerationStatus] = useState<
    'idle' | 'generating' | 'sent' | 'error'
  >('idle');
  const [quoteAcceptanceWorkflow, setQuoteAcceptanceWorkflow] =
    useState<any>(null);

  // Enhanced Broker Features State
  const [performanceMetrics, setPerformanceMetrics] =
    useState<BrokerPerformanceMetrics | null>(null);
  const [marginTracking, setMarginTracking] = useState<BrokerMarginTracking[]>(
    []
  );
  const [biddingHistory, setBiddingHistory] = useState<LoadBidding[]>([]);
  const [brokerContracts, setBrokerContracts] = useState<BrokerContract[]>([]);
  // CRM functionality moved to Enhanced CRM system
  const [showShipperDetails, setShowShipperDetails] = useState(false);
  const [showContractWorkflow, setShowContractWorkflow] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<BrokerContract | null>(null);
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [selectedLoadForBid, setSelectedLoadForBid] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidNotes, setBidNotes] = useState('');

  // Add missing CRM variables for backward compatibility
  const [shipperProfiles] = useState<any[]>([]);
  const [selectedShipper, setSelectedShipper] = useState<any>(null);
  const [upsellOpportunities] = useState<any[]>([]);

  // Shipper Creation Workflow state variables
  const [showShipperCreation, setShowShipperCreation] = useState(false);
  const [shipperCreationMode, setShipperCreationMode] = useState<
    'manual' | 'automated'
  >('manual');
  const [workflowForShipperCreation, setWorkflowForShipperCreation] =
    useState<any>(null);

  // Settings state variables
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    'preferences' | 'integrations' | 'commissions' | 'templates'
  >('preferences');

  // Calculation Functions
  const calculateLTL = () => {
    console.log('🔄 Calculating LTL Quote...');
    const weight = parseFloat(ltlData.weight) || 0;
    const pallets = parseInt(ltlData.pallets) || 1;
    const freightClass = parseInt(ltlData.freightClass) || 50;

    let baseRate = weight * 0.85;
    if (freightClass >= 175) baseRate *= 1.5;
    else if (freightClass >= 125) baseRate *= 1.3;
    else if (freightClass >= 85) baseRate *= 1.1;

    let totalRate = baseRate;
    if (ltlData.liftgate) totalRate += 150;
    if (ltlData.residential) totalRate += 200;

    const fuelSurcharge = totalRate * 0.15;
    const total = totalRate + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'LTL',
      quoteNumber: `LTL-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(totalRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        weight,
        pallets,
        freightClass,
        liftgate: ltlData.liftgate,
        residential: ltlData.residential,
        origin: ltlData.origin,
        destination: ltlData.destination,
        commodity: ltlData.commodity,
      },
    };

    console.log('✅ LTL Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateFTL = () => {
    console.log('🔄 Calculating FTL Quote...');
    const miles = parseFloat(ftlData.miles) || 0;
    const weight = parseFloat(ftlData.weight) || 0;

    let baseRate = miles * 2.5;
    if (ftlData.equipmentType === 'Flatbed') baseRate *= 1.3;
    else if (ftlData.equipmentType === 'Reefer') baseRate *= 1.4;
    else if (ftlData.equipmentType === 'Power Only') baseRate *= 0.8;

    if (ftlData.hazmat) baseRate *= 1.25;
    if (ftlData.teamDriver) baseRate *= 1.5;

    const fuelSurcharge = baseRate * 0.18;
    const total = baseRate + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'FTL',
      quoteNumber: `FTL-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        miles,
        weight,
        equipmentType: ftlData.equipmentType,
        hazmat: ftlData.hazmat,
        teamDriver: ftlData.teamDriver,
        origin: ftlData.origin,
        destination: ftlData.destination,
        commodity: ftlData.commodity,
      },
    };

    console.log('✅ FTL Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateSpecialized = () => {
    console.log('🔄 Calculating Specialized Quote...');
    const weight = parseFloat(specializedData.weight) || 0;
    const value = parseFloat(specializedData.value) || 0;

    let baseRate = weight * 1.2;
    if (specializedData.serviceType === 'White Glove') baseRate *= 1.5;
    else if (specializedData.serviceType === 'Inside Delivery') baseRate *= 1.3;
    else if (specializedData.serviceType === 'Liftgate') baseRate *= 1.2;

    const insuranceCost = value * 0.01;
    const fuelSurcharge = baseRate * 0.15;
    const total = baseRate + insuranceCost + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'Specialized',
      quoteNumber: `SPC-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      details: {
        serviceType: specializedData.serviceType,
        weight,
        value,
        dimensions: specializedData.dimensions,
        origin: specializedData.origin,
        destination: specializedData.destination,
        specialRequirements: specializedData.specialRequirements,
      },
    };

    console.log('✅ Specialized Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateWarehousing = () => {
    console.log('🔄 Calculating Warehousing Quote...');
    const palletCount = parseInt(warehousingData.palletCount) || 0;
    const duration = parseInt(warehousingData.duration) || 1;

    let baseRate = palletCount * 25 * duration;
    if (warehousingData.serviceType === 'Cross-Dock') baseRate *= 0.8;
    else if (warehousingData.serviceType === 'Pick & Pack') baseRate *= 1.3;
    else if (warehousingData.serviceType === 'Kitting') baseRate *= 1.4;
    else if (warehousingData.serviceType === 'Distribution') baseRate *= 1.2;

    if (warehousingData.temperature === 'Cold Storage') baseRate *= 1.5;
    else if (warehousingData.temperature === 'Frozen') baseRate *= 2.0;

    const handlingFee = baseRate * 0.1;
    const total = baseRate + handlingFee;

    const quote = {
      id: Date.now().toString(),
      type: 'Warehousing',
      quoteNumber: `WH-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(baseRate),
      fuelSurcharge: Math.round(handlingFee),
      total: Math.round(total),
      details: {
        serviceType: warehousingData.serviceType,
        palletCount,
        duration,
        location: warehousingData.location,
        temperature: warehousingData.temperature,
      },
    };

    console.log('✅ Warehousing Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  const calculateMultiService = () => {
    console.log('🔄 Calculating Multi-Service Quote...');

    if (multiServiceData.selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    if (!multiServiceData.commonOrigin || !multiServiceData.commonDestination) {
      alert('Please enter origin and destination');
      return;
    }

    const totalWeight = parseFloat(multiServiceData.totalWeight) || 0;
    let totalBaseRate = 0;
    const serviceBreakdown: any[] = [];

    // Calculate individual service costs
    multiServiceData.selectedServices.forEach((service) => {
      let serviceCost = 0;

      switch (service) {
        case 'LTL':
          serviceCost = totalWeight * 0.85;
          break;
        case 'FTL':
          serviceCost = 500; // Base FTL cost
          break;
        case 'Warehousing':
          serviceCost = Math.ceil(totalWeight / 1000) * 25; // $25 per 1000 lbs
          break;
        case 'Specialized':
          serviceCost = totalWeight * 1.2;
          break;
        default:
          serviceCost = totalWeight * 0.5; // Default rate
      }

      totalBaseRate += serviceCost;
      serviceBreakdown.push({
        service,
        cost: Math.round(serviceCost),
      });
    });

    // Apply multi-service discount (5% for 2+ services)
    const discount =
      multiServiceData.selectedServices.length >= 2 ? totalBaseRate * 0.05 : 0;
    const discountedRate = totalBaseRate - discount;
    const fuelSurcharge = discountedRate * 0.15;
    const total = discountedRate + fuelSurcharge;

    const quote = {
      id: Date.now().toString(),
      type: 'Multi-Service',
      quoteNumber: `MS-${Date.now()}`,
      timestamp: Date.now(),
      baseRate: Math.round(discountedRate),
      fuelSurcharge: Math.round(fuelSurcharge),
      total: Math.round(total),
      discount: Math.round(discount),
      serviceBreakdown,
      details: {
        selectedServices: multiServiceData.selectedServices,
        commonOrigin: multiServiceData.commonOrigin,
        commonDestination: multiServiceData.commonDestination,
        totalWeight,
        notes: multiServiceData.notes,
      },
    };

    console.log('✅ Multi-Service Quote calculated:', quote);
    setPendingQuote(quote);
    setShowConfirmation(true);
  };

  // Quote Acceptance Workflow Functions
  const initializeQuoteAcceptanceWorkflow = (quote: any, shipper: any) => {
    const workflow = businessWorkflowManager.initializeQuoteAcceptanceWorkflow(
      quote.id,
      'broker-001', // Current broker ID
      shipper.id,
      {
        ...quote,
        shipper: shipper,
      }
    );

    setQuoteAcceptanceWorkflow(workflow);
    return workflow;
  };

  const handleQuoteAcceptance = async (quote: any, shipper: any) => {
    // Initialize workflow
    const workflow = initializeQuoteAcceptanceWorkflow(quote, shipper);

    // Complete initial steps
    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_generated',
      quote,
      'broker-001'
    );

    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_sent_to_shipper',
      { sentAt: new Date().toISOString() },
      'broker-001'
    );

    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_reviewed_by_shipper',
      { reviewedAt: new Date().toISOString() },
      shipper.id
    );

    await businessWorkflowManager.completeBusinessStep(
      workflow.id,
      'quote_accepted_by_shipper',
      { acceptedAt: new Date().toISOString() },
      shipper.id
    );

    // Show acceptance modal with shipper creation options
    setSelectedAcceptedQuote({ ...quote, shipper, workflowId: workflow.id });
    setWorkflowForShipperCreation(workflow);
    setShowQuoteAcceptance(true);
  };

  const generateBrokerShipperAgreement = async (acceptedQuote: any) => {
    setContractGenerationStatus('generating');

    try {
      // Complete contract generation step
      await businessWorkflowManager.completeBusinessStep(
        acceptedQuote.workflowId,
        'contract_generation_triggered',
        { triggeredAt: new Date().toISOString() },
        'broker-001'
      );

      // Use existing broker contract system with pre-filled data
      const contractData = {
        clientName: acceptedQuote.shipper.name,
        clientEmail: acceptedQuote.shipper.email,
        clientPhone: acceptedQuote.shipper.phone,
        services: acceptedQuote.services || [acceptedQuote.type],
        rates: acceptedQuote.rates,
        terms: 'Standard Broker-Shipper Agreement',
        status: 'pending_signature',
        quoteReference: acceptedQuote.quoteNumber,
        generatedFromQuote: true,
      };

      // Navigate to existing broker contracts page with pre-filled data
      window.location.href = `/broker/contracts?prefill=${encodeURIComponent(JSON.stringify(contractData))}`;

      setContractGenerationStatus('sent');
    } catch (error) {
      console.error('Error generating contract:', error);
      setContractGenerationStatus('error');
    }
  };

  const confirmQuote = () => {
    if (pendingQuote) {
      setQuotes((prev) => [pendingQuote, ...prev]);
      console.log('✅ Quote confirmed and saved!');
      setShowConfirmation(false);
      setPendingQuote(null);
    }
  };

  useEffect(() => {
    // Auto-create demo broker session (no login required)
    const demoSession = {
      id: 'broker-demo-001',
      brokerCode: 'DEMO001',
      brokerName: 'Demo Broker',
      email: 'demo@fleetflow.com',
      role: 'broker',
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('brokerSession', JSON.stringify(demoSession));
    setBrokerSession(demoSession);
  }, []);

  // 🔗 LOAD UNIFIED QUOTES: Load quotes generated from the unified quoting system
  useEffect(() => {
    if (brokerSession?.id) {
      const brokerQuotesKey = `broker-quotes-${brokerSession.id}`;
      const unifiedQuotes = localStorage.getItem(brokerQuotesKey);
      if (unifiedQuotes) {
        try {
          const parsedQuotes = JSON.parse(unifiedQuotes);
          // Merge unified quotes with existing broker quotes
          setQuotes((prevQuotes) => {
            const existingIds = prevQuotes.map((q) => q.id);
            const newQuotes = parsedQuotes.filter(
              (q: any) => !existingIds.includes(q.id)
            );
            return [...newQuotes, ...prevQuotes];
          });
          console.log('🎯 Loaded unified quotes for broker:', {
            broker: brokerSession.brokerName,
            count: parsedQuotes.length,
          });
        } catch (error) {
          console.error('Error loading unified quotes:', error);
        }
      }
    }
  }, [brokerSession]);

  const handleLogout = () => {
    localStorage.removeItem('brokerSession');
    router.push('/broker');
  };

  const handleLoadCreated = (load: Load) => {
    console.log('New load created:', load);
    setShowCreateForm(false);
    // Refresh the load board by switching tabs and back
    setSelectedTab('bids');
    setTimeout(() => setSelectedTab('loads'), 100);
  };

  // Get shippers assigned to this broker
  const myShippers = shippers.filter(
    (shipper: any) =>
      shipper.assignedBrokerId === brokerSession?.id ||
      shipper.assignedBrokerId === brokerSession?.brokerCode
  );

  if (!brokerSession) {
    return (
      <div
        style={{
          backgroundImage: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
        `,
          backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
          backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '18px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          🔐 Verifying broker credentials...
        </div>
      </div>
    );
  }

  // const currentDispatcher = availableDispatchers.find(
  //   (d) => d.id === brokerSession.id.replace('broker-', 'disp-')
  // );

  // Add function to handle shipper creation mode selection
  const handleShipperCreationMode = (mode: 'manual' | 'automated') => {
    setShipperCreationMode(mode);
    setShowQuoteAcceptance(false);

    if (mode === 'automated') {
      // Show existing AddShipperForm for automated creation
      setShowShipperCreation(true);
    } else {
      // Proceed directly to contract generation for manual creation
      generateBrokerShipperAgreement(selectedAcceptedQuote);
    }
  };

  // Add function to handle shipper form submission
  const handleShipperFormSubmit = async (shipperData: any) => {
    try {
      // Complete shipper information collection step
      await businessWorkflowManager.completeBusinessStep(
        workflowForShipperCreation.id,
        'shipper_information_collected',
        shipperData,
        'shipper'
      );

      // Complete shipper verification step (auto-approved for demo)
      await businessWorkflowManager.completeBusinessStep(
        workflowForShipperCreation.id,
        'shipper_verified',
        {
          creditApproved: true,
          creditLimit: 50000,
          verificationNotes: 'Auto-approved for demo',
          verifiedBy: 'broker-001',
        },
        'broker-001'
      );

      // Create shipper in system
      const result = await businessWorkflowManager.createShipperInSystem(
        workflowForShipperCreation.id,
        shipperData
      );

      if (result.success) {
        setShowShipperCreation(false);
        // Proceed to contract generation
        generateBrokerShipperAgreement(selectedAcceptedQuote);
      }
    } catch (error) {
      console.error('Error in shipper creation workflow:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        padding: '20px',
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          backgroundImage: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
        `,
          backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
          backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Back Button */}
        <div style={{ padding: '16px 24px' }}>
          <Link href='/'>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ marginRight: '8px' }}>←</span>
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Main Container */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px 32px',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h1
                  style={{
                    color: 'white',
                    margin: 0,
                    fontSize: '2rem',
                    fontWeight: '700',
                    background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                  }}
                >
                  🚛 Brokerage Portal & Freight Management
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: '4px 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '500',
                  }}
                >
                  Professional Freight Brokerage • Customer Relationship
                  Management • Load Optimization
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '8px',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    ✅ {brokerSession?.brokerName || 'Broker'} Active
                  </span>
                  <span
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    🆔 {brokerSession?.brokerCode || 'N/A'}
                  </span>
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#fbbf24',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    🚛 MC: {brokerSession?.mcNumber || 'N/A'}
                  </span>
                </div>
              </div>
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                <DocumentsPortalButton variant='small' />
                <button
                  onClick={() => router.push('/notifications')}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #d97706, #f59e0b)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(245, 158, 11, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #f59e0b, #d97706)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 15px rgba(245, 158, 11, 0.3)';
                  }}
                  title='Notifications'
                >
                  🔔
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title='Settings'
                >
                  ⚙️
                </button>
                <button
                  onClick={() => setSelectedTab('agent-management')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title='Agent Management'
                >
                  👥
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #dc2626, #b91c1c)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #ef4444, #dc2626)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>👥</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Active Shippers
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    {performanceMetrics?.customerCount || 0}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>📦</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Active Loads
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    {performanceMetrics?.activeLoads || 0}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>💰</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Monthly Revenue
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${performanceMetrics?.totalRevenue?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>📊</span>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    Success Rate
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      fontWeight: 'bold',
                    }}
                  >
                    {performanceMetrics?.winRate || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            {[
              {
                id: 'quotes-workflow',
                label: 'Quotes & Workflow',
                icon: '💼',
                color: '#3b82f6',
              },
              {
                id: 'loads-bids',
                label: 'Loads & Bidding',
                icon: '📦',
                color: '#14b8a6',
              },
              {
                id: 'contracts-bol',
                label: 'Contracts & BOL',
                icon: '📋',
                color: '#f97316',
              },
              {
                id: 'analytics',
                label: 'Performance Analytics',
                icon: '📊',
                color: '#6366f1',
              },
              {
                id: 'ai-intelligence',
                label: 'AI Intelligence',
                icon: '🤖',
                color: '#8b5cf6',
              },
              {
                id: 'financial-dashboard',
                label: 'Financial Dashboard',
                icon: '💹',
                color: '#10b981',
              },
              {
                id: 'enhanced-crm',
                label: 'Enhanced CRM',
                icon: '🏢',
                color: '#1e40af',
              },
              {
                id: 'carrier-network',
                label: 'Carrier Network',
                icon: '🚛',
                color: '#0ea5e9',
              },
              {
                id: 'market-intelligence',
                label: 'Market Intelligence',
                icon: '📊',
                color: '#ec4899',
              },
              {
                id: 'shipper-acquisition',
                label: 'Shipper Acquisition',
                icon: '🏢',
                color: '#059669',
              },
              {
                id: 'phone-monitoring',
                label: 'Phone Monitoring',
                icon: '📞',
                color: '#0f766e',
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  background:
                    selectedTab === tab.id
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                      : 'rgba(255, 255, 255, 0.1)',
                  color:
                    selectedTab === tab.id
                      ? '#60a5fa'
                      : 'rgba(255, 255, 255, 0.8)',
                  border:
                    selectedTab === tab.id
                      ? '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {[
              {
                title: 'Active Quotes',
                value: quotes.length,
                unit: '',
                change: '+12',
                trend: 'up',
                description: 'Currently active freight quotes',
                color: '#3b82f6',
                background: 'rgba(59, 130, 246, 0.5)',
                border: 'rgba(59, 130, 246, 0.3)',
              },
              {
                title: 'Loads in Progress',
                value: acceptedQuotes.length,
                unit: '',
                change: '+5',
                trend: 'up',
                description: 'Loads currently being transported',
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.5)',
                border: 'rgba(16, 185, 129, 0.3)',
              },
              {
                title: 'Total Revenue',
                value: (
                  brokerContracts.reduce(
                    (sum, contract) => sum + (contract.totalValue || 0),
                    0
                  ) / 1000
                ).toFixed(1),
                unit: 'K',
                change: '+18.5%',
                trend: 'up',
                description: 'Total revenue from active contracts',
                color: '#8b5cf6',
                background: 'rgba(139, 92, 246, 0.5)',
                border: 'rgba(139, 92, 246, 0.3)',
              },
              {
                title: 'Customer Satisfaction',
                value: 94.2,
                unit: '%',
                change: '+2.1%',
                trend: 'up',
                description: 'Overall customer satisfaction score',
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.5)',
                border: 'rgba(245, 158, 11, 0.3)',
              },
              {
                title: 'On-Time Delivery',
                value: 96.8,
                unit: '%',
                change: '+1.3%',
                trend: 'up',
                description: 'On-time delivery performance',
                color: '#14b8a6',
                background: 'rgba(20, 184, 166, 0.5)',
                border: 'rgba(20, 184, 166, 0.3)',
              },
              {
                title: 'Cost Savings',
                value: 12.4,
                unit: '%',
                change: '+3.2%',
                trend: 'up',
                description: 'Cost optimization vs previous period',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.5)',
                border: 'rgba(239, 68, 68, 0.3)',
              },
            ].map((kpi, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'white',
                      margin: 0,
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    {kpi.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '12px',
                      color: kpi.trend === 'up' ? '#10b981' : '#ef4444',
                      fontWeight: '600',
                    }}
                  >
                    {kpi.change}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: kpi.color,
                    marginBottom: '0.25rem',
                  }}
                >
                  {typeof kpi.value === 'number' && kpi.value % 1 !== 0
                    ? kpi.value.toFixed(1)
                    : kpi.value}
                  {kpi.unit}
                </div>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  {kpi.description}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {selectedTab === 'quotes-workflow' && (
              <div
                style={{
                  border: '2px solid #8b5cf6', // Purple outline around entire section
                  borderRadius: '16px',
                  padding: '24px',
                  background: 'rgba(0, 0, 0, 0.4)', // Darker background for better contrast
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  💰 Freight Quotes
                </h2>

                {/* Quote Type Tabs */}
                <div
                  style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}
                >
                  {[
                    { id: 'LTL', label: 'LTL', icon: '📦', color: '#8b5cf6' },
                    { id: 'FTL', label: 'FTL', icon: '🚛', color: '#6366f1' },
                    {
                      id: 'Specialized',
                      label: 'Specialized',
                      icon: '⭐',
                      color: '#6366f1',
                    },
                    {
                      id: 'Warehousing',
                      label: 'Warehousing',
                      icon: '🏢',
                      color: '#14b8a6',
                    },
                    {
                      id: 'Multi-Service',
                      label: 'Multi-Service',
                      icon: '🔄',
                      color: '#f59e0b',
                    },
                    {
                      id: 'SpotRates',
                      label: 'Spot Rates',
                      icon: '📈',
                      color: '#10b981',
                    },
                    {
                      id: 'History',
                      label: 'History',
                      icon: '📋',
                      color: '#6b7280',
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveQuoteTab(tab.id as any)}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backgroundColor:
                          activeQuoteTab === tab.id
                            ? `${tab.color}30` // Use tab's color with more opacity
                            : 'rgba(255, 255, 255, 0.15)', // Slightly more visible inactive buttons
                        color:
                          activeQuoteTab === tab.id
                            ? tab.color // Use tab's color
                            : 'rgba(255, 255, 255, 0.8)',
                        border:
                          activeQuoteTab === tab.id
                            ? `1px solid ${tab.color}60` // Stronger border for active tabs
                            : '1px solid rgba(255, 255, 255, 0.2)', // More visible inactive borders
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <span style={{ marginRight: '6px' }}>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* LTL Calculator */}
                {activeQuoteTab === 'LTL' && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(139, 92, 246, 0.5)', // Stronger purple border
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#8b5cf6' }}>
                      📦 LTL (Less Than Truckload) Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Weight (lbs) *
                        </label>
                        <input
                          type='number'
                          value={ltlData.weight}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Enter weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Pallet Count
                        </label>
                        <input
                          type='number'
                          value={ltlData.pallets}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              pallets: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Number of pallets'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Freight Class
                        </label>
                        <select
                          value={ltlData.freightClass}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              freightClass: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='50'>Class 50</option>
                          <option value='55'>Class 55</option>
                          <option value='60'>Class 60</option>
                          <option value='65'>Class 65</option>
                          <option value='70'>Class 70</option>
                          <option value='77.5'>Class 77.5</option>
                          <option value='85'>Class 85</option>
                          <option value='92.5'>Class 92.5</option>
                          <option value='100'>Class 100</option>
                          <option value='110'>Class 110</option>
                          <option value='125'>Class 125</option>
                          <option value='150'>Class 150</option>
                          <option value='175'>Class 175</option>
                          <option value='200'>Class 200</option>
                          <option value='250'>Class 250</option>
                          <option value='300'>Class 300</option>
                          <option value='400'>Class 400</option>
                          <option value='500'>Class 500</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Origin *
                        </label>
                        <input
                          type='text'
                          value={ltlData.origin}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              origin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Origin city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Destination *
                        </label>
                        <input
                          type='text'
                          value={ltlData.destination}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Commodity
                        </label>
                        <input
                          type='text'
                          value={ltlData.commodity}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              commodity: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Type of goods'
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        marginTop: '20px',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ltlData.liftgate}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              liftgate: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Liftgate Required (+$75)
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ltlData.residential}
                          onChange={(e) =>
                            setLtlData((prev) => ({
                              ...prev,
                              residential: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Residential Delivery (+$50)
                      </label>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 LTL Calculate Button Clicked!');
                        calculateLTL();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', // Purple gradient
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      💰 Calculate LTL Quote
                    </button>
                  </div>
                )}

                {/* FTL Calculator */}
                {activeQuoteTab === 'FTL' && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#3b82f6' }}>
                      🚛 FTL (Full Truckload) Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Miles *
                        </label>
                        <input
                          type='number'
                          value={ftlData.miles}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              miles: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total miles'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Equipment Type
                        </label>
                        <select
                          value={ftlData.equipmentType}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              equipmentType: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='Van'>Dry Van</option>
                          <option value='Reefer'>Refrigerated</option>
                          <option value='Flatbed'>Flatbed</option>
                          <option value='Step Deck'>Step Deck</option>
                          <option value='Lowboy'>Lowboy</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Weight (lbs)
                        </label>
                        <input
                          type='number'
                          value={ftlData.weight}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Origin *
                        </label>
                        <input
                          type='text'
                          value={ftlData.origin}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              origin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Origin city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Destination *
                        </label>
                        <input
                          type='text'
                          value={ftlData.destination}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Commodity
                        </label>
                        <input
                          type='text'
                          value={ftlData.commodity}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              commodity: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Type of goods'
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        marginTop: '20px',
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ftlData.hazmat}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              hazmat: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Hazmat (+$200)
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={ftlData.teamDriver}
                          onChange={(e) =>
                            setFtlData((prev) => ({
                              ...prev,
                              teamDriver: e.target.checked,
                            }))
                          }
                          style={{ marginRight: '8px' }}
                        />
                        Team Driver (+$300)
                      </label>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 FTL Calculate Button Clicked!');
                        calculateFTL();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate FTL Quote
                    </button>
                  </div>
                )}

                {/* Specialized Calculator */}
                {activeQuoteTab === 'Specialized' && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#f59e0b' }}>
                      ⭐ Specialized Services Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Service Type
                        </label>
                        <select
                          value={specializedData.serviceType}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              serviceType: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='White Glove'>
                            White Glove Service
                          </option>
                          <option value='Art/Antiques'>Art & Antiques</option>
                          <option value='Medical Equipment'>
                            Medical Equipment
                          </option>
                          <option value='Electronics'>
                            High-Value Electronics
                          </option>
                          <option value='Trade Shows'>
                            Trade Show Logistics
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Weight (lbs)
                        </label>
                        <input
                          type='number'
                          value={specializedData.weight}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              weight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Dimensions (L×W×H)
                        </label>
                        <input
                          type='text'
                          value={specializedData.dimensions}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              dimensions: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='e.g., 48×40×60 inches'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Declared Value ($)
                        </label>
                        <input
                          type='number'
                          value={specializedData.value}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              value: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Item value for insurance'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Origin *
                        </label>
                        <input
                          type='text'
                          value={specializedData.origin}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              origin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Origin city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Destination *
                        </label>
                        <input
                          type='text'
                          value={specializedData.destination}
                          onChange={(e) =>
                            setSpecializedData((prev) => ({
                              ...prev,
                              destination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 Specialized Calculate Button Clicked!');
                        calculateSpecialized();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate Specialized Quote
                    </button>
                  </div>
                )}

                {/* Warehousing Calculator */}
                {activeQuoteTab === 'Warehousing' && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(139, 92, 246, 0.3)', // Purple border accent
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#8b5cf6' }}>
                      🏢 Warehousing Services Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Service Type
                        </label>
                        <select
                          value={warehousingData.serviceType}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              serviceType: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='Storage'>Storage Only</option>
                          <option value='Cross-Dock'>Cross-Docking</option>
                          <option value='Pick & Pack'>Pick & Pack</option>
                          <option value='Kitting'>Kitting & Assembly</option>
                          <option value='Distribution'>
                            Distribution Services
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Pallet Count *
                        </label>
                        <input
                          type='number'
                          value={warehousingData.palletCount}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              palletCount: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Number of pallets'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Duration (months) *
                        </label>
                        <input
                          type='number'
                          value={warehousingData.duration}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              duration: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Storage duration'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Location *
                        </label>
                        <input
                          type='text'
                          value={warehousingData.location}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Warehouse location'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Temperature Requirements
                        </label>
                        <select
                          value={warehousingData.temperature}
                          onChange={(e) =>
                            setWarehousingData((prev) => ({
                              ...prev,
                              temperature: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='Ambient'>Ambient Temperature</option>
                          <option value='Climate Controlled'>
                            Climate Controlled
                          </option>
                          <option value='Refrigerated'>
                            Refrigerated (32-40°F)
                          </option>
                          <option value='Frozen'>Frozen (-10 to 0°F)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🎯 Warehousing Calculate Button Clicked!');
                        calculateWarehousing();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #14b8a6, #0d9488)', // FLEETFLOW - Teal
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate Warehousing Quote
                    </button>
                  </div>
                )}

                {/* Multi-Service Calculator */}
                {activeQuoteTab === 'Multi-Service' && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#f59e0b' }}>
                      🔄 Multi-Service Quote Calculator
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Selected Services
                        </label>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '12px',
                            marginBottom: '16px',
                          }}
                        >
                          {['LTL', 'FTL', 'Warehousing', 'Specialized'].map(
                            (service) => (
                              <label
                                key={service}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  borderRadius: '6px',
                                  background:
                                    multiServiceData.selectedServices.includes(
                                      service
                                    )
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : 'rgba(255, 255, 255, 0.05)',
                                  border:
                                    multiServiceData.selectedServices.includes(
                                      service
                                    )
                                      ? '1px solid rgba(34, 197, 94, 0.3)'
                                      : '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                              >
                                <input
                                  type='checkbox'
                                  checked={multiServiceData.selectedServices.includes(
                                    service
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setMultiServiceData((prev) => ({
                                        ...prev,
                                        selectedServices: [
                                          ...prev.selectedServices,
                                          service,
                                        ],
                                      }));
                                    } else {
                                      setMultiServiceData((prev) => ({
                                        ...prev,
                                        selectedServices:
                                          prev.selectedServices.filter(
                                            (s) => s !== service
                                          ),
                                      }));
                                    }
                                  }}
                                  style={{
                                    marginRight: '8px',
                                    transform: 'scale(1.2)',
                                  }}
                                />
                                <span
                                  style={{ fontSize: '14px', color: 'white' }}
                                >
                                  {service}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                        {multiServiceData.selectedServices.length > 0 && (
                          <div
                            style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              borderRadius: '8px',
                              padding: '12px',
                              marginTop: '8px',
                            }}
                          >
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              Selected Services:
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '12px',
                              }}
                            >
                              {multiServiceData.selectedServices.join(', ')}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Common Origin
                        </label>
                        <input
                          type='text'
                          value={multiServiceData.commonOrigin}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              commonOrigin: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Origin city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Common Destination
                        </label>
                        <input
                          type='text'
                          value={multiServiceData.commonDestination}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              commonDestination: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Destination city, state'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Total Weight (lbs)
                        </label>
                        <input
                          type='number'
                          value={multiServiceData.totalWeight}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              totalWeight: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Total weight'
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)', // Better label contrast
                          }}
                        >
                          Notes
                        </label>
                        <textarea
                          value={multiServiceData.notes}
                          onChange={(e) =>
                            setMultiServiceData((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            background: 'rgba(0, 0, 0, 0.3)', // Darker input background
                            color: 'white',
                            fontSize: '14px',
                          }}
                          placeholder='Additional notes'
                        />
                      </div>
                    </div>

                    <button
                      className='freight-quote-button'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          '🎯 Multi-Service Calculate Button Clicked!'
                        );
                        calculateMultiService();
                      }}
                      style={{
                        marginTop: '24px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      💰 Calculate Multi-Service Quote
                    </button>
                  </div>
                )}

                {/* Quote History */}
                {activeQuoteTab === 'History' && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#6b7280' }}>
                      📋 Quote History
                    </h3>
                    {quotes.length === 0 ? (
                      <p
                        style={{
                          textAlign: 'center',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        No quotes generated yet. Use the calculators above to
                        create your first quote.
                      </p>
                    ) : (
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {quotes.map((quote) => (
                          <div
                            key={quote.id}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              padding: '20px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <div>
                                <h4
                                  style={{
                                    margin: '0 0 8px 0',
                                    color: '#10b981',
                                  }}
                                >
                                  {quote.type} Quote - {quote.quoteNumber}
                                </h4>
                                <p
                                  style={{
                                    margin: '0 0 4px 0',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '14px',
                                  }}
                                >
                                  Generated:{' '}
                                  {new Date(quote.timestamp).toLocaleString()}
                                </p>
                                {quote.customer && (
                                  <p
                                    style={{
                                      margin: '0 0 4px 0',
                                      color: 'rgba(255, 255, 255, 0.8)',
                                      fontSize: '12px',
                                    }}
                                  >
                                    Customer: {quote.customer}
                                  </p>
                                )}
                                {quote.details?.engines &&
                                  quote.details.engines.length > 0 && (
                                    <p
                                      style={{
                                        margin: '0',
                                        color: 'rgba(99, 102, 241, 0.8)',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      🤖 AI Engines:{' '}
                                      {quote.details.engines.join(', ')}
                                    </p>
                                  )}
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div
                                  style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: '#10b981',
                                  }}
                                >
                                  ${quote.total.toLocaleString()}
                                </div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    marginBottom: '4px',
                                  }}
                                >
                                  Base: $
                                  {quote.rate?.toLocaleString() ||
                                    quote.baseRate}{' '}
                                  + Fuel: ${quote.fuelSurcharge}
                                </div>
                                {quote.appliedRule && (
                                  <div
                                    style={{
                                      fontSize: '11px',
                                      color: 'rgba(34, 197, 94, 0.7)',
                                      fontStyle: 'italic',
                                    }}
                                  >
                                    ✨ {quote.appliedRule}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Spot Rate Optimization */}
                {activeQuoteTab === 'SpotRates' && (
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
                      borderRadius: '16px',
                      padding: '32px',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <h3 style={{ marginBottom: '24px', color: '#6366f1' }}>
                      📈 AI-Powered Spot Rate Optimization
                    </h3>
                    <div style={{ marginBottom: '16px' }}>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '16px',
                        }}
                      >
                        Get real-time market intelligence and optimal pricing
                        recommendations for your freight quotes.
                      </p>
                    </div>
                    <SpotRateOptimizationWidget />
                  </div>
                )}

                {/* Navigation to Full Quotes Page */}
                <div
                  style={{
                    marginTop: '32px',
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      marginBottom: '16px',
                      fontSize: '18px',
                    }}
                  >
                    🎯 Advanced Quote Management
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '20px',
                      fontSize: '14px',
                    }}
                  >
                    Access the complete unified quoting system with AI-powered
                    pricing engines, emergency load pricing, spot rate
                    optimization, and volume discounts.
                  </p>
                  <button
                    onClick={() => router.push('/quoting')}
                    style={{
                      padding: '16px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow =
                        '0 6px 20px rgba(99, 102, 241, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(0px)';
                      target.style.boxShadow =
                        '0 4px 16px rgba(99, 102, 241, 0.3)';
                    }}
                  >
                    🚀 Open Full Quoting System
                  </button>
                </div>

                {/* Workflow Automation Section - COMPLETE VERSION */}
                <div style={{ marginTop: '48px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold',
                          margin: 0,
                          marginBottom: '8px',
                        }}
                      >
                        🔄 Workflow Automation Engine
                      </h2>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          margin: 0,
                        }}
                      >
                        Automated workflows for quotes, contracts, and
                        operations
                      </p>
                    </div>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)', // AMBER
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      + Create Rule
                    </button>
                  </div>

                  {/* Automation Overview Cards - COMPLETE VERSION */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                        ⚡
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                        }}
                      >
                        Active Rules
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        12
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                        🔄
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                        }}
                      >
                        Tasks Automated
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        348
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                        💰
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                        }}
                      >
                        Time Saved
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        24hrs
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                        📊
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '12px',
                        }}
                      >
                        Success Rate
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        94%
                      </div>
                    </div>
                  </div>

                  {/* Active Workflow Rules - COMPLETE VERSION */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      marginBottom: '24px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                      }}
                    >
                      🔄 Active Automation Rules
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      {[
                        {
                          name: 'Auto-Quote Generation',
                          trigger: 'New RFQ Received',
                          status: 'Active',
                          lastRun: '2 min ago',
                          success: '98%',
                        },
                        {
                          name: 'Invoice Processing',
                          trigger: 'Load Delivered',
                          status: 'Active',
                          lastRun: '15 min ago',
                          success: '95%',
                        },
                        {
                          name: 'Carrier Assignment',
                          trigger: 'Quote Accepted',
                          status: 'Active',
                          lastRun: '1 hour ago',
                          success: '92%',
                        },
                        {
                          name: 'Document Generation',
                          trigger: 'Contract Signed',
                          status: 'Paused',
                          lastRun: '3 hours ago',
                          success: '88%',
                        },
                      ].map((rule, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background:
                                  rule.status === 'Active'
                                    ? '#10b981'
                                    : '#f59e0b',
                              }}
                            />
                            <div>
                              <div
                                style={{
                                  color: 'white',
                                  fontWeight: '600',
                                  marginBottom: '4px',
                                }}
                              >
                                {rule.name}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  fontSize: '14px',
                                }}
                              >
                                Trigger: {rule.trigger}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '24px',
                            }}
                          >
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontSize: '12px',
                                }}
                              >
                                Last Run
                              </div>
                              <div style={{ color: 'white', fontSize: '14px' }}>
                                {rule.lastRun}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontSize: '12px',
                                }}
                              >
                                Success Rate
                              </div>
                              <div
                                style={{
                                  color: '#10b981',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                }}
                              >
                                {rule.success}
                              </div>
                            </div>
                            <button
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Automated Tasks - MISSING SECTION ADDED */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                      }}
                    >
                      📋 Recent Automated Tasks
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {[
                        {
                          task: 'Generated quote for Atlanta → Miami shipment',
                          rule: 'Auto-Quote Generation',
                          status: 'Completed',
                          time: '2 minutes ago',
                        },
                        {
                          task: 'Processed invoice #INV-2024-0892',
                          rule: 'Invoice Processing',
                          status: 'Completed',
                          time: '15 minutes ago',
                        },
                        {
                          task: 'Assigned carrier for Load #L-24-5678',
                          rule: 'Carrier Assignment',
                          status: 'Completed',
                          time: '1 hour ago',
                        },
                        {
                          task: 'Generated BOL for shipment #SH-24-9876',
                          rule: 'Document Generation',
                          status: 'In Progress',
                          time: '2 hours ago',
                        },
                        {
                          task: 'Sent delivery confirmation to customer',
                          rule: 'Customer Notifications',
                          status: 'Completed',
                          time: '3 hours ago',
                        },
                      ].map((task, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{ color: 'white', marginBottom: '4px' }}
                            >
                              {task.task}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              Rule: {task.rule}
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <div
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                background:
                                  task.status === 'Completed'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(245, 158, 11, 0.2)',
                                color:
                                  task.status === 'Completed'
                                    ? '#10b981'
                                    : '#f59e0b',
                              }}
                            >
                              {task.status}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                                minWidth: '80px',
                              }}
                            >
                              {task.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'loads-bids' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      📦 My Loads & Active Bidding
                    </h2>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      Intelligent bidding with margin tracking and market
                      analysis
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)', // OPERATIONS - Blue
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #2563eb, #1d4ed8)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'linear-gradient(135deg, #3b82f6, #2563eb)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    + Create Load
                  </button>
                </div>

                {/* Load Management Quick Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Active Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'pending')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      🏆
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Won Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'won')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      📈
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Avg Margin
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {performanceMetrics?.avgMargin || 0}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      💰
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Win Rate
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {performanceMetrics?.winRate || 0}%
                    </div>
                  </div>
                </div>

                <EnhancedLoadBoard />
              </div>
            )}

            {selectedTab === 'warehouse-flow' && (
              <div>
                <WarehouseShipmentFlow
                  brokerId={brokerSession.id}
                  brokerName={brokerSession.brokerName}
                  selectedShipperId={undefined}
                />
              </div>
            )}

            {selectedTab === 'bol-review' && (
              <div>
                <BOLReviewPanel
                  brokerId={brokerSession.id}
                  brokerName={brokerSession.brokerName}
                />
              </div>
            )}

            {selectedTab === 'bids' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  💰 Smart Bidding & Market Intelligence
                </h2>

                {/* Bidding Performance Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Pending Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'pending')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      🏆
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Won
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'won')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ❌
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Lost
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'lost')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏰
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Expired
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'expired')
                          .length
                      }
                    </div>
                  </div>
                </div>

                {/* Bidding History Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Bidding History & Performance
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Load ID
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Bid Amount
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Submitted
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {biddingHistory.map((bid) => (
                          <tr key={bid.loadId}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {bid.loadId}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${bid.bidAmount.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {bid.margin}%
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    bid.bidStatus === 'won'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : bid.bidStatus === 'pending'
                                        ? 'rgba(245, 158, 11, 0.2)'
                                        : bid.bidStatus === 'lost'
                                          ? 'rgba(239, 68, 68, 0.2)'
                                          : 'rgba(156, 163, 175, 0.2)',
                                  color:
                                    bid.bidStatus === 'won'
                                      ? '#22c55e'
                                      : bid.bidStatus === 'pending'
                                        ? '#f59e0b'
                                        : bid.bidStatus === 'lost'
                                          ? '#ef4444'
                                          : '#9ca3af',
                                }}
                              >
                                {bid.bidStatus.toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {new Date(bid.submittedAt).toLocaleDateString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                }}
                              >
                                {bid.notes || 'No notes'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '64px 32px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '64px',
                      marginBottom: '16px',
                      opacity: 0.7,
                    }}
                  >
                    💰
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '18px',
                      marginBottom: '8px',
                    }}
                  >
                    No active bids
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '14px',
                    }}
                  >
                    Your bid activity will appear here
                  </p>
                </div>
              </div>
            )}

            {selectedTab === 'analytics' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  📊 Comprehensive Performance Analytics
                </h2>

                {/* Performance Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>💰</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Total Revenue
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          }}
                        >
                          $
                          {performanceMetrics?.totalRevenue?.toLocaleString() ||
                            '0'}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Monthly Growth: +{performanceMetrics?.monthlyGrowth || 0}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🎯</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Win Rate
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          }}
                        >
                          {performanceMetrics?.winRate || 0}%
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Industry Average: 65%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(168, 85, 247, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>📈</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Avg Margin
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold',
                          }}
                        >
                          {performanceMetrics?.avgMargin || 0}%
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '12px',
                      }}
                    >
                      Target: 22.5%
                    </div>
                  </div>
                </div>

                {/* Top Customers */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Top Performing Customers
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {performanceMetrics?.topCustomers?.map(
                      (customer, index) => (
                        <div
                          key={customer.name}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background:
                                  index === 0
                                    ? 'linear-gradient(135deg, #ffd700, #ffed4e)'
                                    : index === 1
                                      ? 'linear-gradient(135deg, #c0c0c0, #e5e5e5)'
                                      : index === 2
                                        ? 'linear-gradient(135deg, #cd7f32, #daa520)'
                                        : 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: index < 3 ? 'black' : 'white',
                                fontWeight: 'bold',
                                fontSize: '14px',
                              }}
                            >
                              #{index + 1}
                            </div>
                            <div>
                              <div
                                style={{
                                  color: 'white',
                                  fontWeight: '600',
                                  fontSize: '16px',
                                }}
                              >
                                {customer.name}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  fontSize: '12px',
                                }}
                              >
                                {customer.loadCount} loads
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px',
                              }}
                            >
                              ${customer.revenue.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              Revenue
                            </div>
                          </div>
                        </div>
                      )
                    ) || []}
                  </div>
                </div>

                {/* Performance Trends */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Performance Trends & Insights
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Load Performance
                      </h4>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Total Loads:{' '}
                          <strong>{performanceMetrics?.totalLoads || 0}</strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Active Loads:{' '}
                          <strong>
                            {performanceMetrics?.activeLoads || 0}
                          </strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Completed Loads:{' '}
                          <strong>
                            {performanceMetrics?.completedLoads || 0}
                          </strong>
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Avg Load Value:{' '}
                          <strong>
                            $
                            {performanceMetrics?.avgLoadValue?.toLocaleString() ||
                              '0'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Customer Metrics
                      </h4>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '16px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Active Customers:{' '}
                          <strong>
                            {performanceMetrics?.customerCount || 0}
                          </strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          High-Risk Customers:{' '}
                          <strong>
                            {
                              shipperProfiles.filter(
                                (s) => s.riskLevel === 'high'
                              ).length
                            }
                          </strong>
                        </div>
                        <div
                          style={{
                            marginBottom: '8px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          A+ Credit Rating:{' '}
                          <strong>
                            {
                              shipperProfiles.filter(
                                (s) => s.creditRating === 'A+'
                              ).length
                            }
                          </strong>
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          Upsell Opportunities:{' '}
                          <strong>{upsellOpportunities.length}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'ai-intelligence' && (
              <div>
                <BrokerAIIntelligenceHub
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'financial-dashboard' && (
              <div>
                <BrokerFinancialDashboard
                  brokerId={brokerSession?.id || 'demo-broker'}
                />

                {/* Carrier Invitation Management */}
                <div style={{ marginTop: '25px' }}>
                  <InvitationQuickManager compact={false} />
                </div>
              </div>
            )}

            {selectedTab === 'enhanced-crm' && (
              <div>
                {/* Enhanced CRM with Glassmorphism Design */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      🏢 Enhanced CRM
                    </h2>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      Customer relationship management and business intelligence
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddShipper(true)}
                    style={{
                      background: 'linear-gradient(135deg, #1e40af, #1e3a8a)', // Dark Blue
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    + Add Shipper
                  </button>
                </div>

                {/* CRM Overview Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      👥
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Total Customers
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      147
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      💰
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Pipeline Value
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      $2.4M
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      📈
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Win Rate
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      78%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                      }}
                    >
                      Active Opportunities
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      34
                    </div>
                  </div>
                </div>

                {/* Recent Customer Activity */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    marginBottom: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    📊 Recent Customer Activity
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {[
                      {
                        customer: 'Walmart Distribution',
                        activity:
                          'Requested new quote for Atlanta → Miami route',
                        value: '$4,200',
                        status: 'Quote Sent',
                        time: '2 hours ago',
                        priority: 'High',
                      },
                      {
                        customer: 'Home Depot Logistics',
                        activity:
                          'Approved contract for Q1 2024 freight services',
                        value: '$85,000',
                        status: 'Contract Signed',
                        time: '4 hours ago',
                        priority: 'High',
                      },
                      {
                        customer: 'Target Supply Chain',
                        activity:
                          'Scheduled pickup for Chicago → Dallas shipment',
                        value: '$3,800',
                        status: 'Scheduled',
                        time: '6 hours ago',
                        priority: 'Medium',
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          }}
                        >
                          <div
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              background:
                                activity.priority === 'High'
                                  ? '#ef4444'
                                  : activity.priority === 'Medium'
                                    ? '#f59e0b'
                                    : '#10b981',
                            }}
                          />
                          <div>
                            <div
                              style={{
                                color: 'white',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              {activity.customer}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '14px',
                              }}
                            >
                              {activity.activity}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                          }}
                        >
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                              }}
                            >
                              Value
                            </div>
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              {activity.value}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                              }}
                            >
                              Status
                            </div>
                            <div style={{ color: 'white', fontSize: '14px' }}>
                              {activity.status}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', minWidth: '80px' }}>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                              }}
                            >
                              {activity.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'carrier-network' && (
              <div>
                <BrokerCarrierNetworkManager
                  brokerId={brokerSession?.id || 'demo-broker'}
                />

                {/* Carrier Weight Compliance Monitoring */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    padding: '24px',
                    marginTop: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h2
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    📱 Carrier OpenELD Compliance Monitoring
                  </h2>

                  {/* Carrier Network Compliance Overview */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#ffffff',
                          marginBottom: '4px',
                        }}
                      >
                        87
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        ELD Compliant Carriers
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#ffffff',
                          marginBottom: '4px',
                        }}
                      >
                        12
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        HOS Violations This Week
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#ffffff',
                          marginBottom: '4px',
                        }}
                      >
                        94.3%
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        OpenELD Compliance Rate
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#ffffff',
                          marginBottom: '4px',
                        }}
                      >
                        142
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Connected ELD Devices
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color: '#ffffff',
                          marginBottom: '4px',
                        }}
                      >
                        5
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Critical Violations
                      </div>
                    </div>
                  </div>

                  {/* Carrier Compliance Table */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        📋 Carrier OpenELD Compliance Status
                      </h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          style={{
                            background: '#22c55e',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={async () => {
                            try {
                              const carrierComplianceData = `Carrier Name,MC Number,DOT Number,ELD Compliance,HOS Violations,Weight Violations,Device Status,Risk Level,Last Load,Performance Score,Active Drivers,ELD Devices
Premium Logistics LLC,MC-123456,DOT-789012,COMPLIANT,0,0,CONNECTED,LOW,2024-01-20,95.2%,8,8
Swift Transportation,MC-234567,DOT-890123,CAUTION,2,1,CONNECTED,MEDIUM,2024-01-19,87.5%,15,14
ABC Trucking Co,MC-345678,DOT-901234,COMPLIANT,0,0,CONNECTED,LOW,2024-01-18,92.8%,5,5
Heavy Haul Express,MC-456789,DOT-012345,VIOLATION,5,3,PARTIAL,HIGH,2024-01-17,71.2%,12,9
Regional Freight Inc,MC-567890,DOT-123456,COMPLIANT,1,0,CONNECTED,LOW,2024-01-16,89.1%,6,6`;

                              const blob = new Blob([carrierComplianceData], {
                                type: 'text/csv',
                              });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `carrier-openeld-compliance-${new Date().toISOString().split('T')[0]}.csv`;
                              link.click();
                              URL.revokeObjectURL(url);

                              alert(
                                '✅ Carrier OpenELD compliance report exported successfully!'
                              );
                            } catch (error) {
                              alert('❌ Export failed. Please try again.');
                            }
                          }}
                        >
                          📥 Export Network Report
                        </button>
                        <button
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            alert(
                              '🔄 Carrier OpenELD data refreshed!\n\nLatest compliance information pulled from all carrier OpenELD systems:\n• HOS violations and status\n• Weight compliance records\n• ELD device connectivity\n• Driver performance metrics'
                            );
                          }}
                        >
                          🔄 Refresh Data
                        </button>
                      </div>
                    </div>

                    {/* Carrier Compliance List */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {[
                        {
                          name: 'Premium Logistics LLC',
                          mcNumber: 'MC-123456',
                          dotNumber: 'DOT-789012',
                          compliance: 'COMPLIANT',
                          hosViolations: 0,
                          weightViolations: 0,
                          eldStatus: 'CONNECTED',
                          riskLevel: 'LOW',
                          lastLoad: 'BRK-001-TXFL',
                          performanceScore: '95.2%',
                          activeDrivers: 8,
                          eldDevices: 8,
                          complianceRate: 98.5,
                        },
                        {
                          name: 'Swift Transportation',
                          mcNumber: 'MC-234567',
                          dotNumber: 'DOT-890123',
                          compliance: 'CAUTION',
                          hosViolations: 2,
                          weightViolations: 1,
                          eldStatus: 'CONNECTED',
                          riskLevel: 'MEDIUM',
                          lastLoad: 'BRK-002-CANY',
                          performanceScore: '87.5%',
                          activeDrivers: 15,
                          eldDevices: 14,
                          complianceRate: 89.2,
                        },
                        {
                          name: 'ABC Trucking Co',
                          mcNumber: 'MC-345678',
                          dotNumber: 'DOT-901234',
                          compliance: 'COMPLIANT',
                          hosViolations: 0,
                          weightViolations: 0,
                          eldStatus: 'CONNECTED',
                          riskLevel: 'LOW',
                          lastLoad: 'BRK-003-ILOH',
                          performanceScore: '92.8%',
                          activeDrivers: 5,
                          eldDevices: 5,
                          complianceRate: 96.1,
                        },
                        {
                          name: 'Heavy Haul Express',
                          mcNumber: 'MC-456789',
                          dotNumber: 'DOT-012345',
                          compliance: 'VIOLATION',
                          hosViolations: 5,
                          weightViolations: 3,
                          eldStatus: 'PARTIAL',
                          riskLevel: 'HIGH',
                          lastLoad: 'BRK-004-TXGA',
                          performanceScore: '71.2%',
                          activeDrivers: 12,
                          eldDevices: 9,
                          complianceRate: 67.8,
                        },
                      ].map((carrier) => (
                        <div
                          key={carrier.mcNumber}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '12px',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  color: 'white',
                                  marginBottom: '4px',
                                }}
                              >
                                {carrier.name}
                              </div>
                              <div
                                style={{
                                  fontSize: '14px',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                }}
                              >
                                {carrier.mcNumber} • {carrier.dotNumber} •{' '}
                                {carrier.activeDrivers} Drivers •{' '}
                                {carrier.eldDevices}/{carrier.activeDrivers} ELD
                                Connected
                              </div>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                              }}
                            >
                              <span
                                style={{
                                  background:
                                    carrier.compliance === 'COMPLIANT'
                                      ? '#10b981'
                                      : carrier.compliance === 'CAUTION'
                                        ? '#f59e0b'
                                        : '#ef4444',
                                  color: 'white',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {carrier.compliance}
                              </span>
                              <span
                                style={{
                                  background:
                                    carrier.riskLevel === 'LOW'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : carrier.riskLevel === 'MEDIUM'
                                        ? 'rgba(245, 158, 11, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                  color:
                                    carrier.riskLevel === 'LOW'
                                      ? '#22c55e'
                                      : carrier.riskLevel === 'MEDIUM'
                                        ? '#f59e0b'
                                        : '#ef4444',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {carrier.riskLevel} RISK
                              </span>
                              <span
                                style={{
                                  background:
                                    carrier.eldStatus === 'CONNECTED'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : carrier.eldStatus === 'PARTIAL'
                                        ? 'rgba(245, 158, 11, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                  color:
                                    carrier.eldStatus === 'CONNECTED'
                                      ? '#22c55e'
                                      : carrier.eldStatus === 'PARTIAL'
                                        ? '#f59e0b'
                                        : '#ef4444',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }}
                              >
                                📱 {carrier.eldStatus}
                              </span>
                              <button
                                style={{
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                                onClick={async () => {
                                  try {
                                    alert(
                                      `📊 ${carrier.name} - OpenELD Compliance Analysis\n\n` +
                                        `MC Number: ${carrier.mcNumber}\n` +
                                        `DOT Number: ${carrier.dotNumber}\n` +
                                        `Active Drivers: ${carrier.activeDrivers}\n` +
                                        `ELD Devices: ${carrier.eldDevices}/${carrier.activeDrivers} Connected\n` +
                                        `ELD Status: ${carrier.eldStatus}\n\n` +
                                        `COMPLIANCE OVERVIEW:\n` +
                                        `Overall Status: ${carrier.compliance}\n` +
                                        `Compliance Rate: ${carrier.complianceRate}%\n` +
                                        `Risk Level: ${carrier.riskLevel}\n\n` +
                                        `VIOLATIONS:\n` +
                                        `HOS Violations: ${carrier.hosViolations}\n` +
                                        `Weight Violations: ${carrier.weightViolations}\n` +
                                        `Performance Score: ${carrier.performanceScore}\n` +
                                        `Last Load: ${carrier.lastLoad}\n\n` +
                                        `RECOMMENDATION:\n${carrier.riskLevel === 'HIGH' ? 'High-risk carrier with multiple violations. Review carefully before assigning loads. Consider additional monitoring.' : carrier.riskLevel === 'MEDIUM' ? 'Moderate risk with some violations. Suitable for standard loads with monitoring.' : 'Low-risk carrier with excellent compliance. Approved for all load types including high-value shipments.'}`
                                    );
                                  } catch (error) {
                                    alert(
                                      '❌ Failed to load carrier analysis.'
                                    );
                                  }
                                }}
                              >
                                📊 Analyze
                              </button>
                              <button
                                style={{
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  // Integration point for load assignment
                                  alert(
                                    `🚛 Load Assignment - OpenELD Compliance Check\n\n` +
                                      `Carrier: ${carrier.name}\n` +
                                      `ELD Status: ${carrier.eldStatus}\n` +
                                      `Compliance: ${carrier.compliance}\n` +
                                      `Risk Level: ${carrier.riskLevel}\n\n` +
                                      `COMPLIANCE DETAILS:\n` +
                                      `HOS Violations: ${carrier.hosViolations}\n` +
                                      `Weight Violations: ${carrier.weightViolations}\n` +
                                      `Compliance Rate: ${carrier.complianceRate}%\n` +
                                      `ELD Devices: ${carrier.eldDevices}/${carrier.activeDrivers} Connected\n\n` +
                                      `${carrier.riskLevel === 'HIGH' ? '🚨 WARNING: High-risk carrier with multiple OpenELD violations. Recommend additional oversight and monitoring for this load.' : carrier.riskLevel === 'MEDIUM' ? '⚠️ CAUTION: Moderate risk with some violations. Standard monitoring recommended.' : '✅ APPROVED: Low-risk carrier with excellent OpenELD compliance. Safe for all load types.'}\n\n` +
                                      `Proceed with load assignment?`
                                  );
                                }}
                              >
                                🚛 Assign Load
                              </button>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(140px, 1fr))',
                              gap: '16px',
                              fontSize: '12px',
                            }}
                          >
                            <div>
                              <span
                                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                Compliance Rate:
                              </span>
                              <div
                                style={{
                                  color:
                                    carrier.complianceRate >= 95
                                      ? '#4ade80'
                                      : carrier.complianceRate >= 85
                                        ? '#fbbf24'
                                        : '#ef4444',
                                  fontWeight: 'bold',
                                }}
                              >
                                {carrier.complianceRate}%
                              </div>
                            </div>
                            <div>
                              <span
                                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                HOS Violations:
                              </span>
                              <div
                                style={{
                                  color:
                                    carrier.hosViolations > 0
                                      ? '#fbbf24'
                                      : '#4ade80',
                                  fontWeight: 'bold',
                                }}
                              >
                                {carrier.hosViolations}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                Weight Violations:
                              </span>
                              <div
                                style={{
                                  color:
                                    carrier.weightViolations > 0
                                      ? '#fbbf24'
                                      : '#4ade80',
                                  fontWeight: 'bold',
                                }}
                              >
                                {carrier.weightViolations}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                ELD Devices:
                              </span>
                              <div
                                style={{
                                  color:
                                    carrier.eldDevices === carrier.activeDrivers
                                      ? '#4ade80'
                                      : '#fbbf24',
                                  fontWeight: 'bold',
                                }}
                              >
                                {carrier.eldDevices}/{carrier.activeDrivers}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                              >
                                Performance:
                              </span>
                              <div
                                style={{ color: 'white', fontWeight: 'bold' }}
                              >
                                {carrier.performanceScore}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Broker Actions */}
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#60a5fa',
                        margin: '0 0 12px 0',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      ℹ️ Carrier OpenELD Compliance Management
                    </h4>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '14px',
                        lineHeight: '1.4',
                        marginBottom: '16px',
                      }}
                    >
                      <p style={{ margin: '0 0 8px 0' }}>
                        • Monitor complete OpenELD compliance across your
                        carrier network (HOS, weight, device status)
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        • Make informed load assignments based on comprehensive
                        ELD compliance records
                      </p>
                      <p style={{ margin: '0 0 8px 0' }}>
                        • Track HOS violations, weight compliance, and ELD
                        device connectivity in real-time
                      </p>
                      <p style={{ margin: '0' }}>
                        • Export detailed OpenELD compliance reports for
                        shippers and DOT audits
                      </p>
                    </div>

                    <div
                      style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                    >
                      <button
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          alert(
                            '📧 OpenELD Compliance Alert Sent!\n\nAll carriers with violations have been notified:\n• HOS violation warnings sent\n• Weight compliance reminders issued\n• ELD device connectivity issues flagged\n• Safety recommendations and corrective actions provided\n• Broker compliance team has been notified with full OpenELD reports'
                          );
                        }}
                      >
                        🚨 Alert Non-Compliant Carriers
                      </button>

                      <button
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          alert(
                            '⭐ Preferred Carrier Program Updated - OpenELD Edition!\n\nCarriers with excellent OpenELD compliance have been marked as "Preferred":\n• Zero HOS violations\n• 100% weight compliance\n• All ELD devices connected\n• 95%+ compliance rating\n\nLoad assignments will prioritize these carriers.\nPreferred carrier bonuses activated.\nOpenELD compliance incentives implemented.'
                          );
                        }}
                      >
                        ⭐ Update Preferred Carriers
                      </button>

                      <button
                        style={{
                          background: '#8b5cf6',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          alert(
                            '📋 Shipper OpenELD Compliance Report Generated!\n\nComprehensive carrier compliance report created including:\n• Complete OpenELD compliance status\n• HOS violation history and trends\n• Weight compliance records\n• ELD device connectivity status\n• Performance metrics and risk assessments\n\nReady to share with shippers to demonstrate:\n• Due diligence in carrier vetting\n• Comprehensive safety verification\n• DOT compliance monitoring\n• Real-time risk management'
                          );
                        }}
                      >
                        📋 Generate Shipper Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'market-intelligence' && (
              <div>
                <BrokerMarketIntelligence
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'shipper-acquisition' && (
              <div>
                <BrokerShipperAcquisition
                  brokerId={brokerSession?.id || 'demo-broker'}
                />
              </div>
            )}

            {selectedTab === 'phone-monitoring' && (
              <div>
                <PhoneMonitoringDashboard />
              </div>
            )}

            {selectedTab === 'agent-management' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '25px',
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '25px',
                  }}
                >
                  👥 Agent Management Dashboard
                </h2>

                {/* Agent Performance Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px',
                  }}
                >
                  {(() => {
                    const agentMetrics =
                      brokerAnalyticsService.getBrokerageOverviewMetrics();
                    return [
                      {
                        title: 'Total Agents',
                        value: agentMetrics.totalAgents,
                        subtitle: `${agentMetrics.activeAgents} active today`,
                        color: '#3b82f6',
                        icon: '👥',
                      },
                      {
                        title: 'Total Agent Revenue',
                        value: `$${agentMetrics.totalRevenue.toLocaleString()}`,
                        subtitle: `Avg: $${agentMetrics.managementInsights.avgAgentRevenue.toLocaleString()}/agent`,
                        color: '#10b981',
                        icon: '💰',
                      },
                      {
                        title: 'Agent Loads',
                        value: agentMetrics.totalLoads,
                        subtitle: `${agentMetrics.activeLoads} active loads`,
                        color: '#f59e0b',
                        icon: '📦',
                      },
                      {
                        title: 'Conversion Rate',
                        value: `${agentMetrics.conversionRate}%`,
                        subtitle: `${agentMetrics.quotesAccepted}/${agentMetrics.totalQuotes} quotes`,
                        color: '#8b5cf6',
                        icon: '📈',
                      },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          padding: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '28px',
                            marginBottom: '10px',
                          }}
                        >
                          {metric.icon}
                        </div>
                        <div
                          style={{
                            color: metric.color,
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '5px',
                          }}
                        >
                          {metric.value}
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '5px',
                          }}
                        >
                          {metric.title}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                          }}
                        >
                          {metric.subtitle}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Agent Performance Ranking */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                    marginBottom: '30px',
                  }}
                >
                  {/* Top Performing Agents */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                      }}
                    >
                      🏆 Top Performing Agents
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {brokerAnalyticsService
                        .getAgentPerformanceRanking()
                        .slice(0, 5)
                        .map((agent, index) => (
                          <div
                            key={agent.agentId}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '10px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background:
                                    index === 0
                                      ? '#ffd700'
                                      : index === 1
                                        ? '#c0c0c0'
                                        : index === 2
                                          ? '#cd7f32'
                                          : '#6b7280',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                }}
                              >
                                {agent.rank}
                              </div>
                              <div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {agent.agentName}
                                </div>
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    fontSize: '12px',
                                  }}
                                >
                                  {agent.loads} loads • {agent.successRate}%
                                  success
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  color: '#10b981',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                }}
                              >
                                ${agent.revenue.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '12px',
                                }}
                              >
                                {agent.margin}% margin
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Agent Load Board Integration */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                      }}
                    >
                      🚛 Agent Loads (Live Feed)
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {brokerAnalyticsService
                        .getAllAgentLoads()
                        .slice(0, 4)
                        .map((load, index) => (
                          <div
                            key={load.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '6px',
                              fontSize: '12px',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: 'white',
                                  fontWeight: '600',
                                }}
                              >
                                {load.loadNumber}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '11px',
                                }}
                              >
                                by {load.agentName}
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontSize: '11px',
                                }}
                              >
                                {load.origin} → {load.destination}
                              </div>
                              <div
                                style={{
                                  marginTop: '4px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  gap: '4px',
                                }}
                              >
                                {/* Transport Mode Badge */}
                                <span
                                  style={{
                                    background: load.transportMode === 'truckload' ? 'rgba(59, 130, 246, 0.3)' : 
                                                load.transportMode === 'ltl' ? 'rgba(16, 185, 129, 0.3)' :
                                                load.transportMode === 'rail' ? 'rgba(168, 85, 247, 0.3)' :
                                                'rgba(245, 158, 11, 0.3)',
                                    color: load.transportMode === 'truckload' ? '#60a5fa' : 
                                           load.transportMode === 'ltl' ? '#10b981' :
                                           load.transportMode === 'rail' ? '#a855f7' :
                                           '#f59e0b',
                                    fontSize: '9px',
                                    padding: '2px 6px',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {load.transportMode === 'truckload' ? '🚛 FTL' : 
                                   load.transportMode === 'ltl' ? '📦 LTL' :
                                   load.transportMode === 'rail' ? '🚂 RAIL' :
                                   load.transportMode === 'intermodal' ? '🚛🚂 IM' :
                                   '🚛 TL'}
                                </span>
                                {/* Cost Savings Indicator */}
                                {load.multimodalOptions && load.multimodalOptions.some(opt => opt.costSavings && opt.costSavings > 0) && (
                                  <span
                                    style={{
                                      background: 'rgba(16, 185, 129, 0.2)',
                                      color: '#10b981',
                                      fontSize: '9px',
                                      padding: '2px 4px',
                                      borderRadius: '6px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    💰
                                  </span>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  color: '#10b981',
                                  fontWeight: 'bold',
                                }}
                              >
                                ${load.rate.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  color:
                                    load.status === 'Available'
                                      ? '#f59e0b'
                                      : '#10b981',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                }}
                              >
                                {load.status}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div
                      style={{
                        marginTop: '15px',
                        padding: '10px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        borderRadius: '8px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          color: '#60a5fa',
                          fontSize: '12px',
                          fontWeight: '600',
                          marginBottom: '5px',
                        }}
                      >
                        💡 Integration Status
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '11px',
                        }}
                      >
                        All agent loads automatically flow to Dispatch Central
                        for assignment. Management maintains full visibility and
                        control.
                      </div>
                    </div>
                  </div>

                  {/* Multimodal Cost Savings Opportunities */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '15px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '20px',
                      marginTop: '20px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                      }}
                    >
                      🚛🚂✈️ Multimodal Cost Savings
                    </h3>
                    {(() => {
                      const costSavings = brokerAnalyticsService.getCostSavingsOpportunities();
                      const totalSavings = costSavings.reduce((sum, item) => sum + item.potentialSavings, 0);
                      
                      return (
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '15px',
                              padding: '10px',
                              background: 'rgba(16, 185, 129, 0.2)',
                              borderRadius: '8px',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              💰 Potential Monthly Savings: ${totalSavings.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '11px',
                              }}
                            >
                              {costSavings.length} opportunities identified
                            </div>
                          </div>
                          
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            {costSavings.slice(0, 3).map((saving, index) => (
                              <div
                                key={saving.loadId}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  const shouldUpdate = confirm(
                                    `Switch ${saving.loadNumber} from Truckload to ${saving.bestAlternative.mode}?\n\n` +
                                    `Current Rate: $${saving.currentRate.toLocaleString()}\n` +
                                    `New Rate: $${saving.bestAlternative.rate.toLocaleString()}\n` +
                                    `Savings: $${saving.potentialSavings.toLocaleString()}\n` +
                                    `Transit Time: ${saving.bestAlternative.transitTime}h\n` +
                                    `Confidence: ${saving.bestAlternative.confidence}%`
                                  );
                                  
                                  if (shouldUpdate) {
                                    brokerAnalyticsService.updateLoadTransportMode(
                                      saving.loadId, 
                                      saving.bestAlternative.mode, 
                                      saving.bestAlternative.rate
                                    );
                                    alert(`✅ Load ${saving.loadNumber} updated to ${saving.bestAlternative.mode} mode!`);
                                  }
                                }}
                              >
                                <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                  {saving.loadNumber}
                                </div>
                                <div style={{ color: '#60a5fa', fontSize: '11px' }}>
                                  Switch to {saving.bestAlternative.mode}
                                </div>
                                <div style={{ color: '#10b981', fontWeight: 'bold' }}>
                                  Save ${saving.potentialSavings.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {costSavings.length === 0 && (
                            <div
                              style={{
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                                padding: '20px',
                              }}
                            >
                              🎯 All loads are optimally priced across transport modes
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Management Insights */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                    }}
                  >
                    📊 Management Insights & Data Flow
                  </h3>
                  {(() => {
                    const insights =
                      brokerAnalyticsService.getBrokerageOverviewMetrics()
                        .managementInsights;
                    return (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '15px',
                        }}
                      >
                        <div
                          style={{
                            padding: '15px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '8px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            Top Performer
                          </div>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          >
                            {insights.topPerformingAgent}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: '15px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            borderRadius: '8px',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          <div
                            style={{
                              color: '#f59e0b',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            Retention Rate
                          </div>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          >
                            {insights.agentRetentionRate}%
                          </div>
                        </div>
                        <div
                          style={{
                            padding: '15px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            borderRadius: '8px',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          <div
                            style={{
                              color: '#3b82f6',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            Load Distribution
                          </div>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          >
                            {insights.loadDistributionEfficiency}% efficient
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {selectedTab === 'task-priority' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  🎯 Smart Task Prioritization
                </h2>
                <BrokerTaskPrioritizationPanel
                  brokerId={brokerSession?.id || 'broker-demo-001'}
                  tenantId='tenant-demo-123'
                />
              </div>
            )}

            {selectedTab === 'margin-tracking' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  💹 Margin Tracking & Performance
                </h2>

                {/* Margin Overview Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>📈</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Average Margin
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {performanceMetrics?.avgMargin || 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>💰</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Total Margin
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          $
                          {Math.round(
                            (performanceMetrics?.totalRevenue || 0) * 0.225
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(168, 85, 247, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>📊</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Avg Load Value
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          $
                          {performanceMetrics?.avgLoadValue?.toLocaleString() ||
                            '0'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Margin Tracking Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Load Margin Analysis
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Load ID
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer Rate
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Carrier Rate
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {marginTracking.map((margin) => (
                          <tr key={margin.loadId}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {margin.loadId}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${margin.customerRate.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${margin.carrierRate.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${margin.margin.toLocaleString()} (
                              {margin.marginPercent}%)
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    margin.status === 'on_target'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : margin.status === 'above_target'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                  color:
                                    margin.status === 'on_target'
                                      ? '#22c55e'
                                      : margin.status === 'above_target'
                                        ? '#3b82f6'
                                        : '#ef4444',
                                }}
                              >
                                {margin.status === 'on_target'
                                  ? '✅ On Target'
                                  : margin.status === 'above_target'
                                    ? '⬆️ Above Target'
                                    : '⬇️ Below Target'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'contract-workflow' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  📋 Contract Workflow & Approvals
                </h2>

                {/* Contract Status Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Pending Approval
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter(
                          (c) => c.status === 'pending_approval'
                        ).length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ✅
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Approved
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter((c) => c.status === 'approved')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ✍️
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Signed
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter((c) => c.status === 'signed')
                          .length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      💳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Invoiced
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter(
                          (c) =>
                            c.paymentStatus === 'invoiced' ||
                            c.paymentStatus === 'paid'
                        ).length
                      }
                    </div>
                  </div>
                </div>

                {/* Active Contracts Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Active Contracts
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Contract #
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Value
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Payment
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {brokerContracts.map((contract) => (
                          <tr key={contract.id}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.contractNumber}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.customerName}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.totalValue.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.margin.toLocaleString()} (
                              {contract.marginPercent}%)
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    contract.status === 'completed'
                                      ? '#22c55e'
                                      : contract.status === 'signed' ||
                                          contract.status === 'active'
                                        ? '#3b82f6'
                                        : contract.status === 'approved'
                                          ? '#a855f7'
                                          : contract.status ===
                                              'pending_approval'
                                            ? '#f59e0b'
                                            : '#6b7280',
                                  color: 'white',
                                }}
                              >
                                {contract.status
                                  .replace('_', ' ')
                                  .toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    contract.paymentStatus === 'paid'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : contract.paymentStatus === 'invoiced'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : contract.paymentStatus === 'overdue'
                                          ? 'rgba(239, 68, 68, 0.2)'
                                          : 'rgba(245, 158, 11, 0.2)',
                                  color:
                                    contract.paymentStatus === 'paid'
                                      ? '#22c55e'
                                      : contract.paymentStatus === 'invoiced'
                                        ? '#3b82f6'
                                        : contract.paymentStatus === 'overdue'
                                          ? '#ef4444'
                                          : '#f59e0b',
                                }}
                              >
                                {contract.paymentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowContractWorkflow(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                View Workflow
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'crm' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  🤝 Customer Relationship Management
                </h2>

                {/* CRM Overview Cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(139, 92, 246, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🏢</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Total Customers
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {shipperProfiles.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(34, 197, 94, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>⭐</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Avg Customer Score
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {Math.round(
                            shipperProfiles.reduce(
                              (sum, s) => sum + s.overallScore,
                              0
                            ) / shipperProfiles.length
                          ) || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          borderRadius: '12px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🎯</span>
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                          }}
                        >
                          Upsell Opportunities
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '32px',
                            fontWeight: 'bold',
                          }}
                        >
                          {upsellOpportunities.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Profiles Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Customer Profiles & Scoring
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Score
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Credit
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Volume
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Risk Level
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Last Activity
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {shipperProfiles.map((shipper) => (
                          <tr key={shipper.id}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: '600' }}>
                                  {shipper.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                  }}
                                >
                                  {shipper.industry}
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <div
                                  style={{
                                    width: '40px',
                                    height: '6px',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${shipper.overallScore}%`,
                                      height: '100%',
                                      background:
                                        shipper.overallScore >= 85
                                          ? '#22c55e'
                                          : shipper.overallScore >= 70
                                            ? '#f59e0b'
                                            : '#ef4444',
                                      borderRadius: '3px',
                                    }}
                                  ></div>
                                </div>
                                <span
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {shipper.overallScore}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background: shipper.creditRating.startsWith(
                                    'A'
                                  )
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : shipper.creditRating.startsWith('B')
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : 'rgba(239, 68, 68, 0.2)',
                                  color: shipper.creditRating.startsWith('A')
                                    ? '#22c55e'
                                    : shipper.creditRating.startsWith('B')
                                      ? '#f59e0b'
                                      : '#ef4444',
                                }}
                              >
                                {shipper.creditRating}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${shipper.totalVolume.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    shipper.riskLevel === 'low'
                                      ? 'rgba(34, 197, 94, 0.2)'
                                      : shipper.riskLevel === 'medium'
                                        ? 'rgba(245, 158, 11, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                  color:
                                    shipper.riskLevel === 'low'
                                      ? '#22c55e'
                                      : shipper.riskLevel === 'medium'
                                        ? '#f59e0b'
                                        : '#ef4444',
                                }}
                              >
                                {shipper.riskLevel.toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {new Date(
                                shipper.lastActivity
                              ).toLocaleDateString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedShipper(shipper);
                                  setShowShipperDetails(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(139, 92, 246, 0.2)',
                                  color: '#8b5cf6',
                                  border: '1px solid rgba(139, 92, 246, 0.3)',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  marginRight: '8px',
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Upsell Opportunities */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Upselling Opportunities
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {upsellOpportunities.map((opportunity) => (
                      <div
                        key={opportunity.shipperId}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              {opportunity.shipperName}
                            </h4>
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background:
                                  opportunity.priority === 'urgent'
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : opportunity.priority === 'high'
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : opportunity.priority === 'medium'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : 'rgba(156, 163, 175, 0.2)',
                                color:
                                  opportunity.priority === 'urgent'
                                    ? '#ef4444'
                                    : opportunity.priority === 'high'
                                      ? '#f59e0b'
                                      : opportunity.priority === 'medium'
                                        ? '#3b82f6'
                                        : '#9ca3af',
                              }}
                            >
                              {opportunity.priority.toUpperCase()} PRIORITY
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: 'bold',
                              }}
                            >
                              ${opportunity.potentialValue.toLocaleString()}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              {opportunity.probability}% probability
                            </div>
                          </div>
                        </div>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            marginBottom: '16px',
                          }}
                        >
                          {opportunity.description}
                        </p>
                        <div style={{ marginBottom: '16px' }}>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '12px',
                              marginBottom: '8px',
                            }}
                          >
                            Required Actions:
                          </div>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                              marginLeft: '16px',
                            }}
                          >
                            {opportunity.requiredActions.map(
                              (action: string, index: number) => (
                                <li key={index} style={{ marginBottom: '4px' }}>
                                  {action}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#3b82f6',
                            }}
                          >
                            {opportunity.opportunityType
                              .replace('_', ' ')
                              .toUpperCase()}
                          </span>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: 'rgba(168, 85, 247, 0.2)',
                              color: '#a855f7',
                            }}
                          >
                            {opportunity.timeframe
                              .replace('_', ' ')
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'contracts-bol' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                  }}
                >
                  📋 BOL Review, Contracts & Workflow
                </h2>

                {/* Contract Status Overview */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      ⏳
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Pending Approval
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        brokerContracts.filter(
                          (c) => c.status === 'pending_approval'
                        ).length
                      }
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      📈
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Avg Margin
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {performanceMetrics?.avgMargin || 0}%
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      🎯
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Active Bids
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {
                        biddingHistory.filter((b) => b.bidStatus === 'pending')
                          .length
                      }
                    </div>
                  </div>
                </div>

                {/* Active Contracts Table */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                    }}
                  >
                    Active Contracts & Workflow
                  </h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Contract #
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Customer
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Value
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Margin
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Status
                          </th>
                          <th
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              padding: '12px',
                              textAlign: 'left',
                              borderBottom:
                                '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {brokerContracts.map((contract) => (
                          <tr key={contract.id}>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.contractNumber}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {contract.customerName}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.totalValue.toLocaleString()}
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              ${contract.margin.toLocaleString()} (
                              {contract.marginPercent}%)
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <span
                                style={{
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  background:
                                    contract.status === 'completed'
                                      ? '#22c55e'
                                      : contract.status === 'signed' ||
                                          contract.status === 'active'
                                        ? '#3b82f6'
                                        : contract.status === 'approved'
                                          ? '#a855f7'
                                          : contract.status ===
                                              'pending_approval'
                                            ? '#f59e0b'
                                            : '#6b7280',
                                  color: 'white',
                                }}
                              >
                                {contract.status
                                  .replace('_', ' ')
                                  .toUpperCase()}
                              </span>
                            </td>
                            <td
                              style={{
                                color: 'white',
                                padding: '12px',
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setSelectedContract(contract);
                                  setShowContractWorkflow(true);
                                }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: '1px solid #3b82f6',
                                  borderRadius: '8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                }}
                              >
                                View Workflow
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                        }}
                      >
                        Transportation Broker Contracts
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                        }}
                      >
                        Manage comprehensive broker-shipper agreements with
                        digital signatures
                      </p>
                    </div>
                    <Link
                      href='/broker/contracts'
                      style={{
                        background: 'linear-gradient(135deg, #f97316, #ea580c)', // RESOURCES - Orange
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 8px 25px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Open Contract Manager
                    </Link>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                        📝
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Create New Contract
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      >
                        Generate comprehensive transportation broker agreements
                      </p>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginLeft: '16px',
                        }}
                      >
                        <li>EDI capability tracking</li>
                        <li>Freight class specifications</li>
                        <li>Legal compliance sections</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                        ✍️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Digital Signatures
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      >
                        Secure electronic signature workflow
                      </p>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginLeft: '16px',
                        }}
                      >
                        <li>Canvas-based signature drawing</li>
                        <li>Multi-party approval process</li>
                        <li>Audit trail tracking</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
                        📊
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Contract Status
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          marginBottom: '12px',
                        }}
                      >
                        Track agreement lifecycle and approvals
                      </p>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                          marginLeft: '16px',
                        }}
                      >
                        <li>Draft → Sent → Client Review</li>
                        <li>Client Completed → Fully Executed</li>
                        <li>Real-time notifications</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Shipper Modal */}
        {showAddShipper && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <AddShipperForm onClose={() => setShowAddShipper(false)} />
            </div>
          </div>
        )}

        {/* Create Load Modal */}
        {showCreateForm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <CreateLoadForm
                onLoadCreated={handleLoadCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {/* Quote Confirmation Modal */}
        {showConfirmation && pendingQuote && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ color: '#1e40af', marginBottom: '16px' }}>
                {pendingQuote.type} Quote Generated Successfully!
              </h3>
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#10b981',
                    marginBottom: '8px',
                  }}
                >
                  ${pendingQuote.total.toLocaleString()}
                </div>
                <div
                  style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '12px',
                  }}
                >
                  {pendingQuote.type} Quote - {pendingQuote.quoteNumber}
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>
                  Base Rate: ${pendingQuote.baseRate.toLocaleString()}
                  {pendingQuote.fuelSurcharge > 0 && (
                    <>
                      {' '}
                      • Fuel Surcharge: $
                      {pendingQuote.fuelSurcharge.toLocaleString()}
                    </>
                  )}
                </div>

                {/* Multi-Service Breakdown */}
                {pendingQuote.type === 'Multi-Service' &&
                  pendingQuote.serviceBreakdown && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '16px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'left',
                      }}
                    >
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Service Breakdown:
                      </div>
                      {pendingQuote.serviceBreakdown.map(
                        (service: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '4px',
                              fontSize: '12px',
                            }}
                          >
                            <span style={{ color: '#6b7280' }}>
                              {service.service}:
                            </span>
                            <span
                              style={{ color: '#10b981', fontWeight: '600' }}
                            >
                              ${service.cost.toLocaleString()}
                            </span>
                          </div>
                        )
                      )}
                      {pendingQuote.discount > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            paddingTop: '8px',
                            borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                            fontSize: '12px',
                          }}
                        >
                          <span style={{ color: '#f59e0b' }}>
                            Multi-Service Discount (5%):
                          </span>
                          <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                            -${pendingQuote.discount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                }}
              >
                <button
                  onClick={confirmQuote}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS - Purple
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ✅ Save Quote
                </button>
                <button
                  onClick={() => {
                    setShowConfirmation(false);
                    // Simulate shipper acceptance (in real app, this would be triggered by shipper)
                    handleQuoteAcceptance(pendingQuote, {
                      id: 'shipper-001',
                      name: 'Acme Manufacturing',
                      email: 'logistics@acme.com',
                      phone: '(555) 123-4567',
                    });
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📧 Send to Shipper
                </button>
                <button
                  onClick={() => {
                    console.log('❌ Quote cancelled');
                    setShowConfirmation(false);
                    setPendingQuote(null);
                  }}
                  style={{
                    background: 'rgba(107, 114, 128, 0.1)',
                    color: '#6b7280',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quote Acceptance Workflow Modal */}
        {showQuoteAcceptance && selectedAcceptedQuote && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  Quote Accepted by Shipper
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {selectedAcceptedQuote.shipper.name} has accepted your quote.
                  Choose how to proceed with shipper creation and contract
                  generation.
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Accepted Quote Details
                </h3>
                <div
                  style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Quote Number:</strong>{' '}
                    {selectedAcceptedQuote.quoteNumber}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Shipper:</strong>{' '}
                    {selectedAcceptedQuote.shipper.name}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Total Amount:</strong> $
                    {selectedAcceptedQuote.total.toLocaleString()}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Services:</strong>{' '}
                    {selectedAcceptedQuote.services?.join(', ') ||
                      selectedAcceptedQuote.type}
                  </div>
                  <div>
                    <strong>Accepted:</strong>{' '}
                    {new Date(
                      selectedAcceptedQuote.acceptedAt
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  Shipper Creation Options
                </h3>
                <div
                  style={{
                    backgroundColor: '#f0f9ff',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Automated Creation:</strong> Use the existing
                    shipper form to collect all required information and
                    automatically create the shipper record.
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Manual Creation:</strong> Skip shipper creation and
                    proceed directly to contract generation (shipper will be
                    created manually later).
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => {
                    setShowQuoteAcceptance(false);
                    setSelectedAcceptedQuote(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleShipperCreationMode('manual')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Manual Creation
                </button>
                <button
                  onClick={() => handleShipperCreationMode('automated')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Automated Creation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipper Creation Form Modal */}
        {showShipperCreation && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '90%',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  Create New Shipper
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Complete the shipper information form to automatically create
                  the shipper record and proceed with contract generation.
                </p>
              </div>

              <AddShipperForm
                onClose={() => {
                  setShowShipperCreation(false);
                  setWorkflowForShipperCreation(null);
                }}
                onSubmit={handleShipperFormSubmit}
                isWorkflowMode={true}
                workflowData={selectedAcceptedQuote}
              />
            </div>
          </div>
        )}

        {/* Contract Workflow Modal */}
        {showContractWorkflow && selectedContract && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  Contract Workflow: {selectedContract.contractNumber}
                </h2>
                <button
                  onClick={() => setShowContractWorkflow(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </div>

              {(() => {
                const workflowStatus =
                  brokerContractService.getContractWorkflowStatus(
                    selectedContract.id
                  );
                if (!workflowStatus) return null;

                return (
                  <div>
                    <div style={{ marginBottom: '24px' }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Contract Details
                      </h3>
                      <div
                        style={{
                          background: '#f9fafb',
                          padding: '16px',
                          borderRadius: '8px',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '16px',
                          }}
                        >
                          <div>
                            <strong>Customer:</strong>{' '}
                            {selectedContract.customerName}
                          </div>
                          <div>
                            <strong>Total Value:</strong> $
                            {selectedContract.totalValue.toLocaleString()}
                          </div>
                          <div>
                            <strong>Margin:</strong> $
                            {selectedContract.margin.toLocaleString()} (
                            {selectedContract.marginPercent}%)
                          </div>
                          <div>
                            <strong>Status:</strong>{' '}
                            {selectedContract.status
                              .replace('_', ' ')
                              .toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Workflow Progress ({Math.round(workflowStatus.progress)}
                        % Complete)
                      </h3>
                      <div
                        style={{
                          background: '#f3f4f6',
                          borderRadius: '8px',
                          padding: '4px',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            background: '#3b82f6',
                            height: '8px',
                            borderRadius: '4px',
                            width: `${workflowStatus.progress}%`,
                            transition: 'width 0.3s ease',
                          }}
                        ></div>
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        {workflowStatus.workflow.map((step, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              padding: '16px',
                              background:
                                step.status === 'completed'
                                  ? '#f0fdf4'
                                  : step.status === 'pending'
                                    ? '#fffbeb'
                                    : '#f9fafb',
                              borderRadius: '8px',
                              border: `1px solid ${step.status === 'completed' ? '#22c55e' : step.status === 'pending' ? '#f59e0b' : '#e5e7eb'}`,
                            }}
                          >
                            <div
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background:
                                  step.status === 'completed'
                                    ? '#22c55e'
                                    : step.status === 'pending'
                                      ? '#f59e0b'
                                      : '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                              }}
                            >
                              {step.status === 'completed' ? '✓' : index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontWeight: '600',
                                  marginBottom: '4px',
                                }}
                              >
                                {step.step}
                              </div>
                              <div
                                style={{ fontSize: '14px', color: '#6b7280' }}
                              >
                                {step.description}
                              </div>
                              {step.completedAt && (
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: '#9ca3af',
                                    marginTop: '4px',
                                  }}
                                >
                                  Completed:{' '}
                                  {new Date(step.completedAt).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedContract.status === 'pending_approval' && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={async () => {
                            const result =
                              await brokerContractService.requestContractApproval(
                                selectedContract.id
                              );
                            alert(result.message);
                          }}
                          style={{
                            padding: '12px 24px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          Request Approval
                        </button>
                      </div>
                    )}

                    {selectedContract.status === 'approved' &&
                      selectedContract.paymentStatus === 'pending' && (
                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            onClick={async () => {
                              const result =
                                await brokerContractService.generateSquareInvoice(
                                  selectedContract.id
                                );
                              if (result.success && result.invoiceUrl) {
                                window.open(result.invoiceUrl, '_blank');
                              }
                              alert(result.message);
                            }}
                            style={{
                              padding: '12px 24px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            Generate Square Invoice
                          </button>
                        </div>
                      )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Shipper Details Modal */}
        {showShipperDetails && selectedShipper && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '900px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  {selectedShipper.name} - Customer Profile
                </h2>
                <button
                  onClick={() => setShowShipperDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </div>

              {/* Customer Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Contact Information
                  </h3>
                  <div
                    style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Email:</strong> {selectedShipper.email}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Phone:</strong> {selectedShipper.phone}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Address:</strong> {selectedShipper.address}
                    </div>
                    <div>
                      <strong>Industry:</strong> {selectedShipper.industry}
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Performance Metrics
                  </h3>
                  <div
                    style={{
                      background: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Overall Score:</strong>{' '}
                      {selectedShipper.overallScore}/100
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Credit Rating:</strong>{' '}
                      {selectedShipper.creditRating}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Risk Level:</strong>{' '}
                      {selectedShipper.riskLevel.toUpperCase()}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Payment Terms:</strong>{' '}
                      {selectedShipper.paymentTerms} days
                    </div>
                    <div>
                      <strong>Avg Payment Time:</strong>{' '}
                      {selectedShipper.avgPaymentTime} days
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Intelligence */}
              <div style={{ marginBottom: '32px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  Business Intelligence
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      background: '#f0fdf4',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #22c55e',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#22c55e',
                      }}
                    >
                      ${selectedShipper.totalVolume.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Annual Volume
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#eff6ff',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #3b82f6',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }}
                    >
                      {selectedShipper.loadCount}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Total Loads
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#fefce8',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #f59e0b',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                      }}
                    >
                      {selectedShipper.reliability}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      Reliability Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Interaction History */}
              <div style={{ marginBottom: '24px' }}>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '16px',
                  }}
                >
                  Recent Interactions
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {
                    /* CRM functionality moved to Enhanced CRM system */
                    /* brokerCRMService
                  .getInteractionHistory(selectedShipper.id)
                  .slice(0, 3) */
                    [].map((interaction: any) => (
                      <div
                        key={interaction.id}
                        style={{
                          background: '#f9fafb',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                          }}
                        >
                          <div>
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background:
                                  interaction.type === 'call'
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : interaction.type === 'email'
                                      ? 'rgba(16, 185, 129, 0.1)'
                                      : interaction.type === 'contract'
                                        ? 'rgba(245, 158, 11, 0.1)'
                                        : 'rgba(156, 163, 175, 0.1)',
                                color:
                                  interaction.type === 'call'
                                    ? '#3b82f6'
                                    : interaction.type === 'email'
                                      ? '#10b981'
                                      : interaction.type === 'contract'
                                        ? '#f59e0b'
                                        : '#6b7280',
                              }}
                            >
                              {interaction.type.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {new Date(
                              interaction.createdAt
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {interaction.subject}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginBottom: '8px',
                          }}
                        >
                          {interaction.description}
                        </div>
                        {interaction.followUpRequired && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#f59e0b',
                              fontWeight: '600',
                            }}
                          >
                            📅 Follow-up required:{' '}
                            {interaction.followUpDate
                              ? new Date(
                                  interaction.followUpDate
                                ).toLocaleDateString()
                              : 'TBD'}
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowShipperDetails(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Add Interaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '800px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Settings Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0,
                  }}
                >
                  ⚙️ Brokerage Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '8px',
                    borderRadius: '8px',
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = 'none')
                  }
                >
                  ✕
                </button>
              </div>

              {/* Settings Tabs */}
              <div
                style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}
              >
                {[
                  { id: 'preferences', label: 'Preferences', icon: '⚙️' },
                  { id: 'integrations', label: 'API Integrations', icon: '🔗' },
                  {
                    id: 'commissions',
                    label: 'Commission Structure',
                    icon: '💰',
                  },
                  { id: 'templates', label: 'Document Templates', icon: '📄' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id as any)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background:
                        settingsTab === tab.id
                          ? '#3b82f6'
                          : 'rgba(59, 130, 246, 0.1)',
                      color: settingsTab === tab.id ? 'white' : '#3b82f6',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Settings Content */}
              <div style={{ minHeight: '400px' }}>
                {settingsTab === 'preferences' && (
                  <div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '16px',
                      }}
                    >
                      Default Preferences
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Default Equipment Type
                        </label>
                        <select
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        >
                          <option>Van</option>
                          <option>Flatbed</option>
                          <option>Reefer</option>
                          <option>Power Only</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Default Service Area (Miles)
                        </label>
                        <input
                          type='number'
                          placeholder='500'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Default Rate Per Mile
                        </label>
                        <input
                          type='number'
                          placeholder='2.50'
                          step='0.01'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Fuel Surcharge %
                        </label>
                        <input
                          type='number'
                          placeholder='15'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'integrations' && (
                  <div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '16px',
                      }}
                    >
                      API Integrations
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Load Board APIs
                        </label>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input type='checkbox' defaultChecked /> DAT
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input type='checkbox' defaultChecked />{' '}
                            Truckstop.com
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input type='checkbox' /> 123LoadBoard
                          </label>
                        </div>
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Factoring Companies
                        </label>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input type='checkbox' /> TAFS
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input type='checkbox' /> RTS Financial
                          </label>
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input type='checkbox' /> eCapital
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'commissions' && (
                  <div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '16px',
                      }}
                    >
                      Commission Structure
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Agent Commission Rate (%)
                        </label>
                        <input
                          type='number'
                          placeholder='15'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Payment Terms (Days)
                        </label>
                        <input
                          type='number'
                          placeholder='30'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Minimum Commission Amount
                        </label>
                        <input
                          type='number'
                          placeholder='50'
                          step='0.01'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500',
                            color: '#374151',
                          }}
                        >
                          Performance Bonus Threshold
                        </label>
                        <input
                          type='number'
                          placeholder='10000'
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'templates' && (
                  <div style={{ margin: '-24px' }}>
                    <ProfessionalTemplateManager
                      tenantId={brokerSession?.brokerCode || 'fleetflow-demo'}
                      isCompact={false}
                    />
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '24px',
                }}
              >
                <button
                  style={{
                    padding: '12px 24px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  💾 Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
