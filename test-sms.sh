#!/bin/bash

echo "🧪 Testing SMS Integration..."

# Test SMS notification
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "loadData": {
      "id": "test-load-001",
      "origin": "Atlanta, GA", 
      "destination": "Miami, FL",
      "rate": "$2500",
      "distance": "650 miles",
      "pickupDate": "2025-06-25",
      "equipment": "Dry Van"
    },
    "recipients": [
      {
        "id": "test-driver", 
        "name": "Test Driver",
        "phone": "+15551234567",
        "type": "driver"
      }
    ],
    "notificationType": "sms"
  }' \
  --silent --show-error

echo ""
echo "✅ Check your phone for SMS if Twilio is configured!"
echo "✅ Check server console for mock notifications if not configured"
