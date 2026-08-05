with open("src/app/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

for lang in ["zh", "ar", "de"]:
    idx = content.find(f"  {lang}: {{")
    if idx != -1:
        snippet = content[idx:idx+1500]
        print(f"=== {lang} snippet ===")
        print(snippet[:600])
