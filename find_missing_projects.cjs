const fs = require('fs');
const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
    console.log("Собираем все проекты из всех баз данных...");
    
    let allProjects = [];
    const uniqueIds = new Set();
    
    function addProjects(sourceName, data) {
        if (!data || !data.ru) return;
        let countAdded = 0;
        let arr = Array.isArray(data.ru) ? data.ru : (data.ru.archive || []);
        
        for (let p of arr) {
            if (!uniqueIds.has(p.id)) {
                uniqueIds.add(p.id);
                // Also add to en and kg if possible
                let enP = (Array.isArray(data.en) ? data.en : (data.en?.archive || [])).find(x => x.id === p.id) || JSON.parse(JSON.stringify(p));
                let kgP = (Array.isArray(data.kg) ? data.kg : (data.kg?.archive || [])).find(x => x.id === p.id) || JSON.parse(JSON.stringify(p));
                
                allProjects.push({ ru: p, en: enP, kg: kgP });
                countAdded++;
            }
        }
        console.log(`- Из ${sourceName} добавлено уникальных проектов: ${countAdded}`);
    }

    try {
        addProjects("OLEG_ARCHIVE_PROJECTS.json", JSON.parse(fs.readFileSync('./OLEG_ARCHIVE_PROJECTS.json', 'utf8')));
    } catch(e) {}
    
    try {
        addProjects("OLEG_ARCHIVE_ITEMS_STEEL.json", JSON.parse(fs.readFileSync('./OLEG_ARCHIVE_ITEMS_STEEL.json', 'utf8')));
    } catch(e) {}
    
    try {
        addProjects("OLEG_TRANSLATIONS_VERCEL.json", JSON.parse(fs.readFileSync('./OLEG_TRANSLATIONS_VERCEL.json', 'utf8')));
    } catch(e) {}
    
    try {
        addProjects("OLEG_TRANSLATIONS_STEEL.json", JSON.parse(fs.readFileSync('./OLEG_TRANSLATIONS_STEEL.json', 'utf8')));
    } catch(e) {}

    console.log(`\nВсего найдено уникальных проектов за все время: ${allProjects.length}`);

    if (allProjects.length > 24) {
        console.log("Отлично! Найдено больше проектов, загружаем в Supabase...");
        
        const finalArchiveData = {
            ru: allProjects.map(p => p.ru),
            en: allProjects.map(p => p.en),
            kg: allProjects.map(p => p.kg)
        };
        
        // Перезаписываем таблицу sds_archive_items
        const postRes = await fetch(`${SUPABASE_URL}/rest/v1/sds_archive_items`, {
            method: "POST",
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            },
            body: JSON.stringify([{ id: 1, data: finalArchiveData }])
        });
        
        if (postRes.ok) {
            console.log("✅ УСПЕХ! Новые проекты успешно добавлены в базу данных!");
            console.log("Обновите страницу сайта, теперь там будет " + allProjects.length + " проектов!");
        } else {
            console.error("❌ Ошибка при загрузке:", await postRes.text());
        }
    } else {
        console.log("Больше 24 проектов не найдено. Если вы точно помните, что их было больше, возможно они не были сохранены в браузере Олега.");
    }
}
run();
