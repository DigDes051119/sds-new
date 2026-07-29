const fs = require('fs');
const path = require('path');

const dumpFile = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const dump = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));

// Copy "one-ordo-resort" to "one-ordo" for en, kg, ru
['en', 'kg', 'ru'].forEach(lang => {
  if (dump[lang] && dump[lang]['one-ordo-resort']) {
    dump[lang]['one-ordo'] = dump[lang]['one-ordo-resort'];
  }
});

const fileContent = `import projectImg1 from "../imports/image_low.webp";
import projectImg2 from "../imports/image_2026-06-09_10-31-16_low.webp";

export interface ProjectDetailData {
  name: string;
  desc: string;
  client: string;
  year: string;
  service: string;
  challenge: string;
  processImages: string[];
  collageBlocks?: string[][];
  results: string[];
  websiteUrl?: string;
  collageTheme?: string;
}

export const projectDetailsTranslations: Record<string, Record<string, ProjectDetailData>> = ${JSON.stringify(dump, null, 2)};
`;

const destFile = path.join(__dirname, 'src', 'app', 'projectDetailsData.ts');
fs.writeFileSync(destFile, fileContent, 'utf8');
console.log('apply_backup.js completed! Wrote bytes:', fileContent.length);
