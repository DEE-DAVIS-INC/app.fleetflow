const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Serve the React app (if it builds)
app.use(express.static('.next/static'));

// API routes for basic functionality
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'FleetFlow Server Running', 
    time: new Date().toISOString(),
    server: 'Express Emergency Server'
  });
});

// Catch-all handler: send back React app's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Try to serve the file from public first
  const publicPath = path.join(__dirname, 'public', req.path);
  
  // If it's a specific file request, try to serve it
  if (req.path.includes('.')) {
    res.sendFile(publicPath, (err) => {
      if (err) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      }
    });
  } else {
    // For routes, serve the emergency dashboard
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚛 FleetFlow Express Server running on http://localhost:${PORT}`);
  console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`🌐 Available pages:`);
  console.log(`   • http://localhost:${PORT}/ (Emergency Dashboard)`);
  console.log(`   • http://localhost:${PORT}/diagnostics.html (Diagnostics)`);
  console.log(`   • http://localhost:${PORT}/working.html (Status Check)`);
  console.log(`   • http://localhost:${PORT}/api/status (API Test)`);
});

// Handle server errors
app.on('error', (err) => {
  console.error('❌ Server error:', err);
});
