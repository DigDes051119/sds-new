const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'Олег Ермаков Google Chrome');
if (!fs.existsSync(dir)) {
    console.error("Папка не найдена:", dir);
    process.exit(1);
}

const files = fs.readdirSync(dir);
console.log('Начинаю АГРЕССИВНОЕ сканирование...');
let foundAny = false;

function extractJsonBlocks(str, file, encoding) {
    let idx = str.indexOf('{"ru":');
    while (idx !== -1) {
        let openBraces = 0;
        let cleanJson = '';
        let valid = false;
        
        for (let i = idx; i < str.length && i < idx + 500000; i++) {
            const char = str[i];
            if (char === '{') openBraces++;
            else if (char === '}') openBraces--;
            cleanJson += char;
            if (openBraces === 0 && cleanJson.length > 50) {
                valid = true;
                break;
            }
        }
        
        if (valid) {
            try {
                const parsed = JSON.parse(cleanJson);
                if (parsed.ru && parsed.ru.length > 0) {
                    foundAny = true;
                    console.log(`[+] Найден JSON (${parsed.ru.length} проектов) в файле ${file} (${encoding})`);
                    fs.appendFileSync('OLEG_RAW_DUMP.txt', 
                        `\n\n\n=== ФАЙЛ: ${file} (Проектов: ${parsed.ru.length}) ===\n\n` + 
                        JSON.stringify(parsed, null, 2)
                    );
                }
            } catch (e) {
                // Если не парсится, все равно сохраняем
                if (cleanJson.length > 500) {
                    foundAny = true;
                    fs.appendFileSync('OLEG_RAW_DUMP.txt', 
                        `\n\n\n=== ФАЙЛ: ${file} (ПОВРЕЖДЕННЫЙ JSON) ===\n\n` + cleanJson
                    );
                }
            }
        }
        idx = str.indexOf('{"ru":', idx + 1);
    }
}

// Очищаем старый дамп если есть
if (fs.existsSync('OLEG_RAW_DUMP.txt')) fs.unlinkSync('OLEG_RAW_DUMP.txt');

for (const file of files) {
    if (file.endsWith('.ldb') || file.endsWith('.log')) {
        const buf = fs.readFileSync(path.join(dir, file));
        
        const str16 = buf.toString('utf16le');
        const str8 = buf.toString('utf8');
        
        extractJsonBlocks(str16, file, 'UTF-16LE');
        extractJsonBlocks(str8, file, 'UTF-8');
    }
}

if (foundAny) {
    console.log('\n✅ Данные НАЙДЕНЫ! Я собрал все найденные версии текстов в файл OLEG_RAW_DUMP.txt.');
    console.log('Откройте этот файл в VS Code, там будут лежать сохраненные проекты Олега!');
} else {
    console.log('\n❌ Ничего не найдено даже при агрессивном поиске по всему содержимому файлов.');
    console.log('Похоже, браузер Олега безвозвратно перезаписал эти секторы на жестком диске (сборка мусора LevelDB).');
}
