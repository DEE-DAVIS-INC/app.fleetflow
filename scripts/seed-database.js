#!/usr/bin/env node

/**
 * Database Seeding Script for FleetFlow
 * Run this script to populate your production database with initial data
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

const db = getFirestore(app);

const seedData = {
  drivers: [
    {
      name: 'John Smith',
      phone: '+1234567890',
      email: 'john.smith@fleetflow.com',
      licenseNumber: 'CDL123456',
      status: 'available',
      location: {
        lat: 33.7490,
        lng: -84.3880,
        address: 'Atlanta, GA'
      },
      hoursOfService: {
        remaining: 10,
        lastReset: Timestamp.now()
      }
    },
    {
      name: 'Sarah Johnson',
      phone: '+1234567891',
      email: 'sarah.johnson@fleetflow.com',
      licenseNumber: 'CDL123457',
      status: 'on_route',
      location: {
        lat: 41.8781,
        lng: -87.6298,
        address: 'Chicago, IL'
      },
      hoursOfService: {
        remaining: 8,
        lastReset: Timestamp.now()
      }
    },
    {
      name: 'Mike Wilson',
      phone: '+1234567892',
      email: 'mike.wilson@fleetflow.com',
      licenseNumber: 'CDL123458',
      status: 'loading',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: 'Los Angeles, CA'
      },
      hoursOfService: {
        remaining: 6,
        lastReset: Timestamp.now()
      }
    }
  ],

  vehicles: [
    {
      vehicleNumber: 'TRK-101',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2022,
      vin: '1FUJGBDV3NLAB1234',
      plateNumber: 'FL-12345',
      equipmentType: 'Dry Van',
      status: 'active',
      location: {
        lat: 33.7490,
        lng: -84.3880,
        address: 'Atlanta, GA'
      }
    },
    {
      vehicleNumber: 'TRK-205',
      make: 'Peterbilt',
      model: '579',
      year: 2021,
      vin: '1XPWD40X1ED234567',
      plateNumber: 'IL-67890',
      equipmentType: 'Refrigerated',
      status: 'active',
      location: {
        lat: 41.8781,
        lng: -87.6298,
        address: 'Chicago, IL'
      }
    },
    {
      vehicleNumber: 'TRK-150',
      make: 'Kenworth',
      model: 'T680',
      year: 2023,
      vin: '1XKYD49X3NJ345678',
      plateNumber: 'CA-11111',
      equipmentType: 'Flatbed',
      status: 'active',
      location: {
        lat: 34.0522,
        lng: -118.2437,
        address: 'Los Angeles, CA'
      }
    }
  ],

  loads: [
    {
      loadNumber: 'LD001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      pickupDate: '2024-12-20',
      deliveryDate: '2024-12-21',
      status: 'available',
      rate: 2450,
      weight: '45,000 lbs',
      equipment: 'Dry Van',
      carrierName: 'Smith Trucking LLC',
      brokerName: 'FleetFlow Logistics'
    },
    {
      loadNumber: 'LD002',
      origin: 'Chicago, IL',
      destination: 'Dallas, TX',
      pickupDate: '2024-12-20',
      deliveryDate: '2024-12-22',
      status: 'assigned',
      rate: 1850,
      weight: '38,500 lbs',
      equipment: 'Refrigerated',
      carrierName: 'Johnson Logistics',
      driverName: 'Sarah Johnson',
      brokerName: 'FleetFlow Logistics'
    },
    {
      loadNumber: 'LD003',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      pickupDate: '2024-12-19',
      deliveryDate: '2024-12-19',
      status: 'in_transit',
      rate: 1650,
      weight: '42,000 lbs',
      equipment: 'Flatbed',
      carrierName: 'Wilson Transport',
      driverName: 'Mike Wilson',
      brokerName: 'FleetFlow Logistics'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed drivers
    console.log('👥 Seeding drivers...');
    for (const driver of seedData.drivers) {
      const docRef = await db.collection('drivers').add({
        ...driver,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`   ✅ Added driver: ${driver.name} (${docRef.id})`);
    }

    // Seed vehicles
    console.log('🚛 Seeding vehicles...');
    for (const vehicle of seedData.vehicles) {
      const docRef = await db.collection('vehicles').add({
        ...vehicle,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`   ✅ Added vehicle: ${vehicle.vehicleNumber} (${docRef.id})`);
    }

    // Seed loads
    console.log('📦 Seeding loads...');
    for (const load of seedData.loads) {
      const docRef = await db.collection('loads').add({
        ...load,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`   ✅ Added load: ${load.loadNumber} (${docRef.id})`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${seedData.drivers.length} drivers added`);
    console.log(`   • ${seedData.vehicles.length} vehicles added`);
    console.log(`   • ${seedData.loads.length} loads added`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Check if required environment variables are set
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`   • ${varName}`);
  });
  console.error('\nPlease set these variables in your .env.local file');
  process.exit(1);
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, seedData };
