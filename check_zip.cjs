const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const zipPath = path.join(__dirname, 'realesrgan_temp.zip');
console.log("Downloading zip...");
try {
  execSync(`curl -L -o "${zipPath}" "https://github.com/xinntao/Real-ESRGAN-ncnn-vulkan/releases/download/v0.2.0/realesrgan-ncnn-vulkan-v0.2.0-windows.zip"`);
  console.log("Listing zip contents using tar...");
  const filesList = execSync(`tar -tf "${zipPath}"`).toString();
  console.log("=== ZIP FILES ===");
  console.log(filesList.split('\n').filter(f => f.includes('models') || f.length < 50).slice(0, 50).join('\n'));
  fs.unlinkSync(zipPath);
} catch (e) {
  console.error(e);
}
