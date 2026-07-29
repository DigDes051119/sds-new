const fs = require('fs');
const path = require('path');

const backupDumpPath = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const detailsData = JSON.parse(fs.readFileSync(backupDumpPath, 'utf8'));

// Ensure for every language in detailsData, both "one-ordo" and "one-ordo-resort" point to the branding project
['en', 'kg', 'ru'].forEach(lang => {
  if (detailsData[lang]) {
    const item = detailsData[lang]['one-ordo-resort'] || detailsData[lang]['one-ordo'];
    if (item) {
      detailsData[lang]['one-ordo'] = item;
      detailsData[lang]['one-ordo-resort'] = item;
    }
  }
});

const tsCode = `import projectImg1 from "../imports/image_low.webp";
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

export const projectDetailsTranslations: Record<string, Record<string, ProjectDetailData>> = ${JSON.stringify(detailsData, null, 2)};
`;

const targetFile = path.join(__dirname, 'src', 'app', 'projectDetailsData.ts');
fs.writeFileSync(targetFile, tsCode, 'utf8');
console.log('Successfully generated full projectDetailsData.ts from backup database dump!');
