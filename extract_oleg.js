const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Олег Ермаков Google Chrome');
if (!fs.existsSync(dir)) {
    console.error("Папка не найдена:", dir);
    process.exit(1);
}

const files = fs.readdirSync(dir);
const target = Buffer.from('sds_archive_items', 'utf8');

console.log('Начинаю сканирование файлов Олега на наличие данных sds_archive_items...');
let jsonResults = [];

for (const file of files) {
    if (file.endsWith('.ldb') || file.endsWith('.log')) {
        const buf = fs.readFileSync(path.join(dir, file));
        
        let idx = buf.indexOf(target);
        while (idx !== -1) {
            // Вытаскиваем большой кусок данных после ключа
            const start = Math.max(0, idx - 10);
            const end = Math.min(buf.length, idx + 500000);
            const chunk = buf.slice(start, end);
            
            // В LevelDB localStorage сохраняет строки в UTF-16LE, если там есть кириллица
            const str16 = chunk.toString('utf16le');
            
            // Ищем начало JSON
            const jsonStartIdx = str16.indexOf('{"ru":');
            if (jsonStartIdx !== -1) {
                let dirtyJson = str16.slice(jsonStartIdx);
                
                let openBraces = 0;
                let cleanJson = '';
                let foundComplete = false;
                
                for (let i = 0; i < dirtyJson.length; i++) {
                    const char = dirtyJson[i];
                    if (char === '{') openBraces++;
                    else if (char === '}') openBraces--;
                    
                    cleanJson += char;
                    
                    if (openBraces === 0 && cleanJson.length > 50) {
                        foundComplete = true;
                        break;
                    }
                }
                
                if (foundComplete) {
                    try {
                        const parsed = JSON.parse(cleanJson);
                        console.log(`[+] Найден JSON в файле ${file} (Проектов внутри RU: ${parsed.ru ? parsed.ru.length : 0})`);
                        jsonResults.push({ file, len: parsed.ru ? parsed.ru.length : 0, data: parsed });
                    } catch(e) {
                        console.log(`[?] Найден сырой (поврежденный) JSON в файле ${file}, сохраняем как текст...`);
                        jsonResults.push({ file, len: 0, raw: cleanJson });
                    }
                }
            }
            idx = buf.indexOf(target, idx + target.length);
        }
    }
}

if (jsonResults.length > 0) {
    // Сортируем так, чтобы JSON с самым большим количеством проектов был первым
    jsonResults.sort((a, b) => b.len - a.len);
    
    // Если удалось распарсить
    if (jsonResults[0].data) {
        fs.writeFileSync('OLEG_RECOVERED_PROJECTS.json', JSON.stringify(jsonResults[0].data, null, 2));
        console.log('\n✅ УСПЕШНО! Самая полная версия проектов Олега сохранена в файл: OLEG_RECOVERED_PROJECTS.json');
        console.log(`В ней ${jsonResults[0].len} проектов в категории ru.`);
    } else {
        // Если только сырой текст
        fs.writeFileSync('OLEG_RECOVERED_RAW.txt', jsonResults[0].raw);
        console.log('\n✅ Найдены текстовые следы проектов. Сохранено в OLEG_RECOVERED_RAW.txt. Вам потребуется вручную почистить текст в начале или конце файла.');
    }
} else {
    console.log('\n❌ К сожалению, тексты не найдены. Браузер мог успеть перезаписать их навсегда.');
}
