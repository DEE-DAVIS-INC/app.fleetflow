#!/usr/bin/env python3
import http.server
import socketserver
import os
import json
from urllib.parse import urlparse

PORT = 3000
DIRECTORY = "public"

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Serve root as index.html
        if path == '/':
            self.path = '/index.html'
        
        return super().do_GET()

def main():
    # Change to the FleetFlow directory
    os.chdir('/Users/deedavis/FLEETFLOW')
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚛 FleetFlow Emergency Server starting on port {PORT}")
        print(f"📂 Serving from: {os.getcwd()}/public")
        print(f"🌐 Open: http://localhost:{PORT}")
        print("✅ Emergency dashboard available!")
        httpd.serve_forever()

if __name__ == "__main__":
    main()
