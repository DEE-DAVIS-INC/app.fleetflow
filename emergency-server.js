const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
  console.log(`📞 Request: ${req.method} ${req.url}`);
  
  let filePath;
  if (req.url === '/') {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  } else {
    filePath = path.join(PUBLIC_DIR, req.url);
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(`❌ Error loading ${filePath}:`, err.message);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body style="font-family: Arial; padding: 20px; text-align: center; background: #f0f0f0;">
            <h1 style="color: red;">🚛 FleetFlow - File Not Found</h1>
            <p>Could not find: ${req.url}</p>
            <p><a href="/index.html">🏠 Go to Emergency Dashboard</a></p>
            <p><a href="/debug.html">🔧 Debug Page</a></p>
          </body>
        </html>
      `);
      return;
    }
    
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.js') contentType = 'application/javascript';
    if (ext === '.json') contentType = 'application/json';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
    console.log(`✅ Served: ${filePath}`);
  });
});

server.listen(PORT, () => {
  console.log('🚛 FleetFlow Emergency Server Started!');
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`📂 Serving from: ${PUBLIC_DIR}`);
  console.log('🌐 Available pages:');
  console.log('   • http://localhost:3000/ (Emergency Dashboard)');
  console.log('   • http://localhost:3000/debug.html (Debug Page)');
  console.log('   • http://localhost:3000/test.html (Test Page)');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('🔄 Port 3000 is busy, trying port 3001...');
    server.listen(3001);
  }
});
