import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const { load, carriers } = await request.json();

    if (!load || !carriers) {
      return NextResponse.json({
        success: false,
        error: 'Load and carriers data required'
      }, { status: 400 });
    }

    let recommendation;

    if (openai) {
      // Use AI for intelligent matching
      recommendation = await getAIRecommendation(load, carriers);
    } else {
      // Fallback to rule-based matching
      recommendation = getFallbackRecommendation(load, carriers);
    }

    return NextResponse.json({
      success: true,
      recommendation
    });

  } catch (error) {
    console.error('AI dispatch matching error:', error);
    
    // Always provide fallback recommendation
    const { load, carriers } = await request.json();
    const fallbackRecommendation = getFallbackRecommendation(load, carriers);
    
    return NextResponse.json({
      success: true,
      recommendation: fallbackRecommendation,
      warning: 'AI unavailable, using fallback algorithm'
    });
  }
}

async function getAIRecommendation(load: any, carriers: any[]) {
  const prompt = `
As an expert AI dispatcher for a freight company, analyze the following load and available carriers to make the best dispatch recommendation.

LOAD DETAILS:
${JSON.stringify(load, null, 2)}

AVAILABLE CARRIERS:
${JSON.stringify(carriers, null, 2)}

ANALYSIS CRITERIA:
1. Capacity match (weight, dimensions, equipment type)
2. Location proximity and route efficiency
3. Carrier reliability and performance history
4. Cost effectiveness and rate competitiveness
5. Specialization match (hazmat, refrigerated, oversized, etc.)
6. Safety ratings and compliance
7. Availability and timing
8. Customer satisfaction history

Please provide a detailed recommendation in the following JSON format:
{
  "primaryRecommendation": {
    "carrierId": "string",
    "matchScore": number (0-100),
    "reasoning": "detailed explanation"
  },
  "alternatives": [
    {
      "carrierId": "string",
      "matchScore": number (0-100),
      "reasoning": "brief explanation"
    }
  ],
  "rateRecommendation": {
    "suggestedRate": number,
    "rateJustification": "explanation",
    "competitivenessScore": number (0-100)
  },
  "riskFactors": ["array of potential risks"],
  "confidenceScore": number (0-100),
  "expectedOutcome": {
    "onTimeDeliveryProbability": number (0-100),
    "costEfficiency": number (0-100),
    "customerSatisfactionPrediction": number (1-5)
  }
}

Focus on making data-driven recommendations that balance cost, reliability, and service quality.
`;

  const completion = await openai!.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert AI dispatcher with deep knowledge of freight logistics, carrier performance, and dispatch optimization. Provide precise, actionable recommendations based on data analysis."
      },
      {
        role: "user", 
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  try {
    const response = completion.choices[0].message.content;
    const recommendation = JSON.parse(response!);
    return recommendation;
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    return getFallbackRecommendation(load, carriers);
  }
}

function getFallbackRecommendation(load: any, carriers: any[]) {
  // Rule-based fallback algorithm
  const scoredCarriers = carriers.map(carrier => {
    let score = 0;
    let reasoning = [];

    // Capacity check (40% weight)
    const capacityRatio = load.weight / (carrier.capacity || 1);
    if (capacityRatio <= 0.95 && capacityRatio >= 0.7) {
      score += 40;
      reasoning.push('optimal capacity utilization');
    } else if (capacityRatio <= 1.0) {
      score += 30;
      reasoning.push('adequate capacity');
    } else {
      score += 0;
      reasoning.push('insufficient capacity');
    }

    // Performance history (30% weight)
    const onTimeScore = (carrier.onTimePercentage || 70) * 0.3;
    score += onTimeScore;
    if (carrier.onTimePercentage > 90) {
      reasoning.push('excellent reliability');
    } else if (carrier.onTimePercentage > 80) {
      reasoning.push('good reliability');
    }

    // Safety rating (20% weight)
    const safetyScore = (carrier.safetyRating || 70) * 0.2;
    score += safetyScore;
    if (carrier.safetyRating > 85) {
      reasoning.push('high safety standards');
    }

    // Specialization match (10% weight)
    if (load.specialRequirements && carrier.specializations) {
      const matches = load.specialRequirements.filter((req: string) => 
        carrier.specializations.includes(req)
      ).length;
      const specializationScore = (matches / load.specialRequirements.length) * 10;
      score += specializationScore;
      if (matches > 0) {
        reasoning.push('specialized equipment available');
      }
    } else {
      score += 5; // neutral
    }

    return {
      carrier,
      score: Math.min(score, 100),
      reasoning: reasoning.join(', ')
    };
  }).sort((a, b) => b.score - a.score);

  const primary = scoredCarriers[0];
  const alternatives = scoredCarriers.slice(1, 3);

  // Calculate recommended rate based on load characteristics
  const baseRate = calculateBaseRate(load);
  const marketAdjustment = 1.0; // Would be dynamic in production
  const suggestedRate = baseRate * marketAdjustment;

  return {
    primaryRecommendation: {
      carrierId: primary.carrier.id,
      matchScore: primary.score,
      reasoning: `Best match based on: ${primary.reasoning}`
    },
    alternatives: alternatives.map(alt => ({
      carrierId: alt.carrier.id,
      matchScore: alt.score,
      reasoning: alt.reasoning
    })),
    rateRecommendation: {
      suggestedRate,
      rateJustification: 'Based on load characteristics and market conditions',
      competitivenessScore: 75
    },
    riskFactors: identifyRiskFactors(load, primary.carrier),
    confidenceScore: Math.max(primary.score * 0.8, 60),
    expectedOutcome: {
      onTimeDeliveryProbability: primary.carrier.onTimePercentage || 80,
      costEfficiency: 80,
      customerSatisfactionPrediction: 4.0
    }
  };
}

function calculateBaseRate(load: any): number {
  // Simplified rate calculation
  const baseRatePerMile = 2.50;
  const distance = load.distance || 500; // Default 500 miles
  const weightMultiplier = Math.max(1.0, load.weight / 40000); // Adjust for weight
  const urgencyMultiplier = load.urgency === 'high' ? 1.2 : load.urgency === 'medium' ? 1.1 : 1.0;
  
  return distance * baseRatePerMile * weightMultiplier * urgencyMultiplier;
}

function identifyRiskFactors(load: any, carrier: any): string[] {
  const risks = [];
  
  if (carrier.onTimePercentage < 85) {
    risks.push('Carrier has below-average on-time performance');
  }
  
  if (carrier.safetyRating < 80) {
    risks.push('Carrier safety rating below industry standard');
  }
  
  if (load.urgency === 'high' && carrier.performanceScore < 85) {
    risks.push('High priority load with moderate performance carrier');
  }
  
  if (load.weight / carrier.capacity > 0.95) {
    risks.push('Near maximum capacity utilization');
  }
  
  if (load.specialRequirements && (!carrier.specializations || carrier.specializations.length === 0)) {
    risks.push('Special requirements may not be fully met');
  }
  
  return risks;
}
