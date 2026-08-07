import os
import json

base_dir = r"d:\Steel Drake Studio Team\SDST web site"
search_paths = [
    os.path.join(base_dir, "backups"),
    os.path.join(base_dir, "src"),
    r"C:\Users\Akimkhan"
]

results = []

for s_path in search_paths:
    if not os.path.exists(s_path):
        continue
    for root, dirs, files in os.walk(s_path):
        if "node_modules" in root or ".git" in root:
            continue
        for f in files:
            if f.endswith(".json") or f.endswith(".ts") or f.endswith(".js"):
                fp = os.path.join(root, f)
                try:
                    with open(fp, "r", encoding="utf-8", errors="ignore") as file_handle:
                        content = file_handle.read()
                        if "ps5" in content.lower():
                            results.append(fp)
                            print(f"FOUND ps5 in {fp}")
                            # print snippets
                            lower = content.lower()
                            idx = 0
                            while True:
                                idx = lower.find("ps5", idx)
                                if idx == -1:
                                    break
                                print("--- Snippet ---")
                                print(content[max(0, idx-150):min(len(content), idx+350)])
                                idx += 3
                except Exception as e:
                    pass

print("Search finished. Found files:", len(results))
