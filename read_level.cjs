const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Устанавливаю библиотеку для чтения LevelDB (classic-level)...');
try {
    execSync('npm install classic-level', { stdio: 'inherit' });
} catch (e) {
    console.error('Ошибка при установке classic-level:', e.message);
    process.exit(1);
}

const { ClassicLevel } = require('classic-level');

const dir = path.join(__dirname, 'Олег Ермаков Google Chrome');
const db = new ClassicLevel(dir, { valueEncoding: 'binary', keyEncoding: 'binary' });

async function run() {
    console.log('Открываю базу данных Олега...');
    await db.open({ createIfMissing: false });
    
    let found = false;
    for await (const [key, value] of db.iterator()) {
        const keyStr = key.toString('utf8');
        
        // В Chrome ключи LocalStorage выглядят примерно так: _https://domain.com\x00\x01sds_archive_items
        if (keyStr.includes('sds_archive_items')) {
            console.log('✅ НАЙДЕН КЛЮЧ:', keyStr.replace(/[\x00-\x1F]/g, ' '));
            
            // В Chrome LocalStorage значения начинаются с байта кодировки (0x00 для UTF-8, 0x01 для UTF-16LE)
            let valStr = '';
            if (value.length > 0) {
                if (value[0] === 0x00) {
                    valStr = value.subarray(1).toString('utf8');
                } else if (value[0] === 0x01) {
                    valStr = value.subarray(1).toString('utf16le');
                } else {
                    valStr = value.toString('utf8');
                }
            }
            
            try {
                // Пытаемся отформатировать JSON
                const parsed = JSON.parse(valStr);
                fs.writeFileSync('OLEG_PERFECT_DATA.json', JSON.stringify(parsed, null, 2));
                console.log(`\n🎉 УСПЕШНО! Данные расшифрованы и сохранены в OLEG_PERFECT_DATA.json`);
                console.log(`Внутри ${parsed.ru ? parsed.ru.length : 0} проектов!`);
            } catch (err) {
                fs.writeFileSync('OLEG_PERFECT_DATA_RAW.txt', valStr);
                console.log(`\n⚠️ Данные найдены, но JSON немного сломан. Сохранены в OLEG_PERFECT_DATA_RAW.txt`);
            }
            found = true;
        }
    }
    
    if (!found) {
        console.log('\n❌ Ключ sds_archive_items не найден в актуальном состоянии базы.');
        console.log('Похоже, браузер все-таки успел обновить страницу и затереть данные (скачав базу Дарьи).');
    }
    await db.close();
}

run().catch(err => {
    console.error('Критическая ошибка:', err);
});
