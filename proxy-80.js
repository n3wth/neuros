#!/usr/bin/env node

/**
 * Simple proxy server to forward port 80 to port 3001
 * Allows accessing neuros.local without specifying a port
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Check if http-proxy is installed
try {
  require.resolve('http-proxy');
} catch (e) {
  console.error('http-proxy is not installed. Installing...');
  require('child_process').execSync('npm install --save-dev http-proxy', { stdio: 'inherit' });
}

const proxy = httpProxy.createProxyServer({});
const TARGET_PORT = process.env.TARGET_PORT || 3001;

// Handle proxy errors
proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err.message);
  res.writeHead(502, { 'Content-Type': 'text/plain' });
  res.end('Bad Gateway - Development server may not be running on port ' + TARGET_PORT);
});

// Create the proxy server
const server = http.createServer(function(req, res) {
  // Add headers for development
  res.setHeader('X-Proxied-By', 'neuros-local-proxy');
  
  // Forward all requests to the Next.js dev server
  proxy.web(req, res, {
    target: `http://localhost:${TARGET_PORT}`,
    changeOrigin: true,
    ws: true // Enable WebSocket support for hot reload
  });
});

// Handle WebSocket upgrades for hot reload
server.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head, {
    target: `http://localhost:${TARGET_PORT}`,
    ws: true
  });
});

// Start the proxy server
const PORT = 80;
server.listen(PORT, '0.0.0.0', function() {
  console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 Proxy Server Running                  ║
║                                            ║
║   Forwarding:                              ║
║   http://neuros.local → localhost:${TARGET_PORT}    ║
║                                            ║
║   Make sure to:                            ║
║   1. Run 'npm run dev:local' in another    ║
║      terminal                               ║
║   2. Access http://neuros.local            ║
║                                            ║
╚════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGINT', function() {
  console.log('\n👋 Shutting down proxy server...');
  server.close();
  process.exit(0);
});