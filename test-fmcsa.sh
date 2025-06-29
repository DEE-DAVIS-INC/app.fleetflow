#!/bin/bash

echo "🔍 Testing FMCSA API Integration"
echo "=================================="

# Test the FMCSA API with real DOT numbers
echo ""
echo "Testing FMCSA API with real DOT numbers..."

# Test DOT number lookup
echo ""
echo "1. Testing DOT Number Lookup..."
curl -s "https://mobile.fmcsa.dot.gov/qc/id/123456?webKey=7de24c4a0eade12f34685829289e0446daf7880e" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed to parse JSON response"

echo ""
echo "2. Testing with a different DOT number..."
curl -s "https://mobile.fmcsa.dot.gov/qc/id/789012?webKey=7de24c4a0eade12f34685829289e0446daf7880e" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed to parse JSON response"

echo ""
echo "3. Testing Carrier Name Search..."
curl -s "https://mobile.fmcsa.dot.gov/qc/name/ABC%20TRUCKING?webKey=7de24c4a0eade12f34685829289e0446daf7880e" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed to parse JSON response"

echo ""
echo "4. Testing API Base Endpoint..."
curl -s "https://mobile.fmcsa.dot.gov/qc/services/" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" | jq '.' || echo "Failed to parse JSON response"

echo ""
echo "=================================="
echo "✅ FMCSA API Test Complete"
echo ""
echo "📝 API Key: 7de24c4a0eade12f34685829289e0446daf7880e"
echo "🌐 Base URL: https://mobile.fmcsa.dot.gov/qc"
echo ""
echo "Available endpoints:"
echo "  - GET /id/{dotNumber}?webKey={apiKey}"
echo "  - GET /name/{carrierName}?webKey={apiKey}"
echo ""
echo "To test in the browser:"
echo "  http://localhost:3002 -> Navigate to any page with SAFER Lookup"
echo ""
