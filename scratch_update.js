const fs = require('fs');
const path = require('path');

const backupDumpPath = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const detailsData = JSON.parse(fs.readFileSync(backupDumpPath, 'utf8'));

const enObj = detailsData.en['one-ordo-resort'];
const kgObj = detailsData.kg['one-ordo-resort'];
const ruObj = detailsData.ru['one-ordo-resort'];

function makeFullTsObj(obj) {
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
  }, null, 4);
}

const targetFile = path.join(__dirname, 'src', 'app', 'projectDetailsData.ts');
let content = fs.readFileSync(targetFile, 'utf8');

// Let's print all occurrences of "one-ordo": in content
let pos = 0;
let occurrences = [];
while ((pos = content.indexOf('"one-ordo":', pos)) !== -1) {
  occurrences.push(pos);
  pos += 11;
}
console.log('Occurrences of "one-ordo":', occurrences);

// There are 3 occurrences (en, kg, ru) or 6 if one-ordo-resort is also there.
// Let's replace each section!
// We know occurrence 0 is en, occurrence 1 is kg, occurrence 2 is ru (or depending on occurrence order).

// Let's inspect what is between occurrence 0 and occurrence 0 + 500
occurrences.forEach((occ, idx) => {
  console.log(`--- Occ ${idx} ---`);
  console.log(content.substring(occ, occ + 200));
});

// We can replace each occurrence cleanly:
const enFormatted = makeFullTsObj(enObj);
const kgFormatted = makeFullTsObj(kgObj);
const ruFormatted = makeFullTsObj(ruObj);

// Re-build file:
// We can find `"one-ordo": { ... },` and `"one-ordo-resort": { ... },`
// Let's use regex to find `"one-ordo":\s*\{[\s\S]*?\},\s*"one-ordo-resort":\s*\{[\s\S]*?\}(,)?`
let count = 0;
content = content.replace(/"one-ordo":\s*\{[\s\S]*?\},\s*"one-ordo-resort":\s*\{[\s\S]*?\}(,)?/g, (match) => {
  let replacementObj = enFormatted;
  if (count === 1) replacementObj = kgFormatted;
  if (count === 2) replacementObj = ruFormatted;
  count++;
  return `"one-ordo": ${replacementObj},\n    "one-ordo-resort": ${replacementObj},`;
});

console.log('Replacements made:', count);
fs.writeFileSync(targetFile, content, 'utf8');
console.log('Updated file successfully!');
