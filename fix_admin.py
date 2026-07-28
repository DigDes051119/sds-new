import re

with open('src/app/pages/AdminProjectsEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('AdminProjectsEditor', 'AdminWebUiUxEditor')
content = content.replace('Управление проектами', 'Управление проектами WEB / UI UX')
content = content.replace('.projects.items', '.webUiUx.items')
content = content.replace('t.projects', 't.webUiUx')
content = content.replace('translations[lang].projects', 'translations[lang].webUiUx')
content = content.replace('translations.ru.projects', 'translations.ru.webUiUx')
content = content.replace('translations.en.projects', 'translations.en.webUiUx')
content = content.replace('translations.kg.projects', 'translations.kg.webUiUx')

content = content.replace('newTranslations.ru.projects', 'newTranslations.ru.webUiUx')
content = content.replace('newTranslations.en.projects', 'newTranslations.en.webUiUx')
content = content.replace('newTranslations.kg.projects', 'newTranslations.kg.webUiUx')

# Also projectsList
content = content.replace('const projectsList = translations.ru.projects?.items || [];', 'const projectsList = translations.ru.webUiUx?.items || [];')
# Let's use a regex to replace any remaining translation.*.projects accesses just in case
content = re.sub(r'translations\.(\w+)\.projects', r'translations.\1.webUiUx', content)
content = re.sub(r'newTranslations\.(\w+)\.projects', r'newTranslations.\1.webUiUx', content)

# Remove the Synq restore auto logic
content = re.sub(r'(?s)// Restore Synq project automatically.*?}, \[\]\);', '', content)

with open('src/app/pages/AdminWebUiUxEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement successful")
