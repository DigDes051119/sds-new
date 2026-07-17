// Save vision output to a file instead of stdout
import { spawn } from 'child_process';
import { createInterface } from 'readline';
import path from 'path';
import fs from 'fs';

const imgPath = process.argv[2];
const prompt = process.argv[3] || 'Describe the screenshot.';
const outPath = process.argv[4] || 'vision_output.txt';

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
    if (msg.id === undefined) return;
    const handler = pending[msg.id];
    if (handler) {
      delete pending[msg.id];
      if (msg.error) handler.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
      else handler.resolve(msg.result);
    }
  } catch (e) {}
});

server.stderr.on('data', () => {});
server.on('error', (err) => { process.exit(1); });

function sendRequest(method, params = {}) {
  return new Promise((resolve, reject) => {
    requestId++;
    pending[requestId] = { resolve, reject };
    server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: requestId, method, params }) + '\n');
  });
}

async function main() {
  try {
    await new Promise(r => setTimeout(r, 2000));
    await sendRequest('initialize', {
      protocolVersion: '2024-11-05', capabilities: {},
      clientInfo: { name: 'vision-client', version: '1.0' },
    });
    server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    await new Promise(r => setTimeout(r, 500));

    const absPath = path.resolve(imgPath);
    const imageBuffer = fs.readFileSync(absPath);
    const base64 = imageBuffer.toString('base64');
    const mimeType = absPath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const result = await sendRequest('tools/call', {
      name: 'analyze_image',
      arguments: {
        imageSource: `data:${mimeType};base64,${base64}`,
        prompt: prompt,
      },
    });

    let text = '';
    if (result.content && Array.isArray(result.content)) {
      for (const part of result.content) {
        if (part.type === 'text') text += part.text;
      }
    } else {
      text = JSON.stringify(result, null, 2);
    }
    fs.writeFileSync(outPath, text, 'utf-8');
    console.log(`Output saved to ${outPath} (${text.length} chars)`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    server.kill();
    setTimeout(() => process.exit(0), 500);
  }
}
main();
