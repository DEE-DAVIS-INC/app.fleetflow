'use client'

import { useState, useEffect } from 'react'

interface AIInsight {
  type: 'route_optimization' | 'maintenance_prediction' | 'cost_optimization' | 'driver_analysis' | 'dispatch_optimization' | 'carrier_matching' | 'rate_optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  timestamp: string;
}

interface AutomationStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  tasksRunning: string[];
}

export default function AIAutomationDashboard() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'dispatch' | 'maintenance' | 'routes' | 'insights'>('overview');
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>({
    isRunning: false,
    lastUpdate: null,
    tasksRunning: []
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispatchRecommendation, setDispatchRecommendation] = useState<any>(null);
  const [testingDispatch, setTestingDispatch] = useState(false);

  useEffect(() => {
    loadAIInsights();
    loadAutomationStatus();
  }, []);

  const loadAutomationStatus = async () => {
    try {
      const response = await fetch('/api/ai/automation');
      const data = await response.json();
      if (data.success) {
        setAutomationStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to load automation status:', error);
    }
  };

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Generate sample insights (in production, these would come from your database)
      const sampleInsights: AIInsight[] = [
        {
          type: 'dispatch_optimization',
          title: 'Smart Dispatch Recommendation',
          description: 'AI identified optimal carrier for Load #FL-2024-0892 with 95% confidence',
          priority: 'high',
          data: { loadId: 'FL-2024-0892', recommendedCarrier: 'Premium Transport LLC', confidence: 95, savings: 180 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'carrier_matching',
          title: 'Carrier Performance Alert',
          description: 'Swift Logistics showing improved on-time performance (+12% this month)',
          priority: 'medium',
          data: { carrierId: 'CAR-001', improvement: 12, newRating: 92 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'rate_optimization',
          title: 'Rate Optimization Opportunity',
          description: 'Current market rates 8% above our pricing on Atlanta-Miami lane',
          priority: 'medium',
          data: { lane: 'Atlanta-Miami', marketRate: 2850, currentRate: 2640, opportunity: 210 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'maintenance_prediction',
          title: 'Predictive Maintenance Alert',
          description: 'Vehicle Truck-045 showing early signs of potential brake system issues',
          priority: 'high',
          data: { vehicleId: 'V001', estimatedCost: 850, daysUntilService: 7 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'route_optimization',
          title: 'Route Efficiency Opportunity',
          description: 'AI identified 15% fuel savings potential on current routes',
          priority: 'medium',
          data: { potentialSavings: 1250, affectedRoutes: 5 },
          timestamp: new Date().toISOString()
        },
        {
          type: 'cost_optimization',
          title: 'Cost Reduction Opportunity',
          description: 'Maintenance scheduling optimization could save $3,200/month',
          priority: 'medium',
          data: { monthlySavings: 3200, implementationTime: '2 weeks' },
          timestamp: new Date().toISOString()
        }
      ];
      
      setInsights(sampleInsights);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async () => {
    try {
      const action = automationStatus.isRunning ? 'stop' : 'start';
      const response = await fetch('/api/ai/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      if (data.success) {
        setAutomationStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const testAIDispatch = async () => {
    setTestingDispatch(true);
    try {
      // Sample load and carriers for testing
      const testLoad = {
        id: 'FL-TEST-001',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        weight: 35000,
        freightClass: 'Class 70',
        specialRequirements: ['refrigerated'],
        urgency: 'medium',
        value: 45000,
        pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        distance: 650
      };

      const testCarriers = [
        {
          id: 'CAR-001',
          name: 'Premium Transport LLC',
          currentLocation: 'Atlanta, GA',
          capacity: 40000,
          specializations: ['refrigerated', 'general_freight'],
          performanceScore: 92,
          rateHistory: [2.45, 2.52, 2.48],
          availability: {
            earliestPickup: new Date().toISOString(),
            preferredLanes: ['Southeast']
          },
          equipmentType: 'refrigerated_trailer',
          safetyRating: 88,
          onTimePercentage: 94,
          customerSatisfaction: 4.3
        },
        {
          id: 'CAR-002',
          name: 'Swift Logistics Inc',
          currentLocation: 'Jacksonville, FL',
          capacity: 45000,
          specializations: ['general_freight'],
          performanceScore: 85,
          rateHistory: [2.35, 2.41, 2.38],
          availability: {
            earliestPickup: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            preferredLanes: ['Southeast', 'Northeast']
          },
          equipmentType: 'dry_van',
          safetyRating: 91,
          onTimePercentage: 87,
          customerSatisfaction: 4.1
        },
        {
          id: 'CAR-003',
          name: 'Reliable Freight Co',
          currentLocation: 'Tampa, FL',
          capacity: 38000,
          specializations: ['refrigerated', 'hazmat'],
          performanceScore: 89,
          rateHistory: [2.55, 2.48, 2.62],
          availability: {
            earliestPickup: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            preferredLanes: ['Southeast']
          },
          equipmentType: 'refrigerated_trailer',
          safetyRating: 93,
          onTimePercentage: 91,
          customerSatisfaction: 4.5
        }
      ];

      const response = await fetch('/api/ai/dispatch-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ load: testLoad, carriers: testCarriers })
      });

      const result = await response.json();
      setDispatchRecommendation(result.recommendation);
      
    } catch (error) {
      console.error('AI dispatch test failed:', error);
    } finally {
      setTestingDispatch(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'maintenance_prediction':
        return '🔧';
      case 'route_optimization':
        return '🗺️';
      case 'cost_optimization':
        return '💰';
      case 'driver_analysis':
        return '👨‍💼';
      case 'dispatch_optimization':
        return '🚛';
      case 'carrier_matching':
        return '🤝';
      case 'rate_optimization':
        return '📈';
      default:
        return '🤖';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="space-y-4">
        {/* Header */}
        <div className="card-2d bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white rounded-xl shadow-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold mb-1 drop-shadow-lg">AI Automation Center</h1>
              <p className="text-purple-100 text-xs drop-shadow-md">Intelligent fleet management powered by artificial intelligence</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-4">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'dispatch', label: 'AI Dispatch', icon: '🚛' },
            { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
            { id: 'routes', label: 'Routes', icon: '🗺️' },
            { id: 'insights', label: 'Insights', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm ${
                selectedTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <>
            {/* Automation Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚙️</span>
                  Automation Engine
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${automationStatus.isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="font-medium text-gray-900">
                        {automationStatus.isRunning ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                    <button
                      onClick={toggleAutomation}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        automationStatus.isRunning
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {automationStatus.isRunning ? 'Stop' : 'Start'}
                    </button>
                  </div>

                  {automationStatus.lastUpdate && (
                    <div className="text-sm text-gray-600">
                      Last update: {new Date(automationStatus.lastUpdate).toLocaleString()}
                    </div>
                  )}

                  {automationStatus.tasksRunning.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Active Tasks:</h4>
                      {automationStatus.tasksRunning.map((task, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => loadAIInsights()}
                    disabled={loading}
                    className="w-full p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>🔄</span>
                    <span>{loading ? 'Refreshing...' : 'Refresh Insights'}</span>
                  </button>
                  
                  <button 
                    onClick={testAIDispatch}
                    disabled={testingDispatch}
                    className="w-full p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>🚛</span>
                    <span>{testingDispatch ? 'Testing...' : 'Test AI Dispatch'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI Capabilities Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">🚛</div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Dispatch</h4>
                <p className="text-sm text-gray-600">Intelligent load-carrier matching with 95% accuracy</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">🗺️</div>
                <h4 className="font-semibold text-gray-900 mb-2">Route Optimization</h4>
                <p className="text-sm text-gray-600">AI-powered route planning for maximum efficiency and cost savings</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">🔧</div>
                <h4 className="font-semibold text-gray-900 mb-2">Predictive Maintenance</h4>
                <p className="text-sm text-gray-600">Predict vehicle maintenance needs before breakdowns occur</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">📈</div>
                <h4 className="font-semibold text-gray-900 mb-2">Rate Optimization</h4>
                <p className="text-sm text-gray-600">Dynamic pricing optimization based on market conditions</p>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'dispatch' && (
          <div className="space-y-6">
            {/* AI Dispatch Test Results */}
            {dispatchRecommendation && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🚛</span>
                  AI Dispatch Recommendation
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Primary Recommendation</h4>
                      <p className="text-green-800">Carrier: {dispatchRecommendation.primaryRecommendation?.carrierId}</p>
                      <p className="text-green-700">Match Score: {dispatchRecommendation.primaryRecommendation?.matchScore}%</p>
                      <p className="text-sm text-green-600 mt-2">{dispatchRecommendation.primaryRecommendation?.reasoning}</p>
                    </div>
                    
                    {dispatchRecommendation.rateRecommendation && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Rate Recommendation</h4>
                        <p className="text-blue-800">Suggested Rate: ${dispatchRecommendation.rateRecommendation.suggestedRate.toLocaleString()}</p>
                        <p className="text-blue-700">Competitiveness: {dispatchRecommendation.rateRecommendation.competitivenessScore}%</p>
                        <p className="text-sm text-blue-600 mt-2">{dispatchRecommendation.rateRecommendation.rateJustification}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {dispatchRecommendation.expectedOutcome && (
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2">Expected Outcome</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-purple-700">On-Time Delivery:</span>
                            <span className="text-purple-800 font-medium">{dispatchRecommendation.expectedOutcome.onTimeDeliveryProbability}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Cost Efficiency:</span>
                            <span className="text-purple-800 font-medium">{dispatchRecommendation.expectedOutcome.costEfficiency}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Customer Satisfaction:</span>
                            <span className="text-purple-800 font-medium">{dispatchRecommendation.expectedOutcome.customerSatisfactionPrediction}/5.0</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {dispatchRecommendation.riskFactors && dispatchRecommendation.riskFactors.length > 0 && (
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 mb-2">Risk Factors</h4>
                        <ul className="space-y-1">
                          {dispatchRecommendation.riskFactors.map((risk: string, index: number) => (
                            <li key={index} className="text-sm text-yellow-700 flex items-start">
                              <span className="mr-2">⚠️</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Confidence Score:</strong> {dispatchRecommendation.confidenceScore}% 
                    {dispatchRecommendation.warning && (
                      <span className="ml-4 text-orange-600">⚠️ {dispatchRecommendation.warning}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
            
            {/* Dispatch Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-gray-900 mb-2">Match Accuracy</h4>
                <p className="text-2xl font-bold text-blue-600">94.2%</p>
                <p className="text-sm text-gray-600">AI recommendation accuracy</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">💰</div>
                <h4 className="font-semibold text-gray-900 mb-2">Cost Savings</h4>
                <p className="text-2xl font-bold text-green-600">$18,420</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
                <p className="text-2xl font-bold text-purple-600">1.2s</p>
                <p className="text-sm text-gray-600">Average AI decision time</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">💡</span>
            Recent AI Insights
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-3 flex-1">
                    <div className="text-2xl">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <p className="text-gray-600 mt-1">{insight.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        {new Date(insight.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
