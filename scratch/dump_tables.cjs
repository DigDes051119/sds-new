const fs = require('fs');
const path = require('path');
const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
    const tables = ['sds_translations', 'sds_project_details', 'sds_archive_items'];
    for (const table of tables) {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
            const data = await res.json();
            const dest = path.join(__dirname, `${table}_current.json`);
            fs.writeFileSync(dest, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Saved ${dest}`);
        }
    }
}

run().catch(console.error);
