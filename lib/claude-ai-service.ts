// Claude AI Integration Service for FleetFlow
// This service integrates Anthropic's Claude AI for advanced document generation and route optimization

import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface RouteOptimizationRequest {
  vehicles: Vehicle[];
  loads: Load[];
  constraints: RouteConstraints;
  businessContext?: string;
}

export interface DocumentGenerationRequest {
  type: 'rate_confirmation' | 'bill_of_lading' | 'carrier_agreement' | 'safety_report' | 'route_plan';
  data: any;
  customInstructions?: string;
  shareableLink?: boolean;
}

export class ClaudeAIService {
  
  /**
   * Generate optimized routes with detailed explanations
   */
  async optimizeRoutes(request: RouteOptimizationRequest): Promise<{
    routes: OptimizedRoute[];
    explanation: string;
    alternativeOptions: string[];
    shareableReport?: string;
  }> {
    const prompt = `
    As a freight transportation expert, optimize these routes for maximum efficiency:
    
    VEHICLES:
    ${JSON.stringify(request.vehicles, null, 2)}
    
    LOADS:
    ${JSON.stringify(request.loads, null, 2)}
    
    CONSTRAINTS:
    ${JSON.stringify(request.constraints, null, 2)}
    
    BUSINESS CONTEXT:
    ${request.businessContext || 'Standard freight operations'}
    
    Please provide:
    1. Optimal route assignments with detailed reasoning
    2. Cost-benefit analysis for each route
    3. Risk assessment and mitigation strategies
    4. Alternative routing options for contingencies
    5. Clear explanation that can be shared with drivers and dispatchers
    
    Format the response as JSON with detailed explanations.
    `;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      const aiResponse = response.content[0].text;
      
      // Parse Claude's response and structure it
      return this.parseRouteOptimizationResponse(aiResponse);
      
    } catch (error) {
      console.error('Claude AI route optimization error:', error);
      throw new Error('Failed to optimize routes with Claude AI');
    }
  }

  /**
   * Generate professional freight documents
   */
  async generateDocument(request: DocumentGenerationRequest): Promise<{
    document: string;
    metadata: DocumentMetadata;
    shareableLink?: string;
  }> {
    const documentPrompts = {
      rate_confirmation: this.getRateConfirmationPrompt(request.data),
      bill_of_lading: this.getBillOfLadingPrompt(request.data),
      carrier_agreement: this.getCarrierAgreementPrompt(request.data),
      safety_report: this.getSafetyReportPrompt(request.data),
      route_plan: this.getRoutePlanPrompt(request.data)
    };

    const prompt = documentPrompts[request.type];
    
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: prompt + (request.customInstructions ? `\n\nADDITIONAL REQUIREMENTS:\n${request.customInstructions}` : '')
          }
        ],
      });

      const document = response.content[0].text;
      
      // Generate shareable link if requested
      let shareableLink;
      if (request.shareableLink) {
        shareableLink = await this.createShareableDocument(document, request.type);
      }

      return {
        document,
        metadata: {
          type: request.type,
          generatedAt: new Date().toISOString(),
          wordCount: document.split(' ').length,
          estimatedReadTime: Math.ceil(document.split(' ').length / 200)
        },
        shareableLink
      };
      
    } catch (error) {
      console.error('Claude AI document generation error:', error);
      throw new Error('Failed to generate document with Claude AI');
    }
  }

  /**
   * Generate AI insights for fleet operations
   */
  async generateFleetInsights(fleetData: FleetData): Promise<{
    insights: AIInsight[];
    recommendations: string[];
    riskAssessment: string;
    opportunities: string[];
  }> {
    const prompt = `
    Analyze this fleet operation data and provide strategic insights:
    
    FLEET DATA:
    ${JSON.stringify(fleetData, null, 2)}
    
    Please provide:
    1. Key operational insights and trends
    2. Specific recommendations for improvement
    3. Risk assessment and mitigation strategies
    4. Growth opportunities and market analysis
    5. Cost optimization opportunities
    
    Focus on actionable insights that can improve profitability and efficiency.
    `;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      });

      return this.parseFleetInsights(response.content[0].text);
      
    } catch (error) {
      console.error('Claude AI fleet insights error:', error);
      throw new Error('Failed to generate fleet insights with Claude AI');
    }
  }

  /**
   * Create shareable document links
   */
  private async createShareableDocument(content: string, type: string): Promise<string> {
    // This would integrate with Claude.ai's sharing feature or create internal links
    // For now, return a placeholder - in production, you'd store the document and create a public link
    const documentId = this.generateDocumentId();
    
    // Store document in your database with public access
    // await this.storeShareableDocument(documentId, content, type);
    
    return `https://yourapp.vercel.app/shared/documents/${documentId}`;
  }

  private generateDocumentId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Document prompt templates
  private getRateConfirmationPrompt(data: any): string {
    return `
    Generate a professional rate confirmation for this freight shipment:
    
    SHIPMENT DETAILS:
    ${JSON.stringify(data, null, 2)}
    
    Include:
    - Professional letterhead format
    - Clear pickup and delivery details
    - Rate breakdown and payment terms
    - Equipment specifications
    - Special instructions and requirements
    - Legal terms and conditions
    - Contact information
    
    Make it comprehensive and ready for client signature.
    `;
  }

  private getBillOfLadingPrompt(data: any): string {
    return `
    Generate a standard Bill of Lading document:
    
    SHIPMENT DATA:
    ${JSON.stringify(data, null, 2)}
    
    Include all required DOT and legal fields, commodity descriptions, 
    weight and piece counts, and proper formatting for legal compliance.
    `;
  }

  private getCarrierAgreementPrompt(data: any): string {
    return `
    Generate a carrier agreement contract:
    
    CARRIER DETAILS:
    ${JSON.stringify(data, null, 2)}
    
    Include standard freight brokerage terms, insurance requirements,
    payment terms, and compliance obligations.
    `;
  }

  private getSafetyReportPrompt(data: any): string {
    return `
    Generate a comprehensive safety report:
    
    SAFETY DATA:
    ${JSON.stringify(data, null, 2)}
    
    Include incident analysis, compliance status, recommendations,
    and action items for safety improvement.
    `;
  }

  private getRoutePlanPrompt(data: any): string {
    return `
    Generate a detailed route plan document:
    
    ROUTE DATA:
    ${JSON.stringify(data, null, 2)}
    
    Include turn-by-turn directions, fuel stops, rest areas,
    timing estimates, and contingency plans.
    `;
  }

  private parseRouteOptimizationResponse(response: string): any {
    // Parse Claude's structured response
    try {
      return JSON.parse(response);
    } catch {
      // If JSON parsing fails, extract structured data from text
      return this.extractStructuredData(response);
    }
  }

  private parseFleetInsights(response: string): any {
    // Parse insights from Claude's response
    const sections = response.split('\n\n');
    return {
      insights: this.extractInsights(sections),
      recommendations: this.extractRecommendations(sections),
      riskAssessment: this.extractRiskAssessment(sections),
      opportunities: this.extractOpportunities(sections)
    };
  }

  private extractStructuredData(text: string): any {
    // Fallback text parsing logic
    return {
      routes: [],
      explanation: text,
      alternativeOptions: [],
      shareableReport: text
    };
  }

  private extractInsights(sections: string[]): AIInsight[] {
    // Extract insights from text sections
    return [];
  }

  private extractRecommendations(sections: string[]): string[] {
    // Extract recommendations from text sections
    return [];
  }

  private extractRiskAssessment(sections: string[]): string {
    // Extract risk assessment from text sections
    return '';
  }

  private extractOpportunities(sections: string[]): string[] {
    // Extract opportunities from text sections
    return [];
  }
}

// Types
interface Vehicle {
  id: string;
  type: string;
  capacity: number;
  location: string;
  driver: string;
}

interface Load {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  pickupDate: string;
  deliveryDate: string;
}

interface RouteConstraints {
  maxDriveTime: number;
  fuelEfficiency: boolean;
  avoidTolls: boolean;
  preferredCarriers: string[];
}

interface OptimizedRoute {
  vehicleId: string;
  stops: RouteStop[];
  totalDistance: number;
  estimatedTime: number;
  fuelCost: number;
  explanation: string;
}

interface RouteStop {
  loadId: string;
  address: string;
  type: 'pickup' | 'delivery';
  estimatedArrival: string;
  instructions: string;
}

interface AIInsight {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  timestamp: string;
}

interface FleetData {
  vehicles: Vehicle[];
  loads: Load[];
  drivers: any[];
  performance: any;
  costs: any;
}

interface DocumentMetadata {
  type: string;
  generatedAt: string;
  wordCount: number;
  estimatedReadTime: number;
}

export default ClaudeAIService;
