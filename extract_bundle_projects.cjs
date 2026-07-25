const fs = require('fs');

async function run() {
    console.log("Сканируем встроенные файлы бандлов...");
    const files = [
        './public/old/assets/index-BABQTOnN.js',
        './public/old/assets/index-DqW-tu1U.js'
    ];
    
    let foundTitles = new Set();
    
    for (let f of files) {
        try {
            const content = fs.readFileSync(f, 'utf8');
            console.log(`Файл ${f}: размер ${content.length} символов.`);
            
            // Search for quotes, titles, desc patterns
            const titleMatches = content.match(/"title"\s*:\s*"([^"]+)"/g) || [];
            console.log(`Найдено упоминаний "title": ${titleMatches.length}`);
            
            for (let tm of titleMatches) {
                const title = tm.split(':')[1].replace(/"/g, '').trim();
                foundTitles.add(title);
            }
        } catch(e) {
            console.error(`Ошибка чтения ${f}:`, e.message);
        }
    }
    
    console.log("\nВсе найденные названия проектов из бандлов:");
    foundTitles.forEach(t => console.log("- " + t));
}
run();
