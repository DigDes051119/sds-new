const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
    const tables = ['sds_translations', 'sds_project_details', 'sds_archive_items'];
    for (const table of tables) {
        console.log(`Checking table ${table}...`);
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        if (res.ok) {
            const data = await res.json();
            const str = JSON.stringify(data);
            console.log(`Table ${table} fetched, length: ${str.length}`);
            
            // Search for bishbench case-insensitively
            const matches = str.match(/bishbench/i);
            if (matches) {
                console.log(`FOUND in ${table}!`);
                // Let's inspect the matches or print where it is
                // If it's a single record containing a large JSON object:
                if (data.length === 1) {
                    const obj = data[0];
                    console.log("Keys in row 0:", Object.keys(obj));
                    // Let's search inside data[0].data if it exists
                    if (obj.data) {
                        const dataKeys = Object.keys(obj.data);
                        console.log("Keys in obj.data:", dataKeys);
                        // Let's find exactly which key/sub-key contains the word
                        findWord(obj.data, "bishbench");
                    }
                } else {
                    for (let i = 0; i < data.length; i++) {
                        if (JSON.stringify(data[i]).match(/bishbench/i)) {
                            console.log(`Row ${i} matches:`, data[i].id || i);
                        }
                    }
                }
            }
        } else {
            console.log(`Error fetching ${table}: ${res.status} ${res.statusText}`);
        }
    }
}

function findWord(obj, word, path = "data") {
    if (typeof obj === 'string') {
        if (obj.toLowerCase().includes(word.toLowerCase())) {
            console.log(`Match at string path: ${path} = "${obj.substring(0, 100)}..."`);
        }
    } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
            findWord(item, word, `${path}[${index}]`);
        });
    } else if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            findWord(obj[key], word, `${path}.${key}`);
        });
    }
}

run().catch(console.error);
