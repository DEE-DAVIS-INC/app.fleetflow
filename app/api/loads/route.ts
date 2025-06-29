import { NextRequest, NextResponse } from 'next/server';
import { loadService } from '../../../lib/database';

export async function GET() {
  try {
    const loads = await loadService.getAll();
    return NextResponse.json({ success: true, data: loads });
  } catch (error) {
    console.error('Error fetching loads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch loads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { loadNumber, origin, destination, pickupDate, deliveryDate, rate, weight, equipment } = body;
    
    if (!loadNumber || !origin || !destination || !pickupDate || !deliveryDate || !rate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const loadId = await loadService.create({
      loadNumber,
      origin,
      destination,
      pickupDate,
      deliveryDate,
      status: 'available',
      rate: parseFloat(rate),
      weight: weight || '',
      equipment: equipment || 'Dry Van',
      carrierName: body.carrierName,
      driverName: body.driverName,
      brokerName: body.brokerName
    });

    return NextResponse.json({ 
      success: true, 
      data: { id: loadId, message: 'Load created successfully' }
    });
  } catch (error) {
    console.error('Error creating load:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create load' },
      { status: 500 }
    );
  }
}
