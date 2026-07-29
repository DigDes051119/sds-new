const fs = require('fs');
const path = require('path');

const dumpFile = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const dump = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));

const enObj = dump.en['one-ordo-resort'];
const kgObj = dump.kg['one-ordo-resort'];
const ruObj = dump.ru['one-ordo-resort'];

const out = {
  en: enObj,
  kg: kgObj,
  ru: ruObj
};

fs.writeFileSync(path.join(__dirname, 'one_ordo_full_data.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote one_ordo_full_data.json successfully');
