#!/bin/bash

echo "🚛 Starting FleetFlow Fresh..."

# Kill any existing processes
echo "Killing existing processes..."
pkill -f "next\|node" || true

# Clear caches
echo "Clearing caches..."
rm -rf .next
rm -rf node_modules/.cache

# Install dependencies
echo "Installing dependencies..."
npm install

# Start fresh server
echo "Starting development server..."
npm run dev

echo "FleetFlow should now be available at http://localhost:3000"
