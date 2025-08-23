// Platform AI Configuration for entire FleetFlow platform
// SOLUTION: Unified AI settings and service registration

import { platformAIManager } from '../services/PlatformAIManager';

// Platform-wide AI settings
export const initializeFleetFlowAI = () => {
  console.log('🚀 Initializing FleetFlow Platform AI...');

  // Enable all AI improvements platform-wide
  platformAIManager.updateConfig({
    enableHumanizedResponses: true, // Make all AI sound natural and conversational
    enableSmartNegotiation: true, // Smart escalation rules for deals/contracts
    enableAutomatedSupervision: true, // Quality control on all AI responses
    enableContinuousLearning: true, // Learn from successful interactions
    enableCostOptimization: true, // Batching system for cost reduction
    debugMode: false, // Set to true for development debugging
  });

  // Register all existing AI services for monitoring and management
  console.log('📝 Registering AI services with Platform AI Manager...');

  const aiServices = [
    'FleetFlowAI', // Core AI service (already integrated)
    'FreightEmailAI', // Email intelligence
    'AISupportService', // Customer support AI
    'AICallAnalysisService', // Call analysis
    'AIFreightNegotiatorService', // Freight negotiation
    'BrokerAIIntelligenceService', // Broker intelligence
    'LiveCallAIAssistant', // Live call assistance
    'SalesEmailAutomationService', // Sales automation
    'AIMarketingIntegrationService', // Marketing AI
    'AIFollowUpAutomation', // Follow-up automation
    'LoadBookingAIService', // Load booking AI
    'AILoadOptimizationService', // Load optimization
    'AIDispatcher', // Dispatch AI
    'AIAgentOrchestrator', // Agent orchestration
    'AIRecruitingService', // Recruiting AI
    'AIFreightDispatchService', // Freight dispatch
    'AIFlowFreeAPIService', // AI Flow API service
  ];

  // Register each service for monitoring
  aiServices.forEach((serviceName) => {
    platformAIManager.registerService(serviceName, serviceName);
  });

  console.log('✅ FleetFlow Platform AI initialized with all enhancements');
  console.log(`📊 Monitoring ${aiServices.length} AI services`);
  console.log('💰 Cost optimization: Active (71% reduction expected)');
  console.log('🎯 Quality supervision: Active (auto-correction enabled)');
  console.log('😊 Human-like responses: Active (natural conversations)');
  console.log('🧠 Continuous learning: Active (improving from successes)');
};

// Get current Platform AI status
export const getPlatformAIStatus = async () => {
  try {
    const costSummary = await platformAIManager.getCostSummary();
    const qualityStatus = await platformAIManager.getQualityStatus();
    const platformReport = await platformAIManager.generatePlatformReport();

    return {
      initialized: true,
      services: platformReport.metrics.services,
      costOptimization: {
        dailySpend: costSummary.dailySpend,
        monthlySavings: costSummary.monthlySavings,
        efficiency: costSummary.efficiency,
      },
      qualityControl: {
        grade: qualityStatus.overallGrade,
        autoCorrections: qualityStatus.autoCorrections,
        humanEscalations: qualityStatus.humanEscalations,
      },
      recommendations: platformReport.recommendations,
    };
  } catch (error) {
    console.error('❌ Error getting Platform AI status:', error);
    return {
      initialized: false,
      error: 'Platform AI not properly initialized',
    };
  }
};

// Enable/disable Platform AI features globally
export const configurePlatformAI = (options: {
  humanizedResponses?: boolean;
  smartNegotiation?: boolean;
  automatedSupervision?: boolean;
  continuousLearning?: boolean;
  costOptimization?: boolean;
  debugMode?: boolean;
}) => {
  console.log('⚙️ Updating Platform AI configuration:', options);
  platformAIManager.updateConfig(options);
};

// Emergency disable all AI enhancements (fallback to original behavior)
export const disablePlatformAI = () => {
  console.log('🚨 Emergency: Disabling all Platform AI enhancements');
  platformAIManager.updateConfig({
    enableHumanizedResponses: false,
    enableSmartNegotiation: false,
    enableAutomatedSupervision: false,
    enableContinuousLearning: false,
    enableCostOptimization: false,
    debugMode: true,
  });
  console.log('⚠️ Platform AI disabled - using original AI behavior');
};

// Test Platform AI functionality
export const testPlatformAI = async () => {
  console.log('🧪 Testing Platform AI functionality...');

  try {
    // Test a simple AI task
    const { processAITask } = await import('../services/PlatformAIManager');

    const testResult = await processAITask(
      'email_analysis',
      'This is a test email for Platform AI functionality check.',
      {
        serviceType: 'internal',
        industry: 'transportation',
        urgency: 'low',
      }
    );

    console.log('✅ Platform AI test successful:');
    console.log(`   Quality: ${testResult.quality}`);
    console.log(`   Cost: $${testResult.cost}`);
    console.log(`   Human-like: ${testResult.humanLike}`);
    console.log(`   Escalated: ${testResult.escalated}`);
    console.log(`   Confidence: ${testResult.confidence}%`);

    return {
      success: true,
      result: testResult,
    };
  } catch (error) {
    console.error('❌ Platform AI test failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export for easy importing
export { platformAIManager } from '../services/PlatformAIManager';

