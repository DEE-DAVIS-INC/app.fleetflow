#!/bin/bash

echo "=== FLEETFLOW EMERGENCY STARTUP ==="
echo "Current time: $(date)"
echo "Current directory: $(pwd)"

# Kill any existing processes
echo "Killing existing processes..."
pkill -f "node\|next\|npm" 2>/dev/null || true
sleep 2

# Start simple HTTP server using Python (most reliable)
echo "Starting Python HTTP server..."
cd /Users/deedavis/FLEETFLOW/public

# Start on port 3000
echo "Attempting to start on port 3000..."
python3 -m http.server 3000 &
PYTHON_PID_3000=$!
echo "Python server PID on 3000: $PYTHON_PID_3000"

sleep 2

# Also start on port 8000 as backup
echo "Starting backup server on port 8000..."
python3 -m http.server 8000 &
PYTHON_PID_8000=$!
echo "Python server PID on 8000: $PYTHON_PID_8000"

sleep 2

# Check what's running
echo "Checking running processes..."
lsof -i :3000,8000 2>/dev/null || echo "No processes found"

echo ""
echo "=== SERVER STARTUP COMPLETE ==="
echo "Try these URLs:"
echo "  http://localhost:3000/working.html"
echo "  http://localhost:8000/working.html" 
echo "  http://localhost:3000/index.html"
echo "  http://localhost:8000/index.html"
echo ""
echo "If servers started successfully, you should see content at these URLs."
