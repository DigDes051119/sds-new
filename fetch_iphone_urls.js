const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function main() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/sds_translations?select=*`, {
    method: "GET",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch");
  const rows = await response.json();
  const translations = rows[0]?.data || {};
  
  // Find iphone-concept-2014 in archive
  const archive = translations.ru?.archive || [];
  const iphoneItem = archive.find(item => item.id === "iphone-concept-2014");
  
  if (iphoneItem) {
    console.log("=== IPHONE 8 CONCEPT IMAGES ===");
    console.log(JSON.stringify(iphoneItem.images, null, 2));
  } else {
    console.log("iphone-concept-2014 not found in database archive.");
  }
}

main().catch(console.error);
