import json

# Let's inspect src/app/i18n.ts
with open("src/app/i18n.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Let's check which languages are defined in translations object
for lang in ["en", "kg", "ru", "zh", "ar", "de"]:
    pos = content.find(f"  {lang}: {{")
    if pos != -1:
        print(f"Language '{lang}' found at position {pos}")
    else:
        print(f"Language '{lang}' NOT FOUND in translations!")
