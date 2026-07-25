const fs = require('fs');

try {
    const steelDataStr = fs.readFileSync('./OLEG_ARCHIVE_ITEMS_STEEL.json', 'utf8');
    const steelData = JSON.parse(steelDataStr);
    const ruProjects = steelData.ru || [];
    console.log("В файле OLEG_ARCHIVE_ITEMS_STEEL.json найдено проектов: " + ruProjects.length);
    
    // Also check other files just in case
    try {
        const vercelDataStr = fs.readFileSync('./OLEG_TRANSLATIONS_VERCEL.json', 'utf8');
        const vercelData = JSON.parse(vercelDataStr);
        console.log("В файле OLEG_TRANSLATIONS_VERCEL.json (archive) найдено проектов: " + (vercelData.ru && vercelData.ru.archive ? vercelData.ru.archive.length : 0));
    } catch(e) {}
    
    try {
        const steelTransStr = fs.readFileSync('./OLEG_TRANSLATIONS_STEEL.json', 'utf8');
        const steelTransData = JSON.parse(steelTransStr);
        console.log("В файле OLEG_TRANSLATIONS_STEEL.json (archive) найдено проектов: " + (steelTransData.ru && steelTransData.ru.archive ? steelTransData.ru.archive.length : 0));
    } catch(e) {}

} catch (err) {
    console.error("Error parsing:", err);
}
