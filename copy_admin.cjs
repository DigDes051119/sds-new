const fs = require('fs');

let content = fs.readFileSync('src/app/pages/AdminProjectsEditor.tsx', 'utf-8');

// Replace component name
content = content.replace(/AdminProjectsEditor/g, 'AdminWebUiUxEditor');

// Replace titles
content = content.replace(/Управление проектами/g, 'Управление проектами WEB / UI UX');

// Replace all instances of .projects.items or ['projects'].items with .webUiUx.items
content = content.replace(/\.projects\.items/g, '.webUiUx.items');
content = content.replace(/t\.projects/g, 't.webUiUx');
content = content.replace(/translations\[lang\]\.projects/g, 'translations[lang].webUiUx');
content = content.replace(/translations\.ru\.projects/g, 'translations.ru.webUiUx');
content = content.replace(/translations\.en\.projects/g, 'translations.en.webUiUx');
content = content.replace(/translations\.kg\.projects/g, 'translations.kg.webUiUx');

content = content.replace(/newTranslations\.ru\.projects/g, 'newTranslations.ru.webUiUx');
content = content.replace(/newTranslations\.en\.projects/g, 'newTranslations.en.webUiUx');
content = content.replace(/newTranslations\.kg\.projects/g, 'newTranslations.kg.webUiUx');

// Fix Synq auto-restore bug - we don't need synq restore in web ui ux, so remove the whole block.
// Or just let it be, but we should remove it to keep it clean.
content = content.replace(/\/\/ Restore Synq project automatically.*?}, \[\]\);/gs, '');

fs.writeFileSync('src/app/pages/AdminWebUiUxEditor.tsx', content);
console.log('Done!');
