const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";
const BACKUP_DIR = path.join(__dirname, 'backups', 'media');

async function fetchTable(tableName) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?select=*`, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch ${tableName}`);
  return await response.json();
}

async function getRemoteSize(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) {
      const len = res.headers.get('content-length');
      return len ? parseInt(len, 10) : null;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Extract filename from URL (e.g., product-hero-12345.webp -> product-hero-12345.webp)
function getFilenameFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    return path.basename(pathname);
  } catch (e) {
    return path.basename(url);
  }
}

async function main() {
  console.log("1. Получение данных из Supabase...");
  const transRows = await fetchTable("sds_translations");
  const detailsRows = await fetchTable("sds_project_details");

  const translations = transRows[0]?.data || {};
  const projectDetails = detailsRows[0]?.data || {};

  console.log("2. Сбор ссылок на изображения...");
  const imageUrls = new Set();

  // Projects list images
  const langs = ['ru', 'en', 'kg'];
  langs.forEach(lang => {
    const items = translations[lang]?.projects?.items || [];
    items.forEach(item => {
      if (item.img) imageUrls.add(item.img);
    });

    // Archive items
    const archive = translations[lang]?.archive || [];
    archive.forEach(item => {
      if (item.images) {
        item.images.forEach(img => imageUrls.add(img));
      }
    });

    // Products
    const products = translations[lang]?.productDetail?.products || {};
    Object.values(products).forEach((prod) => {
      if (prod.mainImage) imageUrls.add(prod.mainImage);
      if (prod.images) {
        prod.images.forEach(img => imageUrls.add(img));
      }
    });
  });

  // Project details images
  langs.forEach(lang => {
    const details = projectDetails[lang] || {};
    Object.values(details).forEach(detail => {
      if (detail.processImages) {
        detail.processImages.forEach(img => imageUrls.add(img));
      }
    });
  });

  const urls = Array.from(imageUrls).filter(url => 
    url.startsWith("http") && (url.includes("supabase.co") || url.includes("cdn.steeldrakestudio.com"))
  );

  console.log(`Найдено ${urls.length} уникальных изображений на сайте.`);

  console.log("3. Сканирование локальной папки бэкапа...");
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error(`Папка бэкапа не найдена по пути: ${BACKUP_DIR}`);
    return;
  }
  const backupFiles = fs.readdirSync(BACKUP_DIR);
  console.log(`В локальном бэкапе найдено ${backupFiles.length} файлов.`);

  // Map of lowercase filename -> stat object
  const backupMap = new Map();
  backupFiles.forEach(file => {
    const fullPath = path.join(BACKUP_DIR, file);
    const stat = fs.statSync(fullPath);
    backupMap.set(file.toLowerCase(), {
      name: file,
      size: stat.size,
    });
  });

  console.log("\n4. Сравнение файлов...");
  let foundCount = 0;
  let missingCount = 0;
  let heavierCount = 0;
  let sameOrLighterCount = 0;

  const results = [];

  for (const url of urls) {
    const filename = getFilenameFromUrl(url);
    const filenameLower = filename.toLowerCase();

    // Check if filename matches or similar timestamp exists
    let match = backupMap.get(filenameLower);

    // If no exact filename match, try matching by timestamp (e.g. project-block-1-0-1784455068772.webp)
    if (!match) {
      const matchTimestamp = filename.match(/\d+/);
      if (matchTimestamp) {
        const ts = matchTimestamp[0];
        const matchedFile = backupFiles.find(f => f.includes(ts));
        if (matchedFile) {
          match = backupMap.get(matchedFile.toLowerCase());
        }
      }
    }

    if (match) {
      foundCount++;
      const remoteSize = await getRemoteSize(url);
      const diff = remoteSize ? (match.size - remoteSize) : 0;
      const isHeavier = diff > 1024 * 10; // heavier by more than 10KB

      if (isHeavier) heavierCount++;
      else sameOrLighterCount++;

      results.push({
        url,
        filename,
        inBackup: true,
        backupFilename: match.name,
        remoteSize,
        backupSize: match.size,
        isHeavier,
      });
    } else {
      missingCount++;
      results.push({
        url,
        filename,
        inBackup: false,
      });
    }
  }

  console.log("\n=== ИТОГ СРАВНЕНИЯ ===");
  console.log(`Всего изображений на сайте (Supabase): ${urls.length}`);
  console.log(`Найдено совпадений в бэкапе: ${foundCount} (${((foundCount/urls.length)*100).toFixed(1)}%)`);
  console.log(`Отсутствует в бэкапе: ${missingCount}`);
  console.log(`Файлы в бэкапе ТЯЖЕЛЕЕ (лучше качество): ${heavierCount}`);
  console.log(`Файлы в бэкапе такие же или легче: ${sameOrLighterCount}`);

  // Show some examples of missing files
  const missingExamples = results.filter(r => !r.inBackup).slice(0, 10).map(r => r.filename);
  if (missingExamples.length > 0) {
    console.log("\nПримеры отсутствующих в бэкапе файлов:");
    console.log(missingExamples.join('\n'));
  }

  // Show some examples of heavier files (originals)
  const heavierExamples = results.filter(r => r.inBackup && r.isHeavier).slice(0, 5);
  if (heavierExamples.length > 0) {
    console.log("\nПримеры оригиналов в бэкапе, которые тяжелее серверных:");
    heavierExamples.forEach(r => {
      console.log(`- ${r.filename}: бэкап = ${(r.backupSize/1024/1024).toFixed(2)} MB vs сайт = ${(r.remoteSize/1024/1024).toFixed(2)} MB`);
    });
  }
}

main().catch(console.error);
