import { NextRequest, NextResponse } from 'next/server';

// Configure this route for dynamic rendering
export const dynamic = 'force-dynamic';

// Simple in-memory store for automation status (in production, use a database)
let automationStatus: {
  isRunning: boolean;
  lastUpdate: string | null;
  tasksRunning: string[];
} = {
  isRunning: false,
  lastUpdate: null,
  tasksRunning: []
};

export async function GET() {
  return NextResponse.json({
    success: true,
    status: automationStatus
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'start':
        // In a real implementation, you would start the automation engine here
        // For now, we'll just update the status
        automationStatus.isRunning = true;
        automationStatus.lastUpdate = new Date().toISOString();
        automationStatus.tasksRunning = [
          'predictive-maintenance',
          'route-optimization', 
          'driver-analysis',
          'cost-optimization',
          'smart-monitoring'
        ];
        
        console.log('🚀 AI Automation Engine started (mock mode)');
        break;
        
      case 'stop':
        automationStatus.isRunning = false;
        automationStatus.lastUpdate = new Date().toISOString();
        automationStatus.tasksRunning = [];
        
        console.log('⏹️ AI Automation Engine stopped');
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      status: automationStatus
    });
    
  } catch (error) {
    console.error('Automation API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
