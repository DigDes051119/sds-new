const fs = require('fs');
const path = require('path');

const backupsDir = path.join(__dirname, 'backups');
const folders = fs.readdirSync(backupsDir).filter(f => f.startsWith('backup_')).sort().reverse();

console.log('Searching backups for Tooko...');

for (const folder of folders) {
  const p1 = path.join(backupsDir, folder, 'database_dump', 'sds_project_details.json');
  const p2 = path.join(backupsDir, folder, 'database_dump', 'sds_translations.json');

  if (fs.existsSync(p1)) {
    const content = fs.readFileSync(p1, 'utf8');
    if (content.toLowerCase().includes('tooko')) {
      console.log(`Found TOOKO in ${folder}/database_dump/sds_project_details.json`);
    }
  }

  if (fs.existsSync(p2)) {
    const content = fs.readFileSync(p2, 'utf8');
    if (content.toLowerCase().includes('tooko')) {
      console.log(`Found TOOKO in ${folder}/database_dump/sds_translations.json`);
    }
  }
}
