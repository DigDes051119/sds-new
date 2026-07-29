const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Akimkhan\\.gemini\\antigravity-ide\\brain\\9adf35c6-c216-4a7f-9269-ea59d58825f3\\media__1785312577609.svg';
const dest = path.join(__dirname, 'src', 'imports', 'duck.svg');

try {
  const content = fs.readFileSync(src, 'utf8');
  console.log('SVG Content length:', content.length);
  console.log('=== SVG CONTENT ===');
  console.log(content);
  fs.writeFileSync(dest, content, 'utf8');
  console.log('Copied successfully to:', dest);
} catch (e) {
  console.log('Error copying SVG:', e.message);
}
