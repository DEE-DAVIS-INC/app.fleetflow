import { NextRequest, NextResponse } from 'next/server';
import ClaudeAIService from '../../../../lib/claude-ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action, data } = body;

    const claudeService = new ClaudeAIService();

    switch (action) {
      case 'optimize_routes':
        const routeOptimization = await claudeService.optimizeRoutes(data);
        return NextResponse.json({
          success: true,
          data: routeOptimization
        });

      case 'generate_document':
        const document = await claudeService.generateDocument(data);
        return NextResponse.json({
          success: true,
          data: document
        });

      case 'fleet_insights':
        const insights = await claudeService.generateFleetInsights(data);
        return NextResponse.json({
          success: true,
          data: insights
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Claude AI API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
