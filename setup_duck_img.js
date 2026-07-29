const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  execSync('git checkout 2655bf9~1 -- imports/duck.png', { cwd: __dirname });
  console.log('Checked out imports/duck.png');
} catch (e) {
  console.log('Error checking out:', e.message);
}

const srcFile = path.join(__dirname, 'imports', 'duck.png');
const destFile = path.join(__dirname, 'src', 'imports', 'duck.png');

if (fs.existsSync(srcFile)) {
  fs.copyFileSync(srcFile, destFile);
  console.log('Copied to:', destFile);
} else {
  console.log('srcFile does not exist:', srcFile);
}
