import urllib.request
import json

SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co"
SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"

def main():
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/sds_translations?select=*",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
    
    print(f"Total rows in sds_translations: {len(rows)}")
    for i, r in enumerate(rows):
        print(f"Row {i}: id={r.get('id')}, created_at={r.get('created_at')}")

if __name__ == "__main__":
    main()
