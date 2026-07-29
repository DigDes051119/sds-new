const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const targetPath = path.join(projectRoot, 'src', 'imports', 'duck.png');

console.log('Target path:', targetPath);

// Try git checkout first
try {
  execSync('git checkout 2655bf9~1 -- imports/duck.png', { cwd: projectRoot });
  console.log('Git checkout successful');
} catch (e) {
  console.log('Git checkout error:', e.message);
}

const rootDuck = path.join(projectRoot, 'imports', 'duck.png');
if (fs.existsSync(rootDuck)) {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(rootDuck, targetPath);
  console.log('Copied rootDuck to targetPath successfully');
} else {
  console.log('rootDuck does not exist at:', rootDuck);
}

console.log('File exists at target?', fs.existsSync(targetPath));
