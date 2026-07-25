const fs = require('fs');
const path = require('path');
const readline = require('readline');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function run() {
    console.log('Чтение проектов Олега из локального дампа...');
    const olegData = JSON.parse(fs.readFileSync(path.join(__dirname, 'OLEG_ARCHIVE_PROJECTS.json'), 'utf8'));
    
    console.log('Скачивание текущей базы данных Supabase (с новыми проектами Дарьи)...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sds_translations?select=*`, {
      method: "GET",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
    });

    if (!response.ok) throw new Error("Не удалось скачать базу: " + response.statusText);
    
    const rows = await response.json();
    let translationsData = (rows && rows.length > 0 && rows[0].data) ? rows[0].data : {};
    
    for (const lang of ['ru', 'en', 'kg']) {
        if (!translationsData[lang]) translationsData[lang] = {};
        const currentArr = translationsData[lang].archive || [];
        const olegArr = olegData[lang] || [];
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
    }
    
    console.log('Данные успешно объединены!');
    console.log('\n⚠️ База данных надежно защищена от изменений извне (Unauthorized).');
    console.log('Чтобы сервер разрешил загрузку, нужно ввести данные любого администратора.');
    
    rl.question('Введите ваш логин от админки сайта: ', (username) => {
        rl.question('Введите ваш пароль: ', async (password) => {
            console.log('\nОтправка...');
            try {
                const uploadRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/update_translations_secure`, {
                    method: "POST",
                    headers: {
                      "apikey": SUPABASE_KEY,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        p_requester_username: username,
                        p_requester_password: password,
                        p_data: translationsData
                    })
                });
                
                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    throw new Error(err.message || uploadRes.statusText);
                }
                
                console.log('\n✅ ПОЛНЫЙ УСПЕХ! Старые проекты Олега были успешно добавлены к проектам Дарьи.');
                console.log('Зайдите в админку и обновите страницу, чтобы всё увидеть!');
            } catch (e) {
                console.error('❌ Ошибка загрузки (возможно, неверный пароль):', e.message);
            }
            rl.close();
        });
    });
}

run().catch(e => {
    console.error('Ошибка:', e.message);
    rl.close();
});
