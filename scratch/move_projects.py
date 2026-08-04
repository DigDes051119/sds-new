import urllib.request
import json

SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co"
SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"

TARGET_IDS = [
    "evodrone",
    "iphone-iq-concept-2018",
    "sony-zeus",
    "ps5-concept-2018",
    "tesla-sd-concept"
]

def main():
    print("Fetching translations from Supabase...")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/sds_translations?id=eq.1",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    
    with urllib.request.urlopen(req) as resp:
        rows = json.loads(resp.read().decode('utf-8'))
        
    if not rows:
        print("Error: No translation row found.")
        return

    translations_data = rows[0]["data"]
    langs = ["ru", "en", "kg", "zh", "ar", "de"]
    modified_count = 0

    for lang in langs:
        if lang not in translations_data:
            continue
        
        lang_data = translations_data[lang]
        if "products" not in lang_data or not isinstance(lang_data["products"], dict):
            lang_data["products"] = {"items": []}
        if "concepts" not in lang_data or not isinstance(lang_data["concepts"], dict):
            lang_data["concepts"] = {"items": []}
            
        products_items = lang_data["products"].get("items", [])
        concepts_items = lang_data["concepts"].get("items", [])
        product_details = lang_data.get("productDetail", {}).get("products", {})

        for target_id in TARGET_IDS:
            # Find item in products
            p_item = None
            p_idx = -1
            for idx, item in enumerate(products_items):
                if item.get("id") == target_id:
                    p_item = item
                    p_idx = idx
                    break
            
            if p_item:
                # Remove from products
                products_items.pop(p_idx)
                
                # Fetch product detail if exists
                details = product_details.get(target_id, {})
                if target_id in product_details:
                    del product_details[target_id]
                
                concept_item = {**p_item, **details, "id": target_id}
                
                # Check if already in concepts
                c_idx = -1
                for idx, c in enumerate(concepts_items):
                    if c.get("id") == target_id:
                        c_idx = idx
                        break
                
                if c_idx == -1:
                    concepts_items.append(concept_item)
                    print(f"[{lang}] Moved '{target_id}' to concepts.")
                else:
                    concepts_items[c_idx] = concept_item
                    print(f"[{lang}] Updated '{target_id}' in concepts.")
                
                modified_count += 1
            else:
                print(f"[{lang}] '{target_id}' not found in products.")

    if modified_count > 0:
        print("Saving changes back to Supabase...")
        payload = json.dumps({"data": translations_data}).encode('utf-8')
        patch_req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/sds_translations?id=eq.1",
            data=payload,
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            method="PATCH"
        )
        with urllib.request.urlopen(patch_req) as patch_resp:
            print("Successfully updated database!")
    else:
        print("No items modified.")

if __name__ == "__main__":
    main()
