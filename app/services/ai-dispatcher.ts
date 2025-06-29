import { FleetFlowAI } from './ai';

// Enhanced AI Dispatching Service
export class AIDispatcher {
  private ai: FleetFlowAI;
  private learningData: any[] = [];

  constructor() {
    this.ai = new FleetFlowAI();
  }

  // Smart Load-Carrier Matching Algorithm
  async matchLoadToCarrier(load: LoadData, availableCarriers: CarrierData[]): Promise<DispatchRecommendation> {
    const analysisData = {
      load: {
        id: load.id,
        origin: load.origin,
        destination: load.destination,
        weight: load.weight,
        freightClass: load.freightClass,
        specialRequirements: load.specialRequirements,
        urgency: load.urgency,
        value: load.value,
        pickupDate: load.pickupDate,
        deliveryDate: load.deliveryDate
      },
      carriers: availableCarriers.map(carrier => ({
        id: carrier.id,
        name: carrier.name,
        location: carrier.currentLocation,
        capacity: carrier.capacity,
        specializations: carrier.specializations,
        performanceScore: carrier.performanceScore,
        rateHistory: carrier.rateHistory,
        availability: carrier.availability,
        equipmentType: carrier.equipmentType,
        safetyRating: carrier.safetyRating,
        onTimePercentage: carrier.onTimePercentage
      }))
    };

    try {
      const response = await fetch('/api/ai/dispatch-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisData)
      });

      const result = await response.json();
      return result.recommendation;
    } catch (error) {
      console.error('AI matching failed, using fallback algorithm:', error);
      return this.fallbackMatching(load, availableCarriers);
    }
  }

  // Predictive Capacity Planning
  async predictCapacityNeeds(historicalData: any[], timeHorizon: number = 30): Promise<CapacityPrediction> {
    const prediction = await this.ai.analyzeData({
      type: 'capacity_prediction',
      data: historicalData,
      parameters: {
        timeHorizon,
        includeSeasonality: true,
        includeMarketTrends: true,
        confidenceLevel: 0.85
      }
    });

    return {
      timeHorizon,
      predictedDemand: prediction.demand,
      recommendedCapacity: prediction.capacity,
      riskFactors: prediction.risks,
      confidenceScore: prediction.confidence,
      actionableInsights: prediction.insights
    };
  }

  // Dynamic Rate Optimization
  async optimizeRates(loadDetails: any, marketData: any): Promise<RateOptimization> {
    const optimizationData = {
      load: loadDetails,
      market: {
        averageRates: marketData.averageRates,
        supplyDemand: marketData.supplyDemand,
        fuelPrices: marketData.fuelPrices,
        seasonalFactors: marketData.seasonalFactors,
        competitorRates: marketData.competitorRates
      },
      historical: {
        acceptanceRates: marketData.acceptanceRates,
        profitMargins: marketData.profitMargins,
        customerSatisfaction: marketData.customerSatisfaction
      }
    };

    const optimization = await this.ai.analyzeData({
      type: 'rate_optimization',
      data: optimizationData
    });

    return {
      recommendedRate: optimization.optimalRate,
      rateRange: optimization.rateRange,
      competitivenessScore: optimization.competitiveness,
      acceptanceProbability: optimization.acceptanceProbability,
      profitMargin: optimization.profitMargin,
      marketPosition: optimization.marketPosition,
      reasoning: optimization.reasoning
    };
  }

  // Automated Dispatch Decision Engine
  async makeDispatchDecision(
    load: LoadData, 
    carriers: CarrierData[], 
    constraints: DispatchConstraints
  ): Promise<DispatchDecision> {
    // Multi-factor analysis
    const matchingResults = await this.matchLoadToCarrier(load, carriers);
    const rateOptimization = await this.optimizeRates(load, constraints.marketData);
    
    // Score each carrier option
    const carrierScores = await Promise.all(
      carriers.map(async (carrier) => {
        const score = await this.scoreCarrierForLoad(carrier, load, constraints);
        return { carrier, score };
      })
    );

    // Sort by score and apply business rules
    const rankedCarriers = carrierScores
      .sort((a, b) => b.score.overall - a.score.overall)
      .filter(item => item.score.overall >= constraints.minimumScore);

    const decision: DispatchDecision = {
      loadId: load.id,
      recommendedCarrier: rankedCarriers[0]?.carrier || null,
      alternativeCarriers: rankedCarriers.slice(1, 3).map(item => item.carrier),
      recommendedRate: rateOptimization.recommendedRate,
      confidence: this.calculateDecisionConfidence(rankedCarriers),
      reasoning: this.generateReasoningExplanation(rankedCarriers, rateOptimization),
      riskFactors: this.identifyRiskFactors(load, rankedCarriers[0]?.carrier),
      expectedOutcome: {
        onTimeDelivery: rankedCarriers[0]?.score.reliability || 0,
        profitMargin: rateOptimization.profitMargin,
        customerSatisfaction: rankedCarriers[0]?.score.customerSatisfaction || 0
      }
    };

    // Learn from decision for future improvements
    this.recordDecisionForLearning(decision, load, carriers);

    return decision;
  }

  // Performance-Based Carrier Scoring
  private async scoreCarrierForLoad(
    carrier: CarrierData, 
    load: LoadData, 
    constraints: DispatchConstraints
  ): Promise<CarrierScore> {
    const baseScore = {
      capacity: this.scoreCapacityMatch(carrier, load),
      location: this.scoreLocationAdvantage(carrier, load),
      reliability: carrier.onTimePercentage || 0,
      cost: this.scoreCostEffectiveness(carrier, load, constraints),
      specialization: this.scoreSpecialization(carrier, load),
      safety: carrier.safetyRating || 0,
      experience: this.scoreExperience(carrier, load),
      availability: this.scoreAvailability(carrier, load),
      customerSatisfaction: carrier.customerSatisfaction || 0
    };

    // Weighted overall score
    const weights = {
      capacity: 0.15,
      location: 0.12,
      reliability: 0.20,
      cost: 0.18,
      specialization: 0.10,
      safety: 0.10,
      experience: 0.08,
      availability: 0.05,
      customerSatisfaction: 0.02
    };

    const overall = Object.entries(baseScore).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);

    return { ...baseScore, overall };
  }

  // Fallback matching algorithm when AI is unavailable
  private fallbackMatching(load: LoadData, carriers: CarrierData[]): DispatchRecommendation {
    const scored = carriers.map(carrier => ({
      carrier,
      score: this.calculateBasicScore(carrier, load)
    }));

    const best = scored.sort((a, b) => b.score - a.score)[0];

    return {
      primaryRecommendation: best.carrier,
      alternatives: scored.slice(1, 3).map(item => item.carrier),
      confidence: Math.min(best.score / 100, 0.9),
      reasoning: 'Basic compatibility matching (AI unavailable)'
    };
  }

  private calculateBasicScore(carrier: CarrierData, load: LoadData): number {
    let score = 0;
    
    // Basic capacity check
    if (carrier.capacity >= load.weight) score += 30;
    
    // Performance history
    score += (carrier.onTimePercentage || 0) * 0.4;
    
    // Safety rating
    score += (carrier.safetyRating || 0) * 0.3;
    
    return Math.min(score, 100);
  }

  private scoreCapacityMatch(carrier: CarrierData, load: LoadData): number {
    const utilizationRatio = load.weight / carrier.capacity;
    if (utilizationRatio > 1) return 0; // Overweight
    if (utilizationRatio >= 0.7 && utilizationRatio <= 0.95) return 100; // Optimal
    if (utilizationRatio >= 0.5) return 80; // Good
    if (utilizationRatio >= 0.3) return 60; // Acceptable
    return 40; // Under-utilized
  }

  private scoreLocationAdvantage(carrier: CarrierData, load: LoadData): number {
    // This would use actual distance calculations in production
    const proximityScore = Math.random() * 100; // Placeholder
    return proximityScore;
  }

  private scoreCostEffectiveness(carrier: CarrierData, load: LoadData, constraints: DispatchConstraints): number {
    if (!carrier.rateHistory) return 50;
    
    const avgRate = carrier.rateHistory.reduce((sum, rate) => sum + rate, 0) / carrier.rateHistory.length;
    const marketRate = constraints.marketData?.averageRate || avgRate;
    
    if (avgRate <= marketRate * 0.9) return 100; // 10% below market
    if (avgRate <= marketRate) return 80; // At or below market
    if (avgRate <= marketRate * 1.1) return 60; // 10% above market
    return 30; // Significantly above market
  }

  private scoreSpecialization(carrier: CarrierData, load: LoadData): number {
    if (!carrier.specializations || !load.specialRequirements) return 70; // Neutral
    
    const matches = load.specialRequirements.filter(req => 
      carrier.specializations.includes(req)
    ).length;
    
    return Math.min((matches / load.specialRequirements.length) * 100, 100);
  }

  private scoreExperience(carrier: CarrierData, load: LoadData): number {
    // Score based on similar route experience, freight type, etc.
    return carrier.experienceScore || 70; // Placeholder
  }

  private scoreAvailability(carrier: CarrierData, load: LoadData): number {
    if (!carrier.availability) return 0;
    
    const pickupDate = new Date(load.pickupDate);
    const availableDate = new Date(carrier.availability.earliestPickup);
    
    if (availableDate <= pickupDate) return 100;
    
    const daysDifference = (availableDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, 100 - (daysDifference * 10));
  }

  private calculateDecisionConfidence(rankedCarriers: any[]): number {
    if (rankedCarriers.length === 0) return 0;
    if (rankedCarriers.length === 1) return rankedCarriers[0].score.overall / 100;
    
    const best = rankedCarriers[0].score.overall;
    const second = rankedCarriers[1].score.overall;
    const gap = best - second;
    
    return Math.min((best / 100) * (1 + gap / 100), 1);
  }

  private generateReasoningExplanation(rankedCarriers: any[], rateOptimization: RateOptimization): string {
    if (rankedCarriers.length === 0) return 'No suitable carriers found';
    
    const best = rankedCarriers[0];
    const reasons = [];
    
    if (best.score.reliability > 85) reasons.push('excellent reliability record');
    if (best.score.cost > 80) reasons.push('competitive pricing');
    if (best.score.capacity > 90) reasons.push('optimal capacity utilization');
    if (best.score.specialization > 80) reasons.push('specialized equipment/experience');
    
    return `Recommended based on: ${reasons.join(', ')}. Rate optimized for ${rateOptimization.competitivenessScore}% market competitiveness.`;
  }

  private identifyRiskFactors(load: LoadData, carrier: CarrierData | null): string[] {
    const risks: string[] = [];
    
    if (!carrier) return ['No suitable carrier identified'];
    
    if (carrier.onTimePercentage < 85) risks.push('Below-average on-time performance');
    if (carrier.safetyRating < 80) risks.push('Safety rating below optimal');
    if (load.urgency === 'high' && carrier.reliability < 90) risks.push('High urgency load with moderate reliability carrier');
    
    return risks;
  }

  private recordDecisionForLearning(decision: DispatchDecision, load: LoadData, carriers: CarrierData[]): void {
    this.learningData.push({
      timestamp: new Date().toISOString(),
      decision,
      load,
      availableCarriers: carriers,
      outcome: null // To be updated later with actual results
    });
    
    // Keep only last 1000 decisions for learning
    if (this.learningData.length > 1000) {
      this.learningData = this.learningData.slice(-1000);
    }
  }

  // Update learning data with actual outcomes
  updateDecisionOutcome(decisionId: string, outcome: DispatchOutcome): void {
    const record = this.learningData.find(d => d.decision.loadId === decisionId);
    if (record) {
      record.outcome = outcome;
    }
  }

  // Generate dispatch insights and recommendations
  async generateDispatchInsights(): Promise<DispatchInsights> {
    const recentDecisions = this.learningData.slice(-100);
    
    return {
      totalDecisions: this.learningData.length,
      successRate: this.calculateSuccessRate(recentDecisions),
      averageConfidence: this.calculateAverageConfidence(recentDecisions),
      topPerformingCarriers: this.identifyTopCarriers(recentDecisions),
      improvementAreas: this.identifyImprovementAreas(recentDecisions),
      costSavings: this.calculateCostSavings(recentDecisions),
      recommendations: this.generateActionableRecommendations(recentDecisions)
    };
  }

  private calculateSuccessRate(decisions: any[]): number {
    const completedDecisions = decisions.filter(d => d.outcome);
    if (completedDecisions.length === 0) return 0;
    
    const successful = completedDecisions.filter(d => 
      d.outcome.onTimeDelivery && d.outcome.customerSatisfaction >= 4.0
    );
    
    return (successful.length / completedDecisions.length) * 100;
  }

  private calculateAverageConfidence(decisions: any[]): number {
    if (decisions.length === 0) return 0;
    
    const totalConfidence = decisions.reduce((sum, d) => sum + d.decision.confidence, 0);
    return (totalConfidence / decisions.length) * 100;
  }

  private identifyTopCarriers(decisions: any[]): any[] {
    // Implementation for identifying best performing carriers
    return [];
  }

  private identifyImprovementAreas(decisions: any[]): string[] {
    // Implementation for identifying areas needing improvement
    return ['Rate optimization', 'Carrier vetting', 'Route planning'];
  }

  private calculateCostSavings(decisions: any[]): number {
    // Implementation for calculating cost savings from AI recommendations
    return 0;
  }

  private generateActionableRecommendations(decisions: any[]): string[] {
    return [
      'Consider expanding carrier network in high-demand corridors',
      'Implement dynamic pricing for peak demand periods',
      'Focus on carrier relationship management for top performers'
    ];
  }
}

// Type definitions
interface LoadData {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  freightClass: string;
  specialRequirements: string[];
  urgency: 'low' | 'medium' | 'high';
  value: number;
  pickupDate: string;
  deliveryDate: string;
}

interface CarrierData {
  id: string;
  name: string;
  currentLocation: string;
  capacity: number;
  specializations: string[];
  performanceScore: number;
  rateHistory: number[];
  availability: {
    earliestPickup: string;
    preferredLanes: string[];
  };
  equipmentType: string;
  safetyRating: number;
  onTimePercentage: number;
  customerSatisfaction: number;
  experienceScore: number;
  reliability: number;
}

interface DispatchRecommendation {
  primaryRecommendation: CarrierData;
  alternatives: CarrierData[];
  confidence: number;
  reasoning: string;
}

interface CapacityPrediction {
  timeHorizon: number;
  predictedDemand: any;
  recommendedCapacity: any;
  riskFactors: string[];
  confidenceScore: number;
  actionableInsights: string[];
}

interface RateOptimization {
  recommendedRate: number;
  rateRange: { min: number; max: number };
  competitivenessScore: number;
  acceptanceProbability: number;
  profitMargin: number;
  marketPosition: string;
  reasoning: string;
}

interface DispatchConstraints {
  minimumScore: number;
  marketData: any;
  businessRules: any;
}

interface DispatchDecision {
  loadId: string;
  recommendedCarrier: CarrierData | null;
  alternativeCarriers: CarrierData[];
  recommendedRate: number;
  confidence: number;
  reasoning: string;
  riskFactors: string[];
  expectedOutcome: {
    onTimeDelivery: number;
    profitMargin: number;
    customerSatisfaction: number;
  };
}

interface CarrierScore {
  capacity: number;
  location: number;
  reliability: number;
  cost: number;
  specialization: number;
  safety: number;
  experience: number;
  availability: number;
  customerSatisfaction: number;
  overall: number;
}

interface DispatchOutcome {
  onTimeDelivery: boolean;
  actualCost: number;
  customerSatisfaction: number;
  issues: string[];
  completionDate: string;
}

interface DispatchInsights {
  totalDecisions: number;
  successRate: number;
  averageConfidence: number;
  topPerformingCarriers: any[];
  improvementAreas: string[];
  costSavings: number;
  recommendations: string[];
}

export default AIDispatcher;
