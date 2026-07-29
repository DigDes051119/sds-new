const fs = require('fs');
const path = require('path');

const backupDumpPath = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const detailsData = JSON.parse(fs.readFileSync(backupDumpPath, 'utf8'));

const enObj = detailsData.en['one-ordo-resort'];
const kgObj = detailsData.kg['one-ordo-resort'];
const ruObj = detailsData.ru['one-ordo-resort'];

function formatTs(obj) {
  return JSON.stringify({
    name: obj.name,
    desc: obj.desc,
    client: obj.client,
    year: obj.year,
    service: obj.service,
    challenge: obj.challenge,
    websiteUrl: obj.websiteUrl || "https://oneconstruction.kg/",
    collageTheme: obj.collageTheme || "light",
    results: obj.results || [],
    processImages: obj.processImages || [],
    collageBlocks: obj.collageBlocks || []
  }, null, 2);
}

const targetFile = path.join(__dirname, 'src', 'app', 'projectDetailsData.ts');
let content = fs.readFileSync(targetFile, 'utf8');

function replaceOrdo(code, langMarker, langObj) {
  const markerIdx = code.indexOf(langMarker);
  if (markerIdx === -1) {
    console.error('Marker not found:', langMarker);
    return code;
  }
  
  // Find "one-ordo" after markerIdx
  const startIdx = code.indexOf('"one-ordo":', markerIdx);
  if (startIdx === -1) {
    console.error('one-ordo not found after', langMarker);
    return code;
  }

  // Find next project key start after startIdx, which is "techstart": or techstart:
  let endIdx = code.indexOf('techstart:', startIdx);
  if (endIdx === -1) {
    endIdx = code.indexOf('"techstart":', startIdx);
  }

  if (endIdx === -1) {
    console.error('techstart not found after', startIdx);
    return code;
  }

  const formatted = formatTs(langObj);
  const replacement = `"one-ordo": ${formatted},\n    "one-ordo-resort": ${formatted},\n    `;

  return code.substring(0, startIdx) + replacement + code.substring(endIdx);
}

content = replaceOrdo(content, 'projectDetailsTranslations', enObj); // en is first in projectDetailsTranslations
content = replaceOrdo(content, 'salkyn:', kgObj); // kg section has salkyn before one-ordo
content = replaceOrdo(content, 'salkyn:', ruObj); // ru section (second salkyn)

// Wait, let's test if salkyn exists in kg and ru
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Finished replaceOrdo update!');
