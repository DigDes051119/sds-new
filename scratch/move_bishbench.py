import urllib.request
import json

SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co"
SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu"

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
    modified = False

    for lang in langs:
        if lang not in translations_data:
            print(f"Language '{lang}' not found in translations.")
            continue
        
        lang_data = translations_data[lang]
        
        # Ensure products and concepts exist
        if "products" not in lang_data:
            lang_data["products"] = {"items": []}
        if "concepts" not in lang_data:
            lang_data["concepts"] = {"items": []}
            
        products_items = lang_data["products"].get("items", [])
        concepts_items = lang_data["concepts"].get("items", [])
        
        # Search for bishbench in products.items
        p_item = None
        p_idx = -1
        for idx, item in enumerate(products_items):
            if item.get("id") == "bishbench":
                p_item = item
                p_idx = idx
                break
                
        if p_item:
            # Remove from products
            products_items.pop(p_idx)
            
            # Check if already in concepts
            c_idx = -1
            for idx, c in enumerate(concepts_items):
                if c.get("id") == "bishbench":
                    c_idx = idx
                    break
            
            if c_idx == -1:
                # Add to concepts.items
                concepts_items.append(p_item)
                print(f"[{lang}] Moved 'bishbench' from products to concepts.")
            else:
                # Update in concepts.items
                concepts_items[c_idx] = p_item
                print(f"[{lang}] Updated 'bishbench' in concepts.")
            
            modified = True
        else:
            # If not in products, check if it's already in concepts
            in_concepts = any(c.get("id") == "bishbench" for c in concepts_items)
            if in_concepts:
                print(f"[{lang}] 'bishbench' is already in concepts.")
            else:
                print(f"[{lang}] Warning: 'bishbench' not found in products or concepts.")

    if modified:
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
        print("No changes were made (already moved).")

if __name__ == "__main__":
    main()
