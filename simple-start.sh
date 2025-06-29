#!/bin/bash

# Simple startup script for FleetFlow
echo "🚛 FleetFlow Simple Startup"
echo "=========================="

# Navigate to the directory
cd /Users/deedavis/FLEETFLOW

echo "📍 Directory: $(pwd)"

# Try to start Node.js server
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js found, starting emergency server..."
    node emergency-server.js &
    echo "🚀 Emergency server started on http://localhost:3000"
else
    echo "❌ Node.js not found"
fi

# Try to start Python server as backup
if command -v python3 >/dev/null 2>&1; then
    echo "✅ Python found, starting backup server..."
    cd public
    python3 -m http.server 8000 &
    echo "🚀 Python server started on http://localhost:8000"
    cd ..
else
    echo "❌ Python not found"
fi

echo ""
echo "🌐 Test these URLs:"
echo "   • http://localhost:3000/red-test.html"
echo "   • http://localhost:8000/red-test.html"
echo "   • file:///Users/deedavis/FLEETFLOW/file-test.html"

# Keep script running
echo ""
echo "Press Ctrl+C to stop servers"
wait
