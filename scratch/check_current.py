import urllib.request
import json

SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co"
SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"

def main():
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/sds_translations?id=eq.1",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
    
    data = rows[0]["data"]
    
    for lang in ["ru", "en", "kg"]:
        print(f"=== {lang} ===")
        products = data[lang].get("products", {}).get("items", [])
        concepts = data[lang].get("concepts", {}).get("items", [])
        print("Products:", [p.get("id") for p in products])
        print("Concepts:", [c.get("id") for c in concepts])

if __name__ == "__main__":
    main()
