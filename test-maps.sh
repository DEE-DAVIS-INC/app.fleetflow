#!/bin/bash

echo "🗺️ Testing Google Maps Integration..."
echo "======================================"

# Check if API key is set
if grep -q "your_google_maps_api_key_here" .env.local; then
    echo "❌ Google Maps API key not set yet"
    echo "   Please update NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local"
    echo ""
    echo "📋 Steps to get API key:"
    echo "   1. Go to https://console.cloud.google.com/apis/credentials"
    echo "   2. Create a new project or select existing"
    echo "   3. Enable Maps JavaScript API, Places API, Directions API"
    echo "   4. Create API Key"
    echo "   5. Paste it in .env.local"
else
    echo "✅ Google Maps API key is configured!"
    echo "🌐 Open http://localhost:3000/routes to test interactive maps"
    echo "🌐 Open http://localhost:3000/vehicles to test vehicle tracking"
    echo "🌐 Open http://localhost:3000/dispatch to test route planning"
fi

echo ""
echo "🎯 Test locations to try:"
echo "   - 1600 Amphitheatre Parkway, Mountain View, CA"
echo "   - 350 Fifth Avenue, New York, NY"
echo "   - 1 Microsoft Way, Redmond, WA"
