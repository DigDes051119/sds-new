const fs = require('fs');
const path = require('path');
const { ClassicLevel } = require('classic-level');

const dir = path.join(__dirname, 'Олег Ермаков Google Chrome');
const db = new ClassicLevel(dir, { valueEncoding: 'binary', keyEncoding: 'binary' });

async function run() {
    console.log('Повторно открываю базу данных...');
    await db.open({ createIfMissing: false });
    
    for await (const [key, value] of db.iterator()) {
        const keyStr = key.toString('utf8');
        
        if (keyStr.includes('sds_archive_items')) {
            console.log('✅ Ключ:', keyStr.replace(/[\x00-\x1F]/g, ' '));
            
            // В прошлый раз мы перепутали байты. В Chrome LocalStorage:
            // 0x00 в начале означает UTF-16LE!
            // 0x01 означает UTF-8!
            let valStr = '';
            if (value.length > 0) {
                if (value[0] === 0x00) {
                    valStr = value.subarray(1).toString('utf16le'); // ПРАВИЛЬНАЯ КОДИРОВКА
                } else if (value[0] === 0x01) {
                    valStr = value.subarray(1).toString('utf8');
                } else {
                    valStr = value.toString('utf16le');
                }
            }
            
            try {
                // Удаляем бинарный мусор (оставляем переносы строк \n \r и табы \t)
                let cleanStr = valStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
                
                // Обрезаем до чистого JSON (от первой { до последней })
                const start = cleanStr.indexOf('{');
                const end = cleanStr.lastIndexOf('}');
                if(start !== -1 && end !== -1) {
                   cleanStr = cleanStr.substring(start, end + 1);
                }
                
                const parsed = JSON.parse(cleanStr);
                fs.writeFileSync('OLEG_ARCHIVE_PROJECTS.json', JSON.stringify(parsed, null, 2));
                
                console.log(`\n🎉 БИНГО! Теперь кириллица и JSON идеально расшифрованы.`);
                console.log(`Сохранено ${parsed.ru ? parsed.ru.length : 0} проектов в OLEG_ARCHIVE_PROJECTS.json!`);
            } catch (err) {
                console.log(`\n⚠️ Ошибка парсинга:`, err.message);
                fs.writeFileSync('OLEG_DEBUG.txt', valStr);
            }
        }
    }
    await db.close();
}

run().catch(err => console.error(err));
