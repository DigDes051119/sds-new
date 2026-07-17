#!/usr/bin/env node
// JSON-RPC MCP client for ai-vision-mcp
// Usage: node vision_client.mjs <image_path> [prompt]

import { spawn } from 'child_process';
import { createInterface } from 'readline';
import path from 'path';
import fs from 'fs';

const imagePath = process.argv[2];
const prompt = process.argv[3] || 'Опиши, что изображено на этой картинке. Ответь подробно на русском языке.';

if (!imagePath) {
  console.error('Usage: node vision_client.mjs <image_path> [prompt]');
  process.exit(1);
}

if (!fs.existsSync(imagePath)) {
  console.error(`File not found: ${imagePath}`);
  process.exit(1);
}

const absPath = path.resolve(imagePath);

// Spawn with shell:true for .cmd compatibility on Windows
const server = spawn('npx.cmd', ['ai-vision-mcp'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: Object.assign({}, process.env, {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    IMAGE_PROVIDER: 'google',
    VIDEO_PROVIDER: 'google',
  }),
  shell: true,
  windowsHide: true,
});

const rl = createInterface({ input: server.stdout });
let requestId = 0;
let pending = {};

rl.on('line', (line) => {
  line = line.trim();
  if (!line) return;
  try {
    const msg = JSON.parse(line);
    // Ignore notifications (no id)
    if (msg.id === undefined) return;
    
    const handler = pending[msg.id];
    if (handler) {
      delete pending[msg.id];
      if (msg.error) {
        handler.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      } else {
        handler.resolve(msg.result);
      }
    }
  } catch (e) {
    // Ignore parse errors
  }
});

server.stderr.on('data', () => {});

server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});

function sendRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    requestId++;
    pending[requestId] = { resolve, reject };
    const req = JSON.stringify({
      jsonrpc: '2.0',
      id: requestId,
      method,
      params,
    });
    server.stdin.write(req + '\n');
  });
}

async function main() {
  try {
    // Wait for server startup
    await new Promise(r => setTimeout(r, 2000));
    
    // Initialize
    await sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'vision-client', version: '1.0' },
    });
    
    // Send initialized notification
    server.stdin.write(JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    }) + '\n');
    
    await new Promise(r => setTimeout(r, 500));
    
    // Read the image as base64
    const imageBuffer = fs.readFileSync(absPath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = absPath.toLowerCase().endsWith('.png') ? 'image/png' 
      : (absPath.toLowerCase().endsWith('.jpg') || absPath.toLowerCase().endsWith('.jpeg')) ? 'image/jpeg'
      : 'image/png';
    
    // Call analyze_image with proper MCP format
    const result = await sendRequest('tools/call', {
      name: 'analyze_image',
      arguments: {
        imageSource: `data:${mimeType};base64,${base64}`,
        prompt: prompt,
      },
    });
    
    // Output the result text
    if (result.content && Array.isArray(result.content)) {
      for (const part of result.content) {
        if (part.type === 'text') {
          console.log(part.text);
        }
      }
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message || JSON.stringify(err));
    process.exit(1);
  } finally {
    server.kill();
    setTimeout(() => process.exit(0), 500);
  }
}

main();
