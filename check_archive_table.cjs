const fs = require('fs');
const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/sds_archive_items?select=*`, {
      method: "GET",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
    });
    if (!response.ok) throw new Error("Failed: " + response.statusText);
    
    const rows = await response.json();
    if (rows && rows.length > 0 && rows[0].data) {
        console.log("RU archive items count:", rows[0].data.ru ? rows[0].data.ru.length : 0);
        console.log("First item:", rows[0].data.ru[0].title);
    } else {
        console.log("No data in sds_archive_items");
    }
}
run();
