const fs = require('fs');
const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

const TARGET_IDS = [
  "evodrone",
  "iphone-iq-concept-2018",
  "sony-zeus",
  "ps5-concept-2018",
  "tesla-sd-concept"
];

async function run() {
  console.log("Fetching translations from Supabase...");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/sds_translations?id=eq.1`, {
    method: "GET",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
  });
  
  if (!response.ok) throw new Error("Failed to fetch translations: " + response.statusText);
  
  const rows = await response.json();
  if (!rows || rows.length === 0) {
    throw new Error("No translation row found with id=1");
  }
  
  const dbRow = rows[0];
  const translationsData = dbRow.data;
  
  const langs = ["ru", "en", "kg", "zh", "ar", "de"];
  let modifiedCount = 0;
  
  for (const lang of langs) {
    if (!translationsData[lang]) continue;
    
    const langData = translationsData[lang];
    if (!langData.products) langData.products = { items: [] };
    if (!langData.concepts) langData.concepts = { items: [] };
    
    const productsItems = langData.products.items || [];
    const conceptsItems = langData.concepts.items || [];
    const productDetails = langData.productDetail?.products || {};
    
    for (const id of TARGET_IDS) {
      // Find the item index in products
      const pIdx = productsItems.findIndex(item => item.id === id);
      if (pIdx !== -1) {
        const item = productsItems[pIdx];
        
        // Remove from products
        productsItems.splice(pIdx, 1);
        
        // Get details from productDetails
        const details = productDetails[id] || {};
        
        // Merge item with details for concept format
        const conceptItem = {
          ...item,
          ...details,
          // Ensure id is kept
          id: id
        };
        
        // Remove from productDetails
        delete productDetails[id];
        
        // Add to concepts.items if not already there
        const cIdx = conceptsItems.findIndex(c => c.id === id);
        if (cIdx === -1) {
          conceptsItems.push(conceptItem);
          console.log(`[${lang}] Moved project '${id}' from products to concepts.`);
        } else {
          // Update it
          conceptsItems[cIdx] = conceptItem;
          console.log(`[${lang}] Updated project '${id}' in concepts.`);
        }
        modifiedCount++;
      } else {
        console.log(`[${lang}] Project '${id}' not found in products items.`);
      }
    }
  }
  
  if (modifiedCount > 0) {
    console.log("Saving modified translations back to Supabase...");
    const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/sds_translations?id=eq.1`, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify({ data: translationsData }),
    });
    
    if (!saveResponse.ok) {
      const errText = await saveResponse.text();
      throw new Error("Failed to save changes: " + errText);
    }
    console.log("Successfully updated translations in database!");
  } else {
    console.log("No changes were made (projects might already be moved).");
  }
}

run().catch(err => {
  console.error("Error running script:", err);
});
