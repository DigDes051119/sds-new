const fs = require('fs');
const path = require('path');
const { ClassicLevel } = require('classic-level');

const dir = path.join(__dirname, 'Олег Ермаков Google Chrome');
const db = new ClassicLevel(dir, { valueEncoding: 'binary', keyEncoding: 'binary' });

async function run() {
    console.log('Поиск всех ключей с сохранением их под разными именами...');
    await db.open({ createIfMissing: false });
    
    let foundKeys = [];
    for await (const [key, value] of db.iterator()) {
        const keyStr = key.toString('utf8');
        const cleanKey = keyStr.replace(/[\x00-\x1F]/g, ' ').trim();
        
        if (cleanKey.includes('sds_')) {
            foundKeys.push(cleanKey);
            
            let valStr = '';
            if (value.length > 0) {
                if (value[0] === 0x00) {
                    valStr = value.subarray(1).toString('utf16le');
                } else if (value[0] === 0x01) {
                    valStr = value.subarray(1).toString('utf8');
                } else {
                    valStr = value.toString('utf16le');
                }
            }
            
            let cleanStr = valStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
            const start = cleanStr.indexOf('{');
            const end = cleanStr.lastIndexOf('}');
            if(start !== -1 && end !== -1) {
               cleanStr = cleanStr.substring(start, end + 1);
            }

            let domain = cleanKey.includes('vercel') ? 'VERCEL' : 'STEEL';
            
            if (cleanKey.includes('sds_translations')) {
                fs.writeFileSync(`OLEG_TRANSLATIONS_${domain}.json`, cleanStr);
                console.log(`Сохранен OLEG_TRANSLATIONS_${domain}.json`);
            }
            if (cleanKey.includes('sds_project_details')) {
                fs.writeFileSync(`OLEG_PROJECT_DETAILS_${domain}.json`, cleanStr);
                console.log(`Сохранен OLEG_PROJECT_DETAILS_${domain}.json`);
            }
            if (cleanKey.includes('sds_archive_items')) {
                fs.writeFileSync(`OLEG_ARCHIVE_ITEMS_${domain}.json`, cleanStr);
                console.log(`Сохранен OLEG_ARCHIVE_ITEMS_${domain}.json`);
            }
        }
    }
    await db.close();
    console.log('Готово!');
}
run().catch(console.error);
