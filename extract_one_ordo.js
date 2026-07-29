const fs = require('fs');
const path = require('path');

const backupDumpPath = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const rawDetails = fs.readFileSync(backupDumpPath, 'utf8');
const detailsData = JSON.parse(rawDetails);

const enOneOrdo = detailsData.en['one-ordo-resort'];
const kgOneOrdo = detailsData.kg['one-ordo-resort'];
const ruOneOrdo = detailsData.ru['one-ordo-resort'];

function makeTsObj(data) {
  return `{
      name: ${JSON.stringify(data.name)},
      desc: ${JSON.stringify(data.desc)},
      client: ${JSON.stringify(data.client)},
      year: ${JSON.stringify(data.year)},
      service: ${JSON.stringify(data.service)},
      challenge: ${JSON.stringify(data.challenge)},
      websiteUrl: ${JSON.stringify(data.websiteUrl || "https://oneconstruction.kg/")},
      collageTheme: ${JSON.stringify(data.collageTheme || "light")},
      results: ${JSON.stringify(data.results || [])},
      processImages: ${JSON.stringify(data.processImages || [])},
      collageBlocks: ${JSON.stringify(data.collageBlocks || [])}
    }`;
}

const targetFile = path.join(__dirname, 'src', 'app', 'projectDetailsData.ts');
let code = fs.readFileSync(targetFile, 'utf8');

// Replace "one-ordo" & "one-ordo-resort" in EN section
// We can find `en: {` ... `},` and replace one-ordo entries
const enBlock = `    "one-ordo": ${makeTsObj(enOneOrdo)},\n    "one-ordo-resort": ${makeTsObj(enOneOrdo)}`;
const kgBlock = `    "one-ordo": ${makeTsObj(kgOneOrdo)},\n    "one-ordo-resort": ${makeTsObj(kgOneOrdo)}`;
const ruBlock = `    "one-ordo": ${makeTsObj(ruOneOrdo)},\n    "one-ordo-resort": ${makeTsObj(ruOneOrdo)}`;

// Pattern replace one-ordo and one-ordo-resort in the file
// Find EN section:
code = code.replace(/en:\s*\{([\s\S]*?)\n  \},/, (match, p1) => {
  let inner = p1.replace(/"one-ordo":\s*\{[\s\S]*?\},\s*"one-ordo-resort":\s*\{[\s\S]*?\}(,)?/, '');
  inner = inner.replace(/"one-ordo":\s*\{[\s\S]*?\}(,)?/, '');
  return `en: {\n${enBlock},\n${inner.trim()}\n  },`;
});

// Find KG section:
code = code.replace(/kg:\s*\{([\s\S]*?)\n  \},/, (match, p1) => {
  let inner = p1.replace(/"one-ordo":\s*\{[\s\S]*?\},\s*"one-ordo-resort":\s*\{[\s\S]*?\}(,)?/, '');
  inner = inner.replace(/"one-ordo":\s*\{[\s\S]*?\}(,)?/, '');
  return `kg: {\n${kgBlock},\n${inner.trim()}\n  },`;
});

// Find RU section:
code = code.replace(/ru:\s*\{([\s\S]*?)\n  \}/, (match, p1) => {
  let inner = p1.replace(/"one-ordo":\s*\{[\s\S]*?\},\s*"one-ordo-resort":\s*\{[\s\S]*?\}(,)?/, '');
  inner = inner.replace(/"one-ordo":\s*\{[\s\S]*?\}(,)?/, '');
  return `ru: {\n${ruBlock},\n${inner.trim()}\n  }`;
});

fs.writeFileSync(targetFile, code, 'utf8');
console.log('Successfully updated projectDetailsData.ts!');
