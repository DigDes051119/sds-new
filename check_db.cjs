const fs = require('fs');
const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sds_translations?select=*`, {
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
    });
    const rows = await response.json();
    const data = rows[0].data;
    
    console.log("Проверка базы данных на сервере Supabase...");
    console.log("Количество проектов в RU:", data.ru?.archive?.length);
    
    if (data.ru?.archive?.length > 0) {
        console.log("Первый проект:", data.ru.archive[0].name);
        console.log("Последний проект:", data.ru.archive[data.ru.archive.length - 1].name);
    }
}
run().catch(console.error);
