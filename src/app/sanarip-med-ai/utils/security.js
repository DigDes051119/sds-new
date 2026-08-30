/**
 * Sanarip Med AI - Web Application Security & Anti-XSS Engine
 * Implements input sanitization, injection protection, and client-side rate limiting.
 */

// Escape dangerous HTML characters to prevent Stored & Reflected XSS
export const sanitizeHtml = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Clean and validate lead input fields
export const sanitizeLeadInput = (data) => {
  if (!data || typeof data !== 'object') return {};

  const cleanString = (val, maxLen = 200) => {
    if (!val || typeof val !== 'string') return '';
    // Strip control characters and tags
    return val.replace(/<[^>]*>?/gm, '').trim().slice(0, maxLen);
  };

  return {
    name: cleanString(data.name, 100),
    phone: cleanString(data.phone, 30),
    organization: cleanString(data.organization, 150),
    city: cleanString(data.city, 80),
    mode: cleanString(data.mode, 30),
    partnerType: cleanString(data.partnerType, 50)
  };
};

// Validate phone numbers (international +996 / standard)
export const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  return digitsOnly.length >= 9 && digitsOnly.length <= 15;
};

// Client-side Sliding-Window Rate Limiter (prevents DDoS & AI Token exhaustion)
class RateLimiter {
  constructor(maxRequests = 15, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  canProceed() {
    const now = Date.now();
    // Filter requests older than window
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    this.requests.push(now);
    return true;
  }

  getRemainingRequests() {
    const now = Date.now();
    this.requests = this.requests.filter(timestamp => now - timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - this.requests.length);
  }
}

// Export singletons for chat and vision API protection
export const chatRateLimiter = new RateLimiter(20, 60000); // 20 messages per minute
export const visionRateLimiter = new RateLimiter(10, 60000); // 10 image scans per minute
export const formRateLimiter = new RateLimiter(5, 60000); // 5 form submits per minute
