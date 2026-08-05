import re

filepath = "src/app/i18n.ts"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# We want to replace target string:
target = """        { id: "tesla-sd-concept", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp", name: "TESLA SD CONCEPT", category: "Industrial design", categoryKey: "industrial" }
      ],"""

replacement = """        { id: "tesla-sd-concept", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785057676457.webp", name: "TESLA SD CONCEPT", category: "Industrial design", categoryKey: "industrial" },
        { id: "bishbench", img: "https://cdn.steeldrakestudio.com/storage/v1/object/public/assets/products/product-hero-1785532296450.webp", name: "Bishbench", category: "Industrial design", categoryKey: "industrial" }
      ],"""

# Let's count how many replacements will be made
count = content.count(target)
print(f"Found {count} occurrences of target string.")

new_content = content.replace(target, replacement)
with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement complete.")
