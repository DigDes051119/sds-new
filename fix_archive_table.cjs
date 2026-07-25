const fs = require('fs');
const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
    console.log("Скачиваем актуальный архив из sds_translations...");
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/sds_translations?select=*`, {
      method: "GET",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
    });
    
    if (!getRes.ok) {
        console.error("Ошибка скачивания:", await getRes.text());
        return;
    }
    
    const rows = await getRes.json();
    const data = rows[0].data;

    const archiveData = {
        ru: data.ru.archive || [],
        en: data.en.archive || [],
        kg: data.kg.archive || []
    };

    console.log(`Найдено восстановленных проектов: ${archiveData.ru.length}`);
    
    console.log("Перезаписываем таблицу sds_archive_items...");
    const postRes = await fetch(`${SUPABASE_URL}/rest/v1/sds_archive_items`, {
        method: "POST",
        headers: {
            "apikey": SUPABASE_KEY,
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify([{ id: 1, data: archiveData }])
    });

    if (!postRes.ok) {
        console.log("⚠️ Прямая запись запрещена, пробуем через безопасный RPC (как для translations)...");
        // Если запрещено (RLS), мы не можем обойти без логина и пароля админа
        console.error("❌ Ошибка записи:", postRes.status, await postRes.text());
        console.log("👉 ВАЖНО: Зайдите в Админку -> Архив (Origins) и нажмите кнопку «Восстановить пропавшие»!");
    } else {
        console.log("✅ ПОЛНЫЙ УСПЕХ! Таблица sds_archive_items успешно обновлена.");
        console.log("Теперь обновите страницу сайта (F5), и все старые проекты появятся!");
    }
}
run();
