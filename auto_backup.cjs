const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://hniqpnuqqsmqpolxgbav.supabase.co";
const SUPABASE_KEY = "sb_publishable_3DWLrcWUpjuE_gNKEivM8A_UHOmJLgu";

// Папка для бэкапов
const BACKUP_BASE_DIR = path.join(__dirname, 'backups');
const MEDIA_DIR = path.join(BACKUP_BASE_DIR, 'media');

if (!fs.existsSync(BACKUP_BASE_DIR)) fs.mkdirSync(BACKUP_BASE_DIR, { recursive: true });
if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

// Функция рекурсивного копирования папки кода (игнорируя node_modules, .git, backups)
function copyDirSync(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        if (['node_modules', '.git', 'backups', 'dist'].includes(entry.name)) continue;

        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Функция для скачивания файла по URL
async function downloadFile(url, destPath) {
    if (fs.existsSync(destPath)) return;
    try {
        const res = await fetch(url);
        if (!res.ok) return;
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(destPath, buffer);
        console.log(`  [Медиа] Сохранен: ${path.basename(destPath)}`);
    } catch (e) {
        console.warn(`  [Медиа Ошибка] Не удалось скачать ${url}: ${e.message}`);
    }
}

// Поиск всех ссылок на медиафайлы в объекте
function extractUrls(obj, urls = new Set()) {
    if (!obj) return urls;
    if (typeof obj === 'string') {
        if (obj.startsWith('http://') || obj.startsWith('https://')) {
            if (obj.match(/\.(webp|png|jpg|jpeg|svg|mp4|gif)($|\?)/i) || obj.includes('/storage/v1/object/public/')) {
                urls.add(obj);
            }
        }
    } else if (Array.isArray(obj)) {
        obj.forEach(item => extractUrls(item, urls));
    } else if (typeof obj === 'object') {
        Object.values(obj).forEach(val => extractUrls(val, urls));
    }
    return urls;
}

async function runBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    console.log(`\n========================================`);
    console.log(`🚀 ЗАПУСК ПОЛНОГО БЭКАПА (КОД + БД + МЕДИА): ${new Date().toLocaleString()}`);
    console.log(`========================================`);

    const currentBackupDir = path.join(BACKUP_BASE_DIR, `backup_${timestamp}`);
    const codeBackupDir = path.join(currentBackupDir, 'site_and_admin_code');
    const dbBackupDir = path.join(currentBackupDir, 'database_dump');

    fs.mkdirSync(currentBackupDir, { recursive: true });
    fs.mkdirSync(dbBackupDir, { recursive: true });

    // 1. БЭКАП ИСХОДНОГО КОДА САЙТА И АДМИНКИ
    console.log(`📁 1/3 Копирование исходного кода сайта и админки...`);
    copyDirSync(__dirname, codeBackupDir);
    console.log(`✅ Исходный код сайта и админки успешно сохранен в: site_and_admin_code/`);

    // 2. БЭКАП БАЗЫ ДАННЫХ
    console.log(`\n🗄️ 2/3 Выгрузка таблиц базы данных Supabase...`);
    const tables = ['sds_translations', 'sds_project_details', 'sds_archive_items', 'sds_leads', 'sds_admin_logs'];
    const allMediaUrls = new Set();
    const dbDump = {};

    for (const table of tables) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
                headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
            });
            if (res.ok) {
                const data = await res.json();
                dbDump[table] = data;
                fs.writeFileSync(path.join(dbBackupDir, `${table}.json`), JSON.stringify(data, null, 2), 'utf8');
                console.log(`  - Таблица ${table}: сохранена (${data.length} записей)`);
                
                extractUrls(data, allMediaUrls);
            } else {
                console.warn(`  ⚠️ Не удалось скачать ${table}: HTTP ${res.status}`);
            }
        } catch (e) {
            console.error(`  ❌ Ошибка таблицы ${table}: ${e.message}`);
        }
    }
    fs.writeFileSync(path.join(dbBackupDir, 'full_db_dump.json'), JSON.stringify(dbDump, null, 2), 'utf8');

    // 3. БЭКАП МЕДИАФАЙЛОВ И КАРТИНОК
    console.log(`\n🖼️ 3/3 Найдено уникальных фото/видео: ${allMediaUrls.size}`);
    console.log(`📥 Скачивание материалов в папку backups/media...`);

    let downloadedCount = 0;
    for (const url of allMediaUrls) {
        const urlObj = new URL(url);
        const filename = path.basename(urlObj.pathname);
        const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
        const mediaPath = path.join(MEDIA_DIR, safeFilename);

        if (!fs.existsSync(mediaPath)) {
            await downloadFile(url, mediaPath);
            downloadedCount++;
        }
    }

    console.log(`✅ Скачано новых медиафайлов: ${downloadedCount}`);
    console.log(`\n========================================`);
    console.log(`🎉 ПОЛНЫЙ БЭКАП УСПЕШНО ЗАВЕРШЕН!`);
    console.log(`Путь к копии: backups/backup_${timestamp}`);
    console.log(`========================================\n`);
}

if (require.main === module) {
    runBackup();
}

module.exports = { runBackup };
