#!/bin/bash

echo "🚛 FleetFlow Emergency Startup Script"
echo "======================================"

# Kill any existing processes
echo "🔄 Killing existing processes..."
sudo pkill -f "node\|next\|npm" 2>/dev/null || true
sleep 2

# Navigate to directory
cd /Users/deedavis/FLEETFLOW

echo "📍 Current directory: $(pwd)"
echo "📂 Files in directory:"
ls -la | head -10

# Try different server options
echo ""
echo "🚀 Starting server options..."

# Option 1: Try Next.js
echo "🔸 Trying Next.js server..."
if command -v npm >/dev/null 2>&1; then
    echo "   ✅ npm found"
    timeout 5s npm run dev 2>/dev/null || echo "   ❌ npm run dev failed"
else
    echo "   ❌ npm not found"
fi

# Option 2: Try Node.js emergency server
echo "🔸 Trying Node.js emergency server..."
if command -v node >/dev/null 2>&1; then
    echo "   ✅ node found"
    echo "   🚀 Starting emergency server on port 3000..."
    node emergency-server.js &
    SERVER_PID=$!
    echo "   📝 Server PID: $SERVER_PID"
    sleep 3
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo "   ✅ Emergency server started successfully!"
    else
        echo "   ❌ Emergency server failed to start"
    fi
else
    echo "   ❌ node not found"
fi

# Option 3: Try Python server
echo "🔸 Trying Python server..."
if command -v python3 >/dev/null 2>&1; then
    echo "   ✅ python3 found"
    echo "   🚀 Starting Python server on port 3001..."
    cd public
    python3 -m http.server 3001 &
    PYTHON_PID=$!
    echo "   📝 Python server PID: $PYTHON_PID"
    cd ..
else
    echo "   ❌ python3 not found"
fi

echo ""
echo "🌐 Try these URLs:"
echo "   • http://localhost:3000/working.html"
echo "   • http://localhost:3000/index.html" 
echo "   • http://localhost:3001/working.html"
echo "   • http://localhost:3001/index.html"

echo ""
echo "🔍 Checking what's running on ports:"
lsof -i :3000,3001 2>/dev/null || echo "No processes found on ports 3000-3001"

echo ""
echo "✅ Startup script complete!"
echo "If you still see a white screen, try the URLs above manually."
