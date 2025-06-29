import OpenAI from 'openai';

// AI Service for FleetFlow Automation
export class FleetFlowAI {
  private openai?: OpenAI;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = !!process.env.OPENAI_API_KEY;
    
    if (this.isEnabled) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.log('AI Service running in mock mode - set OPENAI_API_KEY for production');
    }
  }

  // Route Optimization using AI
  async optimizeRoute(vehicles: any[], destinations: string[]): Promise<any> {
    if (!this.isEnabled || !this.openai) {
      return this.mockRouteOptimization(vehicles, destinations);
    }

    try {
      const prompt = `
        As a fleet management AI, optimize the following route assignment:
        
        Vehicles: ${JSON.stringify(vehicles, null, 2)}
        Destinations: ${JSON.stringify(destinations, null, 2)}
        
        Consider:
        - Vehicle fuel levels
        - Driver availability 
        - Vehicle capacity
        - Distance efficiency
        - Maintenance schedules
        
        Return a JSON response with optimized assignments including:
        - vehicle assignments
        - estimated fuel consumption
        - time estimates
        - cost analysis
        - efficiency score (1-100)
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Route Optimization Error:', error);
      return this.mockRouteOptimization(vehicles, destinations);
    }
  }

  // Predictive Maintenance AI
  async predictMaintenance(vehicle: any): Promise<any> {
    if (!this.isEnabled || !this.openai) {
      return this.mockMaintenancePrediction(vehicle);
    }

    try {
      const prompt = `
        Analyze this vehicle's data for predictive maintenance:
        
        Vehicle Data: ${JSON.stringify(vehicle, null, 2)}
        
        Consider:
        - Current mileage vs last maintenance
        - Fuel efficiency patterns
        - Usage patterns
        - Vehicle age and type
        
        Provide maintenance predictions with:
        - Risk level (low/medium/high)
        - Recommended actions
        - Timeline for next service
        - Cost estimates
        - Priority components to check
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Maintenance Prediction Error:', error);
      return this.mockMaintenancePrediction(vehicle);
    }
  }

  // Driver Performance Analysis
  async analyzeDriverPerformance(driverData: any): Promise<any> {
    if (!this.isEnabled || !this.openai) {
      return this.mockDriverAnalysis(driverData);
    }

    try {
      const prompt = `
        Analyze driver performance data:
        
        Driver Data: ${JSON.stringify(driverData, null, 2)}
        
        Evaluate:
        - Fuel efficiency
        - On-time delivery rates
        - Safety record
        - Route adherence
        - Customer feedback
        
        Provide analysis with:
        - Performance score (1-100)
        - Strengths and areas for improvement
        - Training recommendations
        - Safety insights
        - Efficiency tips
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Driver Analysis Error:', error);
      return this.mockDriverAnalysis(driverData);
    }
  }

  // Cost Optimization AI
  async optimizeCosts(fleetData: any): Promise<any> {
    if (!this.isEnabled || !this.openai) {
      return this.mockCostOptimization(fleetData);
    }

    try {
      const prompt = `
        Analyze fleet data for cost optimization opportunities:
        
        Fleet Data: ${JSON.stringify(fleetData, null, 2)}
        
        Analyze:
        - Fuel consumption patterns
        - Maintenance costs
        - Route efficiency
        - Vehicle utilization
        - Driver productivity
        
        Provide recommendations for:
        - Immediate cost savings
        - Long-term optimizations
        - ROI calculations
        - Implementation priorities
        - Expected savings percentages
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Cost Optimization Error:', error);
      return this.mockCostOptimization(fleetData);
    }
  }

  // Smart Notifications AI
  async generateSmartNotification(context: any): Promise<any> {
    if (!this.isEnabled || !this.openai) {
      return this.mockSmartNotification(context);
    }

    try {
      const prompt = `
        Generate intelligent notification based on fleet context:
        
        Context: ${JSON.stringify(context, null, 2)}
        
        Create appropriate notification with:
        - Priority level (low/medium/high/critical)
        - Message content (clear and actionable)
        - Recommended actions
        - Recipient suggestions
        - Follow-up requirements
      `;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error('AI Smart Notification Error:', error);
      return this.mockSmartNotification(context);
    }
  }

  // Mock functions for development/fallback
  private mockRouteOptimization(vehicles: any[], destinations: string[]) {
    return {
      assignments: vehicles.map((vehicle, index) => ({
        vehicleId: vehicle.id,
        destination: destinations[index % destinations.length],
        estimatedFuel: Math.round(20 + Math.random() * 30),
        estimatedTime: Math.round(60 + Math.random() * 120),
        estimatedCost: Math.round(150 + Math.random() * 200)
      })),
      efficiencyScore: Math.round(75 + Math.random() * 20),
      totalEstimatedCost: Math.round(vehicles.length * 200),
      recommendation: "Routes optimized for fuel efficiency and time"
    };
  }

  private mockMaintenancePrediction(vehicle: any) {
    const riskLevels = ['low', 'medium', 'high'];
    const risk = riskLevels[Math.floor(Math.random() * 3)];
    
    return {
      riskLevel: risk,
      nextServiceDue: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      recommendedActions: [
        'Oil change due soon',
        'Tire pressure check recommended',
        'Brake inspection suggested'
      ],
      estimatedCost: Math.round(200 + Math.random() * 500),
      confidence: Math.round(80 + Math.random() * 15)
    };
  }

  private mockDriverAnalysis(driverData: any) {
    return {
      performanceScore: Math.round(70 + Math.random() * 25),
      strengths: ['Punctual deliveries', 'Good fuel efficiency'],
      improvements: ['Route planning could be optimized'],
      trainingRecommendations: ['Advanced safety course', 'Eco-driving techniques'],
      safetyRating: Math.round(85 + Math.random() * 10)
    };
  }

  private mockCostOptimization(fleetData: any) {
    return {
      immediateSavings: {
        fuelOptimization: '$2,500/month',
        routeEfficiency: '$1,800/month',
        maintenanceScheduling: '$1,200/month'
      },
      longTermSavings: {
        vehicleReplacement: '$15,000/year',
        driverTraining: '$8,000/year'
      },
      totalPotentialSavings: '$28,500/year',
      roi: '340%',
      implementationPriority: [
        'Route optimization',
        'Predictive maintenance',
        'Driver training program'
      ]
    };
  }

  private mockSmartNotification(context: any) {
    const priorities = ['low', 'medium', 'high', 'critical'];
    return {
      priority: priorities[Math.floor(Math.random() * 4)],
      message: 'AI detected potential optimization opportunity',
      recommendedActions: ['Review route efficiency', 'Check vehicle status'],
      recipients: ['fleet_manager', 'dispatch'],
      followUp: '24 hours'
    };
  }
}

export const fleetAI = new FleetFlowAI();
