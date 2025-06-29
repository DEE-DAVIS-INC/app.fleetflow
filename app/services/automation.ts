import * as cron from 'node-cron';
import { fleetAI } from './ai';
import { smsService } from './sms';
import { sendInvoiceEmail } from './email';

// AI Automation Engine for FleetFlow
export class AIAutomationEngine {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private isRunning: boolean = false;

  constructor() {
    console.log('🤖 AI Automation Engine initialized');
  }

  // Start all automation tasks
  start() {
    if (this.isRunning) {
      console.log('⚠️ Automation engine already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting AI Automation Engine...');

    // Schedule predictive maintenance checks (daily at 6 AM)
    this.scheduleTask('predictive-maintenance', '0 6 * * *', () => {
      this.runPredictiveMaintenance();
    });

    // Schedule route optimization (every 4 hours during business hours)
    this.scheduleTask('route-optimization', '0 */4 8-18 * * *', () => {
      this.runRouteOptimization();
    });

    // Schedule driver performance analysis (weekly on Monday at 9 AM)
    this.scheduleTask('driver-analysis', '0 9 * * 1', () => {
      this.runDriverAnalysis();
    });

    // Schedule cost optimization analysis (monthly on 1st at 10 AM)
    this.scheduleTask('cost-optimization', '0 10 1 * *', () => {
      this.runCostOptimization();
    });

    // Schedule smart monitoring (every 30 minutes)
    this.scheduleTask('smart-monitoring', '*/30 * * * *', () => {
      this.runSmartMonitoring();
    });

    console.log('✅ All AI automation tasks scheduled');
  }

  // Stop all automation tasks
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Automation engine not running');
      return;
    }

    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`🛑 Stopped task: ${name}`);
    });

    this.tasks.clear();
    this.isRunning = false;
    console.log('⏹️ AI Automation Engine stopped');
  }

  // Schedule a new automation task
  private scheduleTask(name: string, schedule: string, callback: () => void) {
    try {
      const task = cron.schedule(schedule, callback, {
        timezone: "America/New_York"
      });

      this.tasks.set(name, task);
      console.log(`📅 Scheduled task: ${name} (${schedule})`);
    } catch (error) {
      console.error(`❌ Failed to schedule task ${name}:`, error);
    }
  }

  // Run predictive maintenance analysis
  private async runPredictiveMaintenance() {
    console.log('🔧 Running AI Predictive Maintenance Analysis...');
    
    try {
      // Get vehicle data (in real app, this would come from database)
      const vehicles = await this.getVehicleData();
      
      for (const vehicle of vehicles) {
        const analysis = await fleetAI.predictMaintenance(vehicle);
        
        // Send alerts for high-risk vehicles
        if (analysis.riskLevel === 'high') {
          await this.sendMaintenanceAlert(vehicle, analysis);
        }
      }
      
      console.log('✅ Predictive maintenance analysis completed');
    } catch (error) {
      console.error('❌ Predictive maintenance analysis failed:', error);
    }
  }

  // Run route optimization
  private async runRouteOptimization() {
    console.log('🗺️ Running AI Route Optimization...');
    
    try {
      const vehicles = await this.getActiveVehicles();
      const destinations = await this.getPendingDestinations();
      
      if (vehicles.length > 0 && destinations.length > 0) {
        const optimization = await fleetAI.optimizeRoute(vehicles, destinations);
        
        // Notify dispatch team of optimized routes
        await this.sendRouteOptimizationAlert(optimization);
      }
      
      console.log('✅ Route optimization completed');
    } catch (error) {
      console.error('❌ Route optimization failed:', error);
    }
  }

  // Run driver performance analysis
  private async runDriverAnalysis() {
    console.log('👨‍💼 Running AI Driver Performance Analysis...');
    
    try {
      const drivers = await this.getDriverData();
      
      for (const driver of drivers) {
        const analysis = await fleetAI.analyzeDriverPerformance(driver);
        
        // Send performance reports to management
        if (analysis.performanceScore < 70) {
          await this.sendDriverPerformanceAlert(driver, analysis);
        }
      }
      
      console.log('✅ Driver performance analysis completed');
    } catch (error) {
      console.error('❌ Driver performance analysis failed:', error);
    }
  }

  // Run cost optimization analysis
  private async runCostOptimization() {
    console.log('💰 Running AI Cost Optimization Analysis...');
    
    try {
      const fleetData = await this.getFleetData();
      const optimization = await fleetAI.optimizeCosts(fleetData);
      
      // Send cost optimization recommendations to management
      await this.sendCostOptimizationReport(optimization);
      
      console.log('✅ Cost optimization analysis completed');
    } catch (error) {
      console.error('❌ Cost optimization analysis failed:', error);
    }
  }

  // Run smart monitoring
  private async runSmartMonitoring() {
    console.log('🧠 Running Smart Monitoring...');
    
    try {
      // Monitor various fleet metrics
      const alerts = await this.checkForAnomalies();
      
      for (const alert of alerts) {
        const smartNotification = await fleetAI.generateSmartNotification(alert);
        await this.sendSmartAlert(smartNotification);
      }
      
      console.log('✅ Smart monitoring completed');
    } catch (error) {
      console.error('❌ Smart monitoring failed:', error);
    }
  }

  // Helper function to send SMS notifications
  private async sendSMSNotification(to: string, message: string, priority: string = 'normal') {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sms',
          to,
          message,
          priority
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  // Helper function to send email notifications
  private async sendEmailNotification(to: string, subject: string, htmlMessage: string, type: string = 'notification') {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          to,
          subject,
          htmlMessage,
          emailType: type
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
    const message = `🚨 HIGH MAINTENANCE RISK: Vehicle ${vehicle.name} requires immediate attention. Risk: ${analysis.riskLevel}. Next service due: ${analysis.nextServiceDue}`;
    
    // Send SMS to fleet manager
    await sendNotification({
      type: 'sms',
      to: process.env.FLEET_MANAGER_PHONE || '+1234567890',
      message,
      priority: 'high'
    });

    // Send email with detailed report
    await sendEmail({
      to: process.env.FLEET_MANAGER_EMAIL || 'manager@fleetflow.com',
      subject: `🔧 Urgent: Vehicle ${vehicle.name} Maintenance Required`,
      htmlMessage: this.generateMaintenanceEmailHTML(vehicle, analysis),
      type: 'maintenance_alert'
    });
  }

  // Send route optimization alert
  private async sendRouteOptimizationAlert(optimization: any) {
    const message = `🗺️ AI Route Optimization Complete! Efficiency Score: ${optimization.efficiencyScore}%. Estimated savings: $${optimization.totalEstimatedCost}`;
    
    await sendNotification({
      type: 'sms',
      to: process.env.DISPATCH_PHONE || '+1234567890',
      message,
      priority: 'normal'
    });
  }

  // Send driver performance alert
  private async sendDriverPerformanceAlert(driver: any, analysis: any) {
    await sendEmail({
      to: process.env.HR_EMAIL || 'hr@fleetflow.com',
      subject: `📊 Driver Performance Review: ${driver.name}`,
      htmlMessage: this.generateDriverAnalysisEmailHTML(driver, analysis),
      type: 'performance_review'
    });
  }

  // Send cost optimization report
  private async sendCostOptimizationReport(optimization: any) {
    await sendEmail({
      to: process.env.MANAGEMENT_EMAIL || 'management@fleetflow.com',
      subject: `💰 Monthly Cost Optimization Report - Potential Savings: ${optimization.totalPotentialSavings}`,
      htmlMessage: this.generateCostOptimizationEmailHTML(optimization),
      type: 'cost_optimization'
    });
  }

  // Send smart alert
  private async sendSmartAlert(notification: any) {
    if (notification.priority === 'critical' || notification.priority === 'high') {
      await sendNotification({
        type: 'sms',
        to: process.env.EMERGENCY_CONTACT || '+1234567890',
        message: notification.message,
        priority: notification.priority
      });
    }
  }

  // Mock data functions (replace with real database calls)
  private async getVehicleData() {
    return [
      {
        id: 'V001',
        name: 'Truck-045',
        type: 'Heavy Truck',
        mileage: 125000,
        lastMaintenance: '2024-05-15',
        fuelEfficiency: 8.5,
        status: 'active'
      },
      {
        id: 'V002',
        name: 'Van-023',
        type: 'Light Van',
        mileage: 89000,
        lastMaintenance: '2024-06-20',
        fuelEfficiency: 12.3,
        status: 'maintenance'
      }
    ];
  }

  private async getActiveVehicles() {
    const vehicles = await this.getVehicleData();
    return vehicles.filter(v => v.status === 'active');
  }

  private async getPendingDestinations() {
    return [
      'New York, NY',
      'Philadelphia, PA',
      'Baltimore, MD',
      'Washington, DC'
    ];
  }

  private async getDriverData() {
    return [
      {
        id: 'D001',
        name: 'John Smith',
        experience: 5,
        safetyRecord: 98,
        deliveryRate: 94,
        fuelEfficiency: 87
      },
      {
        id: 'D002',
        name: 'Sarah Wilson',
        experience: 3,
        safetyRecord: 92,
        deliveryRate: 89,
        fuelEfficiency: 91
      }
    ];
  }

  private async getFleetData() {
    return {
      totalVehicles: 25,
      totalDrivers: 30,
      monthlyFuelCost: 45000,
      monthlyMaintenanceCost: 12000,
      averageUtilization: 78
    };
  }

  private async checkForAnomalies() {
    // Check for various anomalies
    const alerts = [];
    
    // Example: Check fuel efficiency drop
    const vehicles = await this.getVehicleData();
    for (const vehicle of vehicles) {
      if (vehicle.fuelEfficiency < 8.0) {
        alerts.push({
          type: 'fuel_efficiency_drop',
          vehicle: vehicle,
          severity: 'medium'
        });
      }
    }
    
    return alerts;
  }

  // Email template generators
  private generateMaintenanceEmailHTML(vehicle: any, analysis: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">🔧 Maintenance Alert: ${vehicle.name}</h2>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
          <h3>Risk Level: <span style="color: #dc2626; text-transform: uppercase;">${analysis.riskLevel}</span></h3>
          <p><strong>Next Service Due:</strong> ${analysis.nextServiceDue}</p>
          <p><strong>Estimated Cost:</strong> $${analysis.estimatedCost}</p>
          <h4>Recommended Actions:</h4>
          <ul>
            ${analysis.recommendedActions.map((action: string) => `<li>${action}</li>`).join('')}
          </ul>
        </div>
        <p style="margin-top: 20px; color: #666;">
          This alert was generated by FleetFlow AI Automation. Please take immediate action to prevent potential breakdowns.
        </p>
      </div>
    `;
  }

  private generateDriverAnalysisEmailHTML(driver: any, analysis: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📊 Driver Performance Analysis: ${driver.name}</h2>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px;">
          <h3>Performance Score: ${analysis.performanceScore}/100</h3>
          <h4>Strengths:</h4>
          <ul>
            ${analysis.strengths.map((strength: string) => `<li style="color: #059669;">${strength}</li>`).join('')}
          </ul>
          <h4>Areas for Improvement:</h4>
          <ul>
            ${analysis.improvements.map((improvement: string) => `<li style="color: #dc2626;">${improvement}</li>`).join('')}
          </ul>
          <h4>Training Recommendations:</h4>
          <ul>
            ${analysis.trainingRecommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  private generateCostOptimizationEmailHTML(optimization: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">💰 Cost Optimization Report</h2>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px;">
          <h3>Total Potential Savings: ${optimization.totalPotentialSavings}</h3>
          <h4>Immediate Opportunities:</h4>
          <ul>
            <li>Fuel Optimization: ${optimization.immediateSavings.fuelOptimization}</li>
            <li>Route Efficiency: ${optimization.immediateSavings.routeEfficiency}</li>
            <li>Maintenance Scheduling: ${optimization.immediateSavings.maintenanceScheduling}</li>
          </ul>
          <h4>Implementation Priority:</h4>
          <ol>
            ${optimization.implementationPriority.map((item: string) => `<li>${item}</li>`).join('')}
          </ol>
          <p><strong>Expected ROI:</strong> ${optimization.roi}</p>
        </div>
      </div>
    `;
  }
}

export const aiAutomation = new AIAutomationEngine();
