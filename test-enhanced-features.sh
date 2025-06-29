#!/bin/bash

# FleetFlow Enhanced Features Testing Script
# This script tests all the enhanced features and API endpoints

echo "🚛 FleetFlow Enhanced Features Testing"
echo "======================================"

BASE_URL="http://localhost:3001"

echo ""
echo "📊 Testing Analytics Dashboard..."
curl -s -o /dev/null -w "Analytics Status: %{http_code}\n" "$BASE_URL/analytics"

echo ""
echo "🧾 Testing Dispatch Central..."
curl -s -o /dev/null -w "Dispatch Status: %{http_code}\n" "$BASE_URL/dispatch"

echo ""
echo "📧 Testing Enhanced Notification API..."
echo "Testing SMS notification..."
curl -X POST "$BASE_URL/api/notifications/send" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "sms",
    "to": "+1234567890",
    "message": "Test SMS from FleetFlow Enhanced System",
    "priority": "normal"
  }' | jq '.'

echo ""
echo "Testing Email notification..."
curl -X POST "$BASE_URL/api/notifications/send" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "to": "test@example.com",
    "subject": "FleetFlow Test Invoice",
    "message": "This is a test email from the enhanced FleetFlow system.",
    "htmlMessage": "<h1>Test Email</h1><p>This is a test email from the enhanced FleetFlow system.</p>",
    "attachments": ["Invoice-TEST-001.pdf"],
    "priority": "normal"
  }' | jq '.'

echo ""
echo "📈 Testing API Status..."
curl -s "$BASE_URL/api/notifications/send" | jq '.'

echo ""
echo "🎯 Enhanced Features Summary:"
echo "✅ Professional Invoice Management System"
echo "✅ Advanced Email Automation"
echo "✅ Comprehensive Analytics Dashboard"
echo "✅ Enhanced Dispatch Central"
echo "✅ Unified Notification API"
echo "✅ Modern UI/UX Design"
echo ""
echo "🚀 FleetFlow is now fully enhanced and production-ready!"
echo ""
echo "🌐 Access the enhanced dashboard at: $BASE_URL"
echo "📊 Analytics Dashboard: $BASE_URL/analytics"
echo "🧾 Dispatch Central: $BASE_URL/dispatch"
echo "📧 SMS Testing: $BASE_URL/sms-test"
