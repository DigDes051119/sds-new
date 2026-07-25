const fs = require('fs');

async function run() {
    console.log("=== СКАН ИЗВЛЕЧЕНИЯ ИЗ SDST web site-old ===");
    
    // Check projectDetailsData.ts
    try {
        const pDetailsStr = fs.readFileSync('d:/Steel Drake Studio Team/SDST web site-old/src/app/projectDetailsData.ts', 'utf8');
        const matches = pDetailsStr.match(/"([^"]+)":\s*\{[\s\S]*?name:/g) || [];
        console.log("В projectDetailsData.ts найдено названий:", matches.length);
    } catch(e) {
        console.error(" Ошибка чтения projectDetailsData:", e.message);
    }

    // Check i18n.ts
    try {
        const i18nStr = fs.readFileSync('d:/Steel Drake Studio Team/SDST web site-old/src/app/i18n.ts', 'utf8');
        console.log("Размер i18n.ts в старом сайте:", i18nStr.length, "байтов.");
    } catch(e) {
        console.error(" Ошибка чтения i18n:", e.message);
    }
}
run();
