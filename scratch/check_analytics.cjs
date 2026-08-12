const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

async function run() {
  console.log("Calling get_analytics_data RPC...");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_analytics_data`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_requester_username: "sdstadmin",
      p_requester_password: "sdst2011team"
    }),
  });
  if (!response.ok) {
    console.error("Failed:", await response.text());
    return;
  }
  const data = await response.json();
  console.log("Total rows found:", data.length);
  if (data.length > 0) {
    console.log("First row:", data[0]);
    console.log("Last row:", data[data.length - 1]);
    
    // Check distribution of created_at dates to see when they were created
    const dates = data.map(r => r.created_at);
    console.log("Min date:", Math.min(...dates.map(d => new Date(d).getTime())));
    console.log("Max date:", Math.max(...dates.map(d => new Date(d).getTime())));
    console.log("Min date string:", new Date(Math.min(...dates.map(d => new Date(d).getTime()))).toISOString());
    console.log("Max date string:", new Date(Math.max(...dates.map(d => new Date(d).getTime()))).toISOString());
  }
}

run().catch(console.error);
