const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, 'src', 'imports', 'duck.png');
const buf = fs.readFileSync(imgPath);

// PNG header check
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

console.log(`PNG Dimensions: ${width}x${height}`);
