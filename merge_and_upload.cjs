const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";
const TABLE_NAME = "sds_translations"; // ИСПОЛЬЗУЕМ ПРАВИЛЬНУЮ ТАБЛИЦУ

async function run() {
    console.log('Чтение проектов Олега из локального дампа...');
    const olegData = JSON.parse(fs.readFileSync(path.join(__dirname, 'OLEG_ARCHIVE_PROJECTS.json'), 'utf8'));
    
    console.log('Скачивание текущей базы данных Supabase (с новыми проектами Дарьи)...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
        throw new Error("Не удалось скачать базу: " + response.statusText);
    }
    
    const rows = await response.json();
    let translationsData = {};
    if (rows && rows.length > 0 && rows[0].data) {
        translationsData = rows[0].data;
    }
    
    console.log('Объединение проектов...');
    
    for (const lang of ['ru', 'en', 'kg']) {
        if (!translationsData[lang]) translationsData[lang] = {};
        
        const currentArr = translationsData[lang].archive || [];
        const olegArr = olegData[lang] || [];
        
        // Вставляем проекты Олега, затем текущие проекты Дарьи, исключая дубликаты по id
        const combined = [...olegArr, ...currentArr];
        const unique = [];
        const seenIds = new Set();
        
        for (const item of combined) {
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                unique.push(item);
            }
        }
        translationsData[lang].archive = unique;
        console.log(`Итоговый список (${lang}): ${unique.length} проектов`);
    }
    
    console.log('Отправка объединенной базы обратно в Supabase...');
    const uploadRes = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates",
        },
        body: JSON.stringify([{ id: 1, data: translationsData }])
    });
    
    if (!uploadRes.ok) {
        throw new Error("Не удалось загрузить объединенную базу: " + uploadRes.statusText);
    }
    
    console.log('\n✅ ПОЛНЫЙ УСПЕХ! Старые проекты Олега были успешно добавлены к проектам Дарьи.');
    console.log('Вы можете зайти в админку (обязательно обновите страницу!) и убедиться, что всё на месте.');
}

run().catch(e => console.error('Ошибка:', e));
