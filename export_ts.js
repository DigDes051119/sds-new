const fs = require('fs');
const path = require('path');

const dumpFile = path.join(__dirname, 'backups', 'backup_2026-07-27T17-23-53', 'database_dump', 'sds_project_details.json');
const dump = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));

['en', 'kg', 'ru'].forEach(lang => {
  if (dump[lang] && dump[lang]['one-ordo-resort']) {
    dump[lang]['one-ordo'] = dump[lang]['one-ordo-resort'];
  }
});

let code = `import projectImg1 from "../imports/image_low.webp";
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

export const projectDetailsTranslations: Record<string, Record<string, ProjectDetailData>> = {\n`;

['en', 'kg', 'ru'].forEach((lang, lIdx) => {
  code += `  ${lang}: {\n`;
  const keys = Object.keys(dump[lang]);
  keys.forEach((key, kIdx) => {
    const item = dump[lang][key];
    code += `    ${JSON.stringify(key)}: {\n`;
    code += `      name: ${JSON.stringify(item.name || "")},\n`;
    code += `      desc: ${JSON.stringify(item.desc || "")},\n`;
    code += `      client: ${JSON.stringify(item.client || "")},\n`;
    code += `      year: ${JSON.stringify(item.year || "")},\n`;
    code += `      service: ${JSON.stringify(item.service || "")},\n`;
    code += `      challenge: ${JSON.stringify(item.challenge || "")},\n`;
    if (item.websiteUrl) code += `      websiteUrl: ${JSON.stringify(item.websiteUrl)},\n`;
    if (item.collageTheme) code += `      collageTheme: ${JSON.stringify(item.collageTheme)},\n`;
    code += `      results: ${JSON.stringify(item.results || [])},\n`;
    code += `      processImages: ${JSON.stringify(item.processImages || [])},\n`;
    if (item.collageBlocks) {
      code += `      collageBlocks: [\n`;
      item.collageBlocks.forEach((block, bIdx) => {
        code += `        ${JSON.stringify(block)}${bIdx < item.collageBlocks.length - 1 ? ',' : ''}\n`;
      });
      code += `      ]\n`;
    } else {
      code += `      collageBlocks: []\n`;
    }
    code += `    }${kIdx < keys.length - 1 ? ',' : ''}\n`;
  });
  code += `  }${lIdx < 2 ? ',' : ''}\n`;
});

code += `};\n`;

const targetFile = path.join(__dirname, 'scratch_compact.ts');
fs.writeFileSync(targetFile, code, 'utf8');
console.log('Saved scratch_compact.ts! Line count:', code.split('\n').length);
