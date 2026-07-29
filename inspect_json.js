const fs = require('fs');
const path = require('path');

const backupDumpPath = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const detailsData = JSON.parse(fs.readFileSync(backupDumpPath, 'utf8'));

console.log('Top keys:', Object.keys(detailsData));

for (const k of Object.keys(detailsData)) {
  const subKeys = Object.keys(detailsData[k] || {});
  console.log('Key:', k, 'Subkeys includes one-ordo-resort?', subKeys.includes('one-ordo-resort'), 'includes one-ordo?', subKeys.includes('one-ordo'));
  if (detailsData[k]['one-ordo-resort']) {
    const item = detailsData[k]['one-ordo-resort'];
    console.log('  one-ordo-resort:', {
      name: item.name,
      collageBlocksCount: item.collageBlocks ? item.collageBlocks.length : 0,
      processImagesCount: item.processImages ? item.processImages.length : 0
    });
  }
}
