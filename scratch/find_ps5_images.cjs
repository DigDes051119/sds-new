const fs = require('fs');
const path = require('path');

const backupsDir = path.join(__dirname, '..', 'backups');

function searchDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      searchDir(fullPath);
    } else if (f.name.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.toLowerCase().includes('ps5')) {
          console.log('FOUND PS5 in:', fullPath);
          const data = JSON.parse(content);
          const str = JSON.stringify(data);
          // find matches around ps5
          let idx = 0;
          while ((idx = str.toLowerCase().indexOf('ps5', idx)) !== -1) {
            console.log('--- Snippet ---');
            console.log(str.substring(Math.max(0, idx - 200), Math.min(str.length, idx + 400)));
            idx += 3;
          }
        }
      } catch (e) {}
    }
  }
}

searchDir(backupsDir);
