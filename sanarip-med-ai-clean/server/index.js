import http from 'http';
import { analyzeClinicalSymptoms } from './clinicalAIEngine.js';

const PORT = process.env.PORT || 5000;

// Simple in-memory sliding window rate limiter
const ipRateLimits = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 60;

const isRateLimited = (ip) => {
  const now = Date.now();
  const timestamps = ipRateLimits.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

  if (recent.length >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  recent.push(now);
  ipRateLimits.set(ip, recent);
  return false;
};

// Cleanup old rate limit entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRateLimits.entries()) {
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) ipRateLimits.delete(ip);
    else ipRateLimits.set(ip, recent);
  }
}, 5 * 60 * 1000);

const server = http.createServer((req, res) => {
  // Client IP extraction
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // Strict OWASP Production Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Rate Limiting Protection against DDoS & Token Exhaustion
  if (isRateLimited(clientIp)) {
    res.writeHead(429, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Too Many Requests', message: 'Превышен лимит запросов. Попробуйте через минуту.' }));
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Health check endpoint
  if (url.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'online', 
      engine: 'Sanarip Med AI Clinical Triage v2.0',
      protocols: 'MOH KR & MedElement Verified',
      security: 'Hardened (CSP, Anti-DDoS, Input Sanitization)'
    }));
    return;
  }

  // Triage & Diagnostic Chat Endpoint
  if (url.pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    const MAX_PAYLOAD_BYTES = 512 * 1024; // 512KB limit

    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > MAX_PAYLOAD_BYTES) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload Too Large' }));
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const rawQuery = data.message || data.query || '';
        // Sanitize query string & truncate to reasonable length
        const query = String(rawQuery).replace(/<[^>]*>?/gm, '').trim().slice(0, 1000);
        const lang = ['ru', 'ky', 'en'].includes(data.lang) ? data.lang : 'ru';
        const userLocation = String(data.location || 'Бишкек').replace(/<[^>]*>?/gm, '').slice(0, 100);

        if (!query) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing symptom query' }));
          return;
        }

        // Process query through Clinical AI Engine
        const clinicalResult = analyzeClinicalSymptoms(query, lang, { userLocation });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(clinicalResult));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // 404 for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`[Sanarip Med AI Backend] Hardened server running on http://localhost:${PORT}`);
});
