'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface EmergencyLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  equipmentType: string;
  urgencyLevel: 'standard' | 'urgent' | 'critical' | 'emergency';
  timeConstraint: {
    requestedPickup: string;
    requiredDelivery: string;
    currentTime: string;
  };
  specialRequirements: string[];
  customerTier: 'standard' | 'premium' | 'enterprise';
  hazmatClass?: string;
  temperatureControlled?: boolean;
}

interface EmergencyPricingFactors {
  baseRate: number;
  urgencyMultiplier: number;
  timeConstraintMultiplier: number;
  availabilityMultiplier: number;
  specialRequirementsMultiplier: number;
  customerTierDiscount: number;
  marketDemandMultiplier: number;
  driverIncentiveMultiplier: number;
}

interface EmergencyPricingAnalysis {
  result: EmergencyLoadRequest;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
  emergencyRate: number;
  standardRate: number;
  emergencyPremium: number;
  pricingFactors: EmergencyPricingFactors;
  timeToDeadline: {
    hours: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  availabilityAssessment: {
    driversAvailable: number;
    equipmentAvailable: number;
    competingLoads: number;
    availabilityScore: 'abundant' | 'limited' | 'scarce' | 'critical';
  };
  riskAssessment: {
    deliveryRisk: 'low' | 'medium' | 'high';
    weatherRisk: 'low' | 'medium' | 'high';
    routeRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  recommendedActions: string[];
}

interface EmergencyLoadMetrics {
  totalEmergencyLoads: number;
  averageEmergencyPremium: number;
  successRate: number;
  averageResponseTime: number;
  revenueImpact: number;
  customerSatisfactionScore: number;
  driverUtilizationImpact: number;
}

interface PricingStrategy {
  strategyName: string;
  description: string;
  urgencyThreshold: number;
  baseMultiplier: number;
  maxMultiplier: number;
  applicableScenarios: string[];
  expectedOutcomes: string[];
}

export default function EmergencyLoadPricingWidget() {
  const isEnabled = useFeatureFlag('EMERGENCY_LOAD_PRICING');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EmergencyPricingAnalysis | null>(
    null
  );
  const [metrics, setMetrics] = useState<EmergencyLoadMetrics | null>(null);
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'calculator' | 'metrics' | 'strategies'
  >('calculator');

  // Form state
  const [loadRequest, setLoadRequest] = useState<EmergencyLoadRequest>({
    loadId: '',
    origin: '',
    destination: '',
    distance: 0,
    weight: 0,
    equipmentType: 'dry-van',
    urgencyLevel: 'urgent',
    timeConstraint: {
      requestedPickup: '',
      requiredDelivery: '',
      currentTime: new Date().toISOString().slice(0, 16),
    },
    specialRequirements: [],
    customerTier: 'standard',
    hazmatClass: '',
    temperatureControlled: false,
  });

  useEffect(() => {
    if (isEnabled) {
      loadMetrics();
      loadStrategies();
    }
  }, [isEnabled]);

  const loadMetrics = async () => {
    try {
      const response = await fetch(
        '/api/analytics/emergency-pricing?action=metrics'
      );
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadStrategies = async () => {
    try {
      const response = await fetch(
        '/api/analytics/emergency-pricing?action=strategies'
      );
      const data = await response.json();
      if (data.success) {
        setStrategies(data.data);
      }
    } catch (error) {
      console.error('Error loading strategies:', error);
    }
  };

  const calculatePricing = async () => {
    if (
      !loadRequest.loadId ||
      !loadRequest.origin ||
      !loadRequest.destination ||
      loadRequest.distance === 0
    ) {
      setError(
        'Please fill in all required fields (Load ID, Origin, Destination, Distance)'
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analytics/emergency-pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'calculate',
          loadRequest,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
        setActiveTab('calculator');
      } else {
        setError(data.error || 'Pricing calculation failed');
      }
    } catch (error) {
      setError('Failed to calculate emergency pricing');
      console.error('Error calculating pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'standard':
        return '#6b7280';
      case 'urgent':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      case 'emergency':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getAvailabilityColor = (score: string) => {
    switch (score) {
      case 'abundant':
        return '#10b981';
      case 'limited':
        return '#f59e0b';
      case 'scarce':
        return '#ef4444';
      case 'critical':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  if (!isEnabled) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
        <div className='flex items-center gap-3'>
          <div className='text-2xl'>🚨</div>
          <div>
            <h3 className='font-semibold text-yellow-800'>
              Emergency Load Pricing
            </h3>
            <p className='text-sm text-yellow-700'>
              Enable ENABLE_EMERGENCY_LOAD_PRICING=true to access emergency
              pricing features
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='text-3xl'>🚨</div>
          <div>
            <h2 className='text-xl font-bold text-gray-900'>
              Emergency Load Pricing
            </h2>
            <p className='text-sm text-gray-600'>
              Dynamic pricing for urgent shipments
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6 flex space-x-1 rounded-lg bg-gray-100 p-1'>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'calculator'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pricing Calculator
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'metrics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Performance Metrics
        </button>
        <button
          onClick={() => setActiveTab('strategies')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'strategies'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pricing Strategies
        </button>
      </div>

      {/* Pricing Calculator Tab */}
      {activeTab === 'calculator' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Load Details */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>Load Details</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Load ID
                  </label>
                  <input
                    type='text'
                    value={loadRequest.loadId}
                    onChange={(e) =>
                      setLoadRequest({ ...loadRequest, loadId: e.target.value })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., EML-001'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Urgency Level
                  </label>
                  <select
                    value={loadRequest.urgencyLevel}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        urgencyLevel: e.target.value as any,
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='standard'>Standard</option>
                    <option value='urgent'>Urgent</option>
                    <option value='critical'>Critical</option>
                    <option value='emergency'>Emergency</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Origin
                  </label>
                  <input
                    type='text'
                    value={loadRequest.origin}
                    onChange={(e) =>
                      setLoadRequest({ ...loadRequest, origin: e.target.value })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., ATL'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Destination
                  </label>
                  <input
                    type='text'
                    value={loadRequest.destination}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        destination: e.target.value,
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                    placeholder='e.g., LAX'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Distance (miles)
                  </label>
                  <input
                    type='number'
                    value={loadRequest.distance}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        distance: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Weight (lbs)
                  </label>
                  <input
                    type='number'
                    value={loadRequest.weight}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        weight: Number(e.target.value),
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>

            {/* Time Constraints & Requirements */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-gray-900'>
                Time Constraints & Requirements
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Required Delivery
                  </label>
                  <input
                    type='datetime-local'
                    value={loadRequest.timeConstraint.requiredDelivery}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        timeConstraint: {
                          ...loadRequest.timeConstraint,
                          requiredDelivery: e.target.value,
                        },
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Equipment Type
                  </label>
                  <select
                    value={loadRequest.equipmentType}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        equipmentType: e.target.value,
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='dry-van'>Dry Van</option>
                    <option value='flatbed'>Flatbed</option>
                    <option value='reefer'>Reefer</option>
                    <option value='step-deck'>Step Deck</option>
                    <option value='low-boy'>Low Boy</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    Customer Tier
                  </label>
                  <select
                    value={loadRequest.customerTier}
                    onChange={(e) =>
                      setLoadRequest({
                        ...loadRequest,
                        customerTier: e.target.value as any,
                      })
                    }
                    className='mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                  >
                    <option value='standard'>Standard</option>
                    <option value='premium'>Premium</option>
                    <option value='enterprise'>Enterprise</option>
                  </select>
                </div>
                <div className='flex items-center space-x-4'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={loadRequest.temperatureControlled}
                      onChange={(e) =>
                        setLoadRequest({
                          ...loadRequest,
                          temperatureControlled: e.target.checked,
                        })
                      }
                      className='mr-2'
                    />
                    <span className='text-sm text-gray-700'>
                      Temperature Controlled
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='flex gap-4'>
            <button
              onClick={calculatePricing}
              disabled={loading}
              className='rounded-lg bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50'
            >
              {loading ? 'Calculating...' : 'Calculate Emergency Pricing'}
            </button>
          </div>

          {error && (
            <div className='rounded-lg bg-red-50 p-4 text-red-600'>{error}</div>
          )}

          {analysis && (
            <div className='space-y-6'>
              {/* Pricing Results */}
              <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                <div className='rounded-lg bg-red-50 p-4'>
                  <div className='text-2xl font-bold text-red-600'>
                    ${analysis.emergencyRate}
                  </div>
                  <div className='text-sm text-red-600'>Emergency Rate</div>
                </div>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <div className='text-2xl font-bold text-gray-600'>
                    ${analysis.standardRate}
                  </div>
                  <div className='text-sm text-gray-600'>Standard Rate</div>
                </div>
                <div className='rounded-lg bg-orange-50 p-4'>
                  <div className='text-2xl font-bold text-orange-600'>
                    ${analysis.emergencyPremium}
                  </div>
                  <div className='text-sm text-orange-600'>
                    Emergency Premium
                  </div>
                </div>
                <div className='rounded-lg bg-blue-50 p-4'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {analysis.timeToDeadline.hours}h
                  </div>
                  <div className='text-sm text-blue-600'>Time to Deadline</div>
                </div>
              </div>

              {/* Pricing Factors */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Pricing Factors
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Base Rate:</span>
                      <span className='font-medium'>
                        ${analysis.pricingFactors.baseRate}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Urgency Multiplier:</span>
                      <span className='font-medium'>
                        {analysis.pricingFactors.urgencyMultiplier}x
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Time Constraint:</span>
                      <span className='font-medium'>
                        {analysis.pricingFactors.timeConstraintMultiplier}x
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Availability:</span>
                      <span className='font-medium'>
                        {analysis.pricingFactors.availabilityMultiplier}x
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Customer Discount:</span>
                      <span className='font-medium'>
                        {(
                          analysis.pricingFactors.customerTierDiscount * 100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg border border-gray-200 p-4'>
                  <h3 className='mb-3 font-semibold text-gray-900'>
                    Availability Assessment
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Drivers Available:</span>
                      <span className='font-medium'>
                        {analysis.availabilityAssessment.driversAvailable}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>
                        Equipment Available:
                      </span>
                      <span className='font-medium'>
                        {analysis.availabilityAssessment.equipmentAvailable}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Competing Loads:</span>
                      <span className='font-medium'>
                        {analysis.availabilityAssessment.competingLoads}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-600'>Availability Score:</span>
                      <span
                        className='font-medium'
                        style={{
                          color: getAvailabilityColor(
                            analysis.availabilityAssessment.availabilityScore
                          ),
                        }}
                      >
                        {analysis.availabilityAssessment.availabilityScore.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Risk Assessment
                </h3>
                <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Delivery Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.deliveryRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.deliveryRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Weather Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.weatherRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.weatherRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Route Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(analysis.riskAssessment.routeRisk),
                      }}
                    >
                      {analysis.riskAssessment.routeRisk.toUpperCase()}
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-sm text-gray-600'>Overall Risk</div>
                    <div
                      className='text-lg font-bold'
                      style={{
                        color: getRiskColor(
                          analysis.riskAssessment.overallRisk
                        ),
                      }}
                    >
                      {analysis.riskAssessment.overallRisk.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  Recommended Actions
                </h3>
                <ul className='space-y-2'>
                  {analysis.recommendedActions.map((action, index) => (
                    <li
                      key={index}
                      className='flex items-center gap-2 text-sm text-gray-600'
                    >
                      <div className='h-2 w-2 rounded-full bg-red-500'></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Analysis */}
              <div className='rounded-lg border border-gray-200 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>
                  AI Analysis
                </h3>
                <p className='text-sm text-gray-600'>{analysis.reasoning}</p>
                <div className='mt-3 text-xs text-gray-500'>
                  Confidence: {analysis.confidence}%
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Metrics Tab */}
      {activeTab === 'metrics' && metrics && (
        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            <div className='rounded-lg bg-blue-50 p-4'>
              <div className='text-2xl font-bold text-blue-600'>
                {metrics.totalEmergencyLoads}
              </div>
              <div className='text-sm text-blue-600'>Total Emergency Loads</div>
            </div>
            <div className='rounded-lg bg-green-50 p-4'>
              <div className='text-2xl font-bold text-green-600'>
                {metrics.successRate}%
              </div>
              <div className='text-sm text-green-600'>Success Rate</div>
            </div>
            <div className='rounded-lg bg-orange-50 p-4'>
              <div className='text-2xl font-bold text-orange-600'>
                {metrics.averageEmergencyPremium}%
              </div>
              <div className='text-sm text-orange-600'>Avg Premium</div>
            </div>
            <div className='rounded-lg bg-purple-50 p-4'>
              <div className='text-2xl font-bold text-purple-600'>
                {metrics.averageResponseTime}min
              </div>
              <div className='text-sm text-purple-600'>Avg Response Time</div>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Revenue Impact
              </h3>
              <div className='text-2xl font-bold text-green-600'>
                ${(metrics.revenueImpact / 1000).toFixed(0)}K
              </div>
              <div className='text-sm text-gray-600'>
                Additional revenue from emergency loads
              </div>
            </div>

            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Customer Satisfaction
              </h3>
              <div className='text-2xl font-bold text-blue-600'>
                {metrics.customerSatisfactionScore}/5.0
              </div>
              <div className='text-sm text-gray-600'>
                Average satisfaction score
              </div>
            </div>

            <div className='rounded-lg border border-gray-200 p-4'>
              <h3 className='mb-3 font-semibold text-gray-900'>
                Driver Utilization
              </h3>
              <div className='text-2xl font-bold text-orange-600'>
                {metrics.driverUtilizationImpact}%
              </div>
              <div className='text-sm text-gray-600'>
                Impact on driver utilization
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {strategies.map((strategy, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 p-4'
              >
                <div className='mb-3'>
                  <h3 className='font-semibold text-gray-900'>
                    {strategy.strategyName}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {strategy.description}
                  </p>
                </div>

                <div className='mb-4 space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Urgency Threshold:</span>
                    <span className='font-medium'>
                      {strategy.urgencyThreshold}h
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Base Multiplier:</span>
                    <span className='font-medium'>
                      {strategy.baseMultiplier}x
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-600'>Max Multiplier:</span>
                    <span className='font-medium'>
                      {strategy.maxMultiplier}x
                    </span>
                  </div>
                </div>

                <div className='mb-4'>
                  <h4 className='mb-2 text-sm font-medium text-gray-900'>
                    Applicable Scenarios:
                  </h4>
                  <ul className='space-y-1'>
                    {strategy.applicableScenarios.map(
                      (scenario, scenarioIndex) => (
                        <li
                          key={scenarioIndex}
                          className='text-xs text-gray-600'
                        >
                          • {scenario}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className='mb-2 text-sm font-medium text-gray-900'>
                    Expected Outcomes:
                  </h4>
                  <ul className='space-y-1'>
                    {strategy.expectedOutcomes.map((outcome, outcomeIndex) => (
                      <li key={outcomeIndex} className='text-xs text-gray-600'>
                        • {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
