const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'OLEG_PERFECT_DATA_RAW.txt'), 'utf8');

// Убираем нулевые байты (которые отображаются как пробелы), так как текст был в UTF-16
const clean = raw.replace(/\x00/g, '');

try {
    const parsed = JSON.parse(clean);
    fs.writeFileSync('OLEG_ARCHIVE_PROJECTS.json', JSON.stringify(parsed, null, 2));
    console.log(`\n✅ БИНГО! Я очистил данные Олега от артефактов кодировки.`);
    console.log(`✅ Успешно сохранено ${parsed.ru.length} старых проектов в файл OLEG_ARCHIVE_PROJECTS.json!`);
} catch(e) {
    console.error('Ошибка очистки JSON:', e.message);
}
