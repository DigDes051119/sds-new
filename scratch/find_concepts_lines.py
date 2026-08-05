with open("src/app/i18n.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "concepts:" in line:
        print(f"Line {i+1}: {line.strip()}")
        # print next few lines
        for j in range(1, 10):
            if i + j < len(lines):
                print(f"  Line {i+j+1}: {lines[i+j].strip()}")
